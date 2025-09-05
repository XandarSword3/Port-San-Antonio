export type Language = 'en' | 'ar' | 'fr'

export type TranslationKeys = 
  // Navigation & Common
  | 'siteTitle'
  | 'welcomeTo'
  | 'experienceLuxury'
  | 'exploreMenu'
  | 'menu'
  | 'admin'
  | 'debug'
  | 'home'
  | 'back'
  | 'close'
  | 'share'
  | 'noResults'
  | 'contactUs'
  | 'followUs'
  | 'search'
  | 'goBack'
  | 'itemAdded'
  | 'orderNow'
  | 'quantity'
  | 'specialInstructions'
  | 'orderSuccess'
  | 'orderError'
  | 'tryAgain'
  | 'variants'
  | 'price'
  | 'selectOption'
  | 'popular'
  | 'total'
  
  // Menu Related
  | 'menuTitle'
  | 'searchPlaceholder'
  | 'filters'
  | 'clearAll'
  | 'available'
  | 'unavailable'
  | 'details'
  | 'viewDetails'
  | 'longPressHint'
  | 'allDishes'
  
  // Categories
  | 'starters'
  | 'salads'
  | 'pizza'
  | 'pasta'
  | 'mains'
  | 'desserts'
  | 'beverages'
  | 'burgers'
  | 'sandwiches'
  | 'platters'
  | 'drinks'
  | 'beers'
  | 'arak'
  | 'prosecco'
  | 'wine'
  | 'signatureCocktails'
  
  // Dietary tags
  | 'vegetarian'
  | 'vegan'
  | 'glutenFree'
  | 'nutsFree'
  | 'sugarFree'
  | 'dairyFree'
  | 'keto'
  | 'paleo'
  
  // Price ranges
  | 'priceUnder10'
  | 'price11to20'
  | 'priceOver20'
  
  // Modal content
  | 'calories'
  | 'allergens'
  | 'ingredients'
  | 'description'
  | 'editItem'
  
  // Common actions
  | 'loading'
  | 'error'
  | 'retry'
  | 'cancel'
  | 'confirm'
  | 'save'
  | 'delete'
  | 'edit'
  | 'viewMenu'
  | 'toMenu'
  | 'cart'
  | 'items'
  | 'cartEmpty'
  | 'addToCart'
  | 'removeFromCart'
  | 'checkout'
  | 'backToTop'
  | 'mobileMenu'
  | 'closeMenu'
  | 'spa'
  | 'spaPackages'
  | 'wellness'
  | 'relaxation'
  | 'footer'
  | 'contact'
  | 'legal'
  | 'privacy'
  | 'terms'
  | 'copyright'

