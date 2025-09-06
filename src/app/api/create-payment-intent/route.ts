import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
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
        restaurant: 'Port San Antonio',
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
