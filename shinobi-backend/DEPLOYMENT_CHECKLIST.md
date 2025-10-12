# ✅ Backend Deployment Checklist

Use this checklist to track your deployment progress. Check off each item as you complete it.

## 📋 Pre-Deployment Preparation

### Code Preparation
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.gitignore` includes `.env` file
- [ ] No sensitive data committed to repository
- [ ] Local development is working correctly
- [ ] All dependencies installed (`npm install`)

### Account Setup
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created  
- [ ] Hosting platform account created (Render/Railway/Fly.io)

---

## 🗄️ Phase 1: MongoDB Atlas Setup

### Create Database
- [ ] Signed up at https://www.mongodb.com/cloud/atlas
- [ ] Created new project
- [ ] Created M0 FREE cluster
- [ ] Cluster is active and running

### Security Configuration
- [ ] Created database user
  - [ ] Username saved: `_______________`
  - [ ] Password saved securely: `***************`
  - [ ] Role set to: "Read and write to any database"
- [ ] Network access configured
  - [ ] Added IP: `0.0.0.0/0` (Allow from anywhere)
  - [ ] Or specific IPs whitelisted

### Connection String
- [ ] Connection string obtained
- [ ] Format: `mongodb+srv://username:password@cluster...`
- [ ] Password replaced in connection string
- [ ] Connection string saved: `_______________`
- [ ] Database name added: `/shinobi-academy`

---

## 🖼️ Phase 2: Cloudinary Setup

### Account Creation
- [ ] Signed up at https://cloudinary.com
- [ ] Email verified

### Get Credentials
- [ ] Cloud Name copied: `_______________`
- [ ] API Key copied: `_______________`
- [ ] API Secret copied (keep secret): `***************`
- [ ] All credentials saved securely

---

## 🔑 Phase 3: Generate Secrets

### JWT Secret
- [ ] JWT Secret generated using one of these methods:
  ```bash
  # Option 1: Use included script
  npm run generate-secret
  
  # Option 2: Node.js command
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  
  # Option 3: OpenSSL
  openssl rand -hex 64
  ```
- [ ] JWT Secret saved securely: `***************`

---

## 🚀 Phase 4: Deploy Backend

### Choose Your Platform (pick one):

#### Option A: Render
- [ ] Logged in to https://render.com
- [ ] Connected GitHub account
- [ ] Created new Web Service
- [ ] Selected repository: `Shinobi-Academy`
- [ ] Configured service:
  - [ ] Name: `shinobi-academy-api`
  - [ ] Region: `_______________`
  - [ ] Root Directory: `shinobi-backend`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: `Free`

#### Option B: Railway
- [ ] Logged in to https://railway.app
- [ ] Created new project from GitHub repo
- [ ] Railway detected Node.js automatically
- [ ] Service created

#### Option C: Fly.io
- [ ] Fly CLI installed
- [ ] Logged in: `flyctl auth login`
- [ ] Launched app: `flyctl launch`
- [ ] App name chosen: `_______________`
- [ ] Region selected: `_______________`

---

## 🔐 Phase 5: Configure Environment Variables

### Add All Required Variables

Check off each variable as you add it to your platform:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5001` (or platform default)
- [ ] `MONGODB_URI` = `mongodb+srv://...` (from Phase 1)
- [ ] `JWT_SECRET` = `your-generated-secret` (from Phase 3)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `CLIENT_URL` = `*` (temporary, will update after frontend deployment)
- [ ] `CLOUDINARY_CLOUD_NAME` = `your-cloud-name` (from Phase 2)
- [ ] `CLOUDINARY_API_KEY` = `your-api-key` (from Phase 2)
- [ ] `CLOUDINARY_API_SECRET` = `your-api-secret` (from Phase 2)

### Platform-Specific Steps

#### Render
- [ ] Navigated to "Environment" tab
- [ ] Clicked "Add Environment Variable" for each
- [ ] Clicked "Save Changes"

#### Railway
- [ ] Clicked on service
- [ ] Navigated to "Variables" tab
- [ ] Used "RAW Editor" to paste all variables
- [ ] Clicked "Update Variables"

#### Fly.io
- [ ] Set secrets using `flyctl secrets set` commands
- [ ] Verified with `flyctl secrets list`

---

## 🎯 Phase 6: Deploy & Verify

### Deployment
- [ ] Deployment initiated
- [ ] Build process started
- [ ] Build completed successfully
- [ ] Application started
- [ ] No errors in logs

### Get Deployment URL
- [ ] Deployment URL obtained: `_______________`

Example formats:
- Render: `https://shinobi-academy-api.onrender.com`
- Railway: `https://shinobi-academy-api.up.railway.app`
- Fly.io: `https://shinobi-academy-api.fly.dev`

