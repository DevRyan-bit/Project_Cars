# Frontend-Backend API Connection & Vercel Deployment Guide

## 📋 Overview

This project is now set up for full-stack deployment on Vercel with:
- **Frontend**: React + TypeScript + Vite deployed as static site
- **Backend**: Serverless functions in `/api` directory
- **Communication**: Frontend connects to backend via `/api` prefix

---

## 🚀 Quick Start - Deploy on Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy from Root Directory
```bash
# From project root
vercel
```

Vercel will automatically:
- Detect the frontend in `/frontend` and build it
- Deploy the API handlers from `/api`
- Set up environment variables
- Create necessary infrastructure

### Step 3: Set Environment Variables in Vercel Dashboard

After deployment, go to your project settings and add:

```
JWT_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=https://yourdomain.vercel.app,https://yourdomain.com
NODE_ENV=production
```

---

## 📁 Project Structure

```
/
├── api/                          # Serverless functions (auto-deployed)
│   ├── auth/
│   │   ├── login.js             # POST /api/auth/login
│   │   └── profile.js           # GET /api/auth/profile
│   ├── cars/
│   │   ├── index.js             # GET /api/cars
│   │   └── [id].js              # GET /api/cars/[id]
│   ├── orders/
│   │   └── index.js             # GET /api/orders
│   ├── transactions/
│   │   └── index.js             # GET /api/transactions
│   ├── lib/
│   │   ├── database.js          # Database utilities
│   │   └── auth.js              # Auth middleware
│   ├── health.js                # GET /api/health
│   ├── hello.js                 # GET /api/hello
│   └── package.json
│
├── frontend/                     # React app (auto-deployed to root)
│   ├── src/
│   ├── .env.development         # Local API: http://localhost:5000
│   ├── .env.production          # Vercel API: /api
│   └── package.json
│
├── backend/                      # (Optional) For local Express server
│   ├── server.js
│   └── package.json
│
├── vercel.json                   # Vercel configuration
├── .vercelignore                 # Files to ignore
└── VERCEL_DEPLOYMENT.md          # This file
```

---

## 🔌 API Connection

### How Frontend Connects to Backend

**In `/frontend/.env.production`:**
```
VITE_API_URL=/api
```

**In `/frontend/src/lib/api.ts`:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**Result**: Requests to `/api/auth/login` automatically go to the serverless function!

### Local Development

For local development, run both servers:

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend (optional - for testing)
cd backend
npm run dev
```

Frontend will proxy `/api` requests to `http://localhost:5000` (configured in `vite.config.ts`).

---

## 📝 API Endpoints

All endpoints are at `https://yourdomain.vercel.app/api/*`

### Authentication
- `POST /api/auth/login` - Login with username/email & password
- `GET /api/auth/profile` - Get current user (requires Bearer token)

### Cars (Public)
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get specific car

### Orders (Protected)
- `GET /api/orders` - Get all orders

### Transactions (Protected)
- `GET /api/transactions` - Get all transactions

### Health Check
- `GET /api/health` - Check backend status

[See API_ENDPOINTS.md for full documentation]

---

## 🔐 Security

### Environment Variables (Set in Vercel Dashboard)

1. **JWT_SECRET** ⚠️ CRITICAL
   - Use a strong random string (min 32 characters)
   - Generate: `openssl rand -base64 32`
   - Never commit to git

2. **CORS_ORIGIN**
   - Set to your domain(s)
   - Multiple domains: `domain1.com,domain2.com`
   - Prevents unauthorized API access

3. **DATABASE_URL** (For production)
   - For SQLite on Vercel, data resets after function timeout
   - Migrate to PostgreSQL or MongoDB for persistence
   - See "Database Migration" section

### Best Practices

✅ **Do**:
- Keep JWT_SECRET secret
- Use environment variables for sensitive data
- Validate all inputs on backend
- Use HTTPS (Vercel provides automatically)
- Set specific CORS origins (not `*`)
- Rate limit API endpoints
- Hash passwords (bcryptjs already used)

❌ **Don't**:
- Commit `.env` files
- Use weak JWT secrets
- Trust client-side validation only
- Log sensitive data
- Use SQLite for production (ephemeral filesystem)

---

## 💾 Database

### Current Setup: SQLite (Local/Ephemeral)

**Pros:**
- No external dependencies
- Easy local development
- File-based storage

**Cons:**
- Vercel has ephemeral filesystem
- Data persists only during single request
- Not suitable for production

### Migration for Production

Choose one option:

#### Option 1: PostgreSQL (Recommended)

```bash
npm install pg
```

Update `api/lib/database.js`:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

Providers:
- **Vercel Postgres** (integrates with Vercel)
- **Railway** ($5/month)
- **Heroku Postgres** (free tier available)

#### Option 2: MongoDB

```bash
npm install mongoose
```

Providers:
- **MongoDB Atlas** (free tier: 512MB)
- **Railway** (pay-as-you-go)

