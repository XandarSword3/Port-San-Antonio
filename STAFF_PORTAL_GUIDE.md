# Staff Portal Requirements & Implementation Guide

## Overview
The staff portal is a **separate Next.js application** that allows restaurant staff to manage the customer-facing website content. Both applications share the same Supabase database.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│          CUSTOMER WEBSITE (Current Repo)            │
│         https://port-san-antonio.vercel.app         │
│                                                       │
│  - Public menu display                               │
│  - Restaurant information                            │
│  - Reservations & orders                             │
│  - Analytics tracking (sends events)                 │
│                                                       │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Both read/write to
                   ▼
         ┌─────────────────────┐
         │                     │
         │  SUPABASE DATABASE  │
         │                     │
         │  - dishes           │
         │  - categories       │
         │  - analytics_events │
         │  - reservations     │
         │  - reviews          │
         │  - footer_settings  │
         │  - content          │
         │                     │
         └─────────────────────┘
                   ▲
                   │
                   │ Both read/write to
┌──────────────────┴──────────────────────────────────┐
│                                                       │
│           STAFF PORTAL (New Repo Needed)            │
│      https://staff-port-san-antonio.vercel.app      │
│                                                       │
│  - Login authentication                              │
│  - Menu management (CRUD)                            │
│  - Analytics dashboard                               │
│  - Reservation management                            │
│  - Review moderation                                 │
│  - Content management                                │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## What You Need to Do

### 1. Create Staff Portal Repository

Create a new GitHub repository called `Port-San-Antonio-Staff`

### 2. Set Up Staff Portal Codebase

**Option A: Copy from existing admin components**
Your customer website already has admin components that can be extracted:
- `src/components/AdminDashboard.tsx` ✅
- `src/components/MenuManager.tsx` ✅
- `src/components/CategoryManager.tsx` ✅
- `src/components/AnalyticsDashboard.tsx` ✅
- `src/components/ReservationManager.tsx` ✅
- `src/components/ContentManager.tsx` ✅
- `src/components/AdManager.tsx` ✅
- `src/components/AdminLogin.tsx` ✅

**Option B: Start fresh with create-next-app**
```bash
npx create-next-app@latest port-san-antonio-staff
cd port-san-antonio-staff
npm install @supabase/supabase-js framer-motion lucide-react recharts
```

### 3. Staff Portal Structure

```
staff-portal/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx              # Staff login
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard
│   │   ├── menu/
│   │   │   └── page.tsx              # Menu management
│   │   ├── analytics/
│   │   │   └── page.tsx              # Analytics dashboard
│   │   ├── reservations/
│   │   │   └── page.tsx              # Reservation management
│   │   └── content/
│   │       └── page.tsx              # Content/footer management
│   ├── components/
│   │   ├── MenuEditor.tsx            # Dish CRUD
│   │   ├── CategoryEditor.tsx        # Category management
│   │   ├── AnalyticsCharts.tsx       # Revenue/popularity charts
│   │   └── ReservationList.tsx       # Reservation approval
│   └── lib/
│       ├── supabase.ts               # Same as customer site
│       └── auth.ts                   # JWT authentication
└── .env.local
```

### 4. Environment Variables (Vercel)

Both customer and staff portal need these in Vercel:

**Customer Website:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
STRIPE_SECRET_KEY=sk_live_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For analytics API
```

**Staff Portal:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co  # SAME as customer
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...                   # SAME as customer
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...                       # For admin operations
JWT_SECRET=your-secret-key-here                            # For staff sessions
```

### 5. Authentication Flow

**Staff Login:**
```typescript
// src/app/api/auth/staff-login/route.ts
export async function POST(request: Request) {
  const { username, password } = await request.json()
  
  // Check against staff table in Supabase
  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .eq('username', username)
    .eq('password_hash', hashPassword(password))  // Use bcrypt
    .single()
  
  if (error || !staff) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  
  // Create JWT token
  const token = jwt.sign({ 
    id: staff.id, 
    role: staff.role 
  }, process.env.JWT_SECRET)
  
  return NextResponse.json({ token, staff })
}
```

