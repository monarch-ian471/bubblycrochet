# 🚀 Quick Deployment Reference

**Bubbly Crochet - Production Deployment to Vercel**

## Prerequisites Checklist
- [ ] MongoDB Atlas cluster ready
- [ ] Vercel account created
- [ ] GitHub repository pushed
- [ ] Environment variables prepared

## 1-Minute Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Follow prompts, then add environment variables in Vercel dashboard
```

## Required Environment Variables

### In Vercel Dashboard (Settings → Environment Variables):

**Backend:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bubblycrochet
JWT_SECRET=your_32_character_minimum_secret_key_here
FRONTEND_URL=https://your-app.vercel.app
ADMIN_URL=https://your-app.vercel.app/admin.html
ALLOWED_ORIGINS=https://your-app.vercel.app
NODE_ENV=production
```

**Frontend:**
```
VITE_API_URL=https://your-app.vercel.app/api
```

## Post-Deployment

1. **Create Admin User**
   ```bash
   cd backend
   MONGODB_URI=your_uri npm run create-admin
   ```

2. **Test Your App**
   - Client: `https://your-app.vercel.app`
   - Admin: `https://your-app.vercel.app/admin.html`
   - Health: `https://your-app.vercel.app/api/health`

## Project Structure

```
bubblycrochet/
├── vercel.json              # Vercel configuration
├── .env.example             # Environment template
├── DEPLOYMENT.md            # Full deployment guide
├── PRODUCTION_CHECKLIST.md  # Pre-deployment checklist
├── ENVIRONMENT_SETUP.md     # Environment variables guide
├── deploy.sh                # Deployment helper script
├── backend/
│   ├── .env.example
│   └── src/server.ts        # API entry point
└── frontend/
    ├── .env.example
    └── dist/                # Built static files
```

## Key Files

| File | Purpose |
|------|---------|
| `vercel.json` | Configures routing and builds |
| `.env.example` | Environment variable templates |
| `backend/src/server.ts` | API serverless function |
| `frontend/dist/` | Static frontend assets |

## Common Issues

### CORS Error
- Check `ALLOWED_ORIGINS` matches your Vercel URL exactly
- No trailing slashes (except admin URL)

### MongoDB Connection Failed
- IP whitelist: 0.0.0.0/0 in MongoDB Atlas
- Connection string format correct
- Database user has permissions

### API 404 Errors
- Verify `vercel.json` exists in root
- Check environment variables are set
- Review Vercel function logs

### Build Failed
- Node.js version ≥18
- All dependencies in package.json
- No TypeScript errors

## Helpful Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls

# Check deployment status
vercel inspect

# Redeploy latest
vercel --prod --force
```

## Support Documents

- 📖 **DEPLOYMENT.md** - Complete deployment instructions
- ✅ **PRODUCTION_CHECKLIST.md** - Pre-deployment checklist
- ⚙️ **ENVIRONMENT_SETUP.md** - Environment configuration
- 📘 **README.md** - Project documentation

## Deployment Helper Script

```bash
./deploy.sh
```

Choose from:
1. Install dependencies
2. Build for production
3. Deploy to Vercel
4. Create .env files
5. Check environment setup
6. Run local development

## Quick Fixes

**Forgot to add environment variable?**
```bash
vercel env add VARIABLE_NAME production
vercel --prod  # Redeploy
```

**Need to update a variable?**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Delete old variable
3. Add new one
4. Redeploy

**Want to rollback?**
1. Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Performance Tips

- Use MongoDB indexes for common queries
- Enable Vercel Analytics for insights
- Optimize images before upload
- Use CDN for static assets
- Monitor function execution time

## Security Checklist

- [ ] JWT_SECRET is strong (32+ chars)
- [ ] MongoDB credentials secured
- [ ] CORS configured properly
- [ ] Environment variables not in code
- [ ] .env files in .gitignore
- [ ] MongoDB Atlas IP whitelist set
- [ ] HTTPS enforced (automatic on Vercel)

## Monitoring

**Vercel Dashboard:**
- Deployments → View logs
- Analytics → Traffic & performance
- Settings → Usage limits

**MongoDB Atlas:**
- Metrics → Database performance
- Network Access → IP whitelist
- Database Access → User permissions

## Cost Estimates

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited serverless function executions
- 100 GB-hours compute time

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- No credit card required

## Getting Help

1. Check **DEPLOYMENT.md** for detailed steps
2. Review **PRODUCTION_CHECKLIST.md**
3. Read **ENVIRONMENT_SETUP.md** for variables
4. Check Vercel logs for errors
5. Verify MongoDB Atlas connection

---

**🎉 Ready to Deploy?**

```bash
vercel --prod
```

**Questions?** Check the full documentation in `DEPLOYMENT.md`

---

**Last Updated**: December 9, 2025
