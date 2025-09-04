// Translation strings for the application

export type SupportedLanguage = 'en' | 'ar';

export type TranslationKeys = {
  // Header and navigation
  siteTitle: string;
  menu: string;
  admin: string;
  home: string;
  contact: string;
  
  // Homepage
  welcomeTo: string;
  experienceLuxury: string;
  
  // Sidebar
  followUs: string;
  siteBy: string;
  
  // Menu page
  menuTitle: string;
  searchPlaceholder: string;
  backToHome: string;
  backToMenu: string;
  
  // Filters
  filters: string;
  clearAll: string;
  available: string;
  unavailable: string;
  priceRange: string;
  
  // Dietary tags
  vegetarian: string;
  vegan: string;
  glutenFree: string;
  containsNuts: string;
  sugarFree: string;
  
  // Dish modal
  details: string;
  ingredients: string;
  allergens: string;
  calories: string;
  pairings: string;
  noDetailsAvailable: string;
  
  // CTA
  exploreMenu: string;
  share: string;
  close: string;
  
  // Debug
  debugTitle: string;
  debugOverlay: string;
  loadingDebugInfo: string;
  systemInformation: string;
  serverStatus: string;
  dataStatus: string;
  activeFilters: string;
  recentLogs: string;
  quickActions: string;
  theme: string;
  language: string;
  browser: string;
  screenSize: string;
  goToHomePage: string;
  goToMenuPage: string;
  goToAdminPanel: string;
  
  // Navigation
  back: string;
  goBack: string;
};

type Translations = {
  [key in SupportedLanguage]: TranslationKeys;
};

export const translations: Translations = {
  en: {
    // Header and navigation
    siteTitle: 'San Antonio',
    menu: 'Menu',
    admin: 'Admin',
    home: 'Home',
    contact: 'Contact',
    
    // Homepage
    welcomeTo: 'Welcome to',
    experienceLuxury: 'Experience luxury dining at its finest',
    
    // Sidebar
    followUs: 'Follow Us',
    siteBy: 'Site made by',
    
    // Menu page
    menuTitle: 'Our Menu',
    searchPlaceholder: 'Search dishes...',
    backToHome: 'Back to Home',
    backToMenu: 'Back to Menu',
    
    // Filters
    filters: 'Filters',
    clearAll: 'Clear all',
    available: 'Available',
    unavailable: 'Unavailable',
    priceRange: 'Price Range',
    
    // Dietary tags
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'Gluten-Free',
    containsNuts: 'Contains Nuts',
    sugarFree: 'Sugar-Free',
    
    // Dish modal
    details: 'Details',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    calories: 'Calories',
    pairings: 'Recommended Pairings',
    noDetailsAvailable: 'No details available',
    
    // CTA
    exploreMenu: 'Explore Our Menu',
    share: 'Share',
    close: 'Close',
    
    // Debug
    debugTitle: 'Debug Information',
    debugOverlay: 'Debug Overlay',
    loadingDebugInfo: 'Loading debug information...',
    systemInformation: 'System Information',
    serverStatus: 'Server Status',
    dataStatus: 'Data Status',
    activeFilters: 'Active Filters',
    recentLogs: 'Recent Logs',
    quickActions: 'Quick Actions',
    theme: 'Theme',
    language: 'Language',
    browser: 'Browser',
    screenSize: 'Screen Size',
    goToHomePage: 'Go to Home Page',
    goToMenuPage: 'Go to Menu Page',
    goToAdminPanel: 'Go to Admin Panel',
    
    // Navigation
    back: 'Back',
    goBack: 'Go back',
  },
  ar: {
    // Header and navigation
    siteTitle: 'سان أنطونيو',
    menu: 'القائمة',
    admin: 'المسؤول',
    home: 'الرئيسية',
    contact: 'اتصل بنا',
    
    // Homepage
    welcomeTo: 'مرحبا بكم في',
    experienceLuxury: 'استمتع بتجربة تناول الطعام الفاخرة',
    
    // Sidebar
    followUs: 'تابعنا',
    siteBy: 'الموقع من تصميم',
    
    // Menu page
    menuTitle: 'قائمتنا',
    searchPlaceholder: 'البحث عن الأطباق...',
    backToHome: 'العودة إلى الرئيسية',
    backToMenu: 'العودة إلى القائمة',
    
    // Filters
    filters: 'التصفية',
    clearAll: 'مسح الكل',
    available: 'متوفر',
    unavailable: 'غير متوفر',
    priceRange: 'نطاق السعر',
    
    // Dietary tags
    vegetarian: 'نباتي',
    vegan: 'نباتي صرف',
    glutenFree: 'خالي من الغلوتين',
    containsNuts: 'يحتوي على مكسرات',
    sugarFree: 'خالي من السكر',
    
    // Dish modal
    details: 'التفاصيل',
    ingredients: 'المكونات',
    allergens: 'مسببات الحساسية',
    calories: 'السعرات الحرارية',
    pairings: 'الاقتراحات المصاحبة',
    noDetailsAvailable: 'لا تتوفر تفاصيل',
    
    // CTA
    exploreMenu: 'استكشف قائمتنا',
    share: 'مشاركة',
    close: 'إغلاق',
    
    // Debug
    debugTitle: 'معلومات التصحيح',
    debugOverlay: 'واجهة التصحيح',
    loadingDebugInfo: 'جاري تحميل معلومات التصحيح...',
    systemInformation: 'معلومات النظام',
    serverStatus: 'حالة الخادم',
    dataStatus: 'حالة البيانات',
    activeFilters: 'عوامل التصفية النشطة',
    recentLogs: 'السجلات الأخيرة',
    quickActions: 'إجراءات سريعة',
    theme: 'السمة',
    language: 'اللغة',
    browser: 'المتصفح',
    screenSize: 'حجم الشاشة',
    goToHomePage: 'الذهاب إلى الصفحة الرئيسية',
    goToMenuPage: 'الذهاب إلى صفحة القائمة',
    goToAdminPanel: 'الذهاب إلى لوحة المسؤول',
    
    // Navigation
    back: 'رجوع',
    goBack: 'العودة',
  },
};

// Helper function to get translation
export function getTranslation(lang: SupportedLanguage, key: keyof TranslationKeys): string {
  // For UI elements only - translate based on language
  if (!translations[lang] || !translations[lang][key]) {
    // Fallback to English if translation is missing
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    // Return the key itself as last resort
    return key;
  }
  return translations[lang][key];
}

// Helper function to determine if a string should be translated
// This prevents dish names, descriptions, and other content data from being translated
export function shouldTranslate(key: string): boolean {
  // Only translate UI elements defined in our TranslationKeys type
  return Object.keys(translations.en).includes(key as keyof TranslationKeys);
}