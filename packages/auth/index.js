const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("@hauzral/shared/utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret";

function authenticate(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new UnauthorizedError("Missing bearer token"));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
}

function authorize(...requiredScopes) {
  return (req, _res, next) => {
    const roles = req.user?.roles || [];
    const ok = requiredScopes.some((scope) => roles.includes(scope) || roles.includes("*"));

    if (!ok) {
      return next(new ForbiddenError(`Requires scope: ${requiredScopes.join(" or ")}`));
    }

    return next();
  };
}

function issueToken(payload, expiresIn = "12h") {
  return jwt.sign({ org: "hauzral", ...payload }, JWT_SECRET, { expiresIn });
}

module.exports = {
  authenticate,
  authorize,
  issueToken,
};
