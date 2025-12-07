/**
 * PWA Push Notifications System
 * Handles web push notifications for:
 * - Order status updates
 * - Special offers & promotions
 * - Reservation confirmations
 * - Loyalty rewards
 * - Spin wheel opportunities
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Request permission for push notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Check if push notifications are supported
 */
export function isPushSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToPush(userId?: string): Promise<PushSubscriptionData | null> {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    // Request permission first
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }

    // Convert subscription to our format
    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!),
      },
    };

    // Save subscription to backend
    await savePushSubscription(subscriptionData, userId);

    console.log('✅ Push subscription created');
    return subscriptionData;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove from backend
      await removePushSubscription(subscription.endpoint);
      
      console.log('✅ Push subscription removed');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
}

/**
 * Check if user is subscribed to push
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking push subscription:', error);
    return false;
  }
}

/**
 * Save push subscription to backend
 */
async function savePushSubscription(subscription: PushSubscriptionData, userId?: string): Promise<void> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push subscription');
    }
  } catch (error) {
    console.error('Error saving push subscription:', error);
    throw error;
  }
}

/**
 * Remove push subscription from backend
 */
async function removePushSubscription(endpoint: string): Promise<void> {
  try {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove push subscription');
    }
  } catch (error) {
    console.error('Error removing push subscription:', error);
    throw error;
  }
}

/**
 * Send notification to user (server-side function)
 */
export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        payload,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

/**
 * Show local notification (doesn't require push subscription)
 */
export async function showLocalNotification(payload: NotificationPayload): Promise<void> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const notificationOptions: NotificationOptions & { actions?: any } = {
      body: payload.body,
      icon: payload.icon || '/images/icon-192x192.png',
      badge: payload.badge || '/images/badge-72x72.png',
      tag: payload.tag,
      data: payload.data,
      requireInteraction: false,
      silent: false,
    };
    
    if (payload.actions) {
      notificationOptions.actions = payload.actions;
    }
    
    await registration.showNotification(payload.title, notificationOptions);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

/**
 * Predefined notification templates
 */
export const NOTIFICATION_TEMPLATES = {
  orderPlaced: (orderNumber: string): NotificationPayload => ({
    title: '✅ Order Confirmed',
    body: `Your order #${orderNumber} has been placed successfully!`,
    icon: '/images/icon-192x192.png',
    tag: `order-${orderNumber}`,
    data: { type: 'order_placed', orderNumber },
    actions: [
      { action: 'view', title: 'View Order' },
      { action: 'close', title: 'Close' },
    ],
  }),

  orderPreparing: (orderNumber: string): NotificationPayload => ({
    title: '👨‍🍳 Order in Progress',
    body: `Your order #${orderNumber} is being prepared by our chefs!`,
    icon: '/images/icon-192x192.png',
    tag: `order-${orderNumber}`,
    data: { type: 'order_preparing', orderNumber },
  }),

  orderReady: (orderNumber: string): NotificationPayload => ({
    title: '🎉 Order Ready!',
    body: `Your order #${orderNumber} is ready for pickup or on its way!`,
    icon: '/images/icon-192x192.png',
    tag: `order-${orderNumber}`,
    data: { type: 'order_ready', orderNumber },
  }),

  orderDelivered: (orderNumber: string): NotificationPayload => ({
    title: '📦 Order Delivered',
    body: `Your order #${orderNumber} has been delivered. Enjoy your meal!`,
    icon: '/images/icon-192x192.png',
    tag: `order-${orderNumber}`,
    data: { type: 'order_delivered', orderNumber },
    actions: [
      { action: 'rate', title: 'Rate Order' },
      { action: 'close', title: 'Close' },
    ],
  }),

  specialOffer: (discount: number, expiresIn: string): NotificationPayload => ({
    title: `🎁 ${discount}% OFF Special Offer!`,
    body: `Use your exclusive discount before it expires in ${expiresIn}!`,
    icon: '/images/icon-192x192.png',
    image: '/images/promo-banner.jpg',
    tag: 'special-offer',
    data: { type: 'special_offer', discount },
    actions: [
      { action: 'order', title: 'Order Now' },
      { action: 'close', title: 'Later' },
    ],
  }),

  loyaltyReward: (points: number, reward: string): NotificationPayload => ({
    title: '⭐ Loyalty Reward Earned!',
    body: `You earned ${points} points! Redeem for: ${reward}`,
    icon: '/images/icon-192x192.png',
    tag: 'loyalty-reward',
    data: { type: 'loyalty_reward', points, reward },
    actions: [
      { action: 'redeem', title: 'Redeem Now' },
      { action: 'close', title: 'Later' },
    ],
  }),

  spinAvailable: (spins: number): NotificationPayload => ({
    title: '🎰 Spin the Wheel!',
    body: `You have ${spins} free ${spins === 1 ? 'spin' : 'spins'} available. Try your luck!`,
    icon: '/images/icon-192x192.png',
    tag: 'spin-wheel',
    data: { type: 'spin_available', spins },
    actions: [
      { action: 'spin', title: 'Spin Now' },
      { action: 'close', title: 'Later' },
    ],
  }),

  achievementUnlocked: (achievement: string, points: number): NotificationPayload => ({
    title: '🏆 Achievement Unlocked!',
    body: `${achievement} - Earned ${points} bonus points!`,
    icon: '/images/icon-192x192.png',
    tag: 'achievement',
    data: { type: 'achievement', achievement, points },
  }),

  reservationConfirmed: (date: string, time: string, guests: number): NotificationPayload => ({
    title: '📅 Reservation Confirmed',
    body: `Table for ${guests} on ${date} at ${time}. See you soon!`,
    icon: '/images/icon-192x192.png',
    tag: 'reservation',
    data: { type: 'reservation', date, time, guests },
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'close', title: 'Close' },
    ],
  }),

  reservationReminder: (hours: number): NotificationPayload => ({
    title: '⏰ Reservation Reminder',
    body: `Your reservation is in ${hours} hours. We're excited to see you!`,
    icon: '/images/icon-192x192.png',
    tag: 'reservation-reminder',
    data: { type: 'reservation_reminder', hours },
  }),

  birthdayReward: (reward: string): NotificationPayload => ({
    title: '🎂 Happy Birthday!',
    body: `Enjoy your special birthday reward: ${reward}`,
    icon: '/images/icon-192x192.png',
    image: '/images/birthday-banner.jpg',
    tag: 'birthday',
    data: { type: 'birthday', reward },
    actions: [
      { action: 'claim', title: 'Claim Reward' },
      { action: 'close', title: 'Thanks!' },
    ],
  }),

  membershipUpgrade: (tier: string, benefits: string): NotificationPayload => ({
    title: `✨ Upgraded to ${tier}!`,
    body: `Congratulations! You now have access to: ${benefits}`,
    icon: '/images/icon-192x192.png',
    tag: 'membership-upgrade',
    data: { type: 'membership_upgrade', tier },
  }),
};

/**
 * Utility: Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Utility: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Test notification (for debugging)
 */
export async function sendTestNotification(): Promise<void> {
  await showLocalNotification({
    title: '🧪 Test Notification',
    body: 'Push notifications are working correctly!',
    icon: '/images/icon-192x192.png',
    tag: 'test',
  });
}
