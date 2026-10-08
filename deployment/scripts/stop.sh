#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "Stopping application workloads..."

kubectl delete -f "${ROOT_DIR}/deployment/k8s/04-ingress/" --ignore-not-found=true
kubectl delete -f "${ROOT_DIR}/deployment/k8s/03-frontend/" --ignore-not-found=true
kubectl delete -f "${ROOT_DIR}/deployment/k8s/02-backend/" --ignore-not-found=true
kubectl delete -f "${ROOT_DIR}/deployment/k8s/01-database/" --ignore-not-found=true
kubectl delete -f "${ROOT_DIR}/deployment/k8s/00-config/" --ignore-not-found=true

echo "Application workloads stopped. MongoDB storage preserved."
