# Translation Audit Report

Generated: 2025-12-07T11:51:34.485Z

## Summary

- **Total Issues:** 202
- **Files Affected:** 39

## Issues by File

### \src\components\AdManager.tsx

- **Line 400:** Should use t('total')
  ```
  <h4 className="font-medium text-blue-900 mb-2">Total Ads</h4>
  ```

### \src\components\AdminDashboard.tsx

- **Line 28:** Should use t('view')
  ```
  <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
  ```

- **Line 28:** Should use t('dashboard')
  ```
  <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
  ```

- **Line 29:** Should use t('welcome')
  ```
  <p className="text-gray-600">Welcome to your restaurant management dashboard</p>
  ```

- **Line 29:** Should use t('dashboard')
  ```
  <p className="text-gray-600">Welcome to your restaurant management dashboard</p>
  ```

- **Line 42:** Should use t('total')
  ```
  <p className="text-sm font-medium text-gray-600">Total Dishes</p>
  ```

- **Line 43:** Should use t('total')
  ```
  <p className="text-2xl font-bold text-gray-900">{stats.totalDishes}</p>
  ```

- **Line 60:** Should use t('total')
  ```
  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
  ```

- **Line 77:** Should use t('total')
  ```
  <p className="text-2xl font-bold text-gray-900">{stats.totalAds}</p>
  ```

- **Line 127:** Should use t('price')
  ```
  <p className="text-sm font-medium text-gray-600">Avg. Price</p>
  ```

- **Line 128:** Should use t('price')
  ```
  <p className="text-2xl font-bold text-gray-900">${stats.averagePrice.toFixed(2)}</p>
  ```

- **Line 163:** Should use t('price')
  ```
  <p className="font-medium text-gray-900">${dish.price}</p>
  ```

- **Line 164:** Should use t('menu')
  ```
  <p className="text-sm text-gray-600">Menu item</p>
  ```

- **Line 181:** Should use t('menu')
  ```
  <p className="text-sm text-gray-600">Common tasks to manage your menu</p>
  ```

- **Line 188:** Should use t('menu')
  ```
  <p className="text-sm text-gray-600">Create a new menu item</p>
  ```

- **Line 193:** Should use t('menu')
  ```
  <p className="text-sm text-gray-600">Organize your menu structure</p>
  ```

- **Line 197:** Should use t('date')
  ```
  <h4 className="font-medium text-gray-900">Update Prices</h4>
  ```

- **Line 197:** Should use t('price')
  ```
  <h4 className="font-medium text-gray-900">Update Prices</h4>
  ```

- **Line 198:** Should use t('price')
  ```
  <p className="text-sm text-gray-600">Bulk price management</p>
  ```

### \src\components\AdminLogin.tsx

- **Line 95:** Should use t('password')
  ```
  type={showPassword ? 'text' : 'password'}
  ```

- **Line 125:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\AnalyticsDashboard.tsx

- **Line 72:** Should use t('view')
  ```
  const viewEvents = itemEvents.filter(e => e.type === 'view' && e.duration)
  ```

- **Line 103:** Should use t('view')
  ```
  views: filteredEvents.filter(e => e.type === 'view').length,
  ```

- **Line 139:** Should use t('time')
  ```
  e.timestamp >= intervalStart && e.timestamp < intervalEnd
  ```

- **Line 151:** Should use t('view')
  ```
  views: intervalEvents.filter(e => e.type === 'view').length,
  ```

- **Line 165:** Should use t('view')
  ```
  const viewEvents = itemEvents.filter(e => e.type === 'view' && e.duration)
  ```

- **Line 217:** Should use t('dashboard')
  ```
  <h1 className="text-2xl font-bold text-gray-900">Popularity Analytics Dashboard</h1>
  ```

- **Line 228:** Should use t('time')
  ```
  <option value="all">All Time</option>
  ```

- **Line 236:** Should use t('view')
  ```
  <option value="views">Total Views</option>
  ```

- **Line 236:** Should use t('total')
  ```
  <option value="views">Total Views</option>
  ```

- **Line 252:** Should use t('total')
  ```
  <h3 className="text-sm font-medium text-gray-500">Total Items Tracked</h3>
  ```

- **Line 256:** Should use t('total')
  ```
  <h3 className="text-sm font-medium text-gray-500">Total Interactions</h3>
  ```

