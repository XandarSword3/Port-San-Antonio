/**
 * Stripe Subscription Management
 * Handles membership tier subscriptions with Stripe
 */

import Stripe from 'stripe';
import { MEMBERSHIP_PLANS } from './membershipConfig';
import type { MembershipTier } from '@/types/membership';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export interface CreateSubscriptionParams {
  userId: string;
  email: string;
  tier: MembershipTier;
  billingPeriod: 'monthly' | 'annual';
  paymentMethodId: string;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  newTier?: MembershipTier;
  newBillingPeriod?: 'monthly' | 'annual';
}

/**
 * Stripe Product IDs (create these in your Stripe Dashboard)
 * Format: prod_XXXXXXXXXXXX
 */
const STRIPE_PRODUCT_IDS: Record<MembershipTier, string> = {
  free: '', // No product needed for free tier
  gold: process.env.STRIPE_PRODUCT_ID_GOLD || 'prod_gold',
  platinum: process.env.STRIPE_PRODUCT_ID_PLATINUM || 'prod_platinum',
  diamond: process.env.STRIPE_PRODUCT_ID_DIAMOND || 'prod_diamond',
};

/**
 * Stripe Price IDs (create these in your Stripe Dashboard)
 * Format: price_XXXXXXXXXXXX
 */
const STRIPE_PRICE_IDS: Record<MembershipTier, { monthly: string; annual: string }> = {
  free: { monthly: '', annual: '' },
  gold: {
    monthly: process.env.STRIPE_PRICE_ID_GOLD_MONTHLY || 'price_gold_monthly',
    annual: process.env.STRIPE_PRICE_ID_GOLD_ANNUAL || 'price_gold_annual',
  },
  platinum: {
    monthly: process.env.STRIPE_PRICE_ID_PLATINUM_MONTHLY || 'price_platinum_monthly',
    annual: process.env.STRIPE_PRICE_ID_PLATINUM_ANNUAL || 'price_platinum_annual',
  },
  diamond: {
    monthly: process.env.STRIPE_PRICE_ID_DIAMOND_MONTHLY || 'price_diamond_monthly',
    annual: process.env.STRIPE_PRICE_ID_DIAMOND_ANNUAL || 'price_diamond_annual',
  },
};

/**
 * Create or get Stripe customer
 */
async function getOrCreateCustomer(userId: string, email: string): Promise<string> {
  // Check if customer already exists
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0].id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  return customer.id;
}

/**
 * Create subscription
 */
export async function createSubscription(
  params: CreateSubscriptionParams
): Promise<{ subscriptionId: string; clientSecret: string }> {
  try {
    const { userId, email, tier, billingPeriod, paymentMethodId } = params;

    if (tier === 'free') {
      throw new Error('Cannot create subscription for free tier');
    }

    // Get or create customer
    const customerId = await getOrCreateCustomer(userId, email);

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Get price ID
    const priceId = STRIPE_PRICE_IDS[tier][billingPeriod];

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId,
        tier,
        billingPeriod,
      },
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret!,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

/**
 * Update subscription (change tier or billing period)
 */
export async function updateSubscription(
  params: UpdateSubscriptionParams
): Promise<Stripe.Subscription> {
  try {
    const { subscriptionId, newTier, newBillingPeriod } = params;

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!newTier && !newBillingPeriod) {
      throw new Error('Must specify newTier or newBillingPeriod');
    }

    // Determine new price
    const tier = newTier || (subscription.metadata.tier as MembershipTier);
    const billingPeriod = newBillingPeriod || subscription.metadata.billingPeriod;
    const newPriceId = STRIPE_PRICE_IDS[tier][billingPeriod as 'monthly' | 'annual'];

    // Update subscription
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
      metadata: {
        ...subscription.metadata,
        tier,
        billingPeriod,
      },
    });

    return updated;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  cancelImmediately: boolean = false
): Promise<Stripe.Subscription> {
  try {
    if (cancelImmediately) {
      // Cancel immediately
      return await stripe.subscriptions.cancel(subscriptionId);
    } else {
      // Cancel at period end
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Resume subscription (undo cancel_at_period_end)
 */
export async function resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice', 'customer'],
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

/**
 * Get customer's subscriptions
 */
export async function getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.latest_invoice'],
    });

    return subscriptions.data;
  } catch (error) {
    console.error('Error fetching customer subscriptions:', error);
    throw error;
  }
}

/**
 * Get upcoming invoice (preview next charge)
 */
export async function getUpcomingInvoice(customerId: string): Promise<Stripe.Invoice | null> {
  try {
    return await stripe.invoices.retrieveUpcoming({
      customer: customerId,
    });
  } catch (error) {
    // No upcoming invoice
    return null;
  }
}

/**
 * Get payment methods for customer
 */
export async function getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
}

/**
 * Update default payment method
 */
export async function updateDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  } catch (error) {
    console.error('Error updating default payment method:', error);
    throw error;
  }
}

/**
 * Create setup intent (for adding payment method without charging)
 */
export async function createSetupIntent(customerId: string): Promise<string> {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return setupIntent.client_secret!;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
}

/**
 * Handle webhook events from Stripe
 */
export async function handleWebhookEvent(
  event: Stripe.Event,
  onEvent: (type: string, data: any) => Promise<void>
): Promise<void> {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await onEvent('subscription_created', event.data.object);
        break;

      case 'customer.subscription.updated':
        await onEvent('subscription_updated', event.data.object);
        break;

      case 'customer.subscription.deleted':
        await onEvent('subscription_deleted', event.data.object);
        break;

      case 'invoice.paid':
        await onEvent('invoice_paid', event.data.object);
        break;

      case 'invoice.payment_failed':
        await onEvent('invoice_payment_failed', event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await onEvent('trial_will_end', event.data.object);
        break;

      case 'payment_method.attached':
        await onEvent('payment_method_attached', event.data.object);
        break;

      case 'payment_method.detached':
        await onEvent('payment_method_detached', event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * Get customer portal URL (for managing subscription)
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Calculate proration amount for subscription change
 */
export async function calculateProration(
  subscriptionId: string,
  newPriceId: string
): Promise<number> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const proration = await stripe.invoices.retrieveUpcoming({
      customer: subscription.customer as string,
      subscription: subscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      subscription_proration_behavior: 'create_prorations',
    });

    return proration.amount_due / 100; // Convert cents to dollars
  } catch (error) {
    console.error('Error calculating proration:', error);
    return 0;
  }
}

/**
 * Apply coupon to subscription
 */
export async function applyCoupon(
  subscriptionId: string,
  couponId: string
): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.update(subscriptionId, {
      coupon: couponId,
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw error;
  }
}

/**
 * Create coupon
 */
export async function createCoupon(
  params: {
    percentOff?: number;
    amountOff?: number;
    duration: 'forever' | 'once' | 'repeating';
    durationInMonths?: number;
    maxRedemptions?: number;
    name?: string;
  }
): Promise<Stripe.Coupon> {
  try {
    return await stripe.coupons.create(params);
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
}
