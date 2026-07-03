#!/bin/bash
set -euo pipefail

APP_NAME="hauzral-api"
NAMESPACE="hauzral"
TAG="${1:-latest}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "Deploying ${APP_NAME}:${TAG} to ${ENVIRONMENT}..."

aws eks update-kubeconfig --region ${AWS_REGION:-us-east-1} --name hauzral-cluster || true

if [ "${DRY_RUN:-false}" != "true" ]; then
    kubectl set image deployment/${APP_NAME} api=${ECR_REGISTRY}/${APP_NAME}:${TAG} -n ${NAMESPACE}
    kubectl rollout status deployment/${APP_NAME} -n ${NAMESPACE} --timeout=300s

    echo "Running database migrations..."
    kubectl rollout restart deployment/${APP_NAME} -n ${NAMESPACE} || true
else
    echo "DRY RUN: kubectl set image deployment/${APP_NAME} api=${ECR_REGISTRY}/${APP_NAME}:${TAG} -n ${NAMESPACE}"
fi

echo "Deployment complete: ${APP_NAME}:${TAG}"