- **Line 257:** Should use t('filter')
  ```
  <p className="text-2xl font-bold text-green-600">{filterEventsByTimeframe(events).length}</p>
  ```

- **Line 257:** Should use t('time')
  ```
  <p className="text-2xl font-bold text-green-600">{filterEventsByTimeframe(events).length}</p>
  ```

- **Line 281:** Should use t('time')
  ```
  <XAxis dataKey="time" />
  ```

- **Line 284:** Should use t('total')
  ```
  <Line type="monotone" dataKey="interactions" stroke="#8884d8" name="Total" strokeWidth={2} />
  ```

- **Line 296:** Should use t('view')
  ```
  <h2 className="text-lg font-semibold mb-4">Item Performance Overview</h2>
  ```

- **Line 357:** Should use t('view')
  ```
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
  ```

- **Line 360:** Should use t('cart')
  ```
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cart Adds</th>
  ```

- **Line 362:** Should use t('view')
  ```
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg View Time</th>
  ```

- **Line 362:** Should use t('time')
  ```
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg View Time</th>
  ```

- **Line 384:** Should use t('view')
  ```
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
  ```

- **Line 387:** Should use t('cart')
  ```
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cartAdds}</td>
  ```

- **Line 389:** Should use t('view')
  ```
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgViewTime.toFixed(1)}s</td>
  ```

- **Line 389:** Should use t('time')
  ```
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgViewTime.toFixed(1)}s</td>
  ```

- **Line 405:** Should use t('view')
  ```
  <h3 className="text-sm font-medium text-blue-800">Average View Duration</h3>
  ```

- **Line 406:** Should use t('view')
  ```
  <p className="text-xl font-bold text-blue-600">{detailedStats.avgViewTime.toFixed(1)}s</p>
  ```

- **Line 406:** Should use t('time')
  ```
  <p className="text-xl font-bold text-blue-600">{detailedStats.avgViewTime.toFixed(1)}s</p>
  ```

- **Line 407:** Should use t('view')
  ```
  <p className="text-xs text-blue-600">Min: {detailedStats.minViewTime.toFixed(1)}s | Max: {detailedStats.maxViewTime.toFixed(1)}s</p>
  ```

- **Line 407:** Should use t('time')
  ```
  <p className="text-xs text-blue-600">Min: {detailedStats.minViewTime.toFixed(1)}s | Max: {detailedStats.maxViewTime.toFixed(1)}s</p>
  ```

- **Line 417:** Should use t('cart')
  ```
  <p className="text-xs text-orange-600">Of cart additions</p>
  ```

- **Line 420:** Should use t('date')
  ```
  <h3 className="text-sm font-medium text-purple-800">Last Updated</h3>
  ```

- **Line 437:** Should use t('time')
  ```
  <th className="px-4 py-2 text-left">Time</th>
  ```

- **Line 446:** Should use t('date')
  ```
  <td className="px-4 py-2">{new Date(event.timestamp).toLocaleString()}</td>
  ```

- **Line 446:** Should use t('time')
  ```
  <td className="px-4 py-2">{new Date(event.timestamp).toLocaleString()}</td>
  ```

- **Line 449:** Should use t('view')
  ```
  event.type === 'view' ? 'bg-blue-100 text-blue-800' :
  ```

### \src\components\BeachAmbience.tsx

- **Line 18:** Phrase "Audio not supported" should be translated
  ```
  console.log('Audio not supported')
  ```

- **Line 84:** Phrase "Disable beach ambience" should be translated
  ```
  title={isEnabled ? 'Disable beach ambience' : 'Enable beach ambience'}
  ```

### \src\components\CartSidebar.tsx

- **Line 254:** Should use t('price')
  ```
  <span>{formatCurrency(totalPrice)}</span>
  ```

- **Line 254:** Should use t('total')
  ```
  <span>{formatCurrency(totalPrice)}</span>
  ```

- **Line 260:** Should use t('order')
  ```
  <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Order Information</h3>
  ```

- **Line 270:** Should use t('email')
  ```
  type="email"
  ```

- **Line 302:** Should use t('submit')
  ```
  <>Submitting...</>
  ```

### \src\components\CategoryManager.tsx

- **Line 92:** Should use t('menu')
  ```
  <p className="text-gray-600">Organize your menu structure and categories</p>
  ```

