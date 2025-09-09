# 🚀 Dual Deployment Strategy

This project supports two deployment platforms with different capabilities:

## 📖 GitHub Pages (Static Demo)
- **URL**: `https://xandarsword3.github.io/Port-San-Antonio/`
- **Functionality**: 
  - ✅ Menu browsing and filtering
  - ✅ Category navigation
  - ✅ Cart functionality (client-side)
  - ✅ Responsive design
  - ❌ **Admin features disabled** (requires server-side API)
  - ❌ Auto-commit functionality disabled

## 🔧 Vercel (Full Production)
- **URL**: `https://port-san-antonio.vercel.app/`
- **Functionality**:
  - ✅ All GitHub Pages features
  - ✅ **Full admin panel** (`/admin`)
  - ✅ Menu editing with auto-deployment
  - ✅ User authentication system
  - ✅ Auto-commit to GitHub
  - ✅ Server-side API routes

## 🎯 Use Cases

### GitHub Pages - Perfect for:
- Demo/preview versions
- Public showcasing
- Static content delivery
- Portfolio display

### Vercel - Required for:
- Production restaurant operations
- Menu management
- Admin functionality
- Content editing

## 🔄 Workflow

1. **Development**: Local development with full functionality
2. **GitHub Pages**: Automatic deployment for demo/preview
3. **Vercel**: Production deployment with admin capabilities

Both deployments are automatically updated when you push to the `main` branch.

## 🛠️ Technical Details

- **GitHub Pages**: Uses `output: 'export'` for static generation
- **Vercel**: Uses server-side rendering with API routes
- **Admin Routes**: Only available on Vercel deployment
- **Database**: Admin features require server-side processing
