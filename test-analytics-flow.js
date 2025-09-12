// Test script to debug analytics flow
console.log('=== Analytics Flow Debug ===');

// Test 1: Check if consent is working
console.log('\n1. Checking consent...');
if (typeof window !== 'undefined') {
  const cookieConsent = localStorage.getItem('cookie_consent');
  const psConsent = localStorage.getItem('ps_consent');
  console.log('cookie_consent:', cookieConsent);
  console.log('ps_consent:', psConsent);
  
  if (cookieConsent) {
    try {
      const parsed = JSON.parse(cookieConsent);
      console.log('Analytics consent:', parsed.analytics);
    } catch (e) {
      console.log('Error parsing cookie_consent:', e);
    }
  }
} else {
  console.log('Not in browser environment');
}

// Test 2: Check if tracker is working
console.log('\n2. Testing tracker...');
if (typeof window !== 'undefined') {
  // Simulate a page view event
  fetch('/api/analytics/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      events: [{
        visitorId: 'test-visitor-' + Date.now(),
        eventName: 'page_view',
        props: { path: '/test', test: true },
        url: window.location.href,
        userAgent: navigator.userAgent,
        ts: new Date().toISOString()
      }]
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Analytics batch response:', data);
  })
  .catch(error => {
    console.error('Analytics batch error:', error);
  });
} else {
  console.log('Not in browser environment');
}

// Test 3: Check database data
console.log('\n3. Testing database fetch...');
if (typeof window !== 'undefined') {
  fetch('/api/analytics')
    .then(response => response.json())
    .then(data => {
      console.log('Database analytics data:', data);
    })
    .catch(error => {
      console.error('Database fetch error:', error);
    });
} else {
  console.log('Not in browser environment');
}

console.log('\n=== End Debug ===');
