# Shinobi Academy Backend API

A Node.js/Express REST API for the Shinobi Academy website with MongoDB database.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role management
- **Classes Management** - Full CRUD for martial arts classes
- **Schedule Management** - Dynamic class scheduling system
- **Contact Management** - Contact information and business hours
- **Gallery Management** - Image upload and management
- **Content Management** - Dynamic page content
- **Security** - Rate limiting, CORS, input validation
- **Performance** - Compression, optimized queries

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to backend:**
   ```bash
   cd shinobi-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/shinobi-academy
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

4. **Start MongoDB:**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud database

5. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Initial Setup

The server will automatically create an admin user on first run using the credentials from your `.env` file.

**Default admin credentials:**
- Username: `admin` (or from `ADMIN_USERNAME`)
- Password: `admin123` (or from `ADMIN_PASSWORD`)

⚠️ **Change these credentials after first login!**

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Classes
- `GET /api/classes` - Get all active classes (public)
- `GET /api/classes/admin` - Get all classes (admin)
- `GET /api/classes/:id` - Get single class
- `POST /api/classes` - Create class (admin)
- `PUT /api/classes/:id` - Update class (admin)
- `DELETE /api/classes/:id` - Delete class (admin)
- `POST /api/classes/reorder` - Reorder classes (admin)

### Other Endpoints
- `GET /api/health` - Health check
- Schedule, Contact, Gallery, Content endpoints (coming soon)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 📊 Database Schema

### Classes Collection
```javascript
{
  name: String,           // Class name
  description: String,    // Class description
  image: String,          // Image URL/path
  imageType: String,      // 'predefined', 'upload', 'url'
  imagePosition: String,  // CSS background position
  alignment: String,      // 'left', 'right', 'center'
  speed: Number,          // Parallax speed
  order: Number,          // Display order
  isActive: Boolean,      // Active status
  slug: String,           // URL slug
  metadata: {
    views: Number,        // View count
    featured: Boolean,    // Featured status
    tags: [String]        // Tags
  }
}
```

## 🧪 Testing the API

1. **Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

3. **Get Classes:**
   ```bash
   curl http://localhost:5001/api/classes
   ```

## 🚢 Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shinobi-academy
JWT_SECRET=super-secure-production-secret
CLIENT_URL=https://your-domain.com
```

### Recommended Hosting:
- **Server**: Railway, Heroku, DigitalOcean
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary (for images)

## 🔄 Migration from localStorage

The frontend currently uses localStorage. To migrate:

1. Export existing data from frontend localStorage
2. Use the API endpoints to populate the database
3. Update frontend to use API calls instead of localStorage
4. Test thoroughly before switching

## 📁 Project Structure

```
shinobi-backend/
├── src/
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication, validation
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   └── utils/          # Helper functions
├── server.js           # Main server file
├── package.json
└── README.md
```

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for Atlas

**Authentication Issues:**
- Check JWT_SECRET in `.env`
- Verify token format: `Bearer TOKEN`
- Ensure admin user exists

**CORS Issues:**
- Set correct CLIENT_URL in `.env`
- Check frontend API base URL

## 🔮 Next Steps

1. Implement remaining models (Schedule, Contact, Gallery, Content)
2. Add image upload functionality with Cloudinary
3. Implement data migration scripts
4. Add comprehensive testing
5. Set up CI/CD pipeline
6. Add API documentation (Swagger)

## 📞 Support

For questions or issues, please check the troubleshooting section or create an issue in the repository.
