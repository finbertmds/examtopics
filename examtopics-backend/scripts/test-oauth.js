#!/usr/bin/env node

/**
 * Test OAuth Flow Script
 * This script helps test the OAuth configuration
 */

const https = require('https');
const http = require('http');
const { createHash, randomBytes } = require('node:crypto');

// Configuration
const config = {
  development: {
    backendUrl: 'http://localhost:3001',
    frontendUrl: 'http://localhost:3000',
    callbackUrl: 'http://localhost:3001/auth/google/callback'
  },
  production: {
    backendUrl: 'https://examtopics-backend-latest.onrender.com',
    frontendUrl: 'https://examtopics-practice.onrender.com',
    callbackUrl: 'https://examtopics-backend-latest.onrender.com/auth/google/callback'
  }
};

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

console.log(`🔧 Testing OAuth Configuration for ${env.toUpperCase()}`);
console.log('=' .repeat(50));

// Test functions
const testBackendHealth = () => {
  return new Promise((resolve, reject) => {
    const url = `${currentConfig.backendUrl}/health`;
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Backend health check: PASSED');
          } else {
            console.log('❌ Backend health check: FAILED');
            console.log(`   Error: ${response.error}`);
          }
          resolve(response);
        } catch (error) {
          console.log('❌ Backend health check: FAILED');
          console.log(`   Error: ${error.message}`);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.log('❌ Backend health check: FAILED');
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
  });
};

const testOAuthEndpoint = () => {
  return new Promise((resolve, reject) => {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const url = `${currentConfig.backendUrl}/auth/google?${new URLSearchParams({ challenge })}`;
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      if (res.statusCode === 302) {
        console.log('✅ OAuth endpoint: PASSED');
        console.log(`   Redirects to: ${new URL(res.headers.location, url).origin}`);
      } else {
        console.log('❌ OAuth endpoint: FAILED');
        console.log(`   Status: ${res.statusCode}`);
      }
      resolve(res);
    }).on('error', (error) => {
      console.log('❌ OAuth endpoint: FAILED');
      console.log(`   Error: ${error.message}`);
      reject(error);
    });
  });
};

const validateUrls = () => {
  console.log('🔍 Validating URLs:');
  console.log(`   Backend URL: ${currentConfig.backendUrl}`);
  console.log(`   Frontend URL: ${currentConfig.frontendUrl}`);
  console.log(`   Callback URL: ${currentConfig.callbackUrl}`);
  
  // Validate callback URL format
  if (currentConfig.callbackUrl.includes('/auth/google/callback')) {
    console.log('✅ Callback URL format: PASSED');
  } else {
    console.log('❌ Callback URL format: FAILED');
    console.log('   Should end with: /auth/google/callback');
  }
  
  // Validate protocol
  if (env === 'production' && !currentConfig.backendUrl.startsWith('https')) {
    console.log('⚠️  Production should use HTTPS');
  }
  
  console.log('');
};

const runTests = async () => {
  try {
    validateUrls();
    await testBackendHealth();
    await testOAuthEndpoint();
    
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Set up Google Cloud OAuth credentials');
    console.log('2. Configure environment variables');
    console.log('3. Test OAuth flow manually');
    console.log('4. Check Google Cloud Console for redirect_uri_mismatch errors');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

// Run tests
runTests();
