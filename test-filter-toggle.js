// Simple test script to check filter toggle functionality
const puppeteer = require('puppeteer');

async function testFilterToggle() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    await page.goto('http://localhost:3001/menu');
    await page.waitForSelector('[data-testid="filter-chip"]', { timeout: 10000 });
    
    console.log('Page loaded, looking for filter chips...');
    
    // Find the first filter chip
    const filterChips = await page.$$('[data-testid="filter-chip"]');
    console.log(`Found ${filterChips.length} filter chips`);
    
    if (filterChips.length > 0) {
      console.log('Clicking first filter chip...');
      await filterChips[0].click();
      
      // Wait a moment for state update
      await page.waitForTimeout(1000);
      
      console.log('Clicking same filter chip again...');
      await filterChips[0].click();
      
      // Wait a moment for state update
      await page.waitForTimeout(1000);
    }
    
    await page.waitForTimeout(5000); // Keep browser open for a bit
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testFilterToggle();
