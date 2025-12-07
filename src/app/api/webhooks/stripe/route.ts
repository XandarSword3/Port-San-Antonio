import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { verifyWebhookSignature, handleWebhookEvent } from '@/lib/stripe/subscriptions';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Handle different event types
    await handleWebhookEvent(event, async (type, data) => {
      switch (type) {
        case 'subscription_created':
        case 'subscription_updated': {
          const subscription = data as Stripe.Subscription;
          const userId = subscription.metadata.userId;
          const tier = subscription.metadata.tier;

          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              tier,
              status: subscription.status,
              billing_period: subscription.metadata.billingPeriod,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              start_date: new Date(subscription.start_date * 1000).toISOString(),
              renew_date: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
              end_date: subscription.canceled_at
                ? new Date(subscription.canceled_at * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            });
          break;
        }

        case 'subscription_deleted': {
          const subscription = data as Stripe.Subscription;
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              end_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);
          break;
        }

        case 'invoice_paid': {
          const invoice = data as Stripe.Invoice;
          console.log('Invoice paid:', invoice.id);
          // TODO: Send confirmation notification
          break;
        }

        case 'invoice_payment_failed': {
          const invoice = data as Stripe.Invoice;
          console.log('Payment failed:', invoice.id);
          // TODO: Send payment failed notification
          break;
        }
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
