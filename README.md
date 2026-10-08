# Next.js + Spring Boot + MongoDB Kubernetes Starter

A full-stack cloud-native starter application featuring a Next.js frontend, a Spring Boot RESTful backend, a MongoDB database, and declarative Kubernetes manifests designed for local and production deployments.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Local Development (Without Kubernetes)](#local-development-without-kubernetes)
   - [Prerequisites](#prerequisites)
   - [Running MongoDB](#running-mongodb)
   - [Running Backend (Spring Boot)](#running-backend-spring-boot)
   - [Running Frontend (Next.js)](#running-frontend-nextjs)
3. [Local Kubernetes Deployment](#local-kubernetes-deployment)
   - [Prerequisites (Docker + Minikube / k3d)](#prerequisites-docker--minikube--k3d)
   - [Cluster Setup](#cluster-setup)
   - [Automated Deployment Using Scripts](#automated-deployment-using-scripts)
4. [Deployment Folder Scripts Reference](#deployment-folder-scripts-reference)
5. [Kubernetes Manifests & Concepts Deep-Dive](#kubernetes-manifests--concepts-deep-dive)
   - [Manifest Directory Structure](#manifest-directory-structure)
   - [StatefulSet: Volumes & volumeClaimTemplates](#statefulset-volumes--volumeclaimtemplates)
   - [Deployment & Probes](#deployment--probes)
   - [Service (ClusterIP)](#service-clusterip)
   - [Ingress (Layer 7 Routing)](#ingress-layer-7-routing)
6. [Frontend Architecture (A Guide for Backend & Spring Boot Developers)](#frontend-architecture-a-guide-for-backend--spring-boot-developers)
   - [Architectural Mapping Table](#architectural-mapping-table)
   - [The `core` Layer](#the-core-layer)
   - [The `ui` Layer](#the-ui-layer)
   - [The `app` Layer](#the-app-layer)
7. [Backend API Reference & cURL Commands](#backend-api-reference--curl-commands)
   - [Actuator Health Probes](#actuator-health-probes)
   - [Create User](#create-user)
   - [Get All Users](#get-all-users)
   - [Get User by ID](#get-user-by-id)
   - [Update User](#update-user)
   - [Delete User](#delete-user)

---

## Architecture Overview

```
                        +---------------------------------------+
                        |           Ingress Controller          |
                        |             (Port 80/443)             |
                        +---------------------------------------+
                                   /                \
                       path: /    /                  \   path: /api
                                 v                    v
                   +--------------------+      +--------------------+
                   |  frontend-service  |      |  backend-service   |
                   |     (Port 3000)    |      |     (Port 8080)    |
                   +--------------------+      +--------------------+
                             |                            |
                             v                            v
                   +--------------------+      +--------------------+
                   | Frontend Pod       |      | Backend Pod        |
                   | (Next.js 16)       |      | (Spring Boot 3)    |
                   +--------------------+      +--------------------+
                                                          |
                                                          v
                                               +--------------------+
                                               |  mongodb-service   |
                                               |    (Port 27017)    |
                                               +--------------------+
                                                          |
                                                          v
                                               +--------------------+
                                               | MongoDB Pod (STS)  |
                                               | (StatefulSet + PVC)|
                                               +--------------------+
```

---

## Local Development (Without Kubernetes)

If you want to run the project directly on your host machine without deploying to Kubernetes, follow the steps below.

### Prerequisites

- Java 21 (JDK)
- Maven 3.9+ (or use the repository's Maven wrapper if available)
- Node.js 20+ and npm 10+
- Docker (to run MongoDB standalone) or a locally installed MongoDB instance

### Running MongoDB

Run MongoDB via Docker:

```bash
docker run -d \
  --name local-mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7.0
```

### Running Backend (Spring Boot)

1. Navigate to the `back-end` directory:
   ```bash
   cd back-end
   ```

2. Verify or set the MongoDB URI environment variable (defaults to `mongodb://localhost:27017/user_db` in `application.yml`):
   ```bash
   export SPRING_DATA_MONGODB_URI="mongodb://localhost:27017/user_db"
   ```

3. Build and start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend server starts at `http://localhost:8080`.

### Running Frontend (Next.js)

1. Navigate to the `front-end` directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set the backend API URL. For standalone local development with backend on port 8080:
   ```bash
   export NEXT_PUBLIC_API_URL="http://localhost:8080"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## Local Kubernetes Deployment

You can run the complete stack on a local Kubernetes cluster using either **k3d** (lightweight k3s in Docker) or **Minikube**.

### Prerequisites (Docker + Minikube / k3d)

Install Docker Desktop, OrbStack, or Colima, along with `kubectl` and either `minikube` or `k3d`.

On macOS (via Homebrew):
```bash
# Install Docker (if not already installed)
brew install --cask docker

# Install kubectl
brew install kubectl

# Option A: Install k3d (Recommended for speed and built-in Traefik ingress)
brew install k3d

# Option B: Install Minikube
brew install minikube
```

### Cluster Setup

#### Option A: Using k3d (Recommended)

Create a k3d cluster with port 80 mapped to localhost for ingress:

```bash
k3d cluster create starter-cluster -p "80:80@loadbalancer"
```

#### Option B: Using Minikube

Start Minikube and enable the ingress addon:

```bash
minikube start --driver=docker
minikube addons enable ingress
```

*Note for Minikube on macOS*: Run `minikube tunnel` in a separate terminal window to bind port 80/443 to localhost.

### Automated Deployment Using Scripts

The repository includes shell automation scripts located in `deployment/scripts/`.

1. Deploy the entire stack (builds Docker images, imports them into the cluster, and applies manifests):
   ```bash
   ./deployment/scripts/start.sh
   ```

2. Check the deployed resources:
   ```bash
   kubectl get pods,svc,pvc,ingress
   ```

3. Access the application in your browser:
   - Frontend: `http://localhost/`
   - Backend Health: `http://localhost/api/actuator/health`
   - Backend API: `http://localhost/api/v1/users`

4. Stop the application workloads (preserves database storage):
   ```bash
   ./deployment/scripts/stop.sh
   ```

5. Completely clean up MongoDB database storage (destroys data volume):
   ```bash
   ./deployment/scripts/clean-mongodb-volume.sh
   ```

---

## Deployment Folder Scripts Reference

All deployment scripts reside in `deployment/scripts/` and use `set -euo pipefail` for strict error handling:

### 1. `start.sh`
- **Location**: `deployment/scripts/start.sh`
- **Actions**:
  1. Builds the backend Docker image (`backend:latest`) from `back-end/Dockerfile`.
  2. Builds the frontend Docker image (`frontend:latest`) from `front-end/Dockerfile`.
  3. Detects whether `k3d` or `minikube` is running and automatically loads the local images into the cluster nodes without requiring a remote Docker registry.
  4. Applies the Kubernetes manifests in strict dependency order:
     - `00-config/` (ConfigMap)
     - `01-database/` (MongoDB Service & StatefulSet)
     - `02-backend/` (Spring Boot Service & Deployment)
     - `03-frontend/` (Next.js Service & Deployment)
     - `04-ingress/` (Ingress routing rules)
  5. Waits for each component to become ready using `kubectl rollout status` with timeouts.
  6. Prints the status of all created pods, services, PVCs, and ingress.

### 2. `stop.sh`
- **Location**: `deployment/scripts/stop.sh`
- **Actions**:
  1. Deletes Kubernetes resources in reverse order (Ingress -> Frontend -> Backend -> Database -> ConfigMap).
  2. Uses `--ignore-not-found=true` to ensure idempotency.
  3. **Preserves MongoDB PVC**: Pods and StatefulSets are deleted, but persistent volume data remains safe for subsequent restarts.

### 3. `clean-mongodb-volume.sh`
- **Location**: `deployment/scripts/clean-mongodb-volume.sh`
- **Actions**:
  1. Prompts for explicit user confirmation before proceeding.
  2. Deletes the MongoDB StatefulSet.
  3. Deletes the PersistentVolumeClaim (`mongodb-data-mongodb-0` and matching label `app=mongodb`), allowing a fresh database initialization on the next start.

---

## Kubernetes Manifests & Concepts Deep-Dive

### Manifest Directory Structure

```
deployment/k8s/
├── 00-config/
│   └── configmap.yaml            # Environment variables shared by workloads
├── 01-database/
│   ├── mongodb-service.yaml      # Headless / ClusterIP service for MongoDB
│   └── mongodb-statefulset.yaml  # StatefulSet definition with storage request
├── 02-backend/
│   ├── backend-deployment.yaml   # Spring Boot deployment with health probes
│   └── backend-service.yaml      # ClusterIP service exposing port 8080
├── 03-frontend/
│   ├── frontend-deployment.yaml  # Next.js deployment with health probes
│   └── frontend-service.yaml     # ClusterIP service exposing port 3000
└── 04-ingress/
    └── ingress.yaml              # Path-based routing rules (/ -> UI, /api -> Backend)
```

### StatefulSet: Volumes & volumeClaimTemplates

Stateful workloads like MongoDB require stable network identities, ordered rollouts, and persistent storage across restarts and rescheduling.

- **Why StatefulSet over Deployment?**
  A standard `Deployment` treats pods as interchangeable and stateless. A `StatefulSet` assigns each pod an ordinal index (`mongodb-0`), a fixed hostname, and dedicated storage.

- **`volumes` vs `volumeClaimTemplates`**:
  - **Regular `volumes` + `persistentVolumeClaim`**: In a `Deployment`, all replica pods share the same PVC reference, which causes data collision or write locks unless the storage supports `ReadWriteMany`.
  - **`volumeClaimTemplates` (in StatefulSet)**: Kubernetes dynamically provisions an independent `PersistentVolumeClaim` for each replica pod (e.g., `mongodb-data-mongodb-0`). When a pod crashes or is rescheduled to a new node, Kubernetes re-attaches the exact same volume to the recreated pod, preventing data loss.

Snippet from `deployment/k8s/01-database/mongodb-statefulset.yaml`:
```yaml
spec:
  serviceName: "mongodb-service"
  replicas: 1
  template:
    spec:
      containers:
        - name: mongodb
          image: mongo:7.0
          volumeMounts:
            - name: mongodb-data
              mountPath: /data/db
  volumeClaimTemplates:
    - metadata:
        name: mongodb-data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 100Mi
```

### Deployment & Probes

Stateless applications (`backend` and `frontend`) use Kubernetes `Deployment` objects with configured resource requests/limits and lifecycle probes:

- **`livenessProbe`**: Checks if the container is running and healthy. If the liveness probe fails repeatedly, Kubernetes kills and restarts the container.
  - Backend: Evaluates Spring Boot Actuator endpoint `/actuator/health/liveness`.
  - Frontend: Evaluates HTTP status of `/`.
- **`readinessProbe`**: Checks if the container is ready to accept user traffic. If readiness fails, the pod is temporarily removed from the Service endpoints without restarting.
  - Backend: Evaluates Spring Boot Actuator endpoint `/actuator/health/readiness` (verifies database connectivity).
  - Frontend: Evaluates HTTP status of `/`.

### Service (ClusterIP)

A Kubernetes `Service` provides an internal virtual IP and DNS name that load-balances requests across matching pods:

- `backend-service` routes to backend pods on port 8080.
- `frontend-service` routes to frontend pods on port 3000.
- `mongodb-service` routes to MongoDB pods on port 27017.

Internal DNS resolution format: `<service-name>.<namespace>.svc.cluster.local` (e.g., `mongodb-service:27017`).

### Ingress (Layer 7 Routing)

The Ingress resource acts as the unified reverse proxy entering the cluster. It inspects the HTTP request path and routes traffic accordingly:

- Requests with prefix `/api` are routed to `backend-service:8080`.
- All other requests (`/`) are routed to `frontend-service:3000`.

Snippet from `deployment/k8s/04-ingress/ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
    - http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 8080
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 3000
```

---

## Frontend Architecture (A Guide for Backend & Spring Boot Developers)

The frontend is structured using Clean Architecture principles to mirror familiar enterprise backend patterns (Spring Boot). Instead of coupling UI components directly to API calls or ad-hoc state, the codebase is separated into three distinct layers: `core`, `ui`, and `app`.

### Architectural Mapping Table

| Spring Boot Backend Concept | Next.js Frontend Equivalent | Location in Frontend |
|---|---|---|
| DTO / Java Records | TypeScript Interfaces & DTOs | `front-end/src/core/dto/` |
| RestClient / WebClient / Feign | HTTP Client wrapper (`ApiClient`) | `front-end/src/core/client/` |
| Jakarta Validation (`@Valid`, `@NotBlank`) | Client Request Validators | `front-end/src/core/validator/` |
| Service Interface (`UserService`) | TypeScript Service Interface (`UserService`) | `front-end/src/core/service/UserService.ts` |
| Service Impl (`@Service UserServiceBean`) | TypeScript Service Class (`UserServiceImpl`) | `front-end/src/core/service/UserServiceImpl.ts` |
| Controller / Facade (`@RestController`) | Custom Hooks (`useUserOperations`, `useUserManagement`) | `front-end/src/core/controller_hooks/` |
| Domain Enums / Entities | TypeScript Enums and Types | `front-end/src/core/types/` |
| HTML / Thymeleaf / View Templates | React Presentation Components | `front-end/src/ui/presentation/` |
| UI Widgets / Reusable Form Controls | Atomic UI Components | `front-end/src/ui/components/` |
| Spring MVC Routing / DispatcherServlet | Next.js App Router Pages | `front-end/src/app/` |

---

### The `core` Layer

The `core` layer contains all pure business logic, data contracts, and client-side orchestration. It has no dependency on specific styling or JSX presentation.

- `core/dto/`: Defines data shapes sent to and received from the API (e.g., `UserCreateRequestDto`, `UserUpdateRequestDto`, `UserResponseDto`).
- `core/validator/`: Enforces validation rules on forms before dispatching requests, similar to Spring's `@Valid`.
- `core/client/`: Configures standard HTTP communication with error handling, base URLs, and header injection.
- `core/service/`: Contains `UserService` interface and `UserServiceImpl` class. It manages API communication and data transformations.
- `core/controller_hooks/`:
  - `operations/`: Encapsulates async actions (fetch, create, update, delete) and error states.
  - `facades/`: Aggregates operations into a single cohesive state object consumed by the presentation layer.

### The `ui` Layer

The `ui` layer handles rendering and visual representation:

- `ui/components/`: Reusable, generic UI components (Buttons, Inputs, Modals, Status Badges, Confirm Dialogs).
- `ui/presentation/`: Views that assemble UI components and receive application state through props (e.g., `UserDashboardView`, `UserList`, `UserFormModal`).

### The `app` Layer

The `app` layer utilizes the Next.js App Router:

- `app/layout.tsx`: Root HTML shell and global font/style imports.
- `app/globals.css`: Global styles and design system variables.
- `app/page.tsx`: Root route entry point. It calls the controller hook facade (`useUserManagement()`) and injects the resulting state directly into `<UserDashboardView />`.

---

## Backend API Reference & cURL Commands

Base URLs:
- Direct backend access: `http://localhost:8080`
- Access via Kubernetes Ingress: `http://localhost/api`

The examples below use the direct backend URL (`http://localhost:8080`). If accessing via Ingress, prepend `/api` (for example: `http://localhost/api/v1/users`).

### Actuator Health Probes

Check overall application and database health:

```bash
curl -i -X GET http://localhost:8080/actuator/health
```

Check Kubernetes liveness probe:

```bash
curl -i -X GET http://localhost:8080/actuator/health/liveness
```

Check Kubernetes readiness probe:

```bash
curl -i -X GET http://localhost:8080/actuator/health/readiness
```

---

### Create User

Creates a new user record in MongoDB.

- **Method**: `POST`
- **Path**: `/api/v1/users`
- **Supported Roles**: `ADMIN`, `USER`, `MANAGER`

```bash
curl -i -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "ADMIN"
  }'
```

Response (`201 Created`):
```json
{
  "id": "660c2b5e2f8e4b001a1e8c91",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "createdAt": "2026-10-08T10:30:00Z",
  "updatedAt": "2026-10-08T10:30:00Z"
}
```

---

### Get All Users

Retrieves a list of all registered users.

- **Method**: `GET`
- **Path**: `/api/v1/users`

```bash
curl -i -X GET http://localhost:8080/api/v1/users
```

Response (`200 OK`):
```json
[
  {
    "id": "660c2b5e2f8e4b001a1e8c91",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-10-08T10:30:00Z",
    "updatedAt": "2026-10-08T10:30:00Z"
  }
]
```

---

### Get User by ID

Retrieves a single user by their unique identifier.

- **Method**: `GET`
- **Path**: `/api/v1/users/{id}`

```bash
curl -i -X GET http://localhost:8080/api/v1/users/660c2b5e2f8e4b001a1e8c91
```

Response (`200 OK`):
```json
{
  "id": "660c2b5e2f8e4b001a1e8c91",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "createdAt": "2026-10-08T10:30:00Z",
  "updatedAt": "2026-10-08T10:30:00Z"
}
```

---

### Update User

Updates an existing user's name, role, and status.

- **Method**: `PUT`
- **Path**: `/api/v1/users/{id}`
- **Supported Statuses**: `ACTIVE`, `INACTIVE`, `SUSPENDED`
- **Supported Roles**: `ADMIN`, `USER`, `MANAGER`

```bash
curl -i -X PUT http://localhost:8080/api/v1/users/660c2b5e2f8e4b001a1e8c91 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "role": "MANAGER",
    "status": "ACTIVE"
  }'
```

Response (`200 OK`):
```json
{
  "id": "660c2b5e2f8e4b001a1e8c91",
  "name": "Jane Smith",
  "email": "jane.doe@example.com",
  "role": "MANAGER",
  "status": "ACTIVE",
  "createdAt": "2026-10-08T10:30:00Z",
  "updatedAt": "2026-10-08T10:45:00Z"
}
```

---

### Delete User

Deletes a user record by ID.

- **Method**: `DELETE`
- **Path**: `/api/v1/users/{id}`

```bash
curl -i -X DELETE http://localhost:8080/api/v1/users/660c2b5e2f8e4b001a1e8c91
```

Response (`204 No Content`)
