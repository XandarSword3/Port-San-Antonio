# Vercel Deployment Guide

## Switching from Netlify to Vercel

### Step 1: Create Vercel Account & Import Project
1. Go to [vercel.com](https://vercel.com) and sign up/sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js framework

### Step 2: Environment Variables
Set up the same environment variables you had in Netlify:
- `STRIPE_PUBLISHABLE_KEY` (optional - for payment features)
- `STRIPE_SECRET_KEY` (optional - for payment features)
- `NODE_ENV=production`

### Step 3: Deploy
- Vercel will automatically build and deploy
- Your project will be available at `your-project-name.vercel.app`

### Step 4: Domain Setup (Optional)
- Add custom domains in Vercel dashboard
- DNS configuration is automatic

### Configuration Files:
- ✅ `vercel.json` - Already created with security headers and redirects
- ❌ `netlify.toml` - Can be removed after successful Vercel deployment

### Key Advantages of Vercel for Next.js:
- Native Next.js support (Vercel created Next.js)
- Automatic edge deployment
- Better build performance
- Easier ownership transfer
- Advanced analytics and monitoring

### Build Command Verification:
The project builds successfully with:
```bash
npm run build
```

All Arabic translations, currency conversion, and PWA features are working correctly.
