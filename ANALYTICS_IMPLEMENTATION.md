# 🎯 Customer Website Analytics & Tracking Implementation

## ✅ **Completed Features**

### 1. **Visitor Tracker (src/lib/tracker.ts)**
- ✅ UUID v4 visitor cookies with `ps_visitor` name
- ✅ Secure cookie settings (SameSite=Lax, Secure, 1-year expiry)
- ✅ Event batching (flushes every 5s or 10 events)
- ✅ Uses `navigator.sendBeacon` with `fetch` fallback
- ✅ Props size validation (rejects >8KB)
- ✅ Strict TypeScript types
- ✅ Consent-aware (respects cookie preferences)

### 2. **Automatic Page Tracking (src/components/TrackerProvider.tsx)**
- ✅ Automatic `page_view` events on all pages
- ✅ Route change detection (Next.js navigation)
- ✅ `time_on_page` events on visibility change/unload
- ✅ Integrated into root layout
- ✅ Client-side only execution

### 3. **Analytics API (src/app/api/analytics/batch/route.ts)**
- ✅ POST endpoint at `/api/analytics/batch`
- ✅ JSON array validation (`{ events: Event[] }`)
- ✅ Rate limiting (60 requests/minute per IP)
- ✅ Size limits (max 100 events, 500KB total)
- ✅ Supabase service role integration
- ✅ Automatic visitor table updates
- ✅ Proper error handling & HTTP status codes

### 4. **Database Migration (db/migrations/2025-09-analytics.sql)**
- ✅ `analytics_events` table with all required columns
- ✅ `visitors` table for session tracking
- ✅ `user_visitors` linking table
- ✅ Performance indexes on key columns
- ✅ RLS policies for public access
- ✅ Automatic trigger to update visitor.last_seen
- ✅ Foreign key constraints with proper cascade

### 5. **Cookie Consent (src/components/CookieConsent.tsx)**
- ✅ GDPR-compliant consent banner
- ✅ Accept/Reject analytics options
- ✅ localStorage preference persistence
- ✅ Blocks tracking until consent given
- ✅ Mobile-friendly responsive design
- ✅ Framer Motion animations
- ✅ Integrated with existing layout

### 6. **QR Landing Page (src/app/qr/page.tsx)**
- ✅ Route: `/qr?table=X&token=Y`
- ✅ Automatic `qr_scan` event tracking
- ✅ Table number display and validation
- ✅ Multi-language support ready
- ✅ Professional restaurant-themed UI
- ✅ Menu CTA and loyalty signup buttons
- ✅ Analytics integration

### 7. **SEO & Structured Data (src/components/MenuStructuredData.tsx)**
- ✅ Restaurant JSON-LD schema with menu items
- ✅ Breadcrumb structured data
- ✅ Website search schema
- ✅ Open Graph meta tags
- ✅ Twitter Card support
- ✅ Dynamic content based on menu data
- ✅ Server-side rendering compatible

## 🗃️ **Database Schema**

```sql
-- Analytics Events (main tracking table)
analytics_events (
  id UUID PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  user_id UUID NULL,
  event_name TEXT NOT NULL,
  event_props JSONB DEFAULT '{}',
  url TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Visitor Sessions
visitors (
  visitor_id TEXT PRIMARY KEY,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  device_meta JSONB DEFAULT '{}'
)

-- User-Visitor Links
user_visitors (
  user_id UUID NOT NULL,
  visitor_id TEXT NOT NULL,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, visitor_id)
)
```

## 🚀 **Setup Instructions**

### 1. **Environment Variables**
Add to `.env.local`:
```env
# Required for analytics API
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. **Run Database Migration**
```bash
node scripts/run-analytics-migration.js
```

### 3. **Test Analytics**
1. Visit your site - should see cookie consent banner
2. Accept analytics - `ps_visitor` cookie should be created
3. Navigate pages - `page_view` events should be logged
4. Test QR: `/qr?table=1` - should log `qr_scan` event
5. Check Supabase `analytics_events` table for data

## 📊 **Analytics Events Tracked**

| Event Name | Properties | Trigger |
|------------|------------|---------|
| `page_view` | `path`, `search`, `hash` | Every page load/navigation |
| `time_on_page` | `duration` (seconds) | Page visibility change/unload |
| `qr_scan` | `table`, `token`, `source` | QR landing page load |
| `loyalty_signup_click` | `source`, `table` | Loyalty button click |

## 🔧 **Technical Features**

- **Privacy Compliant**: No tracking without consent
- **Performance Optimized**: Batched requests, minimal overhead
- **Type Safe**: Full TypeScript coverage
- **Error Resilient**: Graceful fallbacks and error handling
- **Mobile Optimized**: Touch-friendly interfaces
- **SEO Enhanced**: Structured data and Open Graph
- **Production Ready**: Rate limiting, validation, security

## 📈 **Analytics Queries**

```sql
-- Most popular pages
SELECT event_props->>'path' as page, COUNT(*) as views
FROM analytics_events 
WHERE event_name = 'page_view'
GROUP BY page ORDER BY views DESC;

-- Visitor activity summary
SELECT visitor_id, 
       COUNT(*) as total_events,
       MIN(created_at) as first_seen,
       MAX(created_at) as last_seen
FROM analytics_events 
GROUP BY visitor_id;

-- QR code effectiveness
SELECT event_props->>'table' as table_number,
       COUNT(*) as scans
FROM analytics_events 
WHERE event_name = 'qr_scan'
GROUP BY table_number ORDER BY scans DESC;

-- Average time on page
SELECT AVG((event_props->>'duration')::int) as avg_seconds
FROM analytics_events 
WHERE event_name = 'time_on_page';
```

## 🎯 **Ready for Production**

All features are production-ready with:
- ✅ GDPR compliance
- ✅ Performance optimization
- ✅ Error handling
- ✅ Security measures
- ✅ Mobile responsiveness
- ✅ SEO optimization
- ✅ Analytics integration

**Commit Message**: "feat(analytics): complete visitor tracking system with consent, QR scans, and SEO"