export const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    // Navigation & Common
    siteTitle: 'Port San Antonio Resort',
    welcomeTo: 'Welcome to',
    experienceLuxury: 'Experience luxury like never before at our beachside paradise',
    exploreMenu: 'Explore Our Menu',
    menu: 'Menu',
    admin: 'Admin',
    debug: 'Debug',
    home: 'Home',
    back: 'Back',
    close: 'Close',
    share: 'Share',
    noResults: 'No results match your filters',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    search: 'Search',
    goBack: 'Go Back',
    itemAdded: 'Item added to cart',
    orderNow: 'Order Now',
    quantity: 'Quantity',
    specialInstructions: 'Special Instructions',
    orderSuccess: 'Order placed successfully',
    orderError: 'Error placing order',
    tryAgain: 'Please try again',
    variants: 'Variants',
    selectOption: 'Select Option',
    price: 'Price',
    popular: 'Popular',
    total: 'Total',
    
    // Menu Related
    menuTitle: 'Our Menu',
    searchPlaceholder: 'Search menu items, ingredients...',
    filters: 'Filters',
    clearAll: 'Clear All',
    available: 'Available',
    unavailable: 'Currently unavailable',
    details: 'Details',
    viewDetails: 'View Details',
    longPressHint: 'Hold for details',
    allDishes: 'All Dishes',
    
    // Categories
    starters: 'Starters',
    salads: 'Salads',
    pizza: 'Pizza',
    pasta: 'Pasta',
    mains: 'Main Courses',
    desserts: 'Desserts',
    beverages: 'Beverages',
    burgers: 'Burgers',
    sandwiches: 'Sandwiches',
    platters: 'Platters',
    drinks: 'Drinks',
    beers: 'Beers',
    arak: 'Arak',
    prosecco: 'Prosecco & Couvent',
    wine: 'Wine',
    signatureCocktails: 'Signature Cocktails',
    
    // Dietary tags
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'Gluten Free',
    nutsFree: 'Nuts Free',
    sugarFree: 'Sugar Free',
    dairyFree: 'Dairy Free',
    keto: 'Keto',
    paleo: 'Paleo',
    
    // Price ranges
    priceUnder10: 'Under $10',
    price11to20: '$11 - $20',
    priceOver20: 'Over $20',
    
    // Modal content
    calories: 'Calories',
    allergens: 'Allergens',
    ingredients: 'Ingredients',
    description: 'Description',
    editItem: 'Edit Item',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    viewMenu: 'View Menu',
    toMenu: 'To Menu',
    cart: 'Cart',
    items: 'items',
    cartEmpty: 'Your cart is empty',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove from Cart',
    checkout: 'Checkout',
    backToTop: 'Back to Top',
    mobileMenu: 'Mobile Menu',
    closeMenu: 'Close Menu',
    spa: 'Spa',
    spaPackages: 'Spa Packages',
    wellness: 'Wellness',
    relaxation: 'Relaxation',
    footer: 'Footer',
    contact: 'Contact',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: 'All rights reserved',
  },
  
  ar: {
    // Navigation & Common
    siteTitle: 'منتجع بورت سان أنطونيو',
    welcomeTo: 'مرحباً بكم في',
    experienceLuxury: 'اختبر الفخامة كما لم تختبرها من قبل في جنتنا على الشاطئ',
    exploreMenu: 'استكشف قائمتنا',
    menu: 'القائمة',
    admin: 'الإدارة',
    debug: 'التصحيح',
    home: 'الرئيسية',
    back: 'رجوع',
    close: 'إغلاق',
    share: 'مشاركة',
    noResults: 'لا توجد نتائج تطابق تصفيتك',
    contactUs: 'تواصل معنا',
    followUs: 'تابعنا',
    search: 'بحث',
    goBack: 'رجوع',
    itemAdded: 'تمت إضافة العنصر إلى السلة',
    orderNow: 'اطلب الآن',
    addToCart: 'أضف إلى السلة',
    quantity: 'الكمية',
    specialInstructions: 'تعليمات خاصة',
    orderSuccess: 'تم تقديم الطلب بنجاح',
    orderError: 'خطأ في تقديم الطلب',
    tryAgain: 'الرجاء المحاولة مرة أخرى',
    variants: 'المتغيرات',
    price: 'السعر',
    selectOption: 'اختر خياراً',
    popular: 'مشهور',
    total: 'المجموع',
    
    // Menu Related
    menuTitle: 'قائمتنا',
    searchPlaceholder: 'البحث في الأطباق والمكونات...',
    filters: 'المرشحات',
    clearAll: 'مسح الكل',
    available: 'متوفر',
    unavailable: 'غير متوفر حالياً',
    details: 'التفاصيل',
    viewDetails: 'عرض التفاصيل',
    longPressHint: 'اضغط مطولاً للتفاصيل',
    allDishes: 'جميع الأطباق',
    
    // Categories
    starters: 'المقبلات',
    salads: 'السلطات',
    pizza: 'البيتزا',
    pasta: 'المعكرونة',
    mains: 'الأطباق الرئيسية',
    desserts: 'الحلويات',
    beverages: 'المشروبات',
    burgers: 'البرجر',
    sandwiches: 'الساندويتشات',
    platters: 'الصواني',
    drinks: 'المشروبات',
    beers: 'البيرة',
    arak: 'العرق',
    prosecco: 'البروسيكو والكوفنت',
    wine: 'النبيذ',
    signatureCocktails: 'الكوكتيلات المميزة',
    
    // Dietary tags
    vegetarian: 'نباتي',
    vegan: 'نباتي صرف',
    glutenFree: 'خالي من الغلوتين',
    nutsFree: 'خالي من المكسرات',
    sugarFree: 'خالي من السكر',
    dairyFree: 'خالي من الألبان',
    keto: 'كيتو',
    paleo: 'باليو',
    
    // Price ranges
    priceUnder10: 'أقل من 10$',
    price11to20: '11$ - 20$',
    priceOver20: 'أكثر من 20$',
    
    // Modal content
    calories: 'السعرات الحرارية',
    allergens: 'مسببات الحساسية',
    ingredients: 'المكونات',
    description: 'الوصف',
    editItem: 'تعديل العنصر',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    retry: 'إعادة المحاولة',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    viewMenu: 'عرض القائمة',
    toMenu: 'إلى القائمة',
    cart: 'السلة',
    items: 'عناصر',
    cartEmpty: 'سلتك فارغة',
    removeFromCart: 'إزالة من السلة',
    checkout: 'الدفع',
    backToTop: 'العودة للأعلى',
    mobileMenu: 'قائمة الهاتف',
    closeMenu: 'إغلاق القائمة',
    spa: 'السبا',
    spaPackages: 'باقات السبا',
    wellness: 'العافية',
    relaxation: 'الاسترخاء',
    footer: 'التذييل',
    contact: 'التواصل',
    legal: 'قانوني',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الخدمة',
    copyright: 'جميع الحقوق محفوظة',
  },
  
  fr: {
    // Navigation & Common
    siteTitle: 'Port San Antonio Resort',
    welcomeTo: 'Bienvenue à',
    experienceLuxury: 'Découvrez le luxe comme jamais auparavant dans notre paradis en bord de mer',
    exploreMenu: 'Découvrir Notre Menu',
    menu: 'Menu',
    admin: 'Admin',
    debug: 'Debug',
    home: 'Accueil',
    back: 'Retour',
    close: 'Fermer',
    share: 'Partager',
    noResults: 'Aucun résultat ne correspond à vos filtres',
    contactUs: 'Contactez-nous',
    followUs: 'Suivez-nous',
    search: 'Rechercher',
    goBack: 'Retour',
    itemAdded: 'Article ajouté au panier',
    orderNow: 'Commander',
    addToCart: 'Ajouter au Panier',
    quantity: 'Quantité',
    specialInstructions: 'Instructions spéciales',
    orderSuccess: 'Commande passée avec succès',
    orderError: 'Erreur lors de la commande',
    tryAgain: 'Veuillez réessayer',
    variants: 'Variantes',
    price: 'Prix',
    selectOption: 'Sélectionnez une option',
    popular: 'Populaire',
    total: 'Total',
    
    // Menu Related
    menuTitle: 'Notre Menu',
    searchPlaceholder: 'Rechercher des plats, ingrédients...',
    filters: 'Filtres',
    clearAll: 'Tout Effacer',
    available: 'Disponible',
    unavailable: 'Actuellement indisponible',
    details: 'Détails',
    viewDetails: 'Voir Détails',
    longPressHint: 'Maintenir pour détails',
    allDishes: 'Tous les Plats',
    
    // Categories
    starters: 'Entrées',
    salads: 'Salades',
    pizza: 'Pizza',
    pasta: 'Pâtes',
    mains: 'Plats Principaux',
    desserts: 'Desserts',
    beverages: 'Boissons',
    burgers: 'Burgers',
    sandwiches: 'Sandwiches',
    platters: 'Plateaux',
    drinks: 'Boissons',
    beers: 'Bières',
    arak: 'Arak',
    prosecco: 'Prosecco & Couvent',
    wine: 'Vin',
    signatureCocktails: 'Cocktails Signature',
    
    // Dietary tags
    vegetarian: 'Végétarien',
    vegan: 'Végan',
    glutenFree: 'Sans Gluten',
    nutsFree: 'Sans Noix',
    sugarFree: 'Sans Sucre',
    dairyFree: 'Sans Lait',
    keto: 'Keto',
    paleo: 'Paleo',
    
    // Price ranges
    priceUnder10: 'Moins de 10$',
    price11to20: '11$ - 20$',
    priceOver20: 'Plus de 20$',
    
    // Modal content
    calories: 'Calories',
    allergens: 'Allergènes',
    ingredients: 'Ingrédients',
    description: 'Description',
    editItem: 'Modifier l\'Article',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Sauvegarder',
    delete: 'Supprimer',
    edit: 'Modifier',
    viewMenu: 'Voir le Menu',
    toMenu: 'Au Menu',
    cart: 'Panier',
    items: 'articles',
    cartEmpty: 'Votre panier est vide',
    removeFromCart: 'Retirer du Panier',
    checkout: 'Commander',
    backToTop: 'Retour en Haut',
    mobileMenu: 'Menu Mobile',
    closeMenu: 'Fermer le Menu',
    spa: 'Spa',
    spaPackages: 'Forfaits Spa',
    wellness: 'Bien-être',
    relaxation: 'Relaxation',
    footer: 'Pied de Page',
    contact: 'Contact',
    legal: 'Légal',
    privacy: 'Politique de Confidentialité',
    terms: 'Conditions de Service',
    copyright: 'Tous droits réservés',
  }
}

export function getTranslation(language: Language, key: TranslationKeys): string {
  return translations[language]?.[key] || translations.en[key] || key
}

export function shouldTranslate(language: Language): boolean {
  return language !== 'en'
}