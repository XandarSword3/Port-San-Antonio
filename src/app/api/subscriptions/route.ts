import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
} from '@/lib/stripe/subscriptions';
import type { MembershipTier } from '@/types/membership';

/**
 * POST /api/subscriptions/create
 * Create new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, tier, billingPeriod, paymentMethodId } = await request.json();

    if (!userId || !email || !tier || !billingPeriod || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe subscription
    const { subscriptionId, clientSecret } = await createSubscription({
      userId,
      email,
      tier: tier as MembershipTier,
      billingPeriod,
      paymentMethodId,
    });

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // Save to database
    const plan = require('@/lib/membershipConfig').MEMBERSHIP_PLANS[tier];
    
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      tier,
      status: 'active',
      billing_period: billingPeriod,
      amount: billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice,
      stripe_subscription_id: subscriptionId,
      start_date: new Date().toISOString(),
      renew_date: new Date(Date.now() + (billingPeriod === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (error) {
      console.error('Error saving subscription to database:', error);
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      clientSecret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscriptions/update
 * Update existing subscription
 */
export async function PATCH(request: NextRequest) {
  try {
    const { subscriptionId, newTier, newBillingPeriod } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId required' },
        { status: 400 }
      );
    }

    // Update Stripe subscription
    const updated = await updateSubscription({
      subscriptionId,
      newTier: newTier as MembershipTier | undefined,
      newBillingPeriod,
    });

    // Update database
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    
    await supabase
      .from('subscriptions')
      .update({
        tier: newTier || undefined,
        billing_period: newBillingPeriod || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: updated,
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscriptions/cancel
 * Cancel subscription
 */
export async function DELETE(request: NextRequest) {
  try {
    const { subscriptionId, cancelImmediately } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId required' },
        { status: 400 }
      );
    }

    // Cancel in Stripe
    const cancelled = await cancelSubscription(subscriptionId, cancelImmediately);

    // Update database
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    
    await supabase
      .from('subscriptions')
      .update({
        status: cancelImmediately ? 'cancelled' : 'active',
        end_date: cancelled.cancel_at ? new Date(cancelled.cancel_at * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: cancelled,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/subscriptions/resume
 * Resume cancelled subscription
 */
export async function PUT(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscriptionId required' },
        { status: 400 }
      );
    }

    // Resume in Stripe
    const resumed = await resumeSubscription(subscriptionId);

    // Update database
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }
    
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        end_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: resumed,
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json(
      { error: 'Failed to resume subscription' },
      { status: 500 }
    );
  }
}
