# ☸️ Kubernetes Deployment Guide

This directory contains the complete Kubernetes configuration and automation scripts for the Next.js + Spring Boot + MongoDB full-stack application.

---

## 📁 Directory Structure

```text
deployment/
├── k8s/
│   ├── 00-config/
│   │   └── configmap.yaml               # Shared app configuration (MongoDB URI, Ports, etc.)
│   ├── 01-database/
│   │   ├── mongodb-service.yaml         # Headless ClusterIP Service (port 27017)
│   │   └── mongodb-statefulset.yaml     # MongoDB 7.0 StatefulSet + 100Mi VolumeClaimTemplate
│   ├── 02-backend/
│   │   ├── backend-deployment.yaml      # Spring Boot 3 Deployment (1 replica) + Actuator Probes
│   │   └── backend-service.yaml         # Backend ClusterIP Service (port 8080)
│   ├── 03-frontend/
│   │   ├── frontend-deployment.yaml     # Next.js 16 Deployment (1 replica) + Probes
│   │   └── frontend-service.yaml        # Frontend ClusterIP Service (port 3000)
│   └── 04-ingress/
│       └── ingress.yaml                 # Ingress routing (/api -> Backend, / -> Frontend)
└── scripts/
    ├── start.sh                         # Builds Docker images & deploys to K8s
    ├── stop.sh                          # Stops workloads (preserves PVC data)
    └── clean-mongodb-volume.sh          # Reclaims MongoDB 100Mi PVC storage space
```

---

## 🚀 How to Run

### 1. Start Application (Build & Deploy)
```bash
./deployment/scripts/start.sh
```

### 2. Stop Application (Keep Data Safe)
```bash
./deployment/scripts/stop.sh
```

### 3. Clear MongoDB Volume & Storage Space
```bash
./deployment/scripts/clean-mongodb-volume.sh
```

---

## 🌐 Accessing the Application

### Option A: Via Ingress (Recommended)
If your cluster has an Ingress controller enabled (e.g. Traefik on k3d or `minikube addons enable ingress`):
- **Web UI**: `http://localhost/` or `http://<ingress-ip>/`
- **Backend API**: `http://localhost/api/v1/users` (or your backend endpoints)

### Option B: Via Port-Forwarding
If running locally without an Ingress controller:
```bash
# Frontend
kubectl port-forward svc/frontend-service 3000:3000

# Backend
kubectl port-forward svc/backend-service 8080:8080
```
