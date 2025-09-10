# 🏖️ Port San Antonio Resort - Customer Website

**100% Database-Driven Restaurant System with Real-Time Updates**

[![Deployment Status](https://img.shields.io/badge/deployment-ready-green)](https://vercel.com) [![Database](https://img.shields.io/badge/database-Supabase-green)](https://supabase.com) [![Framework](https://img.shields.io/badge/framework-Next.js%2015-blue)](https://nextjs.org)

## 🌟 Overview

Port San Antonio Resort's customer-facing website featuring a complete Lebanese Mediterranean restaurant experience. This system provides real-time menu updates, online ordering, and seamless integration with the staff management portal.

**🎯 Key Features:**
- **100% Database-Driven**: No static files, all data from Supabase
- **Real-Time Updates**: Menu changes appear instantly from staff portal
- **Mobile-First Design**: Responsive PWA with offline capabilities  
- **Order System**: Complete cart and checkout with customer info
- **Multilingual**: Arabic and English support
- **Zero Mock Data**: Pure production-ready architecture

## 🏗️ Architecture

```mermaid
graph TB
    A[Customer Website] --> B[Supabase Database]
    C[Staff Portal] --> B
    B --> D[Real-Time Updates]
    D --> A
    D --> C
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account with configured database
- Environment variables (see `.env.example`)

### Installation
```bash
# Clone the repository
git clone https://github.com/XandarSword3/Port-San-Antonio.git
cd Port-San-Antonio

# Install dependencies  
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see below)
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🔧 Environment Configuration

### Required Variables
```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://ifcjvulukaqoqnolgajb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional Variables
```bash
# Authentication & Security
JWT_SECRET=your-secure-jwt-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$12$...

# Application Settings  
NEXT_PUBLIC_SHOW_ADMIN=true

# GitHub Integration
GITHUB_TOKEN=ghp_your_token
GITHUB_REPO=XandarSword3/Port-San-Antonio
GITHUB_BRANCH=main

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**💡 Get Supabase Credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project → Settings → API  
3. Copy "Project URL" and "anon public" key

## 📊 Database Schema

### Required Tables
- **`dishes`**: Menu items with categories, prices, descriptions
- **`categories`**: Menu categories with ordering
- **`orders`**: Customer orders with status tracking  
- **`order_items`**: Individual items within orders

### Migration
Import your menu data using the provided script:
```bash
# Import full dataset (60+ dishes) 
node scripts/migrate-full-data.js

# Check database status
node scripts/check-env.js
```

## 🌐 Deployment to Vercel

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import `XandarSword3/Port-San-Antonio`
4. Deploy with default settings

### 2. Configure Environment Variables
In **Project Settings** → **Environment Variables**, add:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ifcjvulukaqoqnolgajb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2p2dWx1a2Fxb3Fub2xnYWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTQ5ODMsImV4cCI6MjA3MzA3MDk4M30.sRYxcMg9icEuymTro275_Kd1EDFFSaBvJUwgovJdu4k
```

### 3. Redeploy  
After adding environment variables, redeploy the project for changes to take effect.

**📚 Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔍 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
npm run check-env    # Verify environment variables
```

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── menu/           # Menu browsing page
│   ├── cart/           # Shopping cart
│   └── api/            # API endpoints
├── components/         # React components
│   ├── MenuManager.tsx # Real-time menu display
│   ├── CartSidebar.tsx # Order submission  
│   └── ...
├── contexts/           # React contexts
│   ├── MenuContext.tsx # Database menu state
│   ├── CartContext.tsx # Shopping cart state
│   └── ...
└── lib/
    └── supabase.ts     # Database client
```

## 🎨 Features

### Menu System
- **Real-Time Loading**: Menu data streams from Supabase
- **Live Updates**: Changes from staff portal appear instantly
- **Advanced Filtering**: Search, categories, dietary preferences
- **Responsive Design**: Mobile-first with tablet/desktop optimization

### Shopping Cart
- **Persistent Storage**: Cart saved across sessions
- **Order Submission**: Customer info + order items to database
- **Real-Time Pricing**: Dynamic totals with tax calculation
- **Payment Ready**: Stripe integration prepared

### Performance
- **PWA Enabled**: Install as mobile app
- **Image Optimization**: Next.js automatic optimization
- **Static Generation**: Fast loading with database hydration
- **Service Worker**: Caching and offline capabilities

## 🔗 Integration

### Staff Portal Connection
- **Staff Portal**: https://port-antonio-staff.vercel.app
- **Real-Time Sync**: Bi-directional updates via Supabase Realtime
- **Single Database**: Shared source of truth
- **Live Management**: Staff changes appear instantly on customer site

### API Endpoints
- `GET /api/menu` - Menu items from database
- `GET /debug/data` - Database connection status
- `POST /api/orders` - Order submission (future)

## 🛠️ Troubleshooting

### Build Fails
**Error**: `Missing Supabase environment variables`
- **Fix**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Project Settings

### Empty Menu
**Error**: Menu shows loading or empty state
- **Fix**: Verify Supabase credentials and run `node scripts/migrate-full-data.js`

### Real-Time Not Working
**Error**: Changes don't sync between portals
- **Fix**: Enable Realtime in Supabase dashboard, check RLS policies

### Environment Check
```bash
# Verify all variables are set correctly
node scripts/check-env.js
```

## 📱 Mobile Experience

- **Responsive Design**: Optimized for phones, tablets, desktops
- **Touch-Friendly**: Large buttons, smooth scrolling
- **PWA Features**: Install button, offline support
- **Performance**: Lazy loading, optimized images

## 🔐 Security

- **Environment Variables**: Never commit secrets to Git
- **Supabase RLS**: Row Level Security policies enabled
- **API Protection**: Rate limiting and validation
- **Client Safety**: Only anon key used client-side

## 📞 Support

**Related Projects:**
- **Staff Portal**: https://github.com/XandarSword3/Port-San-Antonio-Staff
- **Live Customer Site**: https://port-san-antonio.vercel.app
- **Live Staff Portal**: https://port-antonio-staff.vercel.app

**Documentation:**
- [Deployment Guide](./DEPLOYMENT.md)
- [Integration Complete](./INTEGRATION_COMPLETE.md)  
- [Mock Data Removal](./MOCK_DATA_REMOVAL_COMPLETE.md)

**Issues:**
- Check Vercel function logs for deployment issues
- Verify Supabase connection using provided scripts
- Test environment variables with `check-env.js`

---

**🌟 Built with Next.js 15, Supabase, TypeScript, and Tailwind CSS**

*A complete restaurant management system with real-time updates and zero mock data.*
