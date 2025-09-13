import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
// Handle case where key might not be available during build
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';
const stripe = stripeSecretKey.startsWith('sk_test_placeholder') 
  ? null 
  : new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const { amount, currency = 'usd' } = await request.json();

    // Validate amount
    if (!amount || amount < 50) { // Minimum 50 cents
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $0.50' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      metadata: {
        integration_check: 'accept_a_payment',
        restaurant: 'Port Antonio',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    
    return NextResponse.json(
      { error: 'Payment processing unavailable' },
      { status: 500 }
    );
  }
}
