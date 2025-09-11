// Test if legal pages are set up in Supabase
const fetch = require('node-fetch');

async function testLegalData() {
  try {
    // Test the deployed API
    const response = await fetch('https://port-antonio.vercel.app/api/legal');
    const data = await response.json();
    
    console.log('🔍 Legal Pages API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (data.legalPages && data.legalPages.length > 0) {
      console.log('✅ Legal pages found in database');
      console.log(`📄 Found ${data.legalPages.length} legal page(s)`);
    } else {
      console.log('❌ No legal pages found in database');
      console.log('🔧 Need to populate legal_pages table in Supabase');
    }
    
  } catch (error) {
    console.error('❌ Error testing legal data:', error.message);
  }
}

testLegalData();
