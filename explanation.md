# Explanation of Implementation Choices

1. **Choice of base image**  
   - Backend: `node:20-alpine` — smallest official Node image, secure, ~150MB with deps.  
   - Frontend: Multi-stage — build with `node:20-alpine`, serve with `nginx:alpine` (~20MB final).  
   - Mongo: Official `mongo:7` — optimized and trusted.

2. **Dockerfile directives**  
   - Used multi-stage for frontend to minimize size.  
   - `npm install` (instead of `ci`) to resolve package-lock conflicts.  
   - Production-only deps where possible.  
   - Custom Nginx config for reverse proxy.

3. **Docker-compose Networking**  
   - Custom bridge network `yolo-network`.  
   - Services communicate via service names (e.g., `backend` hostname).  
   - Frontend port 3000 → Nginx:80, backend internal only.

4. **Docker-compose volume definition**  
   - Named volume `mongo-data` mounted to `/data/db` → products persist across restarts.

5. **Git workflow**  
   - Over 10 descriptive commits showing step-by-step progress.  
   - Clear README with run instructions.

6. **Successful running & debugging**  
   - Fixed Mongo connection (env var + service name).  
   - Fixed frontend-backend comm via Nginx reverse proxy.  
   - Add product works, list refreshes, persistence verified.

7. **Good practices**  
   - Semantic versioning on Docker Hub tags (v1.0.0).  
   - Minimal images, clean structure.

8. **Docker Hub screenshot**  
   See `screenshots` — shows both images pushed with tag v1.0.0.

