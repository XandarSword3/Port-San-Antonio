# 🚀 Deployment Guide - Port San Antonio Resort

## Overview

This guide covers deploying the Port San Antonio Resort website to Vercel. The system is **100% database-driven** using Supabase with **no mock data or static JSON files**.

## 🎯 Architecture

```
Customer Website (Next.js) → Supabase Database ← Staff Portal (Next.js)
                                ↓
                         Real-time Updates
                    (Pure database operation)
```

## 📋 Prerequisites

1. **GitHub Repository**: Code pushed to GitHub
2. **Supabase Project**: Database with dishes, categories, and orders tables
3. **Vercel Account**: For hosting and deployment

## 🔧 Step 1: Prepare Supabase

### Get Your Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ifcjvulukaqoqnolgajb` 
3. Navigate to **Settings** → **API**
4. Copy these values:
   - **Project URL**: `https://ifcjvulukaqoqnolgajb.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Verify Database Setup
Ensure these tables exist with data:
- ✅ `dishes` (60+ items imported)
- ✅ `categories` (6 categories mapped)  
- ✅ `orders` (for customer orders)
- ⏳ `order_items` (create if needed - see INTEGRATION_COMPLETE.md)

## 🚀 Step 2: Deploy to Vercel

### Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: `XandarSword3/Port-San-Antonio`
4. Keep default settings, click **"Deploy"**

### Configure Environment Variables
After deployment, go to **Project Settings** → **Environment Variables**:

#### Required Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ifcjvulukaqoqnolgajb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k
```

#### Optional Variables:
```bash
JWT_SECRET=your-secure-jwt-secret
ADMIN_USERNAME=admin  
ADMIN_PASSWORD_HASH=$2b$12$VAcSIB2OY1Ii8obqODSGK.rQP/MiKQfTcTGQa4vkNhEWcZmTc7rVm
NEXT_PUBLIC_SHOW_ADMIN=true
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=XandarSword3/Port-San-Antonio
GITHUB_BRANCH=main
```

### Add Each Variable:
1. Click **"Add New"** 
2. Enter **Name** and **Value**
3. Select **Environment**: All (Production, Preview, Development)
4. Click **"Save"**
5. Repeat for each variable

## 🔄 Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Select **"Use existing Build Cache"**  
4. Click **"Redeploy"**

## ✅ Step 4: Verify Deployment

### Test Customer Website
- **URL**: `https://your-project.vercel.app`
- **Menu loads** from database (60+ dishes)
- **Categories display** properly
- **Real-time updates** work with staff portal
- **No errors** in browser console

### Test API Endpoints
- `https://your-project.vercel.app/api/menu` → Returns dishes from database
- `https://your-project.vercel.app/debug/data` → Shows database connection status

### Verify Staff Integration  
- Staff portal: `https://port-antonio-staff.vercel.app`
- Changes made in staff portal appear instantly on customer site
- Database is single source of truth

## 🛠️ Troubleshooting

### Build Fails with "Missing Supabase environment variables"
- **Cause**: Environment variables not set in Vercel
- **Fix**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project Settings

### Menu shows empty/loading state
- **Cause**: Database connection issues or missing data
- **Fix**: Verify Supabase credentials and run migration scripts

### Real-time updates not working  
- **Cause**: Supabase Realtime not enabled or incorrect permissions
- **Fix**: Enable Realtime in Supabase dashboard, check Row Level Security

## 📊 Performance Optimization

### Vercel Configuration
The project includes optimized `vercel.json`:
```json
{
  "functions": {
    "app/api/menu/route.ts": {
      "maxDuration": 10
    }
  }
}
```

### Next.js Optimization
- Static generation where possible
- Image optimization enabled
- PWA service worker configured

## 🔐 Security Considerations

1. **Environment Variables**: Never commit actual values to Git
2. **Supabase RLS**: Ensure Row Level Security policies are configured
3. **API Keys**: Use anon key for public client, service role for admin
4. **CORS**: Verify Supabase allows requests from your domain

## 📱 Mobile & PWA

The deployment includes:
- **Responsive design** for all screen sizes
- **PWA capabilities** with service worker
- **Offline fallbacks** (limited without database)
- **Install prompts** on supported devices

## 🔗 Related Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ifcjvulukaqoqnolgajb
- **Staff Portal**: https://port-antonio-staff.vercel.app
- **GitHub Repository**: https://github.com/XandarSword3/Port-San-Antonio
- **Migration Scripts**: `/scripts/migrate-full-data.js`

## 📞 Support

For deployment issues:
1. Check Vercel function logs in dashboard
2. Verify environment variables are set correctly  
3. Test Supabase connection using provided scripts
4. Ensure database has required tables and data

---

**🎉 Success**: After following this guide, you'll have a fully functional restaurant system with real-time menu updates and complete database integration!
- Consider adding rate limiting and CSRF protection

## Customization
- Update `public/data.json` for initial menu data
- Modify `public/auth.json` for admin credentials
- Edit Lebanese theme colors in `src/app/globals.css`
- Update contact information in admin panel

## Support
For issues or questions, check the GitHub repository or contact the development team.
