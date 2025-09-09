# GitHub Token Setup for Vercel Auto-Commit

## What Happened
The auto-commit system was trying to access a GitHub token that wasn't configured in Vercel, causing the deployment to fail. I've now fixed it so the app works WITHOUT the token, but you need to set it up for auto-commit to function.

## Step 1: Create GitHub Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `Port San Antonio Auto-Commit`
4. Expiration: 90 days (or longer)
5. Scopes needed:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

6. Copy the token (starts with `ghp_`)

## Step 2: Add Token to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your "Port San Antonio" project
3. Click Settings → Environment Variables
4. Add new variable:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Your GitHub token (paste the `ghp_` token)
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"

## Step 3: Redeploy
1. Go to Deployments tab in Vercel
2. Click "..." on latest deployment → "Redeploy"
3. Wait for deployment to complete

## Step 4: Test
After redeployment:
1. Visit: `https://port-san-antonio.vercel.app/admin`
2. Login with your admin credentials
3. Edit a menu item and save
4. Check your GitHub repo for the auto-commit
5. Verify changes appear on your live site

## Verification URLs
- Check environment: `https://port-san-antonio.vercel.app/api/check-env`
- Test GitHub connection: `https://port-san-antonio.vercel.app/api/test-github`

## Current Status
✅ App deploys successfully without GitHub token
✅ Admin page accessible
⏳ Auto-commit requires GitHub token configuration
⏳ Vercel environment variable setup needed

The app works now - you just need to add the GitHub token to enable auto-commit functionality!
