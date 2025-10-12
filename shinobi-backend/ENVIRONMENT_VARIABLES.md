# 🔐 Environment Variables Reference

Complete reference for all environment variables used in the Shinobi Academy backend.

## Quick Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

Then edit `.env` with your actual values.

---

## 🌍 Core Configuration

### `NODE_ENV`
- **Type:** String
- **Required:** No
- **Default:** `development`
- **Valid Values:** `development`, `production`, `test`
- **Description:** Determines the runtime environment
- **Production Value:** `production`

```bash
NODE_ENV=production
```

### `PORT`
- **Type:** Number
- **Required:** No
- **Default:** `5001`
- **Description:** Port the server listens on
- **Production Note:** Most platforms override this (Render, Railway)

```bash
PORT=5001
```

---

## 💾 Database Configuration

### `MONGODB_URI`
- **Type:** String (Connection URI)
- **Required:** Yes
- **Description:** MongoDB connection string
- **Local Development:** `mongodb://localhost:27017/shinobi-academy`
- **Production:** MongoDB Atlas connection string

#### Local Development:
```bash
MONGODB_URI=mongodb://localhost:27017/shinobi-academy
```

#### Production (MongoDB Atlas):
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shinobi-academy?retryWrites=true&w=majority
```

#### Getting MongoDB Atlas URI:
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Go to Database → Connect
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `shinobi-academy`

**⚠️ Security Notes:**
- Never commit this to Git
- Use strong passwords
- Whitelist appropriate IPs in Atlas (or `0.0.0.0/0` for all)

---

## 🔑 Authentication Configuration

### `JWT_SECRET`
- **Type:** String
- **Required:** Yes
- **Description:** Secret key used to sign JWT tokens
- **Minimum Length:** 32 characters (64+ recommended)
- **Security:** Must be random and unique

#### Generating a Secure JWT Secret:

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: OpenSSL**
```bash
openssl rand -hex 64
```

**Option 3: Online Generator**
- https://generate-secret.vercel.app/64
- https://randomkeygen.com/

```bash
JWT_SECRET=your_super_secret_random_string_here_make_it_long_and_random
```

**⚠️ Security Notes:**
- NEVER use the example value
- NEVER commit the secret to Git
- Change immediately if compromised
- Use different secrets for dev/staging/production

### `JWT_EXPIRES_IN`
- **Type:** String (Time span)
- **Required:** No
- **Default:** `7d`
- **Format:** Number + unit (s, m, h, d)
- **Description:** How long JWT tokens remain valid

```bash
JWT_EXPIRES_IN=7d
```

**Examples:**
- `60s` = 60 seconds
- `15m` = 15 minutes
- `2h` = 2 hours
- `7d` = 7 days
- `30d` = 30 days

**Recommendations:**
- Development: `7d` or `30d`
- Production: `7d` (balance security vs. UX)
- High security: `1h` or `24h`

---

## 🌐 CORS Configuration

### `CLIENT_URL`
- **Type:** String (comma-separated URLs)
- **Required:** Yes (production)
- **Default:** `http://localhost:3000`
- **Description:** Allowed frontend origins for CORS

#### Single Origin:
```bash
CLIENT_URL=https://yoursite.com
```

#### Multiple Origins:
```bash
CLIENT_URL=https://yoursite.com,https://www.yoursite.com,https://staging.yoursite.com
```

#### Development:
```bash
CLIENT_URL=http://localhost:3000
```

**Notes:**
- No trailing slashes
- Include both `www` and non-`www` if applicable
- Must match exactly (including `https://`)
- In development, all origins are allowed by default

---

## 📸 Cloudinary Configuration

Required for image uploads (coaches, gallery).

### `CLOUDINARY_CLOUD_NAME`
- **Type:** String
- **Required:** Yes
- **Description:** Your Cloudinary cloud name

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### `CLOUDINARY_API_KEY`
- **Type:** String
- **Required:** Yes
- **Description:** Your Cloudinary API key

```bash
CLOUDINARY_API_KEY=123456789012345
```

### `CLOUDINARY_API_SECRET`
- **Type:** String
- **Required:** Yes
- **Description:** Your Cloudinary API secret

