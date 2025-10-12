# ⚡ Quick Start Deployment Guide

Get your Shinobi Academy backend deployed in under 30 minutes!

## 🎯 Choose Your Platform

### Best for Beginners: Render
- ✅ Easiest setup (5 minutes)
- ✅ Free tier available
- ✅ Auto-deploy from Git
- ⚠️ Spins down after inactivity (30s wake time)

### Best for Speed: Railway
- ✅ Fastest deployments
- ✅ Great developer experience
- ✅ No sleep on free tier
- ⚠️ Requires credit card

### Best for Scale: Fly.io
- ✅ Global edge network
- ✅ Persistent storage
- ✅ Production-ready
- ⚠️ CLI required (more complex)

---

## 🚀 Option 1: Render (Recommended for First-Time)

### Step 1: Prepare MongoDB (10 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up → Create Free Cluster
3. Security → Database Access → Add New User
   - Username: `shinobi-user`
   - Password: Generate secure password (save it!)
   - Role: `Read and write to any database`
4. Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (`0.0.0.0/0`)
5. Database → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Should look like: `mongodb+srv://shinobi-user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 2: Prepare Cloudinary (5 min)

1. Go to https://cloudinary.com
2. Sign up for free account
3. Dashboard → Copy these values:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Deploy to Render (10 min)

1. Go to https://render.com and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `Shinobi-Academy` repository
5. Configure:
   ```
   Name: shinobi-academy-api
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: shinobi-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
6. Click **"Advanced"** → **"Add Environment Variable"**
   
   Add these variables (click "+ Add Environment Variable" for each):
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Click "Generate" or paste a random 64-char string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `*` (for now, update after frontend deployment) |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

7. Click **"Create Web Service"**
8. Wait ~5 minutes for deployment
9. Copy your API URL (e.g., `https://shinobi-academy-api.onrender.com`)

### Step 4: Verify Deployment (2 min)

Open in browser or use curl:
```bash
https://your-api-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "database": "connected",
  ...
}
```

✅ **Backend deployed!**

### Step 5: Create Admin User (3 min)

**Option A: Local script (if you have Node.js)**
```bash
cd shinobi-backend
node create-admin.js
# Follow prompts
```

**Option B: MongoDB Compass**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MONGODB_URI
3. Navigate to `shinobi-academy` database → `users` collection
4. Insert document:
```json
{
  "username": "admin",
  "password": "$2a$10$XYZ...", 
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
Note: Password needs to be bcrypt hashed. Use the script instead!

---

## 🚀 Option 2: Railway (Fast & Easy)

### Prerequisites
Same as Render: MongoDB Atlas + Cloudinary

### Deploy Steps

1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `Shinobi-Academy` repository
4. Railway will detect Node.js automatically
5. Click on your service
6. Go to **"Variables"** tab
7. Click **"RAW Editor"** and paste:

```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://shinobi-user:PASSWORD@cluster0.xxxxx.mongodb.net/shinobi-academy
JWT_SECRET=your_generated_64_character_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=*
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

8. Click **"Update Variables"**
9. Go to **"Settings"** → **"Networking"**
10. Click **"Generate Domain"**
11. Copy your URL (e.g., `https://shinobi-academy-api.up.railway.app`)

Test: `https://your-url/api/health`

✅ **Deployed!**

---

## 🚀 Option 3: Fly.io (Advanced)

### Prerequisites
- MongoDB Atlas + Cloudinary (same as above)
- Fly CLI installed

### Install CLI

```bash
# macOS
brew install flyctl

# Linux/WSL
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Deploy

```bash
# 1. Login
flyctl auth login

# 2. Navigate to backend
cd shinobi-backend

# 3. Launch (creates app)
flyctl launch
# Choose: name, region, no postgres, no deploy yet

# 4. Set secrets
flyctl secrets set \
  NODE_ENV=production \
  MONGODB_URI="your_mongodb_connection_string" \
  JWT_SECRET="your_jwt_secret" \
  JWT_EXPIRES_IN=7d \
  CLIENT_URL="*" \
  CLOUDINARY_CLOUD_NAME="your_cloud_name" \
  CLOUDINARY_API_KEY="your_api_key" \
  CLOUDINARY_API_SECRET="your_api_secret"

# 5. Deploy
flyctl deploy

# 6. Get URL
flyctl status
# URL shown, e.g., https://shinobi-academy-api.fly.dev
```

Test: `https://your-url.fly.dev/api/health`

✅ **Deployed!**

---

## 🎓 What's Next?

After backend is deployed:

1. **Update Frontend**
   - Update API URL in `shinobi-frontend/src/services/api.js`
   - Deploy frontend (Phase 3)

2. **Update CORS**
   - Once frontend is deployed, update `CLIENT_URL` with actual URL
   - In Render: Dashboard → Environment → Edit `CLIENT_URL`
   - Change from `*` to `https://your-frontend-url.com`

3. **Create Admin Account**
   - Use `create-admin.js` script
   - Or manually via MongoDB Compass

4. **Test Everything**
   - Login to admin panel
   - Upload images (coaches, gallery)
   - Test all CRUD operations

---

## 🆘 Troubleshooting

### ❌ Database Connection Failed
```
Error: MongoServerError: bad auth
```
**Fix:**
- Double-check MONGODB_URI
- Verify username/password
- Check IP whitelist in MongoDB Atlas

### ❌ CORS Error in Browser
```
Access to fetch has been blocked by CORS policy
```
**Fix:**
- Temporarily set `CLIENT_URL=*`
- Or add your frontend URL to `CLIENT_URL`

### ❌ Image Upload Failed
```
Cloudinary error
```
**Fix:**
- Verify all Cloudinary credentials
- Check for extra spaces
- Test credentials in Cloudinary dashboard

### ❌ Render App Sleeping
**Symptom:** First request takes 30+ seconds
**Fix:**
- This is normal on free tier
- Use UptimeRobot to ping every 14 minutes
- Or upgrade to paid plan ($7/mo)

---

## 💰 Cost Comparison

| Platform | Free Tier | Limitations | Paid Plan |
|----------|-----------|-------------|-----------|
| **Render** | ✅ Yes | Sleeps after 15min inactivity | $7/mo |
| **Railway** | ✅ Yes* | $5 credit/month | Pay as you go |
| **Fly.io** | ✅ Yes | 3 VMs, 160GB transfer | $1.94+/mo |

*Railway requires credit card for free tier

---

## 📚 Full Documentation

For detailed guides, see:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - All environment variables
- [README.md](./README.md) - Project overview

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account setup
- [ ] Backend deployed to hosting platform
- [ ] Environment variables configured
- [ ] Health check endpoint working (`/api/health`)
- [ ] Database connected (check health endpoint)
- [ ] Admin user created
- [ ] Test authentication works
- [ ] Test image uploads work
- [ ] API URL saved for frontend deployment

---

**Need help?** Open an issue or check the troubleshooting section above.

Good luck! 🥋🚀

