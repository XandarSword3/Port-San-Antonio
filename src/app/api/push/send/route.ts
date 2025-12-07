import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import webpush from 'web-push';

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@portsanantonio.com';

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

/**
 * POST /api/push/send
 * Send push notification to user
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, payload } = await request.json();

    if (!userId || !payload) {
      return NextResponse.json(
        { error: 'userId and payload required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user's push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, keys')
      .eq('user_id', userId);

    if (error || !subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for user' },
        { status: 404 }
      );
    }

    // Send notification to all user's devices
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: sub.keys,
        };

        return await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(payload)
        );
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failedCount = results.filter((r) => r.status === 'rejected').length;

    // Clean up expired subscriptions
    const failedSubscriptions = subscriptions.filter((_, index) => {
      return results[index].status === 'rejected';
    });

    if (failedSubscriptions.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedSubscriptions.map(s => s.endpoint));
    }

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