#### Option 3: Firebase Firestore

- Google's managed NoSQL
- Free tier: 1GB storage, 50k reads/day
- Automatic scaling

**Update database.js** after choosing a provider to use the corresponding client library.

---

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint
```bash
curl https://yourdomain.vercel.app/api/health
# Expected: { "status": "ok", ... }
```

### 2. Test Public Endpoint (Get Cars)
```bash
curl https://yourdomain.vercel.app/api/cars
# Expected: { "cars": [...] }
```

### 3. Test Auth Endpoint
```bash
curl -X POST https://yourdomain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
# Expected: { "token": "...", "user": {...} }
```

### 4. Test Protected Endpoint
```bash
curl https://yourdomain.vercel.app/api/profile \
  -H "Authorization: Bearer <your_token>"
# Expected: { "user": {...} }
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution:**
```
1. Check CORS_ORIGIN in Vercel dashboard
2. Includes your frontend domain?
3. Restart deployment after changing env vars
4. Check browser console for exact error
```

### Issue: 404 - API Not Found
**Solution:**
```
1. Verify file exists in /api directory
2. Check file naming matches route
3. Check Vercel deployment logs
4. Clear Vercel cache: vercel --prod --clear
```

### Issue: Authentication Failures
**Solution:**
```
1. Check JWT_SECRET is set (same on all deployments)
2. Token not expired (24h expiration)
3. Authorization header format: "Bearer <token>"
4. Check database has users table
```

### Issue: Database Errors on Vercel
**Solution:**
```
1. SQLite on Vercel is ephemeral
2. Migrate to PostgreSQL/MongoDB
3. Or accept data loss after requests
4. See "Database Migration" section
```

### Issue: Slow Cold Starts
**Solution:**
```
1. Reduce dependencies in /api/package.json
2. Split large handlers into smaller files
3. Cache database connections
4. Use Vercel's regional execution
```

---

## 📊 Monitoring & Logs

### View Deployment Logs
```bash
# Real-time logs
vercel logs --prod

# Function logs
vercel logs /api/auth/login --prod
```

### Monitor Performance
- Go to Vercel Dashboard → Your Project → Analytics
- Check response times, error rates, etc.

### Error Tracking
- Set up Sentry integration for error tracking
- Configure in Vercel dashboard

---

## 🔄 Continuous Deployment

### Automatic Deployment on GitHub Push

1. **Connect GitHub**
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Select your GitHub repository

2. **Auto-Deployment**
   - Every push to `main` → automatic build & deploy
   - Every PR → preview deployment

3. **Environment Variables**
   - Set in Vercel dashboard under Settings
   - Available to all builds

---

## 📦 Build Process

### Frontend Build
```bash
cd frontend && npm run build
# Outputs to: frontend/dist/
```

### API Functions
- No build needed
- Deploy as-is from `/api` directory

### Vercel Build
```bash
# Automated, runs when you push or click "Deploy"
vercel --prod
```

---

## 🎯 Next Steps

1. ✅ Create Vercel account (free)
2. ✅ Connect GitHub repository
3. ✅ Set environment variables
4. ✅ Deploy: `vercel`
5. ✅ Test all endpoints
6. ✅ Set custom domain
7. ✅ (Optional) Migrate to PostgreSQL for production
8. ✅ Set up monitoring & error tracking

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/serverless-functions)
- [API Endpoints Reference](./API_ENDPOINTS.md)
- [JWT Authentication](https://jwt.io/)
- [Better SQLite3 Docs](https://github.com/WiseLibs/better-sqlite3)

---

## ❓ FAQ

**Q: Can I use a different database?**
A: Yes! See "Database Migration" section for PostgreSQL, MongoDB, or Firebase options.

**Q: How do I add new API routes?**
A: Create new files in `/api` folder following the naming convention:
- `/api/route.js` → GET/POST /api/route
- `/api/route/[id].js` → GET /api/route/:id
- `/api/users/profile.js` → GET /api/users/profile

**Q: Is there a free tier?**
A: Yes! Vercel has a generous free tier:
- Unlimited deployments
- 100GB bandwidth/month
- 12 serverless function executions/second
- Enough for most projects

**Q: How do I handle CORS for mobile apps?**
A: Mobile apps can request from any origin. Set:
```
CORS_ORIGIN=*
```
Or if you want to restrict, use your app's domain.

---

## 💡 Performance Tips

1. **Optimize Frontend Bundle**
   - Use code splitting
   - Lazy load components
   - Minify CSS/JS (Vite does this)

2. **Optimize API**
   - Add database indexes
   - Cache responses where possible
   - Use pagination for large datasets

3. **Reduce Cold Starts**
   - Keep handler file sizes small
   - Minimize dependencies
   - Preload database connections

4. **Monitor Bandwidth**
   - Compress responses (gzip)
   - Use CDN for static assets
   - Optimize image sizes

---

**Last Updated:** April 2026
**Version:** 1.0.0
