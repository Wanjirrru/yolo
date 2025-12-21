# YOLO E-Commerce Platform (Containerized)

This repository is a forked and enhanced version of the original [kadimasum/yolo](https://github.com/kadimasum/yolo) project — a simple e-commerce application built with Node.js, Express (backend), MongoDB (database), and a React-based client frontend.

The goal of this Week 5 Independent Project (IP 2) was to fully containerize the application using Docker and Docker Compose, turning it into a set of microservices that can be easily built, run, and deployed by anyone cloning the repo.

## Application Overview

- **Backend**: Node.js + Express API handling product CRUD operations (including the "Add Product" form functionality).
- **Frontend**: React application providing the UI for browsing products and the admin dashboard to add new products.
- **Database**: MongoDB for persistent storage of products.

When running, users can:
- View products.
- Add new products via the provided form.
- Verify data persistence (added products remain after container restarts).

## Containerization Approach

We containerized the application into three services:

1. **mongo** — Official MongoDB image with a named volume for data persistence.
2. **backend** — Custom-built Node.js image running the Express server.
3. **frontend** — Multi-stage build: React app built with Node, then served via lightweight Nginx for minimal image size.

### Key Docker Best Practices Applied

- **Minimal base images**:
  - `node:20-alpine` for building and running the backend (~150MB installed).
  - Multi-stage build for frontend: build with `node:20-alpine`, then copy static files to `nginx:alpine` (~20MB final).
  - Official `mongo:7` image (optimized and secure).
  - Total layered image size kept well under 400MB.

- **Production-ready**:
  - Installed only production dependencies (`npm ci --only=production`).
  - No unnecessary dev tools or cache left in final images.

- **Networking**:
  - Custom bridge network (`yolo-network`) so services communicate securely via service names (e.g., backend connects to `mongodb://mongo:27017/yolo-db`).

- **Persistence**:
  - Named Docker volume `mongo-data` mounted to `/data/db` ensures products added via the form survive container restarts/recreates.

- **Image versioning**:
  - Images tagged using semantic versioning (e.g., `yourusername/yolo-backend:v1.0.0`, `yourusername/yolo-frontend:v1.0.0`).
  - Pushed to Docker Hub (see screenshot in repo root or `dockerhub-screenshot.png`).

### File Structure Additions
.
├── backend/                # Original backend code
├── client/                 # Original React frontend code
├── Dockerfile.backend      # Dockerfile for backend service
├── Dockerfile.frontend     # Multi-stage Dockerfile for frontend
├── docker-compose.yml      # Orchestrates all services
└── README.md               # This file


## How to Run the Containerized Application

Prerequisites:
- Docker and Docker Compose installed.

Steps:

```bash
git clone https://github.com/Wanjirrru/yolo.git
cd yolo
docker-compose up --build -d