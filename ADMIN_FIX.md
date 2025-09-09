# VERCEL ADMIN PAGE 404 FIX

## Problem
Admin page returns 404 on Vercel production deployment

## Root Cause
The `vercel.json` file had a redirect from `/admin` to `/admin/dashboard` but the dashboard route doesn't exist.

## Solution Applied
1. Fixed `vercel.json` redirect configuration
2. Ensured proper environment variables are set

## Required Environment Variables in Vercel
Add these in your Vercel dashboard under Project Settings > Environment Variables:

```
NEXT_PUBLIC_SHOW_ADMIN=true
JWT_SECRET=super-secret-jwt-key-for-production-change-this-to-something-secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$12$VAcSIB2OY1Ii8obqODSGK.rQP/MiKQfTcTGQa4vkNhEWcZmTc7rVm
GITHUB_TOKEN=your-github-token-here
GITHUB_REPO=XandarSword3/Port-San-Antonio
GITHUB_BRANCH=main
NODE_ENV=production
```

## Test Credentials
- Username: `admin`
- Password: `admin123`

## Steps to Verify Fix
1. Deploy the updated `vercel.json` 
2. Add environment variables to Vercel
3. Redeploy the application
4. Access `/admin` route - should now work

## Files Modified
- `vercel.json` - Removed problematic redirect