- **Line 111:** Should use t('order')
  ```
  placeholder="Order"
  ```

- **Line 128:** Should use t('order')
  ```
  <p className="text-sm text-gray-600">Drag to reorder categories</p>
  ```

- **Line 148:** Should use t('order')
  ```
  <span className="text-sm font-medium text-gray-500">#{category.order}</span>
  ```

- **Line 223:** Should use t('total')
  ```
  <div>Total dishes: {dishCount}</div>
  ```

- **Line 225:** Should use t('order')
  ```
  <div>Order: #{category.order}</div>
  ```

### \src\components\ContactManager.tsx

- **Line 118:** Should use t('phone')
  ```
  onChange={(e) => handleInputChange('phone', e.target.value)}
  ```

- **Line 130:** Should use t('email')
  ```
  type="email"
  ```

- **Line 132:** Should use t('email')
  ```
  onChange={(e) => handleInputChange('email', e.target.value)}
  ```

- **Line 146:** Should use t('address')
  ```
  onChange={(e) => handleInputChange('address', e.target.value)}
  ```

- **Line 216:** Should use t('view')
  ```
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview</h3>
  ```

- **Line 218:** Should use t('contact')
  ```
  <p><strong>Phone:</strong> {contactInfo.phone || 'Not set'}</p>
  ```

- **Line 218:** Should use t('phone')
  ```
  <p><strong>Phone:</strong> {contactInfo.phone || 'Not set'}</p>
  ```

- **Line 219:** Should use t('contact')
  ```
  <p><strong>Email:</strong> {contactInfo.email || 'Not set'}</p>
  ```

- **Line 219:** Should use t('email')
  ```
  <p><strong>Email:</strong> {contactInfo.email || 'Not set'}</p>
  ```

- **Line 220:** Should use t('contact')
  ```
  <p><strong>Address:</strong> {contactInfo.address || 'Not set'}</p>
  ```

- **Line 220:** Should use t('address')
  ```
  <p><strong>Address:</strong> {contactInfo.address || 'Not set'}</p>
  ```

- **Line 221:** Should use t('contact')
  ```
  <p><strong>Website:</strong> {contactInfo.website || 'Not set'}</p>
  ```

### \src\components\ContentManager.tsx

- **Line 368:** Should use t('time')
  ```
  <option value="full-time">Full Time</option>
  ```

- **Line 369:** Should use t('time')
  ```
  <option value="part-time">Part Time</option>
  ```

- **Line 458:** Should use t('submit')
  ```
  type="submit"
  ```

- **Line 609:** Should use t('settings')
  ```
  <p><strong>Name:</strong> {footerSettings.companyName}</p>
  ```

- **Line 610:** Should use t('settings')
  ```
  <p><strong>Description:</strong> {footerSettings.description}</p>
  ```

- **Line 611:** Should use t('settings')
  ```
  <p><strong>Address:</strong> {footerSettings.address}</p>
  ```

- **Line 611:** Should use t('address')
  ```
  <p><strong>Address:</strong> {footerSettings.address}</p>
  ```

- **Line 612:** Should use t('settings')
  ```
  <p><strong>Phone:</strong> {footerSettings.phone}</p>
  ```

- **Line 612:** Should use t('phone')
  ```
  <p><strong>Phone:</strong> {footerSettings.phone}</p>
  ```

- **Line 613:** Should use t('settings')
  ```
  <p><strong>Email:</strong> {footerSettings.email}</p>
  ```

- **Line 613:** Should use t('email')
  ```
  <p><strong>Email:</strong> {footerSettings.email}</p>
  ```

- **Line 619:** Should use t('settings')
  ```
  <p><strong>Hours:</strong> {footerSettings.diningHours}</p>
  ```

- **Line 620:** Should use t('settings')
  ```
  <p><strong>Location:</strong> {footerSettings.diningLocation}</p>
  ```

- **Line 625:** Should use t('settings')
  ```
  {footerSettings.socialLinks.facebook && <p><strong>Facebook:</strong> {footerSettings.socialLinks.facebook}</p>}
  ```

- **Line 626:** Should use t('settings')
  ```
  {footerSettings.socialLinks.instagram && <p><strong>Instagram:</strong> {footerSettings.socialLinks.instagram}</p>}
  ```

