# Cars Catalog - Premium Vehicle Sales Platform

A modern, full-stack web application for browsing, exploring, and pre-ordering premium vehicles. Built with React, Node.js, and containerized for easy deployment.

## 🚀 Features

- **Vehicle Catalog**: Browse a curated selection of premium cars with detailed specifications
- **Featured Vehicles**: Highlighted premium models on the homepage
- **Pre-Order System**: Reserve vehicles with order tracking
- **Admin Dashboard**: Manage inventory, orders, and users
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Theme toggle for user preference
- **Authentication**: Secure login for admin access
- **Real-time Updates**: Live order status and inventory management
- **Vercel Deployment**: One-click deployment with serverless API functions

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, SQLite (with file-based DB)
- **API**: Vercel Serverless Functions with automatic deployment
- **DevOps**: Docker, Docker Compose, Vercel
- **Testing**: Vitest, Playwright
- **Linting**: ESLint

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Docker & Docker Compose (for containerized setup)
- Vercel account (for cloud deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevRyan-bit/Project_Cars.git
   cd Project_Cars
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:8080
   - Backend: http://localhost:5000

### Docker Setup

```bash
docker-compose up --build
```
Access at http://localhost:3000

## 📖 Usage

### For Users
- Browse vehicles on the homepage
- View detailed car information
- Pre-order vehicles with tracking

### For Admins
- Login at `/admin/login`
- Manage cars, orders, and users
- View analytics and transactions

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cars` | GET | Get all vehicles |
| `/api/cars/:id` | GET | Get specific vehicle |
| `/api/auth/login` | POST | Admin authentication |
| `/api/auth/profile` | GET | Get current user (protected) |
| `/api/orders` | GET | Get all orders (protected) |
| `/api/transactions` | GET | Get transactions (protected) |
| `/api/health` | GET | Health check |
| `/api/hello` | GET | Test endpoint |

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for detailed documentation.

## 🌐 Deployment

### Local Production Build
```bash
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

### ⚡ Vercel Deployment (Recommended)

Deploy both frontend and backend serverless functions on Vercel with zero configuration:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# JWT_SECRET=your-secret-key
# CORS_ORIGIN=your-domain.com
```

**Features:**
- Automatic deployments on git push
- Serverless API functions in `/api`
- Frontend automatically optimized
- Free tier: 100GB bandwidth/month
- Custom domain support

For detailed setup instructions, see [VERCEL_SETUP_GUIDE.md](./VERCEL_SETUP_GUIDE.md)

Run the pre-deployment checklist:
```bash
chmod +x vercel-checklist.sh
./vercel-checklist.sh
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

- **Port conflicts**: Change ports in `vite.config.ts` or `.env`
- **CORS issues**: Verify `CORS_ORIGIN` in backend `.env`
- **Build errors**: Clear `node_modules` and reinstall

For more help, check the [QUICKSTART.md](QUICKSTART.md) or [SETUP_SUMMARY.md](SETUP_SUMMARY.md).