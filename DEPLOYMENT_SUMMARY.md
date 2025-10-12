# 🚀 Shinobi Academy - Full Stack Deployment Guide

Complete deployment guide for both backend and frontend.

## 📋 Deployment Roadmap

### ✅ Phase 1: Database Setup (MongoDB Atlas)
**Status:** Ready to start
**Time:** ~10 minutes
**Cost:** Free

Setup cloud database for your application.

[View Full Guide →](./shinobi-backend/DEPLOYMENT.md#prerequisites)

---

### ✅ Phase 2: Backend Deployment (Current Phase)
**Status:** Configuration Ready ✅
**Time:** ~20 minutes
**Cost:** Free tier available

Deploy the Node.js/Express API.

#### 📦 What's Been Prepared:

✅ **Deployment Configurations Created:**
- `render.yaml` - Render platform config
- `railway.json` - Railway platform config
- `fly.toml` - Fly.io platform config
- `Dockerfile` - Container configuration

✅ **Production Code Updates:**
- Environment-aware CORS configuration
- Enhanced health check endpoint (`/api/health`)
- Deployment verification endpoint (`/api/verify`)
- Graceful shutdown handling

✅ **Documentation Created:**
- **[Quick Start Guide](./shinobi-backend/QUICK_START_DEPLOYMENT.md)** - Fast 30-min deployment
- **[Full Deployment Guide](./shinobi-backend/DEPLOYMENT.md)** - Complete reference with troubleshooting
- **[Environment Variables](./shinobi-backend/ENVIRONMENT_VARIABLES.md)** - All configuration options

#### 🎯 Choose Your Platform:

| Platform | Why Choose | Deploy Guide |
|----------|-----------|--------------|
| **Render** | Easiest setup, great for beginners | [Quick Start](./shinobi-backend/QUICK_START_DEPLOYMENT.md#option-1-render-recommended-for-first-time) |
| **Railway** | Fastest deploys, no cold starts | [Quick Start](./shinobi-backend/QUICK_START_DEPLOYMENT.md#option-2-railway-fast--easy) |
| **Fly.io** | Global CDN, best performance | [Quick Start](./shinobi-backend/QUICK_START_DEPLOYMENT.md#option-3-flyio-advanced) |

#### 📝 Next Steps for Backend:

1. Set up MongoDB Atlas account
2. Set up Cloudinary account
3. Choose hosting platform and deploy
4. Test API endpoints
5. Create admin user

**[→ Start Backend Deployment Now](./shinobi-backend/QUICK_START_DEPLOYMENT.md)**

---

### ⏳ Phase 3: Frontend Deployment (Coming Next)
**Status:** Pending backend completion
**Time:** ~15 minutes
**Cost:** Free

Deploy the React application.

#### Recommended Platforms:
- **Netlify** - Easiest, great for React
- **Vercel** - Fast, optimized for Next.js/React
- **Cloudflare Pages** - Global CDN, fast

#### What Needs to Be Done:
1. Update API base URL to backend URL
2. Configure environment variables
3. Build production bundle
4. Deploy to platform
5. Test end-to-end functionality

---

### ⏳ Phase 4: Post-Deployment
**Status:** After frontend deployment
**Time:** ~10 minutes

#### Finalization Steps:
1. Update backend CORS to allow frontend domain
2. Set up custom domain (optional)
3. Configure SSL certificates (automatic on most platforms)
4. Set up monitoring and alerts
5. Test all features end-to-end

---

## 🎯 Quick Deploy Checklist

### Before You Start:
- [ ] Code pushed to GitHub/GitLab
- [ ] Local development working
- [ ] Admin credentials ready

### Phase 2 - Backend:
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Cloudinary account created
- [ ] Cloudinary credentials obtained
- [ ] Hosting platform account created
- [ ] Backend deployed
- [ ] Environment variables configured
- [ ] Health check endpoint working
- [ ] Database connected
- [ ] Admin user created
- [ ] Backend URL saved

### Phase 3 - Frontend:
- [ ] API URL updated in frontend
- [ ] Frontend deployed
- [ ] Frontend URL obtained
- [ ] CORS updated with frontend URL
- [ ] Login tested
- [ ] Image uploads tested
- [ ] All features tested

### Phase 4 - Finalization:
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Start):

| Service | Free Tier | Limits | Upgrade Cost |
|---------|-----------|--------|--------------|
| **MongoDB Atlas** | ✅ Yes | 512 MB storage | $0.08/hr (~$60/mo) |
| **Cloudinary** | ✅ Yes | 25 GB storage, 25 GB bandwidth | $89/mo |
| **Render** | ✅ Yes | Sleeps after 15min | $7/mo |
| **Netlify** | ✅ Yes | 100 GB bandwidth | $19/mo |
| **Total** | **$0/month** | Good for development/small sites | ~$175/mo for production |

### Recommended Starting Setup: $0/month
- MongoDB Atlas Free Tier
- Cloudinary Free Tier
- Render Free Tier
- Netlify Free Tier

**Perfect for:**
- Development
- Personal projects
- Small businesses (<1000 visitors/month)

---

## 🆘 Need Help?

### Documentation:
- **[Backend Quick Start](./shinobi-backend/QUICK_START_DEPLOYMENT.md)** - Fastest way to deploy
- **[Backend Full Guide](./shinobi-backend/DEPLOYMENT.md)** - Detailed instructions
- **[Environment Variables](./shinobi-backend/ENVIRONMENT_VARIABLES.md)** - Configuration help

### Common Issues:
- Database connection errors → [Troubleshooting](./shinobi-backend/DEPLOYMENT.md#troubleshooting)
- CORS errors → [CORS Guide](./shinobi-backend/DEPLOYMENT.md#issue-cors-errors)
- Image upload issues → [Cloudinary Guide](./shinobi-backend/DEPLOYMENT.md#issue-image-uploads-failing)

### Platform Documentation:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 🎉 Ready to Deploy?

**Start with Phase 2 - Backend Deployment:**

👉 **[Open Quick Start Guide](./shinobi-backend/QUICK_START_DEPLOYMENT.md)**

Follow the step-by-step instructions for your chosen platform. You'll be live in ~30 minutes!

---

## 📊 Current Status

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Database | ⏳ Pending | 0% |
| Phase 2: Backend | ✅ Ready to Deploy | 100% (config) |
| Phase 3: Frontend | ⏳ Pending | 0% |
| Phase 4: Finalization | ⏳ Pending | 0% |

**Next Action:** Deploy backend following the [Quick Start Guide](./shinobi-backend/QUICK_START_DEPLOYMENT.md)

Good luck! 🥋🚀

