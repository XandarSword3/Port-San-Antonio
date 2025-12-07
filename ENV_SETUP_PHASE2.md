# Environment Variables Setup for Phase 2 Features

This document outlines all environment variables required for the new monetization features.

## Required Environment Variables

Add these to your `.env.local` file:

### Stripe Configuration

```bash
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_... # Test key: sk_test_..., Live key: sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Test key: pk_test_..., Live key: pk_live_...

# Stripe Webhook Secret (get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product IDs (create in Stripe Dashboard -> Products)
STRIPE_PRODUCT_ID_GOLD=prod_...
STRIPE_PRODUCT_ID_PLATINUM=prod_...
STRIPE_PRODUCT_ID_DIAMOND=prod_...

# Stripe Price IDs (create in Stripe Dashboard -> Products -> Prices)
STRIPE_PRICE_ID_GOLD_MONTHLY=price_...
STRIPE_PRICE_ID_GOLD_ANNUAL=price_...
STRIPE_PRICE_ID_PLATINUM_MONTHLY=price_...
STRIPE_PRICE_ID_PLATINUM_ANNUAL=price_...
STRIPE_PRICE_ID_DIAMOND_MONTHLY=price_...
STRIPE_PRICE_ID_DIAMOND_ANNUAL=price_...
```

### VAPID Keys for Push Notifications

Generate VAPID keys using the `web-push` library:

```bash
npx web-push generate-vapid-keys
```

Then add to `.env.local`:

```bash
# VAPID Keys for Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BG...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@portsanantonio.com
```

### Supabase (Already configured)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # For server-side operations
```

### GitHub (Already configured)

```bash
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
```

## Setup Instructions

### 1. Stripe Setup

1. **Create Stripe Account**: Sign up at https://stripe.com
2. **Get API Keys**: Dashboard -> Developers -> API Keys
3. **Create Products**:
   - Go to Products -> Add Product
   - Create 3 products: Gold, Platinum, Diamond
   - For each product, create 2 prices: Monthly and Annual
4. **Setup Webhook**:
   - Go to Developers -> Webhooks -> Add Endpoint
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to listen for:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy the webhook secret

### 2. Push Notifications Setup

1. **Generate VAPID Keys**:
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```

2. **Add to Environment Variables**: Copy the generated keys to `.env.local`

3. **Update Service Worker**: The service worker (`public/sw.js`) is already configured

### 3. Supabase Database Setup

1. **Run Migrations**: Execute the SQL files in order:
   ```sql
   -- In Supabase SQL Editor:
   -- 1. Run db/migrations/003_monetization_features.sql
   -- 2. Run db/migrations/004_sql_functions.sql
   ```

2. **Enable Row Level Security**: Already configured in migration files

3. **Setup Cron Jobs** (Optional):
   - Go to Database -> Cron Jobs
   - Add job for `update_demand_pricing()` - every 15 minutes
   - Add job for `check_auto_upgrade()` - daily at midnight

### 4. Testing

#### Test Stripe Subscription:
1. Use test mode keys (sk_test_..., pk_test_...)
2. Test card: `4242 4242 4242 4242`, any future date, any CVC

#### Test Push Notifications:
1. Allow notifications in browser
2. Test with `/api/push/send` endpoint

#### Test Dynamic Pricing:
1. Track dish views/orders
2. Check `demand_metrics` table
3. Verify prices update in `dynamic_pricing` table

## Security Notes

- **Never commit `.env.local`** to version control
- Use test mode Stripe keys for development
- Rotate VAPID keys if compromised
- Keep webhook secrets secure
- Use RLS policies to protect user data

## Production Checklist

Before deploying to production:

- [ ] Switch to Stripe live mode keys
- [ ] Update webhook URL to production domain
- [ ] Generate new production VAPID keys
- [ ] Set up Supabase cron jobs
- [ ] Test all payment flows
- [ ] Test push notifications on multiple browsers
- [ ] Monitor Stripe webhook logs
- [ ] Set up error alerting
- [ ] Enable Stripe fraud detection
- [ ] Review RLS policies

## Troubleshooting

### Stripe Issues
- Check webhook logs in Stripe Dashboard
- Verify webhook secret matches
- Ensure test/live mode consistency

### Push Notification Issues
- Check browser notification permissions
- Verify service worker is registered
- Check VAPID keys are correct
- Test in incognito/private window

### Database Issues
- Check RLS policies
- Verify migrations ran successfully
- Check function definitions in Database -> Functions
- Monitor Database -> Logs for errors
