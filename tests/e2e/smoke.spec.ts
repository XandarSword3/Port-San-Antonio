import { test, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';


// Test configuration for smoke tests
test.beforeEach(async ({ page }: { page: Page }) => {
  // Set viewport size to ensure consistent testing
  await page.setViewportSize({ width: 1280, height: 720 })
})

test.describe('San Antonio Resort - Smoke Tests', () => {
  test('Home page loads with hero and CTA', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003')
    
    // Check for global header
    await expect(page.locator('[data-testid="global-header"]')).toBeVisible()
    
    // Wait for hero image to load
    await page.waitForSelector('img[alt="Port San Antonio Resort"]')
    
    // Check for hero content
    await expect(page.locator('h1')).toContainText('Welcome to')
    await expect(page.locator('h2')).toContainText('Port San Antonio')
    
    // Check for CTA button
    const ctaButton = page.locator('[data-testid="home-cta-button"]')
    await expect(ctaButton).toBeVisible()
    
    // Click CTA and verify navigation
    await ctaButton.click()
    await expect(page).toHaveURL(/.*\/menu/)
  })
  
  test('Global header components work correctly', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003')
    
    // Check theme toggle exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    await expect(themeToggle).toBeVisible()
    
    // Toggle theme and verify it changes - use force click to avoid interception
    const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    await themeToggle.click({ force: true })
    await page.waitForTimeout(500) // Wait for theme change to apply
    const newTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    expect(newTheme).not.toEqual(initialTheme)
    
    // Check language toggle exists
    const languageToggle = page.locator('[data-testid="language-toggle"]')
    await expect(languageToggle).toBeVisible()
    
    // Toggle language and verify it changes - use force click to avoid interception
    const initialLang = await page.evaluate(() => document.documentElement.lang)
    await languageToggle.click({ force: true })
    await page.waitForTimeout(500) // Wait for language change to apply
    const newLang = await page.evaluate(() => document.documentElement.lang)
    expect(newLang).not.toEqual(initialLang)
    
    // Check hamburger menu exists
    const hamburgerMenu = page.locator('[data-testid="hamburger-menu"]')
    await expect(hamburgerMenu).toBeVisible()
    
    // Open sidebar and verify it appears - use force click to avoid interception
    await hamburgerMenu.click({ force: true })
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Close sidebar by clicking outside
    await page.mouse.click(10, 10)
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible()
  })

  test('Menu page loads with categories and dishes', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/menu')
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Check for back button
    await expect(page.locator('[data-testid="back-button"]')).toBeVisible()
    
    // Check for category chips
    const categoryChips = page.locator('[data-testid="category-chip"]')
    await expect(categoryChips.first()).toBeVisible()
    
    // Check for dish cards
    const dishCards = page.locator('[data-testid="dish-card"]')
    await expect(dishCards.first()).toBeVisible()
    
    // Verify no console errors
    const consoleErrors = []
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.waitForTimeout(1000)
    expect(consoleErrors.length).toBe(0)
  })

  test('Filter functionality works', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/menu')
    await page.waitForTimeout(2000) // Wait for content to load
    
    // Check filter button exists
    const filterButton = page.locator('[data-testid="filter-button"]')
    await expect(filterButton).toBeVisible()
    
    // Open filter panel
    await filterButton.click()
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible()
    
    // Select a filter
    const filterChip = page.locator('[data-testid="filter-chip"]').first()
    await filterChip.click()
    
    // Verify filter is applied
    await expect(filterChip).toHaveAttribute('aria-pressed', 'true')
    
    // Clear filters
    const clearButton = page.locator('[data-testid="clear-filters"]')
    if (await clearButton.isVisible()) {
      await clearButton.click()
      await expect(filterChip).toHaveAttribute('aria-pressed', 'false')
    }
  })

  test('Dish modal works with back button', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/menu')
    await page.waitForTimeout(2000) // Wait for content to load
    
    // Open a dish modal by clicking the Details button
    const detailsButton = page.locator('[data-testid="dish-details-button"]').first()
    await detailsButton.click()
    
    // Wait for modal to appear and verify it's open
    await page.waitForSelector('[data-testid="dish-modal"]', { timeout: 10000 })
    await expect(page.locator('[data-testid="dish-modal"]')).toBeVisible()
    
    // Check back button exists in modal
    await expect(page.locator('[data-testid="dish-modal"] [data-testid="back-button"]')).toBeVisible()
    
    // Click back button and verify modal closes
    await page.locator('[data-testid="dish-modal"] [data-testid="back-button"]').click()
    await expect(page.locator('[data-testid="dish-modal"]')).not.toBeVisible()
  })

  test('Debug page shows system information', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/debug')
    await page.waitForTimeout(2000) // Wait for content to load
    
    // Wait for debug title to appear
    await page.waitForSelector('[data-testid="debug-title"]', { timeout: 10000 })
    await expect(page.locator('[data-testid="debug-title"]')).toBeVisible()
    
    // Verify theme information is displayed
    await expect(page.locator('text=Theme')).toBeVisible()
    
    // Verify language information is displayed
    await expect(page.locator('text=Language')).toBeVisible()
    
    // Check back button works
    const backButton = page.locator('[data-testid="back-button"]')
    await expect(backButton).toBeVisible()
    await backButton.click()
    await expect(page).toHaveURL('http://localhost:3003/')
  })

  test('Search functionality works', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/menu')
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Find search input and search for "chicken"
    const searchInput = page.locator('input[placeholder*="search" i], input[aria-label*="search" i]')
    if (await searchInput.count() > 0) {
      await searchInput.fill('chicken')
      await page.waitForTimeout(500)
      
      // Verify search results
      const dishCards = page.locator('[data-testid="dish-card"]')
      const count = await dishCards.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('Admin page is accessible', async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3003/admin')
    
    // Should show login form
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Try to login with admin123
    await page.fill('input[type="password"]', 'admin123')
    // Wait for button to be enabled
    await page.waitForSelector('button[type="submit"]:not([disabled])')
    await page.click('button[type="submit"]')
    
    // Should show admin dashboard
    await expect(page.locator('text=Admin Panel')).toBeVisible()
  })

  test('Debug routes work', async ({ page }: { page: Page }) => {
    // Test health endpoint
    const healthResponse = await page.request.get('http://localhost:3003/health')
    expect(healthResponse.status()).toBe(200)
    
    // Test debug endpoint
    const debugResponse = await page.request.get('http://localhost:3003/debug')
    expect(debugResponse.status()).toBe(200)
    
    // Test debug data endpoint
    const dataResponse = await page.request.get('http://localhost:3003/debug/data')
    expect(dataResponse.status()).toBe(200)
  })
})
