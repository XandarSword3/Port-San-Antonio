# Stripe Integration Setup

## Overview
The Port San Antonio Resort menu application includes Stripe payment integration for processing customer orders. This document explains how to set up Stripe for both development and production environments.

## Development Setup

### 1. Get Stripe API Keys
1. Create a Stripe account at [https://stripe.com](https://stripe.com)
2. Go to the Dashboard → Developers → API Keys
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### 2. Update Environment Variables
Update your `.env.local` file with your actual Stripe keys:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

## Production Deployment (Netlify)

### 1. Set Environment Variables in Netlify
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```
STRIPE_PUBLISHABLE_KEY = pk_live_your_production_publishable_key
STRIPE_SECRET_KEY = sk_live_your_production_secret_key
```

### 2. Test Your Setup
- The application will gracefully handle missing Stripe keys during build
- If keys are not configured, users will see: "Payment processing is not configured. Please contact support."
- Once proper keys are set, the full payment flow will work

## Security Notes

### Important Reminders:
- ⚠️ **Never commit actual Stripe keys to version control**
- ⚠️ **Use test keys for development, live keys for production**
- ⚠️ **Keep your secret keys secure and rotate them regularly**

### Current Implementation:
- The API route handles missing keys gracefully to prevent build failures
- Proper error messages are shown to users when payment processing is unavailable
- All payment processing happens server-side for security

## Testing Payment Flow

### Development Testing:
1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

### Production Testing:
1. Use small real transactions initially
2. Monitor Stripe dashboard for successful payments
3. Test refund process through Stripe dashboard

## Current Features

### Implemented:
- ✅ Payment intent creation
- ✅ Stripe Elements integration
- ✅ Error handling and validation
- ✅ Build-time safety for missing keys
- ✅ Mobile-responsive payment forms

### Payment Flow:
1. User adds items to cart
2. User clicks "Pay Now" in cart sidebar
3. Payment modal opens with Stripe Elements
4. User enters card details
5. Payment processes securely through Stripe
6. Success/failure feedback provided
7. Cart clears on successful payment

## Support

If you encounter issues with Stripe integration:
1. Check Netlify build logs
2. Verify environment variables are set correctly
3. Check Stripe dashboard for API errors
4. Ensure webhook endpoints are configured (if using webhooks)

## Next Steps for Production

### Recommended Enhancements:
1. Set up Stripe webhooks for payment confirmation
2. Add receipt email functionality
3. Implement order tracking system
4. Add refund/cancellation handling
5. Set up subscription payments (if needed)

### Compliance:
- Ensure PCI compliance for production
- Review Stripe's security best practices
- Implement proper logging and monitoring
