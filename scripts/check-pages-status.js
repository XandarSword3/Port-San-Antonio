#!/usr/bin/env node

/**
 * GitHub Pages Status Checker
 * 
 * This script helps diagnose GitHub Pages configuration issues.
 */

const https = require('https');

const REPO_OWNER = 'XandarSword3';
const REPO_NAME = 'Port-San-Antonio';

function checkPagesStatus() {
  console.log('🔍 Checking GitHub Pages status...\n');
  
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/pages`,
    method: 'GET',
    headers: {
      'User-Agent': 'Pages-Checker'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const pages = JSON.parse(data);
        console.log('✅ GitHub Pages is enabled!');
        console.log(`📍 URL: ${pages.html_url}`);
        console.log(`🔧 Source: ${pages.source.branch} branch, ${pages.source.path} path`);
        console.log(`📊 Status: ${pages.status}`);
        
        if (pages.cname) {
          console.log(`🌐 Custom domain: ${pages.cname}`);
        }
      } else if (res.statusCode === 404) {
        console.log('❌ GitHub Pages is NOT enabled for this repository');
        console.log('\n📋 To fix this:');
        console.log('1. Go to https://github.com/XandarSword3/Port-San-Antonio/settings/pages');
        console.log('2. Under "Source", select "GitHub Actions"');
        console.log('3. Save the configuration');
        console.log('4. Run the workflow again');
      } else {
        console.log(`⚠️  Unexpected response: ${res.statusCode}`);
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error checking Pages status:', err.message);
    console.log('\n💡 This might be a network issue or API rate limiting.');
  });

  req.end();
}

// Check if the expected Pages URL is accessible
function checkPagesURL() {
  const pagesURL = `https://${REPO_OWNER.toLowerCase()}.github.io/${REPO_NAME}/`;
  
  console.log(`\n🌐 Checking if Pages site is accessible: ${pagesURL}`);
  
  const options = {
    hostname: `${REPO_OWNER.toLowerCase()}.github.io`,
    path: `/${REPO_NAME}/`,
    method: 'HEAD',
    headers: {
      'User-Agent': 'Pages-Checker'
    }
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Pages site is accessible!');
    } else if (res.statusCode === 404) {
      console.log('❌ Pages site is not accessible (404)');
      console.log('   This usually means Pages is not enabled or not deployed yet.');
    } else {
      console.log(`⚠️  Site returned status: ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.log('❌ Pages site is not accessible');
    console.log('   This usually means Pages is not enabled or not deployed yet.');
  });

  req.end();
}

// Run checks
checkPagesStatus();
setTimeout(checkPagesURL, 2000); // Wait 2 seconds between checks
