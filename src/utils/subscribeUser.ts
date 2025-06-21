const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function isValidPushSubscription(subscription: PushSubscription | null): subscription is PushSubscription {
  return (
    subscription !== null &&
    typeof subscription.endpoint === 'string' &&
    subscription.endpoint.length > 0 &&
    typeof subscription.toJSON === 'function'
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export async function subscribeUser(): Promise<PushSubscription | null> {
  console.log('📡 Starting push subscription flow...');

  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasPushManager = 'PushManager' in window;

  if (!hasServiceWorker || !hasPushManager) {
    console.error('🚫 Push notifications are not supported in this browser.');
    alert('Push notifications are not supported in your browser. Please try Chrome, Firefox, or Edge.');
    return null;
  }

  if (!VAPID_PUBLIC_KEY || typeof VAPID_PUBLIC_KEY !== 'string') {
    console.error('❌ VITE_VAPID_PUBLIC_KEY is not defined or invalid.');
    alert('Missing VAPID key. Push notifications cannot be enabled.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service worker registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('🔕 Notification permission denied by user.');
      alert('Please enable notifications in your browser settings to continue.');
      return null;
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('📦 Existing push subscription found.');
      if (isValidPushSubscription(existingSubscription)) {
        return existingSubscription;
      } else {
        console.warn('⚠️ Existing subscription is malformed.');
        return null;
      }
    }

    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    if (!isValidPushSubscription(newSubscription)) {
      console.error('❌ New push subscription structure is invalid.');
      return null;
    }

    console.log('✅ New push subscription created:', newSubscription);
    return newSubscription;
  } catch (error) {
    console.error('❌ Failed during push subscription process:', error);
    alert('Failed to enable push notifications. Please reload the page and try again.');
    return null;
  }
}
