# Deployment Guide

## Overview
This Lebanese Mediterranean resort website is ready for deployment to various platforms. The admin interface allows no-code management of menu items and contact information.

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Admin credentials: `admin` / `password123`

## Deployment Options

### 1. Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next` (configured in netlify.toml)
   - Node version: 18
3. Deploy automatically on every push to main branch
4. Admin panel available at: `yoursite.com/admin`

### 2. GitHub Pages
1. Enable GitHub Pages in repository settings
2. The GitHub Actions workflow will automatically deploy on push to main
3. Admin panel available at: `yoursite.github.io/admin`

### 3. Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure build settings
3. Deploy automatically on every push
4. Admin panel available at: `yoursite.vercel.app/admin`

## Admin Features

### Menu Management
- Add/Edit/Delete menu items
- Update prices, descriptions, images
- Manage categories
- Changes reflect live on the website

### Contact Management
- Update phone, email, address
- Manage social media links
- Changes save to localStorage (simulate database)

### Authentication
- Simple username/password login
- Credentials stored in `public/auth.json`
- Session persists until logout

## File Structure
```
public/
├── data.json          # Menu and contact data
├── auth.json          # Admin credentials
└── images/            # Menu item images

src/
├── app/
│   ├── admin/         # Admin panel
│   ├── menu/          # Menu page
│   └── page.tsx       # Homepage
├── components/
│   ├── AdminLogin.tsx # Authentication
│   ├── MenuManager.tsx # Menu CRUD
│   ├── ContactManager.tsx # Contact CRUD
│   └── CartModal.tsx  # Shopping cart
└── contexts/          # React contexts
```

## Environment Variables
No environment variables required for basic deployment.

## Netlify Configuration Notes
- The `netlify.toml` file is configured for @netlify/plugin-nextjs
- **Important**: Publish directory is set to `.next` in netlify.toml
- The plugin automatically handles routing and server-side rendering
- If you encounter 404 errors, ensure:
  1. Publish directory is set to `.next` in netlify.toml
  2. Build command is `npm run build`
  3. Node version is set to 18
  4. @netlify/plugin-nextjs is properly installed

## Security Notes
- Admin credentials are stored in plain text (suitable for demo)
- For production, implement proper authentication
- Consider adding rate limiting and CSRF protection

## Customization
- Update `public/data.json` for initial menu data
- Modify `public/auth.json` for admin credentials
- Edit Lebanese theme colors in `src/app/globals.css`
- Update contact information in admin panel

## Support
For issues or questions, check the GitHub repository or contact the development team.
