# Machrou3i Production Deployment & DevOps Strategy

This document outlines the DevOps and Infrastructure implementation strategy for scaling the Machrou3i AI platform from development to a highly-available production environment.

## 1. Containerization (Docker)
We utilize multi-stage Docker builds to dramatically reduce image size and attack surface for the Node (Nest.js) backend and Vite React frontend.

### Frontend Dockerfile Strategy
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
*Gains:* Utilizing `alpine` drops the image size from ~1.2GB to under ~30MB, accelerating Kubernetes scheduling.

## 2. Kubernetes (K8s) Orchestration
The Machrou3i ecosystem requires resilient uptime. We utilize K8s for auto-scaling and self-healing.

### Workload Configurations:
- **Deployment Replicas:** 3 instances of the Node API, 2 instances of the React Frontend.
- **Horizontal Pod Autoscaling (HPA):** Triggers scaling up when CPU utilization exceeds 75% or Memory exceeds 80%.
- **Liveness/Readiness Probes:** Configured to ping `/health` to ensure traffic only routes to healthy API pods.

## 3. CI/CD Pipeline (GitHub Actions -> ArgoCD)
We enforce a strict CI/CD flow merging into `main` to ensure zero-downtime deployments.

1. **Commit Phase:** Developer merges PR.
2. **CI Phase (GitHub Actions):** 
   - Runs `npm run lint`.
   - Executes Jest E2E tests.
   - Triggers SonarQube for vulnerability mapping.
   - Builds Docker Images and pushes them to Docker Hub / AWS ECR.
3. **CD Phase (ArgoCD):** 
   - ArgoCD continually monitors the deployment manifests repository. 
   - Noticing a new image tag, it performs a **Rolling Update** (killing one old pod, starting a new pod simultaneously) to achieve 0 downtime.

## 4. API Gateway & SSL/TLS
- **Nginx Ingress Controller:** Handles incoming HTTPS traffic.
- **Cert-Manager:** Automatically provisions and renews Let's Encrypt SSL certificates.
- **Rate-Limiting:** Enforces 150 requests / minute per IP to prevent DDoS attacks and LLM budget draining.

## 5. Defense PFE Q&A Focus
**Jury Question:** *How does your application scale under heavy AI processing loads?*
**Response:** "AI execution is offloaded asynchronously via WebSockets and message queues (Redis/RabbitMQ). The frontend doesn't hang waiting for an HTTP response. Simultaneously, Kubernetes HPA independently scales the AI-worker pods without affecting the main user-interface web pods."