- **Line 627:** Should use t('settings')
  ```
  {footerSettings.socialLinks.twitter && <p><strong>Twitter:</strong> {footerSettings.socialLinks.twitter}</p>}
  ```

- **Line 628:** Should use t('settings')
  ```
  {footerSettings.socialLinks.linkedin && <p><strong>LinkedIn:</strong> {footerSettings.socialLinks.linkedin}</p>}
  ```

- **Line 708:** Should use t('email')
  ```
  type="email"
  ```

- **Line 794:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\CookieConsent.tsx

- **Line 72:** Should use t('learnmore')
  ```
  learnMore: 'Learn More',
  ```

### \src\components\CurrencySettings.tsx

- **Line 54:** Should use t('settings')
  ```
  <h2 className="text-2xl font-bold text-gray-900">Currency Settings</h2>
  ```

- **Line 60:** Should use t('settings')
  ```
  <h3 className="text-lg font-semibold text-gray-900">Current Settings</h3>
  ```

- **Line 75:** Should use t('date')
  ```
  <span className="text-sm font-medium text-gray-600">Last Updated</span>
  ```

- **Line 76:** Should use t('date')
  ```
  <span className="text-sm text-gray-500">{lastUpdated.toLocaleString()}</span>
  ```

- **Line 84:** Should use t('view')
  ```
  <h3 className="text-lg font-semibold text-gray-900">Price Preview</h3>
  ```

- **Line 84:** Should use t('price')
  ```
  <h3 className="text-lg font-semibold text-gray-900">Price Preview</h3>
  ```

- **Line 92:** Should use t('price')
  ```
  <span className="text-sm font-semibold text-gray-900">${samplePrice.toFixed(2)} USD</span>
  ```

- **Line 97:** Should use t('price')
  ```
  <span className="text-sm font-semibold text-gray-900">{sampleLBPPrice.toLocaleString()} LBP</span>
  ```

- **Line 170:** Should use t('date')
  ```
  <li>• Exchange rates are updated in real-time across the application</li>
  ```

- **Line 170:** Should use t('time')
  ```
  <li>• Exchange rates are updated in real-time across the application</li>
  ```

- **Line 171:** Should use t('price')
  ```
  <li>• All prices are stored in USD and converted to LBP when displayed</li>
  ```

### \src\components\EventManager.tsx

- **Line 249:** Should use t('date')
  ```
  type="date"
  ```

- **Line 275:** Should use t('time')
  ```
  type="time"
  ```

- **Line 288:** Should use t('time')
  ```
  type="time"
  ```

- **Line 361:** Should use t('date')
  ```
  type="date"
  ```

- **Line 382:** Should use t('submit')
  ```
  type="submit"
  ```

- **Line 408:** Phrase "No events match your filters" should be translated
  ```
  ? 'No events match your filters'
  ```

- **Line 409:** Phrase "No events yet" should be translated
  ```
  : 'No events yet'
  ```

### \src\components\ExpandableMenuHeader.tsx

- **Line 113:** Phrase "Clear admin changes and reload original data" should be translated
  ```
  title="Clear admin changes and reload original data"
  ```

### \src\components\FilterChips.tsx

- **Line 84:** Phrase "Toggle available only" should be translated
  ```
  aria-label="Toggle available only"
  ```

- **Line 94:** Should use t('price')
  ```
  <div role="group" aria-label="Price">
  ```

### \src\components\Footer.tsx

- **Line 80:** Should use t('settings')
  ```
  <span>{footerSettings.address}</span>
  ```

- **Line 80:** Should use t('address')
  ```
  <span>{footerSettings.address}</span>
  ```

- **Line 93:** Should use t('settings')
  ```
  <span>{footerSettings.phone}</span>
  ```

- **Line 93:** Should use t('phone')
  ```
  <span>{footerSettings.phone}</span>
  ```

- **Line 97:** Should use t('settings')
  ```
  <span>{footerSettings.email}</span>
  ```

- **Line 97:** Should use t('email')
  ```
  <span>{footerSettings.email}</span>
  ```

- **Line 101:** Should use t('settings')
  ```
  <span>{footerSettings.diningHours}</span>
  ```

- **Line 105:** Should use t('settings')
  ```
  <span className="text-sm">{footerSettings.diningLocation}</span>
  ```

### \src\components\GlobalHeader.tsx

- **Line 47:** Phrase "Sidebar state changing from" should be translated
  ```
  console.log('Sidebar state changing from', prev, 'to', !prev)
  ```

