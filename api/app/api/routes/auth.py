from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database import get_db
from app.models import User, UserRole, Client, RefreshToken
from app.schemas import (
    ClientRegister, ClientLogin, ClientResponse, GoogleAuthRequest,
    TokenPair, TokenRefresh, PasswordChange
)
from app.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token, validate_email
from app.services.tasks import send_welcome_email

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == int(user_id), User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_current_client(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in [UserRole.CLIENT, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Client access required")
    return current_user


@router.post("/signup", response_model=TokenPair, status_code=201)
async def signup(payload: ClientRegister, db: AsyncSession = Depends(get_db)):
    if not validate_email(payload.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered. Please sign in instead.")

    user = User(
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.name,
        role=UserRole.CLIENT,
        provider="email",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    client = Client(
        user_id=user.id,
        name=payload.name,
        email=payload.email.lower(),
        company=payload.company,
        phone=payload.phone,
        project_type=payload.project_type,
    )
    db.add(client)
    await db.commit()

    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    rt = RefreshToken(user_id=user.id, token=refresh_token, expires_at=datetime.fromtimestamp(
        datetime.now(timezone.utc).timestamp() + (7 * 86400), tz=timezone.utc
    ))
    db.add(rt)
    await db.commit()

    send_welcome_email.delay(user.email, user.full_name)

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=1800,
        user=ClientResponse.model_validate(client),
    )


@router.post("/signin", response_model=TokenPair)
async def signin(payload: ClientLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower(), User.is_active == True))
    user = result.scalar_one_or_none()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.last_signed_in_at = datetime.now(timezone.utc)
    await db.commit()

    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    rt = RefreshToken(user_id=user.id, token=refresh_token, expires_at=datetime.fromtimestamp(
        datetime.now(timezone.utc).timestamp() + (7 * 86400), tz=timezone.utc
    ))
    db.add(rt)
    await db.commit()

    client_result = await db.execute(select(Client).where(Client.user_id == user.id))
    client = client_result.scalar_one_or_none()

    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=1800,
        user=ClientResponse.model_validate(client) if client else ClientResponse(id=user.id, name=user.full_name, email=user.email),
    )


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(payload: TokenRefresh, db: AsyncSession = Depends(get_db)):
    token_payload = decode_token(payload.refresh_token)
    if not token_payload or token_payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token == payload.refresh_token, RefreshToken.revoked == False)
    )
    rt = result.scalar_one_or_none()
    if not rt:
        raise HTTPException(status_code=401, detail="Refresh token not found or revoked")

    user_result = await db.execute(select(User).where(User.id == rt.user_id, User.is_active == True))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = create_access_token({"sub": str(user.id), "role": user.role.value})
    new_refresh = create_refresh_token({"sub": str(user.id)})

    rt.token = new_refresh
    rt.expires_at = datetime.fromtimestamp(
        datetime.now(timezone.utc).timestamp() + (7 * 86400), tz=timezone.utc
    )
    await db.commit()

    client_result = await db.execute(select(Client).where(Client.user_id == user.id))
    client = client_result.scalar_one_or_none()

    return TokenPair(
        access_token=access_token,
        refresh_token=new_refresh,
        token_type="bearer",
        expires_in=1800,
        user=ClientResponse.model_validate(client) if client else ClientResponse(id=user.id, name=user.full_name, email=user.email),
    )


@router.post("/change-password")
async def change_password(payload: PasswordChange, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not verify_password(payload.current_password, current_user.hashed_password or ""):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")

    current_user.hashed_password = hash_password(payload.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}


@router.get("/me", response_model=ClientResponse)
async def get_me(current_user: User = Depends(get_current_client), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Client).where(Client.user_id == current_user.id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client profile not found")
    return ClientResponse.model_validate(client)


@router.post("/logout", status_code=204)
async def logout(current_user: User = Depends(get_current_client), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.user_id == current_user.id, RefreshToken.revoked == False)
    )
    tokens = result.scalars().all()
    for token in tokens:
        token.revoked = True
    await db.commit()
    return None
