// Test the full authentication + auto-commit flow
async function testFullFlow() {
  try {
    console.log('🔐 Step 1: Authenticating admin user...\n');
    
    // First, login to get the auth cookie
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    console.log('Login Response Status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const loginError = await loginResponse.json();
      console.log('❌ Login failed:', loginError);
      return;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful:', loginResult);

    // Extract the cookie from the response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies set:', cookies);

    console.log('\n🔄 Step 2: Testing Auto-Commit with authentication...\n');

    // Sample menu data for testing
    const testMenuData = {
      dishes: [
        {
          id: "test-dish-" + Date.now(),
          name: "Auto-commit Test Dish",
          description: "Testing the auto-commit functionality",
          price: 15.99,
          category: "appetizers",
          available: true,
          dietary: [],
          image: ""
        }
      ],
      categories: ["appetizers", "mains", "desserts"],
      ads: []
    };

    // Test the auto-commit endpoint with cookies
    const autoCommitResponse = await fetch('http://localhost:3001/api/auto-commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || '' // Include the auth cookie
      },
      body: JSON.stringify({ menuData: testMenuData })
    });

    console.log('Auto-commit Response Status:', autoCommitResponse.status);
    
    if (autoCommitResponse.ok) {
      const result = await autoCommitResponse.json();
      console.log('✅ Auto-commit successful:', result);
    } else {
      const error = await autoCommitResponse.json();
      console.log('❌ Auto-commit failed:', error);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testFullFlow();
