/**
 * Test script to verify backend API connectivity
 * Run with: npm run test:api
 */

const API_URL = 'https://us-central1-unops-cameron.cloudfunctions.net/api-function';

async function testBackendAPI() {
  console.log('🔍 Testing backend API connection...');
  console.log(`📡 Endpoint: ${API_URL}`);
  
  try {
    console.log('⏳ Sending request...');
    const startTime = Date.now();
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`⚡ Response time: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received successfully');
    console.log(`📦 Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
    
    if (Array.isArray(data)) {
      console.log(`📋 Number of opportunities: ${data.length}`);
      if (data.length > 0) {
        console.log('🔍 Sample opportunity fields:');
        const sample = data[0];
        Object.keys(sample).forEach(key => {
          console.log(`   - ${key}: ${typeof sample[key]}`);
        });
      }
    } else {
      console.log('📝 Single opportunity object received');
      console.log('🔍 Object fields:');
      Object.keys(data).forEach(key => {
        console.log(`   - ${key}: ${typeof data[key]}`);
      });
    }
    
    return { success: true, data, count: Array.isArray(data) ? data.length : 1 };
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('   💡 This might be a network connectivity issue');
    }
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 UNOPS Funding Gateway - Backend API Test');
  console.log('═'.repeat(50));
  
  const result = await testBackendAPI();
  
  console.log('═'.repeat(50));
  if (result.success) {
    console.log('🎉 Backend API is working correctly!');
    console.log(`📊 Total opportunities available: ${result.count}`);
  } else {
    console.log('🚨 Backend API test failed');
    console.log('💡 Possible issues:');
    console.log('   - Google Cloud Function is not deployed');
    console.log('   - Network connectivity issues');
    console.log('   - CORS configuration problems');
    console.log('   - Database (Datastore) is empty or inaccessible');
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

export { testBackendAPI };
