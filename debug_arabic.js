// Simple Arabic Translation Test
console.log('Testing Arabic translations...')

// Test basic translations
const testTranslations = {
  en: {
    siteTitle: 'Port San Antonio Resort',
    welcomeTo: 'Welcome to',
    menu: 'Menu'
  },
  ar: {
    siteTitle: 'منتجع بورت سان أنطونيو',
    welcomeTo: 'مرحباً بكم في',
    menu: 'القائمة'
  }
}

// Test RTL detection
console.log('Arabic translations loaded:', testTranslations.ar)
console.log('RTL should be active for Arabic')
