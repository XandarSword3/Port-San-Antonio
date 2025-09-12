# 🏖️ Port San Antonio Resort - Customer Website

**Professional Lebanese Mediterranean Restaurant Management System**

[![Deployment Status](https://img.shields.io/badge/deployment-ready-green)](https://vercel.com) [![Database](https://img.shields.io/badge/database-Supabase-green)](https://supabase.com) [![Framework](https://img.shields.io/badge/framework-Next.js%2015-blue)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://typescriptlang.org) [![PWA](https://img.shields.io/badge/PWA-enabled-purple)](https://web.dev/progressive-web-apps/)

## 🌟 Overview

A sophisticated **customer-facing restaurant website** for a Lebanese Mediterranean resort restaurant. This modern, database-driven web application provides online menu browsing, ordering capabilities, and a complete restaurant management system with real-time synchronization between customer and staff portals.

### �️ **Architecture Highlights**
- **Next.js 15.5.2** with TypeScript for type safety and modern development
- **Supabase PostgreSQL** database with real-time updates and Row Level Security
- **Progressive Web App (PWA)** with offline capabilities and service workers
- **Dual-system architecture** with separate professional staff portal
- **Role-based authentication** (guest, worker, admin, owner permissions)
- **Multi-language support** (English, Arabic, French) with RTL support
- **Stripe payment integration** ready for production deployment

### 🎯 **Key Features**
- **🍽️ Dynamic Menu System**: Real-time menu loading with advanced filtering
- **🛒 Shopping Cart**: Persistent cart with order submission to database
- **🔍 Advanced Search**: Category filtering, dietary preferences, price ranges
- **🌐 Multilingual Interface**: Full Arabic support with proper RTL layout
- **💰 Multi-Currency**: USD and LBP currency conversion
- **📱 Mobile-First Design**: Responsive across all devices with touch optimizations
- **🌙 Theme System**: Dark/light mode with system preference detection
- **⚡ Performance**: Image optimization, lazy loading, and caching strategies

## 🏗️ Architecture

```mermaid
graph TB
    A[Customer Website<br/>Next.js PWA] --> B[Supabase Database<br/>PostgreSQL + RLS]
    C[Staff Portal<br/>Management System] --> B
    B --> D[Real-Time Updates<br/>Database Sync]
    D --> A
    D --> C
    E[Stripe Payments] --> A
    F[Service Workers<br/>Offline Support] --> A
    G[Multi-Language<br/>AR/EN/FR] --> A
```

### 🎯 **System Components**

#### **Customer Website** (Port 3000)
- **React/Next.js 15.5.2** with TypeScript
- **Tailwind CSS** with custom theme and animations
- **Framer Motion** for smooth UI transitions
- **PWA capabilities** with offline menu browsing
- **Real-time menu updates** from staff portal changes

#### **Staff Portal** (Separate Application - Port 3002)
- **Professional admin interface** for restaurant management
- **Role-based access control** (worker/admin/owner)
- **Menu management** with full CRUD operations
- **Analytics dashboard** with business insights
- **Event management** for promotions and special events

#### **Database Layer** (Supabase)
- **PostgreSQL** with Row Level Security policies
- **Real-time subscriptions** for instant updates
- **Structured schema** for dishes, categories, orders, and content
- **Audit logging** and timestamp tracking

#### **Infrastructure & Deployment**
- **Vercel hosting** with automatic deployments
- **GitHub Actions** for CI/CD pipeline
- **Environment-based configuration** for staging/production
- **Performance monitoring** and error tracking

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 18+** (LTS recommended)
- **npm or yarn** package manager
- **Supabase account** with configured PostgreSQL database
- **Git** for version control
- **Modern browser** with JavaScript enabled

### **Installation & Setup**
```bash
# Clone the repository
git clone https://github.com/XandarSword3/Port-San-Antonio.git
cd Port-San-Antonio

# Install dependencies
npm install

# Environment configuration
cp .env.example .env.local
# Configure your Supabase credentials (see Environment Setup below)

# Database setup
npm run seed

# Start development server
npm run dev
```

### **Environment Setup**
Create `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Authentication
JWT_SECRET=your_secure_jwt_secret_key
```

### **Development Commands**
```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm run test          # Unit tests with Vitest
npm run test:ui       # E2E tests with Playwright

# Database operations
npm run seed          # Import sample menu data
```

### **Staff Portal Setup**
The administrative staff portal is a separate application:
1. **Repository**: Port-San-Antonio-Staff (separate repo)
2. **Local URL**: http://localhost:3002
3. **Features**: Menu management, analytics, order processing
4. **Authentication**: Role-based access (worker/admin/owner)

## 🔧 Configuration & Deployment

### **Production Deployment (Vercel)**
1. **Connect Repository**: Import from GitHub to Vercel dashboard
2. **Environment Variables**: Configure production environment in Vercel settings
3. **Database Setup**: Ensure Supabase production database is configured
4. **Custom Domain**: Optional domain configuration in Vercel

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

### **Core Tables**
```sql
-- Menu Management
├── dishes (menu items with pricing, descriptions, availability)
├── categories (menu organization with ordering)

-- Order Processing  
├── orders (customer orders with status tracking)
├── order_items (detailed line items within orders)

-- Content Management
├── footer_settings (dynamic footer configuration)
├── legal_pages (terms of service, privacy policy)
├── job_positions (careers section content)
└── page_content (dynamic page content management)
```

### **Database Features**
- **Row Level Security (RLS)**: Granular access control policies
- **Real-time Subscriptions**: Instant updates across all clients
- **Audit Trails**: Automatic timestamp tracking for all changes
- **Data Validation**: Database-level constraints and checks
- **Performance Optimization**: Strategic indexing for fast queries

### **Migration & Setup**
```bash
# Import complete dataset (60+ Lebanese Mediterranean dishes)
node scripts/migrate-full-data.js

# Check database connectivity and status
node scripts/check-env.js

# Setup order processing tables
node scripts/setup-order-items.js
```

## 🧪 Testing

### **Test Suite Coverage**
```bash
# End-to-End Testing (Playwright)
npm run test:ui                    # Full browser testing
npm run test:ui -- --headed       # Run with browser visible

# Unit Testing (Vitest)  
npm run test:unit                  # Component and utility testing
npm run test:integration           # Database integration tests
npm run test:data                  # Data validation tests

# Performance Testing
npm run build                      # Build optimization testing
npm run start                      # Production server testing
```

### **Testing Features**
- **Cross-browser compatibility** (Chrome, Firefox, Safari)
- **Mobile responsiveness** testing on various screen sizes
- **Accessibility compliance** with WCAG guidelines
- **Performance benchmarks** and Core Web Vitals
- **Database integration** testing with real Supabase connections

## 📁 Project Structure

```
Port-San-Antonio/
├── 📁 src/
│   ├── 📁 app/                 # Next.js 13+ App Router
│   │   ├── 📁 api/            # API routes (auth, menu, orders)
│   │   ├── 📁 menu/           # Menu browsing pages
│   │   ├── 📁 cart/           # Shopping cart functionality
│   │   └── 📄 layout.tsx      # Root layout component
│   ├── 📁 components/         # React components
│   │   ├── 📁 admin/          # Administrative components
│   │   ├── 📄 DishCard.tsx    # Menu item display
│   │   ├── 📄 GlobalHeader.tsx # Navigation header
│   │   └── 📄 CartModal.tsx   # Shopping cart interface
│   ├── 📁 contexts/           # React Context providers
│   │   ├── 📄 MenuContext.tsx # Menu data management
│   │   ├── 📄 CartContext.tsx # Shopping cart state
│   │   └── 📄 ThemeContext.tsx # Dark/light mode
│   ├── 📁 hooks/              # Custom React hooks
│   ├── 📁 lib/                # Utility libraries
│   │   ├── 📄 supabase.ts     # Database client
│   │   ├── 📄 auth.ts         # Authentication utilities
│   │   └── 📄 translations.ts # Internationalization
│   └── 📁 types/              # TypeScript type definitions
├── 📁 public/                 # Static assets
│   ├── 📁 images/             # Restaurant and menu images
│   ├── 📄 manifest.json       # PWA configuration
│   └── 📄 sw.js              # Service worker
├── 📁 scripts/                # Database and utility scripts
├── 📁 tests/                  # Test suites
│   ├── 📁 e2e/               # Playwright end-to-end tests
│   ├── 📁 unit/              # Vitest unit tests
│   └── 📁 integration/       # Database integration tests
├── 📄 next.config.js          # Next.js configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 playwright.config.ts    # E2E testing configuration
└── 📄 package.json           # Dependencies and scripts
```
- **Real-time Subscriptions**: Instant updates across all clients
- **Audit Trails**: Automatic timestamp tracking for all changes
- **Data Validation**: Database-level constraints and checks
- **Performance Optimization**: Strategic indexing for fast queries

### **Migration & Setup**
```bash
# Import complete dataset (60+ Lebanese Mediterranean dishes)
node scripts/migrate-full-data.js

# Check database connectivity and status
node scripts/check-env.js

# Setup order processing tables
node scripts/setup-order-items.js
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

## 📊 Technical Specifications

### **Frontend Technologies**
- **Framework**: Next.js 15.5.2 (React 18.2.0)
- **Language**: TypeScript 5.3.3 for type safety
- **Styling**: Tailwind CSS 3.4.17 with custom extensions
- **Animations**: Framer Motion 12.23.12 for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **PWA**: next-pwa with Workbox for service workers

### **Backend & Database**
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Authentication**: JWT with bcryptjs password hashing
- **Payments**: Stripe integration with React Stripe.js
- **APIs**: Next.js API routes with TypeScript
- **File Storage**: Supabase storage for images and assets

### **Development & Testing**
- **Testing**: Playwright for E2E testing, Vitest for unit tests
- **Linting**: ESLint with Next.js configuration
- **Build**: Next.js build system with automatic optimization
- **Deployment**: Vercel with automatic GitHub integration

### **Performance Features**
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Service worker caching with NetworkFirst strategy
- **SEO**: Meta tags, sitemap, and structured data
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🤝 Contributing

### **Development Workflow**
1. **Fork the repository** and create a feature branch
2. **Install dependencies** and set up local environment
3. **Make changes** following TypeScript and ESLint guidelines
4. **Run tests** to ensure functionality (unit + E2E)
5. **Submit pull request** with detailed description

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Consistent code formatting
- **Commit Messages**: Conventional Commits format
- **Testing**: Maintain test coverage for new features

### **Local Development Setup**
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure Supabase credentials

# Start development server
npm run dev

# Run test suite
npm run test
npm run test:ui
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Third-Party Licenses**
- **Next.js**: MIT License
- **React**: MIT License  
- **Tailwind CSS**: MIT License
- **Supabase**: Apache 2.0 License
- **Stripe**: Various licenses for SDK components

## 🔗 Related Projects

- **[Port-San-Antonio-Staff](https://github.com/XandarSword3/Port-San-Antonio-Staff)**: Administrative staff portal
- **Supabase Schema**: Database migration scripts and schema definitions
- **Mobile App**: React Native version (planned development)

## 🆘 Support & Documentation

### **Getting Help**
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions
- **Documentation**: Comprehensive README and inline code comments
- **Examples**: Sample configurations in `/scripts` directory

### **Common Issues**
- **Database Connection**: Check Supabase credentials and network connectivity
- **Build Failures**: Ensure Node.js 18+ and clean npm cache
- **Deployment Issues**: Verify environment variables in production
- **Performance**: Enable Next.js image optimization and caching

---

**Built with ❤️ for the Port San Antonio Resort** | **Powered by Next.js & Supabase**
- **Order Tracking**: Integration with staff portal for order processing
- **Payment Integration**: Stripe-ready checkout flow

### **User Experience**
- **Responsive Design**: Mobile-first approach with tablet/desktop optimization
- **Theme System**: Dark/light mode with system preference detection
- **Language Support**: English, Arabic (RTL), and French localization
- **Offline Capabilities**: PWA features for offline menu browsing
- **Touch Interactions**: Optimized for mobile touch interfaces

### **Administrative Features**
- **Staff Portal Integration**: Seamless connection to management system
- **Content Management**: Dynamic footer, legal pages, and job postings
- **Analytics Ready**: Integration points for business intelligence
- **Role-Based Access**: Granular permissions for different user types
- **Audit Logging**: Track changes and system activities

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
