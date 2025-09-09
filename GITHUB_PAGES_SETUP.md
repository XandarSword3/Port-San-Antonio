# 🔧 GitHub Pages Setup Guide

## Issue: "Get Pages site failed. Please verify that the repository has Pages enabled"

This error occurs when GitHub Pages is not enabled in your repository settings. Here's how to fix it:

## 📋 Step-by-Step Setup

### Method 1: Enable via Repository Settings (Recommended)

1. **Go to Repository Settings**
   - Navigate to your GitHub repository: `https://github.com/XandarSword3/Port-San-Antonio`
   - Click on the **"Settings"** tab

2. **Enable GitHub Pages**
   - Scroll down to the **"Pages"** section in the left sidebar
   - Click on **"Pages"**

3. **Configure Pages Source**
   - Under **"Source"**, select **"GitHub Actions"**
   - This enables the Actions-based deployment

4. **Save Configuration**
   - The page will refresh and show your Pages URL
   - Your site will be available at: `https://xandarsword3.github.io/Port-San-Antonio/`

### Method 2: Use Alternative Workflow

If the above doesn't work, you can use the fallback workflow:

1. **Manual Deployment**
   - Go to the **Actions** tab in your repository
   - Find **"Deploy to GitHub Pages (Alternative)"**
   - Click **"Run workflow"** button
   - Select **"main"** branch and click **"Run workflow"**

## 🔍 Verification Steps

After enabling Pages:

1. **Check Repository Settings**
   - Pages section should show: "Your site is live at https://xandarsword3.github.io/Port-San-Antonio/"

2. **Check Actions Tab**
   - You should see workflow runs for "Deploy to GitHub Pages"
   - Green checkmarks indicate successful deployments

3. **Visit Your Site**
   - Open: `https://xandarsword3.github.io/Port-San-Antonio/`
   - You should see your restaurant menu application

## 🚨 Troubleshooting

### If Pages is still not working:

1. **Check Branch Protection**
   - Ensure the `main` branch allows Actions to run

2. **Check Repository Permissions**
   - Repository must be public for free GitHub Pages
   - Or you need GitHub Pro/Teams for private repo Pages

3. **Check Workflow Permissions**
   - Go to Settings → Actions → General
   - Ensure "Read and write permissions" is selected

4. **Manual Enable via API**
   ```bash
   # If you have GitHub CLI installed
   gh api --method POST /repos/XandarSword3/Port-San-Antonio/pages \
     --field source.branch=main \
     --field source.path=/
   ```

## 🎯 Expected Outcome

Once properly configured:
- ✅ GitHub Pages enabled in repository settings
- ✅ Actions workflow runs automatically on push to main
- ✅ Site available at: `https://xandarsword3.github.io/Port-San-Antonio/`
- ✅ Demo version with menu browsing (no admin features)

## 📞 Need Help?

If you continue to have issues:
1. Check the Actions logs for detailed error messages
2. Ensure your repository is public (or has Pages enabled for private repos)
3. Try the alternative workflow first as a test
