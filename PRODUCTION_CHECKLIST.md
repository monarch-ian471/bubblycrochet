# Production Deployment Checklist

## Pre-Deployment

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for Vercel)
- [ ] Connection string obtained and tested
- [ ] Collections created (users, products, orders, reviews, settings, journeys)

### Environment Variables Prepared
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key (min 32 chars)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `FRONTEND_URL` - Your Vercel app URL
- [ ] `ADMIN_URL` - Your Vercel app URL + /admin.html
- [ ] `ALLOWED_ORIGINS` - Your Vercel app URL
- [ ] `VITE_API_URL` - Your Vercel app URL + /api
- [ ] `GEMINI_API_KEY` - If using AI features

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Environment variables not hardcoded
- [ ] `.env` files not committed to Git
- [ ] `.gitignore` properly configured
- [ ] All dependencies listed in package.json
- [ ] Build scripts tested locally

### Security
- [ ] Strong JWT secret generated
- [ ] Default admin password changed
- [ ] MongoDB credentials secured
- [ ] CORS properly configured
- [ ] Sensitive data not in codebase
- [ ] API rate limiting considered

## Vercel Setup

### Repository
- [ ] Code pushed to GitHub
- [ ] Repository is accessible
- [ ] Main branch is up to date

### Vercel Project Configuration
- [ ] New project created in Vercel
- [ ] GitHub repository connected
- [ ] Root directory set to `./`
- [ ] Build settings configured
- [ ] All environment variables added
- [ ] Environment variables set for Production
- [ ] Environment variables set for Preview (optional)

### Initial Deployment
- [ ] First deployment successful
- [ ] Build logs checked for errors
- [ ] Function logs reviewed
- [ ] URLs noted down

## Post-Deployment

### Testing
- [ ] Homepage loads correctly
- [ ] Admin panel accessible at /admin.html
- [ ] API health check responds at /api/health
- [ ] User registration works
- [ ] User login works
- [ ] Product listing displays
- [ ] Product details load
- [ ] Cart functionality works
- [ ] Checkout process functional
- [ ] Order creation successful
- [ ] Admin login works
- [ ] Admin can manage products
- [ ] Admin can manage orders
- [ ] Admin can manage settings

### Database Verification
- [ ] Admin user created
- [ ] Test products added
- [ ] Orders are being saved
- [ ] User data persisting correctly

### Performance
- [ ] Page load times acceptable
- [ ] API response times reasonable
- [ ] Images loading properly
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified

### Monitoring Setup
- [ ] Vercel Analytics enabled (optional)
- [ ] Error monitoring configured (optional)
- [ ] Uptime monitoring setup (optional)

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Domain added in Vercel
- [ ] SSL certificate verified
- [ ] Environment variables updated with custom domain

### Additional Services
- [ ] Email service configured (SendGrid, etc.)
- [ ] Payment gateway integrated (Stripe, PayPal)
- [ ] CDN for images (Cloudinary, etc.)
- [ ] Backup strategy implemented

## Maintenance

### Regular Tasks
- [ ] Monitor Vercel usage dashboard
- [ ] Monitor MongoDB Atlas metrics
- [ ] Review application logs weekly
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Test critical flows monthly
- [ ] Review and rotate secrets quarterly

### Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Admin procedures documented
- [ ] Troubleshooting guide updated

## Rollback Plan

### In Case of Issues
- [ ] Previous deployment available in Vercel
- [ ] Database backup recent
- [ ] Rollback procedure documented
- [ ] Team contact list updated

## Launch Checklist

### Final Verification
- [ ] All above items completed
- [ ] Stakeholders notified
- [ ] Support plan in place
- [ ] Marketing materials ready
- [ ] Social media updated
- [ ] Analytics tracking verified

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Vercel URL**: _______________
**Custom Domain**: _______________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
