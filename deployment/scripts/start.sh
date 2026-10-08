#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "Starting application deployment..."

echo "Building backend Docker image (backend:latest)..."
docker build -t backend:latest "${ROOT_DIR}/back-end"

echo "Building frontend Docker image (frontend:latest)..."
docker build -t frontend:latest "${ROOT_DIR}/front-end"

if command -v k3d &> /dev/null; then
    CLUSTERS=$(k3d cluster list --no-headers 2>/dev/null | awk '{print $1}' || true)
    for c in $CLUSTERS; do
        echo "Loading Docker images into k3d cluster: $c..."
        k3d image import backend:latest frontend:latest -c "$c" 2>/dev/null || true
    done
elif command -v minikube &> /dev/null && minikube status &> /dev/null; then
    echo "Loading Docker images into minikube cluster..."
    minikube image load backend:latest frontend:latest 2>/dev/null || true
fi

echo "Applying Kubernetes manifests..."
kubectl apply -f "${ROOT_DIR}/deployment/k8s/00-config/"
kubectl apply -f "${ROOT_DIR}/deployment/k8s/01-database/"
kubectl apply -f "${ROOT_DIR}/deployment/k8s/02-backend/"
kubectl apply -f "${ROOT_DIR}/deployment/k8s/03-frontend/"
kubectl apply -f "${ROOT_DIR}/deployment/k8s/04-ingress/"

echo "Waiting for MongoDB StatefulSet to be ready..."
kubectl rollout status statefulset/mongodb --timeout=120s

echo "Waiting for backend Deployment to be ready..."
kubectl rollout status deployment/backend --timeout=120s

echo "Waiting for frontend Deployment to be ready..."
kubectl rollout status deployment/frontend --timeout=120s

echo "Deployment completed successfully."
kubectl get pods,svc,pvc,ingress -l 'app.kubernetes.io/part-of=starter-app' 2>/dev/null || kubectl get pods,svc,pvc,ingress
