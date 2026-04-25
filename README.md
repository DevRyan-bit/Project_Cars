# Cars Catalog - Full Stack Application

A modern, responsive web application for browsing and pre-ordering premium vehicles.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn-ui
- **Backend**: Node.js + Express + CORS support
- **DevOps**: Docker & Docker Compose for containerization

## Project Structure

```
Project_cars/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── dist/          # Production build output
│   ├── package.json
│   └── Dockerfile     # Frontend Docker image
├── backend/           # Express backend server
│   ├── server.js
│   ├── .env           # Backend environment variables
│   ├── package.json
│   └── Dockerfile     # Backend Docker image
├── docker-compose.yml # Docker Compose orchestration
└── package.json       # Root package.json with convenience scripts
```

## Prerequisites

- **Node.js** 16+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** or **yarn** package manager
- **Docker & Docker Compose** (optional, for containerized deployment)

## Quick Start

### Local Development (Both Frontend & Backend)

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend && npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd backend && npm install
   cd ..
   ```

4. **Start both services simultaneously**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000
   - Backend Health Check: http://localhost:5000/health

### Individual Service Development

**Frontend only:**
```bash
npm run dev:frontend
```
Opens at http://localhost:8080 with hot reload

**Backend only:**
```bash
npm run dev:backend
```
Runs on http://localhost:5000

## Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend concurrently |
| `npm run dev:frontend` | Start only the frontend dev server |
| `npm run dev:backend` | Start only the backend server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production frontend build |

### Frontend

From `frontend/` directory:
```bash
npm run dev          # Start dev server on :8080
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Watch mode tests
```

### Backend

From `backend/` directory:
```bash
npm run dev          # Start server on :5000
npm start            # Start server (same as dev)
```

## API Endpoints

### Backend Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hello` | GET | Returns a hello message |
| `/health` | GET | Health check endpoint |

## Environment Configuration

### Frontend

**`.env.development`** (development):
```
VITE_API_URL=http://localhost:5000
```

**`.env.production`** (production):
```
VITE_API_URL=/api
```

### Backend

**`.env`**:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:8080
```

## Docker Deployment

### Using Docker Compose

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Using Individual Dockerfiles

**Frontend:**
```bash
cd frontend
docker build -t cars-frontend .
docker run -p 3000:3000 cars-frontend
```

**Backend:**
```bash
cd backend
docker build -t cars-backend .
docker run -p 5000:5000 cars-backend
```

## Frontend Features

- **Browse Vehicles**: Browse premium cars with detailed information
- **Featured Section**: Highlighted featured vehicles
- **Pre-order**: Reserve vehicles for purchase
- **Responsive Design**: Mobile, tablet, and desktop support
- **Dark Mode Support**: Theme toggle capability
- **Component Library**: Built with shadcn/ui components

## Development Workflow

### Making Changes

1. **Frontend changes**: Changes to React components auto-reload via HMR
2. **Backend changes**: Restart the backend server to apply changes
   ```bash
   # Stop current backend (Ctrl+C)
   npm run dev:backend
   ```

### Branch Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to origin
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## Troubleshooting

### Port Already in Use

If port 8080 or 5000 is already in use:

**Frontend**:
```bash
# Change port in frontend/vite.config.ts
export default defineConfig({
  server: {
    port: 3001,  // Change to different port
  },
})
```

**Backend**:
```bash
# Set PORT environment variable
PORT=5001 npm run dev:backend
```

### CORS Issues

If frontend can't reach backend:

1. Ensure backend is running on port 5000
2. Check `.env` file in backend folder
3. Verify `CORS_ORIGIN` includes your frontend URL

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules backend/node_modules node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Performance Optimization

- **Frontend**: Vite provides instant HMR and fast builds
- **Backend**: Express is lightweight and efficient
- **Docker**: Multi-stage builds minimize image size
- **CSS**: Tailwind CSS with PurgeCSS for minimal bundle

## Production Deployment

### Building for Production

```bash
# Build frontend
npm run build

# Output is in frontend/dist/
```

### Deployment Platforms

- **Vercel**: Best for frontend, supports Vite
- **Netlify**: Alternative frontend hosting
- **AWS/Azure**: Full-stack deployment
- **Docker Hub**: Push Docker images for container deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and lint
5. Commit with descriptive messages
6. Push to your fork
7. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Check environment variables in `.env` files
4. Ensure all services are running on correct ports
# Cars Catalog - Premium Vehicle Sales Platform

A modern, responsive web application for browsing and pre-ordering premium vehicles. Built with React, TypeScript, and Vite for optimal performance.

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd Project_cars

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Editing the Code

You can edit this project using your preferred IDE:

- **Visual Studio Code** - Recommended editor
- **GitHub Codespaces** - Cloud-based development environment
- **Direct GitHub edits** - Edit files directly on GitHub.com

### Making Changes Locally

1. Clone the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your commit message"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request on GitHub

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Create an optimized production build
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Technologies Used

This project is built with:

- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **shadcn-ui** - High-quality component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **Recharts** - Charting library
- **Framer Motion** - Animation library

## Deployment

To deploy your application:

1. **Build the application**: `npm run build`
2. **Deploy the `dist` folder** to your hosting provider (Vercel, Netlify, GitHub Pages, etc.)

### Popular Deployment Options

- **Vercel** - Recommended for Vite projects
- **Netlify** - Easy drag-and-drop deployment
- **GitHub Pages** - Free hosting for static sites
- **AWS Amplify** - Scalable cloud deployment

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components (routes)
├── data/             # Static data
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── styles/           # Global styles
└── main.tsx          # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
#   P r o j e c t _ C a r s  
 #   P r o j e c t _ C a r s  
 