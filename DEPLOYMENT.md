# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account**: Set up a MongoDB cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Prepare MongoDB Atlas

1. Create a new cluster or use an existing one
2. Create a database user with read/write permissions
3. Whitelist all IPs (0.0.0.0/0) for Vercel access
4. Get your connection string (should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/bubblycrochet?retryWrites=true&w=majority
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: Leave empty (handled by vercel.json)
   - **Output Directory**: Leave empty (handled by vercel.json)

4. Add Environment Variables in Vercel Dashboard:

   **Backend Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   FRONTEND_URL=https://your-project.vercel.app
   ADMIN_URL=https://your-project.vercel.app/admin.html
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```

   **Frontend Variables:**
   ```
   VITE_API_URL=https://your-project.vercel.app/api
   GEMINI_API_KEY=your_gemini_api_key_if_needed
   ```

5. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   vercel
   ```

4. Follow prompts and add environment variables when asked

## Step 3: Configure Environment Variables

After first deployment, go to your Vercel project:

1. Navigate to **Settings** → **Environment Variables**
2. Add all variables listed above
3. Set them for **Production**, **Preview**, and **Development** environments
4. Update `FRONTEND_URL`, `ADMIN_URL`, `ALLOWED_ORIGINS`, and `VITE_API_URL` with your actual Vercel URL

## Step 4: Set Up Admin User

After deployment, create an admin user:

1. **Option A: Using the script locally**
   ```bash
   cd backend
   MONGODB_URI=your_mongodb_uri npm run create-admin
   ```

2. **Option B: Using MongoDB Compass**
   - Connect to your MongoDB Atlas cluster
   - Create a user document in the `users` collection with `role: 'admin'`

## Step 5: Redeploy

After setting all environment variables:

```bash
vercel --prod
```

Or push to your GitHub repository to trigger automatic deployment.

## Project URLs

After deployment, you'll have:
- **Client Site**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin.html`
- **API**: `https://your-project.vercel.app/api`
- **Health Check**: `https://your-project.vercel.app/api/health`

## Troubleshooting

### API Routes Not Working

1. Check `vercel.json` is in the root directory
2. Verify environment variables are set in Vercel dashboard
3. Check Vercel function logs: Project → Deployments → Click deployment → Functions

### Database Connection Errors

1. Verify MongoDB connection string is correct
2. Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas
3. Check database user has proper permissions

### CORS Errors

1. Verify `ALLOWED_ORIGINS` includes your Vercel URL
2. Check `FRONTEND_URL` and `ADMIN_URL` are set correctly
3. Ensure they don't have trailing slashes (except for admin URL if needed)

### Build Failures

1. Check Node.js version compatibility (needs >=18.x)
2. Verify all dependencies are in `package.json`
3. Review build logs in Vercel dashboard

### Environment Variables Not Working

1. Make sure they're set for the correct environment (Production/Preview)
2. Redeploy after adding new variables
3. Frontend variables must start with `VITE_` to be accessible

## Custom Domain Setup (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain:
   - `FRONTEND_URL`
   - `ADMIN_URL`
   - `ALLOWED_ORIGINS`
   - `VITE_API_URL`

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or pull requests

## Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → Functions
- **Performance**: Use Vercel Speed Insights (optional)

## Security Checklist

- [ ] Strong JWT_SECRET set (minimum 32 characters)
- [ ] MongoDB connection string secured
- [ ] Environment variables set in Vercel (not in code)
- [ ] CORS properly configured with specific origins
- [ ] Admin credentials changed from defaults
- [ ] MongoDB Atlas IP whitelist configured
- [ ] HTTPS enforced (automatic with Vercel)

## Cost Considerations

- **Vercel Free Tier**: Suitable for small projects
  - 100 GB bandwidth
  - Serverless functions execution
  
- **MongoDB Atlas Free Tier**: 
  - 512 MB storage
  - Shared cluster
  
Monitor usage in respective dashboards and upgrade as needed.

## Support

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Project Issues: [GitHub Repository Issues]

---

**Last Updated**: December 9, 2025
