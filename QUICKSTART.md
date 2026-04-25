# Quick Start Guide - Cars Catalog

## 🚀 Get Started in 5 Minutes

### Option 1: Local Development (Recommended for Development)

```bash
# 1. Install all dependencies
npm install

# 2. Start both frontend & backend simultaneously
npm run dev
```

**Access the application:**
- Frontend: http://localhost:8080
- Backend: http://localhost:5000
- Backend Health: http://localhost:5000/health

---

### Option 2: Individual Services

**Start Backend:**
```bash
npm run dev:backend
```
Runs on http://localhost:5000

**Start Frontend (in another terminal):**
```bash
npm run dev:frontend
```
Runs on http://localhost:8080 with hot reload

---

### Option 3: Docker & Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 📁 Project Structure

```
frontend/           # React + TypeScript + Vite + Tailwind
├── src/            # Source code
├── dist/           # Production build
├── vite.config.ts  # Dev server on :8080, proxies /api to backend
└── Dockerfile      # Multi-stage build for production

backend/            # Node.js + Express + CORS
├── server.js       # Express server
├── .env            # Environment variables
└── Dockerfile      # Alpine-based production image

docker-compose.yml  # Orchestration (Frontend :3000, Backend :5000)
```

---

## 🔧 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both services |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

---

## 🌐 Frontend & Backend Integration

**Development (Vite Proxy):**
- Frontend on :8080 automatically proxies `/api/*` to backend on :5000
- No CORS issues in development

**Production (Docker):**
- Frontend serves from backend's `/api/*` endpoints
- Set `VITE_API_URL=/api` in production build

---

## 📝 Making Changes

### Frontend Changes
- Edit files in `frontend/src/`
- Changes hot-reload automatically via Vite
- No restart needed

### Backend Changes
- Edit `backend/server.js`
- Restart backend to apply changes:
  ```bash
  # Stop current process (Ctrl+C)
  npm run dev:backend
  ```

---

## 🐳 Docker Deployment

**Build images locally:**
```bash
docker-compose build
```

**Start services:**
```bash
docker-compose up
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop services:**
```bash
docker-compose down
```

---

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

### Frontend (.env.development)
```
VITE_API_URL=http://localhost:5000
```

### Frontend (.env.production)
```
VITE_API_URL=/api
```

---

## 🔗 API Endpoints

- `GET /api/hello` - Hello endpoint
- `GET /health` - Health check
- More routes can be added to `backend/server.js`

---

## 🐛 Troubleshooting

**Port 8080 already in use?**
```bash
# Change port in frontend/vite.config.ts
# Set to 3001 or another available port
```

**Backend not connecting?**
- Ensure backend is running on port 5000
- Check `.env` file exists with correct PORT
- Verify CORS_ORIGIN includes your frontend URL

**Build failing?**
```bash
# Clear everything and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
```

---

## 📚 Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, CORS
- **DevOps**: Docker, Docker Compose

---

## 🎯 Next Steps

1. **Explore the code**: Check `frontend/src/` and `backend/server.js`
2. **Add features**: Extend backend routes and React components
3. **Style**: Customize with Tailwind CSS in `tailwind.config.ts`
4. **Deploy**: Push Docker images to Docker Hub or deploy to cloud

---

For more details, see the main [README.md](README.md)
