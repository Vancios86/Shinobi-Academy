# 🚀 Shinobi Academy Backend - Deployment Guide

This guide covers deploying the Shinobi Academy backend API to various platforms.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Platform-Specific Guides](#platform-specific-guides)
  - [Render](#option-1-render-recommended)
  - [Railway](#option-2-railway)
  - [Fly.io](#option-3-flyio)
- [Post-Deployment Steps](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

1. **MongoDB Atlas Account** (free tier available)
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - Whitelist IP: `0.0.0.0/0` (allow from anywhere)

2. **Cloudinary Account** (for file uploads)
   - Create account at https://cloudinary.com
   - Get your Cloud Name, API Key, and API Secret

3. **Git Repository**
   - Push your code to GitHub, GitLab, or Bitbucket

---

## 🔐 Environment Variables

You'll need to configure these environment variables on your deployment platform:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5001` (or platform default) |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/shinobi` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate random 64-char string |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CLIENT_URL` | Frontend URL (comma-separated for multiple) | `https://yoursite.com,https://www.yoursite.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Your cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Your API secret |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_USERNAME` | Initial admin username | `admin` |
| `ADMIN_PASSWORD` | Initial admin password | (set securely) |

### Generating JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or online
# Use: https://generate-secret.vercel.app/64
```

---

## 🌐 Platform-Specific Guides

### Option 1: Render (Recommended)

**Pros:** Free tier, auto-deploy from Git, easy setup
**Cons:** Spins down after inactivity (takes ~30s to wake)

#### Steps:

1. **Sign up** at https://render.com

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub/GitLab repository
   - Select the `shinobi-backend` directory

3. **Configure Service**
   - **Name:** `shinobi-academy-api`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `shinobi-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all required variables from the table above
   - Click "Save Changes"

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (~5 minutes)

6. **Get Your API URL**
   - Copy the URL (e.g., `https://shinobi-academy-api.onrender.com`)
   - Test: `https://your-url.onrender.com/api/health`

#### Auto-Deploy Setup
- Render automatically deploys on git push to main branch
- You can disable this in Settings → Build & Deploy

---

### Option 2: Railway

**Pros:** Fast deployments, generous free tier, PostgreSQL included
**Cons:** Requires credit card for free tier

#### Steps:

1. **Sign up** at https://railway.app

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - Railway will auto-detect Node.js
   - It will use the `railway.json` configuration

4. **Add Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Click "RAW Editor" and paste:

```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-url.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment (~3 minutes)

6. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy your URL (e.g., `https://shinobi-academy-api.up.railway.app`)

---

### Option 3: Fly.io

**Pros:** Global edge network, persistent storage, free tier
**Cons:** Requires CLI installation, more complex setup

#### Steps:

1. **Install Fly CLI**
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

2. **Login**
```bash
flyctl auth login
```

3. **Launch Application**
```bash
cd shinobi-backend
flyctl launch
```

4. **Configure (when prompted)**
   - **App name:** `shinobi-academy-api` (or your choice)
   - **Region:** Choose closest to your users
   - **PostgreSQL:** No (we're using MongoDB)
   - **Deploy now:** No

5. **Set Environment Variables**
```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set MONGODB_URI="your_mongodb_connection_string"
flyctl secrets set JWT_SECRET="your_jwt_secret"
flyctl secrets set JWT_EXPIRES_IN=7d
flyctl secrets set CLIENT_URL="https://your-frontend-url.com"
flyctl secrets set CLOUDINARY_CLOUD_NAME="your_cloud_name"
flyctl secrets set CLOUDINARY_API_KEY="your_api_key"
flyctl secrets set CLOUDINARY_API_SECRET="your_api_secret"
```

6. **Deploy**
```bash
flyctl deploy
```

7. **Get Your URL**
```bash
flyctl status
# Your URL: https://shinobi-academy-api.fly.dev
```

#### Fly.io Commands
```bash
# View logs
flyctl logs

# Open dashboard
flyctl dashboard

# Scale instances
flyctl scale count 1

# SSH into machine
flyctl ssh console
```

---

## ✅ Post-Deployment Steps

### 1. Verify Deployment

Test your API endpoints:

```bash
# Health check
curl https://your-api-url.com/api/health

# Verify endpoints
curl https://your-api-url.com/api/verify

# Expected response:
# {
#   "status": "OK",
#   "message": "Shinobi Academy API is running",
#   "database": "connected",
#   ...
# }
```

### 2. Create Admin User

**Option A: Via API (Recommended)**
```bash
# From your local machine
cd shinobi-backend
node create-admin.js --production
```

**Option B: Via MongoDB Compass**
1. Connect to your MongoDB Atlas database
2. Navigate to `shinobi-academy` database
3. Create a user document in the `users` collection with role: `admin`

### 3. Update Frontend API URL

Update your frontend to use the deployed backend URL:

```javascript
// In shinobi-frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api-url.com';
```

Then add to frontend `.env`:
```bash
REACT_APP_API_URL=https://your-api-url.com
```

### 4. Test All Features

- [ ] Health check endpoint works
- [ ] User authentication (login/register)
- [ ] Image uploads to Cloudinary
- [ ] All CRUD operations (classes, coaches, gallery, etc.)
- [ ] Contact form submissions

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Symptom:** Frontend can't connect to backend
**Solution:**
1. Check `CLIENT_URL` environment variable includes your frontend URL
2. Make sure to include both `https://yoursite.com` and `https://www.yoursite.com`
3. Check browser console for exact error

### Issue: Database Connection Failed

**Symptom:** API returns 500 errors
**Solution:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0`)
3. Ensure database user has read/write permissions
4. Check MongoDB Atlas cluster is active

### Issue: Image Uploads Failing

**Symptom:** Images don't upload or return errors
**Solution:**
1. Verify Cloudinary credentials are correct
2. Check Cloudinary dashboard for upload quota
3. Ensure Cloudinary cloud name doesn't have spaces
4. Check backend logs for detailed error

### Issue: JWT Errors

**Symptom:** Authentication fails
**Solution:**
1. Verify `JWT_SECRET` is set and consistent
2. Check `JWT_EXPIRES_IN` format (e.g., `7d`, `24h`)
3. Clear browser cookies/localStorage
4. Generate new JWT secret if needed

### Issue: Platform Sleeping (Render Free Tier)

**Symptom:** First request takes 30+ seconds
**Solution:**
1. This is expected on Render's free tier
2. Upgrade to paid tier ($7/mo) for always-on
3. Use a service like UptimeRobot to ping every 14 minutes
4. Or switch to Railway/Fly.io

### Viewing Logs

**Render:**
```
Dashboard → Your Service → Logs tab
```

**Railway:**
```
Dashboard → Your Service → Deployments → View Logs
```

**Fly.io:**
```bash
flyctl logs
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Strong `JWT_SECRET` (64+ random characters)
- [ ] Secure admin password
- [ ] CORS properly configured with specific domains
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables secured (not in code)
- [ ] HTTPS enabled (automatic on all platforms)
- [ ] Rate limiting enabled (uncomment in `server.js`)
- [ ] Helmet security headers active
- [ ] Regular dependency updates (`npm audit`)

---

## 📊 Monitoring

### Recommended Tools

1. **UptimeRobot** (https://uptimerobot.com)
   - Free uptime monitoring
   - Email/SMS alerts
   - Setup: Add your `/api/health` endpoint

2. **Sentry** (https://sentry.io)
   - Error tracking
   - Performance monitoring
   - Free tier available

3. **LogRocket** (https://logrocket.com)
   - Session replay
   - Error tracking
   - Free tier available

---

## 🚀 Performance Tips

1. **Enable Rate Limiting**
   - Uncomment rate limiting code in `server.js`
   - Protects against DDoS

2. **Database Indexing**
   - MongoDB Atlas auto-creates indexes
   - Monitor slow queries in Atlas dashboard

3. **Cloudinary Optimization**
   - Use Cloudinary transformations for responsive images
   - Enable auto-format and auto-quality

4. **Caching**
   - Consider Redis for session storage
   - Cache frequently accessed data

---

## 📞 Support

If you encounter issues:

1. Check the logs first
2. Review this troubleshooting guide
3. Check platform-specific documentation
4. MongoDB Atlas: https://docs.atlas.mongodb.com
5. Cloudinary: https://cloudinary.com/documentation

---

## 🎉 Next Steps

Once backend is deployed:
1. Test all API endpoints
2. Deploy frontend (Phase 3)
3. Update frontend to use production API URL
4. Set up monitoring
5. Configure custom domain (optional)

Good luck with your deployment! 🥋

