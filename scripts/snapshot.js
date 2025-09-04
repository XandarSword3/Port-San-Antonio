const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureSnapshot() {
  console.log('🎬 Starting headless browser snapshot...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const logs = [];
  const errors = [];
  
  // Capture console logs
  page.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Capture errors
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });
  
  try {
    console.log('📸 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    
    // Wait a bit for any animations to complete
    await page.waitForTimeout(2000);
    
    // Capture screenshot
    console.log('📷 Taking screenshot...');
    await page.screenshot({ 
      path: 'debug/home.png',
      fullPage: true 
    });
    
    // Capture HTML
    console.log('📄 Capturing HTML...');
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync('debug/home-html.txt', html);
    
    // Capture network HAR
    console.log('🌐 Capturing network activity...');
    await context.route('**/*', route => route.continue());
    const har = await context.storageState();
    fs.writeFileSync('debug/net-har.json', JSON.stringify(har, null, 2));
    
    // Check for blank page indicators
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasContent = bodyText.length > 100;
    const hasErrors = errors.length > 0;
    
    console.log(`📊 Page analysis:`);
    console.log(`   - Content length: ${bodyText.length} characters`);
    console.log(`   - Has content: ${hasContent}`);
    console.log(`   - Console logs: ${logs.length}`);
    console.log(`   - Errors: ${errors.length}`);
    
    // Save console logs
    fs.writeFileSync('debug/browser-console.log', JSON.stringify({
      logs,
      errors,
      summary: {
        hasContent,
        contentLength: bodyText.length,
        logCount: logs.length,
        errorCount: errors.length
      }
    }, null, 2));
    
    console.log('✅ Snapshot completed successfully!');
    
  } catch (error) {
    console.error('❌ Snapshot failed:', error.message);
    
    // Save error information
    fs.writeFileSync('debug/snapshot-error.log', JSON.stringify({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, null, 2));
  } finally {
    await browser.close();
  }
}

// Run the snapshot
captureSnapshot().catch(console.error);
