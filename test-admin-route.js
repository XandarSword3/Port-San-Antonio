// Test admin route accessibility
async function testAdminRoute() {
  try {
    console.log('🔍 Testing Admin Route Accessibility...\n');
    
    // Test the main admin page
    const adminResponse = await fetch('http://localhost:3001/admin');
    console.log('Admin page status:', adminResponse.status);
    
    if (adminResponse.ok) {
      console.log('✅ Admin page is accessible');
    } else {
      console.log('❌ Admin page failed:', adminResponse.statusText);
    }
    
    // Test the health check endpoint
    const healthResponse = await fetch('http://localhost:3001/admin/api/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAdminRoute();