- **Line 65:** Should use t('sort')
  ```
  <span className="hidden sm:block">Port Antonio Resort</span>
  ```

- **Line 124:** Phrase "Toggle sidebar menu" should be translated
  ```
  aria-label="Toggle sidebar menu"
  ```

### \src\components\LoginModal.tsx

- **Line 103:** Should use t('password')
  ```
  type={showPassword ? 'text' : 'password'}
  ```

- **Line 148:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\MembershipTierCard.tsx

- **Line 294:** Should use t('getstarted')
  ```
  {isCurrentTier ? 'Current Plan' : tier === 'free' ? 'Get Started' : 'Upgrade Now'}
  ```

### \src\components\MenuManager.tsx

- **Line 117:** Phrase "No authentication token available" should be translated
  ```
  throw new Error('No authentication token available')
  ```

- **Line 209:** Should use t('menu')
  ```
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Manager</h2>
  ```

- **Line 247:** Should use t('price')
  ```
  <span className="text-lg font-bold text-blue-600">${dish.price}</span>
  ```

- **Line 320:** Phrase "Enter dish name" should be translated
  ```
  placeholder="Enter dish name"
  ```

- **Line 425:** Should use t('save')
  ```
  {saving ? 'Saving...' : 'Save'}
  ```

### \src\components\MenuSEO.tsx

- **Line 36:** Should use t('menu')
  ```
  '@type': 'Menu',
  ```

- **Line 80:** Should use t('home')
  ```
  name: 'Home',
  ```

- **Line 86:** Should use t('menu')
  ```
  name: 'Menu',
  ```

### \src\components\MenuStructuredData.tsx

- **Line 37:** Should use t('menu')
  ```
  '@type': 'Menu',
  ```

- **Line 89:** Should use t('home')
  ```
  name: 'Home',
  ```

- **Line 95:** Should use t('menu')
  ```
  name: 'Menu',
  ```

### \src\components\MobileBanner.tsx

- **Line 90:** Should use t('learnmore')
  ```
  <p className="text-xs text-gray-500">Tap to learn more</p>
  ```

### \src\components\OfflineNotification.tsx

- **Line 36:** Phrase "No cached data available" should be translated
  ```
  'No cached data available'
  ```

### \src\components\PageTransition.tsx

- **Line 16:** Should use t('menu')
  ```
  type?: 'menu' | 'admin' | 'default'
  ```

- **Line 104:** Should use t('menu')
  ```
  case 'menu':
  ```

- **Line 122:** Should use t('menu')
  ```
  duration: type === 'menu'
  ```

- **Line 128:** Should use t('menu')
  ```
  ...(type === 'menu' && {
  ```

- **Line 156:** Should use t('menu')
  ```
  export function TransitionOverlay({ type }: { type: 'menu' | 'admin' }) {
  ```

- **Line 165:** Should use t('menu')
  ```
  if (type === 'menu') {
  ```

### \src\components\PaymentModal.tsx

- **Line 42:** Should use t('total')
  ```
  total: 'Total',
  ```

- **Line 80:** Phrase "Card element not found" should be translated
  ```
  throw new Error('Card element not found');
  ```

- **Line 132:** Should use t('price')
  ```
  <span>{formatCurrency(item.price * item.quantity)}</span>
  ```

- **Line 139:** Should use t('total')
  ```
  <span>{localText.total}</span>
  ```

- **Line 184:** Should use t('submit')
  ```
  type="submit"
  ```

- **Line 239:** Should use t('payment')
  ```
  title: 'Payment',
  ```

- **Line 282:** Should use t('payment')
  ```
  <h3 className="text-lg font-semibold mb-2">{t.paymentUnavailable}</h3>
  ```

- **Line 283:** Should use t('contact')
  ```
  <p className="text-gray-600 dark:text-gray-300">{t.contactMessage}</p>
  ```

### \src\components\QuickOrderModal.tsx

- **Line 144:** Phrase "Close order modal" should be translated
  ```
  aria-label="Close order modal"
  ```

### \src\components\ReservationManager.tsx

- **Line 192:** Should use t('email')
  ```
  type="email"
  ```

- **Line 233:** Should use t('date')
  ```
  type="date"
  ```

- **Line 246:** Should use t('time')
  ```
  type="time"
  ```

