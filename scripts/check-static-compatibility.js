#!/usr/bin/env node

/**
 * Check Static Export Compatibility
 * 
 * This script checks if the app is compatible with static export for GitHub Pages.
 * Note: GitHub Pages doesn't support API routes - admin functionality will only work on Vercel.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking static export compatibility...\n');

// Check for API routes
const apiDir = path.join(__dirname, '../src/app/api');
const hasApiRoutes = fs.existsSync(apiDir);

if (hasApiRoutes) {
  const apiRoutes = fs.readdirSync(apiDir, { recursive: true })
    .filter(file => file.endsWith('route.ts') || file.endsWith('route.js'));
  
  console.log('⚠️  Warning: API routes detected (will not work on GitHub Pages):');
  apiRoutes.forEach(route => console.log(`   - ${route}`));
  console.log('\n📝 Note: Admin functionality requires server-side API routes.');
  console.log('   - GitHub Pages: Static hosting only (admin won\'t work)');
  console.log('   - Vercel: Full functionality with API routes (admin works)');
  console.log('   - Consider using GitHub Pages for demo/preview and Vercel for production\n');
}

// Check next.config.js
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (nextConfig.includes("output: 'export'")) {
    console.log('✅ Next.js configured for static export');
  } else {
    console.log('❌ Next.js not configured for static export');
  }
  
  if (nextConfig.includes('unoptimized: true')) {
    console.log('✅ Images configured for static export');
  } else {
    console.log('❌ Images not configured for static export');
  }
}

console.log('\n🚀 For GitHub Pages deployment:');
console.log('   1. Menu browsing and filtering will work');
console.log('   2. Cart functionality will work (client-side)');
console.log('   3. Admin features will NOT work (requires API routes)');
console.log('\n💡 Recommendation: Use Vercel for full functionality');
