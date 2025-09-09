// Test the admin login API
async function testLoginAPI() {
  try {
    console.log('🚀 Testing Admin Login API...\n');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      console.log('✅ Admin authentication API is working!');
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testLoginAPI();
