/**
 * Quick test to check if the prediction system is working
 */

import http from 'http';

// Test if server is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/predictions/dashboard',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('🎉 AI Predictions API is working!');
        console.log(`📊 Found ${result.summary.totalProducts} products`);
        console.log(`🚨 Critical alerts: ${result.summary.criticalAlerts}`);
        console.log(`📈 Sales growth: ${result.summary.salesGrowth}%`);
      } else {
        console.log('❌ API returned error:', result.message);
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Server not running or not accessible');
  console.log('🔧 Please start the server with: node server.js');
});

req.end();
