# Vercel Deployment Guide

## Quick Start

### 1. Deploy Frontend on Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Or connect GitHub repo to Vercel dashboard
```

### 2. Deploy API on Vercel

The API handlers are already configured in the `/api` directory. They will be automatically deployed as serverless functions.

```bash
# From root directory
vercel
```

### 3. Environment Variables

Set these in your Vercel project settings:

- `JWT_SECRET`: Your JWT secret key
- `CORS_ORIGIN`: Your frontend domain(s)
- `NODE_ENV`: production
- `DATABASE_URL`: (optional) For PostgreSQL/MongoDB in production

### 4. Update Frontend API URL

After deployment, update the environment variable in Vercel dashboard:
- `VITE_API_URL`: `/api` (relative to same domain)

## Deployment Options

### Option A: Same Domain (Recommended)
- Deploy both frontend and API on Vercel
- Frontend at `yourdomain.com`
- API at `/api` prefix
- No CORS issues
- Set `VITE_API_URL=/api`

### Option B: Separate Domains
- Frontend at `yourdomain.com`
- API at `api.yourdomain.com` or `yourdomain-api.vercel.app`
- Configure CORS_ORIGIN
- Set `VITE_API_URL=https://api.yourdomain.com`

## Database Migration for Production

**Important**: SQLite doesn't persist on Vercel's ephemeral filesystem. For production, migrate to:

1. **PostgreSQL** (Recommended)
   - Use Vercel Postgres or managed service
   - Update database connection in `api/lib/database.js`

2. **MongoDB**
   - MongoDB Atlas free tier
   - Update API handlers to use MongoDB driver

3. **Firebase Firestore**
   - Google's managed NoSQL database
   - Pay-as-you-go pricing

## File Structure

```
/api                          # Serverless functions
  /auth
    login.js                  # POST /api/auth/login
    profile.js                # GET /api/auth/profile
  /cars
    index.js                  # GET /api/cars
    [id].js                   # GET /api/cars/:id
  /lib
    database.js               # Database initialization
    auth.js                   # Authentication helpers
  /middleware
    auth.js                   # Auth middleware (Express)
  hello.js                    # GET /api/hello (health check)
  health.js                   # GET /api/health
  index.js                    # CORS & error handling

vercel.json                   # Vercel configuration
.vercelignore                 # Files to ignore in deployment
```

## Troubleshooting

### CORS Errors
- Check `CORS_ORIGIN` env var in Vercel dashboard
- Make sure it includes your frontend domain

### Database Errors
- For ephemeral SQLite on Vercel, database resets after function timeout
- Migrate to PostgreSQL or MongoDB for persistent storage

### API Not Found
- Check that `/api` folder exists
- Verify file names match route structure
- Clear Vercel cache and redeploy

## Local Testing

```bash
# Test API locally
cd api
npm install
node server.js

# Test with frontend
cd frontend
npm install
VITE_API_URL=http://localhost:5000 npm run dev
```

## Performance Tips

1. **Optimize database queries** - Use indexes
2. **Cache responses** - Use HTTP caching headers
3. **Minimize dependencies** - Reduces cold start time
4. **Use Response streaming** - For large data

## Cost Optimization

- Vercel free tier: 100GB bandwidth/month
- Each API call counts toward bandwidth
- Database service costs (if using external DB)
- Monitor usage in Vercel dashboard

## Security Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `CORS_ORIGIN` to specific domains
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting (already configured)
- [ ] Use HTTPS (Vercel provides automatically)
- [ ] Validate all inputs on backend
- [ ] Use secure password hashing (bcryptjs)

## Next Steps

1. Create Vercel account at https://vercel.com
2. Connect GitHub repository
3. Configure environment variables
4. Deploy!

For more info: https://vercel.com/docs
