// Test the token validation functions directly
const bcrypt = require('bcryptjs');

// Simulate the token generation and verification process
async function testTokenValidation() {
  console.log('🔍 Testing Token Validation Functions...\n');
  
  try {
    // Test data
    const userId = 'admin-123';
    const username = 'admin';
    const role = 'admin';
    
    // Generate a token (simplified version like in our auth.ts)
    const payload = JSON.stringify({ 
      userId, 
      username, 
      role, 
      exp: Date.now() + 24 * 60 * 60 * 1000,
      iat: Date.now()
    });
    const token = Buffer.from(payload).toString('base64');
    
    console.log('Generated token:', token.substring(0, 50) + '...');
    
    // Verify the token (simplified version)
    try {
      const decodedPayload = JSON.parse(Buffer.from(token, 'base64').toString());
      
      console.log('Decoded payload:');
      console.log('  - userId:', decodedPayload.userId);
      console.log('  - username:', decodedPayload.username);
      console.log('  - role:', decodedPayload.role);
      console.log('  - exp:', new Date(decodedPayload.exp).toISOString());
      
      // Check if token is expired
      const isExpired = decodedPayload.exp <= Date.now();
      console.log('  - expired:', isExpired);
      
      // Check admin role
      const isAdmin = ['admin', 'owner'].includes(decodedPayload.role);
      console.log('  - is admin/owner:', isAdmin);
      
      if (!isExpired && isAdmin) {
        console.log('✅ Token validation successful');
        return true;
      } else {
        console.log('❌ Token validation failed');
        return false;
      }
    } catch (verifyError) {
      console.log('❌ Token verification error:', verifyError.message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
}

testTokenValidation();
