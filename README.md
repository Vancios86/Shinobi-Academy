# 🥋 Shinobi Academy

Full-stack web application for a martial arts academy, featuring class management, scheduling, gallery, and contact management.

## 🌟 Features

- **Dynamic Class Management** - Full CRUD operations for martial arts classes
- **Schedule System** - Weekly class scheduling with time management
- **Gallery** - Image gallery with upload and management capabilities
- **Contact Management** - Business information and contact form
- **Admin Dashboard** - Comprehensive admin panel for content management
- **Authentication** - Secure JWT-based authentication system
- **Responsive Design** - Mobile-first, fully responsive UI
- **Performance Optimized** - Lazy loading, code splitting, image optimization

## 🏗️ Tech Stack

### Frontend
- React 18
- React Router v6
- Context API for state management
- Email.js for contact forms
- React Google Maps
- Lazy loading & code splitting

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Security with Helmet & CORS
- Rate limiting & compression

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Shinobi-Academy
```

2. **Backend Setup**
```bash
cd shinobi-backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd shinobi-frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/api/health

## 🚀 Deployment

Ready to deploy your application? We've prepared comprehensive deployment guides:

### 📚 Deployment Documentation

- **[🎯 Deployment Overview](./DEPLOYMENT_SUMMARY.md)** - Complete deployment roadmap
- **[⚡ Quick Start](./shinobi-backend/QUICK_START_DEPLOYMENT.md)** - Deploy backend in 30 minutes
- **[📖 Full Guide](./shinobi-backend/DEPLOYMENT.md)** - Detailed deployment instructions
- **[🔐 Environment Variables](./shinobi-backend/ENVIRONMENT_VARIABLES.md)** - Configuration reference

### 🎯 Deployment Phases

| Phase | Component | Status | Time |
|-------|-----------|--------|------|
| 1 | Database Setup (MongoDB Atlas) | Ready | ~10 min |
| 2 | Backend Deployment | **✅ Ready** | ~20 min |
| 3 | Frontend Deployment | Pending | ~15 min |
| 4 | Post-Deployment | Pending | ~10 min |

### ⚡ Recommended Platforms

**Backend:**
- Render (easiest for beginners)
- Railway (fastest deploys)
- Fly.io (best for scale)

**Frontend:**
- Netlify (recommended)
- Vercel
- Cloudflare Pages

**Database & Storage:**
- MongoDB Atlas (database)
- Cloudinary (images)

### 🎬 Next Step

**[→ Start Backend Deployment](./shinobi-backend/QUICK_START_DEPLOYMENT.md)**

## 📁 Project Structure

```
Shinobi-Academy/
├── shinobi-backend/          # Node.js/Express API
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & validation
│   │   └── config/           # Database config
│   ├── server.js             # Main server file
│   ├── render.yaml           # Render deployment config
│   ├── railway.json          # Railway deployment config
│   ├── fly.toml              # Fly.io deployment config
│   └── Dockerfile            # Container config
│
├── shinobi-frontend/         # React application
│   ├── src/
│   │   ├── Components/       # React components
│   │   ├── contexts/         # Context providers
│   │   ├── services/         # API services
│   │   └── assets/           # Images & media
│   └── public/               # Static assets
│
└── DEPLOYMENT_SUMMARY.md     # Deployment overview
```

## 🔧 Development Scripts

### Backend
```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run generate-secret # Generate JWT secret
npm run setup-admin    # Create admin user
```

### Frontend
```bash
npm start              # Start development server
npm run build          # Build for production
npm run analyze        # Analyze bundle size
```

## 🔐 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/shinobi-academy
JWT_SECRET=your-secret-here
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5001
```

See [Environment Variables Guide](./shinobi-backend/ENVIRONMENT_VARIABLES.md) for complete reference.

## 📡 API Documentation

### Health Check
```bash
GET /api/health
```

### Authentication
```bash
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/change-password
```

### Classes
```bash
GET    /api/classes
POST   /api/classes          # Admin only
PUT    /api/classes/:id      # Admin only
DELETE /api/classes/:id      # Admin only
```

### Other Endpoints
- `/api/schedule` - Schedule management
- `/api/coaches` - Coaches management
- `/api/gallery` - Gallery management
- `/api/contact` - Contact management
- `/api/content` - Content management

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation
- MongoDB injection protection

## 🎨 Features Highlights

- **Admin Dashboard** - Complete content management system
- **Image Management** - Upload, crop, and manage images
- **Responsive Gallery** - Masonry layout with lightbox
- **Interactive Schedule** - Visual weekly schedule
- **Contact Form** - Email integration with Email.js
- **Google Maps** - Embedded location map
- **Parallax Effects** - Smooth scrolling animations
- **Performance** - Optimized with lazy loading and code splitting

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB is running
- Verify .env file exists and is configured
- Check port 5001 isn't already in use

**Frontend can't connect to backend:**
- Verify backend is running
- Check CORS configuration
- Verify API URL in frontend

**Image uploads not working:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure admin authentication

See [Deployment Troubleshooting](./shinobi-backend/DEPLOYMENT.md#troubleshooting) for more help.

## 📞 Support

- Backend Documentation: [shinobi-backend/README.md](./shinobi-backend/README.md)
- Deployment Guide: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- Environment Variables: [ENVIRONMENT_VARIABLES.md](./shinobi-backend/ENVIRONMENT_VARIABLES.md)

## 📝 License

MIT

## 🎉 Getting Started

1. Follow local development setup above
2. Explore the admin dashboard at `/admin`
3. When ready, follow the [deployment guide](./DEPLOYMENT_SUMMARY.md)

Good luck! 🥋