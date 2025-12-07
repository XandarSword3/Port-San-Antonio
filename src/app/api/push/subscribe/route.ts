import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/push/subscribe
 * Subscribe user to push notifications
 */
export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // Save subscription to database
    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: userId || null,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      last_used: new Date().toISOString(),
    });

    if (error) {
      console.error('Error saving push subscription:', error);
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in push subscribe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