**Protect Staff Routes:**
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('staff-token')
  
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify JWT
  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/menu/:path*', '/analytics/:path*']
}
```

### 6. Database Tables Needed

Your Supabase already has most tables. Add this one for staff:

```sql
-- Staff authentication table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',  -- 'staff', 'admin', 'owner'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read own record"
  ON public.staff FOR SELECT
  USING (auth.uid() = id);
```

### 7. Key Features to Implement

#### A. Menu Management
```typescript
// Staff can:
- Add new dishes
- Edit existing dishes (name, price, description, image)
- Delete dishes
- Manage categories
- Reorder menu items
- Set availability status
```

#### B. Analytics Dashboard
```typescript
// Staff can view:
- Total revenue by day/week/month
- Popular dishes (most viewed, most ordered)
- Customer behavior (avg session time, bounce rate)
- Peak ordering times
- Conversion rates (views → cart → purchase)
```

#### C. Reservation Management
```typescript
// Staff can:
- View all reservations
- Approve/reject reservations
- Modify reservation details
- Send confirmation emails
- Mark as completed/cancelled
```

#### D. Content Management
```typescript
// Staff can edit:
- Footer information (hours, phone, email)
- Homepage hero text
- About page content
- Special promotions
- Event listings
```

### 8. Deployment

**Step 1:** Push staff portal code to GitHub
```bash
git init
git add .
git commit -m "Initial staff portal"
git remote add origin https://github.com/YourUsername/Port-San-Antonio-Staff.git
git push -u origin main
```

**Step 2:** Deploy to Vercel
1. Go to vercel.com
2. Import repository: Port-San-Antonio-Staff
3. Add environment variables (listed in section 4)
4. Deploy

**Step 3:** Create staff accounts
```sql
-- Insert first admin account
INSERT INTO public.staff (username, password_hash, email, full_name, role)
VALUES (
  'admin',
  -- Use bcrypt to hash: 'your-password'
  '$2b$10$YourHashedPasswordHere',
  'admin@portsan antonio.com',
  'Admin User',
  'owner'
);
```

### 9. Connection to Customer Website

**Customer → Staff:** Analytics events
```typescript
// Customer site sends events
POST /api/analytics/batch
{
  "events": [
    {
      "visitorId": "abc123",
      "eventName": "view_dish",
      "props": { "dishId": "beirut-beer", "duration": 5000 }
    }
  ]
}

// Staff portal reads analytics_events table
const { data } = await supabase
  .from('analytics_events')
  .select('*')
  .order('timestamp', { ascending: false })
```

**Staff → Customer:** Menu updates
```typescript
// Staff updates dishes table
await supabase
  .from('dishes')
  .update({ price: 15.99, available: true })
  .eq('id', 'beirut-beer')

// Customer website reads updated data automatically
// No API calls needed between apps - they share the database!
```

### 10. Security Checklist

- ✅ Staff authentication via JWT
- ✅ Password hashing with bcrypt
- ✅ Row Level Security (RLS) on sensitive tables
- ✅ HTTPS only (Vercel handles this)
- ✅ Environment variables in Vercel (never in code)
- ✅ Rate limiting on API routes
- ✅ Input validation on all forms
- ✅ CSRF protection with tokens

### 11. Quick Start Command

If you want me to generate the full staff portal starter:

```bash
# I can create a complete staff portal boilerplate with:
- Pre-configured authentication
- All admin components from customer site
- API routes for CRUD operations
- Analytics dashboard
- Responsive design
- Dark mode support

Just say: "Create staff portal boilerplate"
```

### 12. Maintenance

**Updating Menu from Staff Portal:**
1. Staff logs into `staff-port-san-antonio.vercel.app`
2. Goes to Menu Management
3. Edits dish prices/descriptions
4. Clicks Save
5. Changes immediately reflected on customer website

**No synchronization needed** - both apps read from the same Supabase database in real-time!

---

## Summary

**What you need:**
1. Create new GitHub repo for staff portal
2. Copy admin components from customer site (or I can generate boilerplate)
3. Deploy to Vercel with same Supabase credentials
4. Add staff table to Supabase
5. Create first admin account

**What you DON'T need:**
- API to connect the two apps (they share database)
- Complex synchronization
- Webhooks or message queues
- Separate databases

Let me know if you want me to generate the complete staff portal boilerplate!
