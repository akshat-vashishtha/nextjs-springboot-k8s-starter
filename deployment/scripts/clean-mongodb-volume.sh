#!/usr/bin/env bash

set -euo pipefail

read -p "Are you sure you want to delete MongoDB persistent storage volume? (y/N): " -r CONFIRMATION

if [[ ! "$CONFIRMATION" =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo "Stopping MongoDB StatefulSet..."
kubectl delete statefulset mongodb --ignore-not-found=true

echo "Deleting MongoDB PersistentVolumeClaim..."
kubectl delete pvc mongodb-data-mongodb-0 --ignore-not-found=true
kubectl delete pvc -l app=mongodb --ignore-not-found=true

echo "MongoDB storage volume cleared."
