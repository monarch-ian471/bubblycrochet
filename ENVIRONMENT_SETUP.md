# Environment Setup Guide

## Quick Setup

### 1. Create Environment Files

From the project root:

```bash
# Copy example files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Or use the deployment script:
```bash
./deploy.sh
# Select option 4
```

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
# Required for Production
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bubblycrochet?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Required URLs (update with your Vercel URL)
FRONTEND_URL=https://your-project.vercel.app
ADMIN_URL=https://your-project.vercel.app/admin.html
ALLOWED_ORIGINS=https://your-project.vercel.app

# Optional
PORT=5000
JWT_EXPIRE=7d
```

### 3. Configure Frontend Environment

Edit `frontend/.env`:

```env
# API URL (same domain on Vercel)
VITE_API_URL=https://your-project.vercel.app/api

# Optional: If using AI features
GEMINI_API_KEY=your_gemini_api_key_here
```

## Environment Variables Reference

### Backend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret for JWT tokens (min 32 chars) | `your_secret_key` |
| `FRONTEND_URL` | Yes | Frontend app URL | `https://app.vercel.app` |
| `ADMIN_URL` | Yes | Admin panel URL | `https://app.vercel.app/admin.html` |
| `ALLOWED_ORIGINS` | Yes | CORS allowed origins | `https://app.vercel.app` |
| `PORT` | No | Server port (default: 5000) | `5000` |
| `JWT_EXPIRE` | No | JWT expiration (default: 7d) | `7d` |

### Frontend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API URL | `https://app.vercel.app/api` |
| `GEMINI_API_KEY` | No | Google Gemini API key | `your_api_key` |

## Local Development Setup

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bubblycrochet
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin.html
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Vercel Environment Variables Setup

### Via Dashboard

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `MONGODB_URI`)
   - **Value**: Variable value
   - **Environment**: Select Production, Preview, and/or Development

### Via Vercel CLI

```bash
# Set a variable
vercel env add MONGODB_URI production

# List all variables
vercel env ls

# Remove a variable
vercel env rm MONGODB_URI production
```

## Security Best Practices

### JWT Secret
- Minimum 32 characters
- Use random characters, numbers, and symbols
- Never commit to Git
- Generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### MongoDB URI
- Use MongoDB Atlas in production
- Never expose credentials
- Use environment-specific databases
- Rotate passwords regularly

### CORS Configuration
- Specify exact origins in production
- Don't use wildcards (`*`) in production
- Include all necessary subdomains
- Update when domain changes

## Troubleshooting

### Variables Not Loading

**Frontend**: Vite only exposes variables prefixed with `VITE_`
```env
# ✅ Correct
VITE_API_URL=http://localhost:5000/api

# ❌ Won't work
API_URL=http://localhost:5000/api
```

**Backend**: Use `process.env.VARIABLE_NAME`
```typescript
const port = process.env.PORT || 5000;
```

### CORS Errors

Ensure `ALLOWED_ORIGINS` matches your frontend URL exactly:
```env
# ✅ Correct
ALLOWED_ORIGINS=https://myapp.vercel.app

# ❌ Wrong (trailing slash)
ALLOWED_ORIGINS=https://myapp.vercel.app/
```

### MongoDB Connection Issues

1. Check connection string format
2. Verify database user permissions
3. Ensure IP whitelist includes 0.0.0.0/0
4. Test connection locally first

### Vercel Deployment Issues

- Redeploy after adding environment variables
- Check variable names for typos
- Ensure variables are set for correct environment
- Review function logs for runtime errors

## Validation Script

Create a file `scripts/validate-env.js`:

```javascript
// Run with: node scripts/validate-env.js

const requiredEnvVars = {
  backend: [
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
    'ADMIN_URL',
    'ALLOWED_ORIGINS'
  ],
  frontend: [
    'VITE_API_URL'
  ]
};

console.log('🔍 Validating environment variables...\n');

// Check backend
console.log('Backend:');
requiredEnvVars.backend.forEach(varName => {
  const value = process.env[varName];
  console.log(`  ${varName}: ${value ? '✅' : '❌ MISSING'}`);
});

console.log('\n✨ Manual check required for frontend variables');
console.log('   Check frontend/.env for VITE_* variables\n');
```

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last Updated**: December 9, 2025