### Test Endpoints

Test these in browser or using curl:

- [ ] Health check works:
  ```
  https://your-url.com/api/health
  ```
  Expected: JSON with `"status": "OK"`

- [ ] Verify endpoint works:
  ```
  https://your-url.com/api/verify
  ```
  Expected: JSON with API information

- [ ] Database is connected:
  Check health endpoint shows `"database": "connected"`

### Verify Response
- [ ] Health endpoint returns status: "OK"
- [ ] Database status: "connected"
- [ ] No errors in response
- [ ] Response time is reasonable (<5 seconds)

---

## 👤 Phase 7: Create Admin User

### Choose Method

#### Option A: Using Script (Recommended)
- [ ] On local machine, navigate to: `cd shinobi-backend`
- [ ] Run: `npm run setup-admin`
- [ ] Followed prompts
- [ ] Admin user created successfully

#### Option B: MongoDB Compass
- [ ] Downloaded MongoDB Compass
- [ ] Connected using `MONGODB_URI`
- [ ] Navigated to `shinobi-academy` database
- [ ] Created `users` collection (if doesn't exist)
- [ ] Inserted admin user document
- [ ] Password properly hashed with bcrypt

### Credentials
- [ ] Admin username: `_______________`
- [ ] Admin password: `***************` (saved securely)
- [ ] Can login successfully

---

## 🧪 Phase 8: Test All Features

### Authentication
- [ ] Can access login endpoint: `/api/auth/login`
- [ ] Login returns JWT token
- [ ] Token format is correct
- [ ] Protected routes require authentication

### API Endpoints
Test each endpoint:
- [ ] `/api/classes` - Returns classes
- [ ] `/api/schedule` - Returns schedule
- [ ] `/api/coaches` - Returns coaches
- [ ] `/api/gallery` - Returns gallery images
- [ ] `/api/contact` - Returns contact info
- [ ] `/api/content` - Returns content

### CRUD Operations (with admin token)
- [ ] Can create new items
- [ ] Can read/fetch items
- [ ] Can update items
- [ ] Can delete items

### File Uploads
- [ ] Image upload works
- [ ] Images stored in Cloudinary
- [ ] Image URLs returned correctly
- [ ] Images accessible via URL

---

## 📊 Phase 9: Monitoring Setup

### Platform Monitoring
- [ ] Checked platform dashboard
- [ ] Logs accessible
- [ ] Resource usage visible
- [ ] No errors in logs

### External Monitoring (Optional)
- [ ] UptimeRobot configured
  - [ ] Monitor created for `/api/health`
  - [ ] Check interval: 5-15 minutes
  - [ ] Alerts configured
- [ ] Error tracking setup (Sentry/LogRocket)

---

## 📝 Phase 10: Documentation

### Save Important Information
- [ ] Backend URL saved
- [ ] All credentials saved in password manager
- [ ] Environment variables documented
- [ ] Admin credentials saved securely

### Update Documentation
- [ ] Updated project README with deployment info
- [ ] Documented any custom configuration
- [ ] Added deployment date: `_______________`

---

## 🎬 Next Steps

### Prepare for Frontend Deployment
- [ ] Backend URL ready for frontend configuration
- [ ] Admin credentials ready for testing
- [ ] All API endpoints tested and working

### Before Frontend Deployment
- [ ] Review [Frontend Deployment Guide](link-when-ready)
- [ ] Prepare frontend environment variables
- [ ] Choose frontend hosting platform

### After Frontend Deployment
- [ ] Update `CLIENT_URL` with actual frontend URL
- [ ] Change from `*` to specific domain(s)
- [ ] Test CORS with actual frontend
- [ ] Verify end-to-end functionality

---

## 🆘 Troubleshooting

If you encounter issues, check off as you resolve:

- [ ] Reviewed error messages in logs
- [ ] Checked [Troubleshooting Guide](./DEPLOYMENT.md#troubleshooting)
- [ ] Verified all environment variables
- [ ] Tested database connection
- [ ] Verified Cloudinary credentials
- [ ] Checked platform status page
- [ ] Restarted application/service

---

## ✅ Deployment Complete!

Once all items are checked:

- [ ] ✅ Backend successfully deployed
- [ ] ✅ All tests passing
- [ ] ✅ Documentation updated
- [ ] ✅ Ready for frontend deployment

**Backend URL:** `_______________`

**Date Deployed:** `_______________`

---

## 📞 Need Help?

- **Quick Start:** [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment Vars:** [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)
- **Main README:** [README.md](./README.md)

---

**Congratulations! Your backend is now deployed!** 🎉

Next: [Deploy Frontend →](../DEPLOYMENT_SUMMARY.md)