```bash
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### Getting Cloudinary Credentials:
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Find your credentials under "Account Details"
4. Copy Cloud Name, API Key, and API Secret

**Free Tier Limits:**
- 25 GB storage
- 25 GB bandwidth/month
- Unlimited transformations

**⚠️ Security Notes:**
- Never expose these in frontend code
- Keep API Secret confidential
- Rotate keys if compromised

---

## 👤 Admin User Configuration

Used for initial admin setup via `create-admin.js` script.

### `ADMIN_USERNAME`
- **Type:** String
- **Required:** No (for setup script)
- **Default:** `admin`
- **Description:** Username for initial admin account

```bash
ADMIN_USERNAME=admin
```

### `ADMIN_PASSWORD`
- **Type:** String
- **Required:** No (for setup script)
- **Description:** Password for initial admin account
- **Minimum:** 8 characters

```bash
ADMIN_PASSWORD=your_secure_password_here
```

**⚠️ Security Notes:**
- Use a strong password (16+ characters)
- Include uppercase, lowercase, numbers, symbols
- Change default password immediately after first login
- Consider removing these after initial setup

---

## 📋 Complete Production Example

```bash
# Server Configuration
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb+srv://shinobi:SecurePass123@cluster0.abc123.mongodb.net/shinobi-academy?retryWrites=true&w=majority

# Authentication
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=https://shinobiacademy.com,https://www.shinobiacademy.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=shinobi-academy
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz

# Admin Setup (optional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
```

---

## 🔍 Validation Checklist

Before deployment, verify:

- [ ] `MONGODB_URI` connects successfully
- [ ] `JWT_SECRET` is random and 64+ characters
- [ ] `CLIENT_URL` includes all frontend URLs
- [ ] Cloudinary credentials are valid
- [ ] No sensitive data committed to Git
- [ ] `.env` is in `.gitignore`
- [ ] All required variables are set

---

## 🧪 Testing Environment Variables

Test your configuration:

```bash
# Start the server
npm start

# Check health endpoint
curl http://localhost:5001/api/health

# Should return:
# {
#   "status": "OK",
#   "database": "connected",
#   ...
# }
```

If database shows "disconnected", check your `MONGODB_URI`.

---

## 🚨 Common Issues

### MongoDB Connection Failed
**Error:** `MongoServerError: bad auth`
**Solution:** 
- Verify username and password in URI
- Check user permissions in MongoDB Atlas
- Ensure database name is correct

### JWT Errors
**Error:** `JsonWebTokenError: invalid signature`
**Solution:**
- Verify `JWT_SECRET` is set and consistent
- Check for trailing spaces in secret
- Ensure secret hasn't changed

### CORS Errors
**Error:** `Access to fetch has been blocked by CORS policy`
**Solution:**
- Add your frontend URL to `CLIENT_URL`
- Include protocol (`https://`)
- Check for typos in domain name

### Cloudinary Upload Failed
**Error:** `Invalid cloud_name`
**Solution:**
- Verify `CLOUDINARY_CLOUD_NAME` is correct
- Check for spaces or special characters
- Ensure API key and secret match

---

## 🔄 Rotating Secrets

If secrets are compromised:

1. **JWT Secret:**
   ```bash
   # Generate new secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # Update JWT_SECRET
   # All users will need to re-login
   ```

2. **Cloudinary Credentials:**
   - Generate new API key in Cloudinary dashboard
   - Update environment variables
   - Old credentials will stop working

3. **Database Password:**
   - Change password in MongoDB Atlas
   - Update `MONGODB_URI` with new password
   - Restart application

---

## 📖 Additional Resources

- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

---

## 🛡️ Security Best Practices

1. ✅ Use strong, random secrets
2. ✅ Never commit `.env` to Git
3. ✅ Use different values for dev/production
4. ✅ Rotate secrets periodically
5. ✅ Limit secret access (team members)
6. ✅ Use secret management tools (AWS Secrets Manager, etc.)
7. ✅ Monitor for exposed secrets (GitHub scanning)
8. ✅ Keep backups of production secrets (encrypted)

---

Need help? Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