- **Line 297:** Should use t('submit')
  ```
  type="submit"
  ```

- **Line 322:** Phrase "No reservations match your filters" should be translated
  ```
  {searchTerm || statusFilter !== 'all' ? 'No reservations match your filters' : 'No reservations yet'}
  ```

### \src\components\ReservationModal.tsx

- **Line 117:** Should use t('email')
  ```
  type="email"
  ```

- **Line 151:** Should use t('date')
  ```
  type="date"
  ```

- **Line 170:** Should use t('time')
  ```
  <option value="">Select time</option>
  ```

- **Line 240:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\ReviewModal.tsx

- **Line 151:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\ReviewSystem.tsx

- **Line 77:** Phrase "Database not available" should be translated
  ```
  throw new Error('Database not available')
  ```

- **Line 247:** Should use t('email')
  ```
  type="email"
  ```

- **Line 276:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\Sidebar.tsx

- **Line 93:** Phrase "Audio not supported" should be translated
  ```
  console.log('Audio not supported')
  ```

### \src\components\SmartRecommendations.tsx

- **Line 74:** Should use t('price')
  ```
  .filter(d => Math.abs((d.price || 0) - (currentDish.price || 0)) < 5)
  ```

- **Line 102:** Phrase "Complete your meal" should be translated
  ```
  reason: 'Complete your meal',
  ```

### \src\components\SpinWheel.tsx

- **Line 257:** Should use t('order')
  ```
  <li>• Completing 3 orders (+1 spin)</li>
  ```

- **Line 259:** Should use t('view')
  ```
  <li>• Writing reviews (+1 spin per 5 reviews)</li>
  ```

### \src\components\TargetedAdManager.tsx

- **Line 151:** Should use t('menu')
  ```
  <li>• <strong>Keywords:</strong> Show ads based on menu searches</li>
  ```

- **Line 151:** Should use t('search')
  ```
  <li>• <strong>Keywords:</strong> Show ads based on menu searches</li>
  ```

- **Line 154:** Should use t('date')
  ```
  <li>• <strong>Schedule:</strong> Set start/end dates for campaigns</li>
  ```

- **Line 161:** Should use t('time')
  ```
  <li>• Users can opt-out anytime in cookie preferences</li>
  ```

- **Line 162:** Should use t('about')
  ```
  <li>• Full transparency about data usage</li>
  ```

- **Line 331:** Should use t('date')
  ```
  type="date"
  ```

- **Line 342:** Should use t('date')
  ```
  type="date"
  ```

- **Line 380:** Should use t('submit')
  ```
  type="submit"
  ```

### \src\components\UnifiedFilterBox.tsx

- **Line 180:** Should use t('filter')
  ```
  <span>{filter.label}</span>
  ```

- **Line 220:** Should use t('filter')
  ```
  <span>{filter.label}</span>
  ```

### \src\app\not-found.tsx

- **Line 86:** Should use t('sort')
  ```
  <p>Port Antonio Resort</p>
  ```

- **Line 87:** Should use t('experienceluxury')
  ```
  <p>Experience luxury dining and hospitality</p>
  ```

### \src\app\page.tsx

- **Line 56:** Should use t('menu')
  ```
  navigateWithTransition('/menu', 'menu');
  ```

- **Line 70:** Phrase "Stunning seafront dining with panoramic ocean views" should be translated
  ```
  desc: 'Stunning seafront dining with panoramic ocean views',
  ```

- **Line 76:** Phrase "Relax in nature with breathtaking golden hour views" should be translated
  ```
  desc: 'Relax in nature with breathtaking golden hour views',
  ```

- **Line 82:** Phrase "Daily catches and locally sourced ingredients" should be translated
  ```
  desc: 'Daily catches and locally sourced ingredients',
  ```

- **Line 312:** Should use t('explore')
  ```
  <span className="text-sm font-light">Scroll to explore</span>
  ```

### \src\contexts\CartContext.tsx

- **Line 32:** Should use t('cart')
  ```
  const savedCart = localStorage.getItem('cart')
  ```

- **Line 43:** Should use t('cart')
  ```
  localStorage.setItem('cart', JSON.stringify(items))
  ```

### \src\contexts\MenuContext.tsx

- **Line 137:** Phrase "No dishes found in database" should be translated
  ```
  setError('No dishes found in database')
  ```

