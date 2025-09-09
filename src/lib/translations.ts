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
  | 'cart'
  | 'items'
  | 'copiedToClipboard'
  | 'shareText'
  | 'staffLogin'
  | 'viewFullCart'
  | 'cartTotal'
  | 'proceedToCheckout'
  | 'payNow'
  | 'removeItem'
  | 'updateQuantity'
  | 'orderSummary'
  | 'subtotal'
  | 'tax'
  | 'totalAmount'
  | 'continueShopping'
  | 'checkoutSuccess'
  | 'paymentProcessing'
  | 'paymentError'
  | 'pleaseTryAgain'
  | 'orderConfirmation'
  | 'thankYou'
  | 'emailSent'
  | 'orderNumber'
  | 'estimatedDelivery'
  | 'trackOrder'
  | 'makeReservation'
  | 'clearCart'
  | 'username'
  | 'password'
  | 'login'
  | 'invalidCredentials'
  | 'loggingIn'
  | 'guestInfo'
  | 'staffRoles'
  
  // Additional UI Elements
  | 'searchMenu'
  | 'quickLinks'
  | 'accessibility'
  | 'careers'
  | 'reservations'
  | 'events'
  | 'diningAvailable24'
  | 'coastalParadise'
  | 'coastalParadiseDesc'
  | 'relaxOnSands'
  | 'availableInEnglish'
  | 'francais'
  | 'arabic'
  | 'experienceSerenity'
  | 'beachfrontLocation'
  | 'stunningOceanViews'
  | 'deliciousDish'
  | 'glutenTag'
  | 'dairyTag'
  | 'fishTag'
  | 'block'
  | 'goldenChickenNuggets'
  | 'crispyBatteredMozzarella'
  | 'curlyFries'
  | 'regularFries'
  | 'mozzarellaSticks'
  | 'chickenNuggets'
  
  // Beverages
  | 'signatureMargarita'
  | 'passionFruitMartini'
  | 'lemonDrop'
  | 'whiteChardonnay'
  | 'kasraReserve'
  | 'lebaneseWhiteWine'
  | 'proseccoWine'
  | 'couventWine' 
  | 'arakNA'
  | 'beirutBeer'
  | 'espresso'
  | 'arakBas'
  | 'arabicMuscat'
  | 'freshOrangeJuice'
  | 'freshLemonade'
  | 'largeWater'
  | 'smallWater'
  | 'perrierWater'
  | 'margaritaPitcher'
  | 'lebaneseCoffe'
  | 'softDrinks'
  | 'sangriaPitcher'
  | 'vodkaGreyGoose'
  | 'vodkaAbsolut'
  | 'vodkaRussianStandard'
  | 'tequilaJoseCuervo'
  | 'vodkaGeneric'
  
  // Food Items
  | 'chickenDelight'
  | 'chickenBurgerPlatter'
  | 'beefBurgerPlatter'
  | 'taoukPlatter'
  | 'seasonedChickenFajita'
  | 'chickenMelt'
  | 'tunaSub'
  | 'taoukSandwich'
  | 'classicBurger'
  | 'chickenBurger'
  | 'mozzarellaChickenMelt'
  | 'mozzarellaBeefMelt'
  | 'crispyChicken'
  
  // New Food Items from Analysis
  | 'chickenWings'
  | 'pepperoniPizza'
  | 'cheesePizza'
  | 'veggiePizza'
  | 'greekFusion'
  | 'crabSalad'
  | 'caesarSalad'
  | 'tunaPasta'
  | 'seasonalMix'
  
  // Additional UI Elements
  | 'stock'
  | 'addToCart'
  | 'subtotal'
  | 'deliveryFee'
  | 'shellfish'
  | 'allergenShellfish'
  | 'priceUnder20'
  | 'price20to50'
  | 'priceOver50'
  | 'languageCode'
  | 'available'
  | 'goldenChickenNuggetsDesc'
  | 'iceCucumbersDesc'
  | 'breadedChickenDesc'
  | 'beefPattyDesc'
  | 'skewersColeslawDesc'

export const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    // Navigation & Common
    siteTitle: 'Port Antonio Resort',
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
    copiedToClipboard: 'Copied to clipboard!',
    shareText: 'Share this item',
    staffLogin: 'Staff Login',
    viewFullCart: 'View Full Cart',
    cartTotal: 'Cart Total',
    proceedToCheckout: 'Proceed to Checkout',
    payNow: 'Pay Now',
    removeItem: 'Remove Item',
    updateQuantity: 'Update Quantity',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    tax: 'Tax',
    totalAmount: 'Total Amount',
    continueShopping: 'Continue Shopping',
    checkoutSuccess: 'Checkout Successful',
    paymentProcessing: 'Processing Payment...',
    paymentError: 'Payment Error',
    pleaseTryAgain: 'Please try again',
    orderConfirmation: 'Order Confirmation',
    thankYou: 'Thank You!',
    emailSent: 'Confirmation email sent',
    orderNumber: 'Order Number',
    estimatedDelivery: 'Estimated Delivery',
    trackOrder: 'Track Order',
    makeReservation: 'Make Reservation',
    clearCart: 'Clear Cart',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    invalidCredentials: 'Invalid username or password',
    loggingIn: 'Logging in...',
    guestInfo: 'Guests can browse without logging in',
    staffRoles: 'Staff Roles: Worker • Admin • Owner',
    
    // Additional UI Elements
    searchMenu: 'Search menu...',
    quickLinks: 'Quick Links',
    accessibility: 'Accessibility',
    careers: 'Careers',
    reservations: 'Reservations',
    events: 'Events',
    diningAvailable24: 'Dining Available 24/7',
    coastalParadise: 'Coastal Paradise',
    coastalParadiseDesc: 'Experience the serenity of our beachfront location with stunning ocean views',
    relaxOnSands: 'Relax on our Lebanese sands',
    availableInEnglish: 'Available in English',
    francais: 'Français',
    arabic: 'عربي',
    experienceSerenity: 'Experience the serenity',
    beachfrontLocation: 'beachfront location',
    stunningOceanViews: 'stunning ocean views',
    deliciousDish: 'Delicious dish',
    glutenTag: 'Gluten',
    dairyTag: 'Dairy',
    fishTag: 'Fish',
    block: 'Available',
    goldenChickenNuggets: 'Golden chicken nuggets',
    crispyBatteredMozzarella: 'Crispy battered mozzarella',
    curlyFries: 'Curly Fries',
    regularFries: 'Fries',
    mozzarellaSticks: 'Mozzarella Sticks',
    chickenNuggets: 'Chicken Nuggets',
    
    // Beverages
    signatureMargarita: 'Signature Margarita',
    passionFruitMartini: 'Passion Fruit Martini',
    lemonDrop: 'Lemon Drop',
    whiteChardonnay: 'White Chardonnay',
    kasraReserve: 'Kasra Reserve',
    lebaneseWhiteWine: 'Lebanese white wine',
    proseccoWine: 'Prosecco',
    couventWine: 'Couvent',
    arakNA: 'Arak (NA)',
    beirutBeer: 'Beirut Beer',
    espresso: 'Espresso',
    arakBas: 'Arak - Bas',
    arabicMuscat: 'Arabic Coffee - Muscat',
    freshOrangeJuice: 'Fresh Orange Juice',
    freshLemonade: 'Fresh Lemonade',
    largeWater: 'Large Water',
    smallWater: 'Small Water',
    perrierWater: 'Perrier Water',
    margaritaPitcher: 'Margarita (Pitcher)',
    lebaneseCoffe: 'Lebanese Coffee',
    softDrinks: 'Soft Drinks',
    sangriaPitcher: 'Sangria (Pitcher)',
    vodkaGreyGoose: 'Vodka - Grey Goose',
    vodkaAbsolut: 'Vodka - Absolut',
    vodkaRussianStandard: 'Vodka - Russian Standard',
    tequilaJoseCuervo: 'Tequila - Jose Cuervo',
    vodkaGeneric: 'Vodka',
    
    // Food Items
    chickenDelight: 'Chicken Delight',
    chickenBurgerPlatter: 'Chicken Burger Platter',
    beefBurgerPlatter: 'Beef Burger Platter',
    taoukPlatter: 'Taouk Platter',
    seasonedChickenFajita: 'Seasoned Chicken Fajita Fusion',
    chickenMelt: 'Chicken Melt',
    tunaSub: 'Tuna Sub',
    taoukSandwich: 'Taouk',
    classicBurger: 'Classic Burger',
    chickenBurger: 'Chicken Burger',
    mozzarellaChickenMelt: 'Mozzarella Chicken Melt',
    mozzarellaBeefMelt: 'Mozzarella Beef Melt',
    crispyChicken: 'Crispy Chicken',
    
    // New Food Items from Analysis
    chickenWings: 'Chicken Wings',
    pepperoniPizza: 'Pepperoni Pizza',
    cheesePizza: 'Cheese Pizza',
    veggiePizza: 'Veggie Pizza',
    greekFusion: 'Greek Fusion',
    crabSalad: 'Crab Salad',
    caesarSalad: 'Caesar Salad',
    tunaPasta: 'Tuna Pasta',
    seasonalMix: 'Seasonal Mix',
    
    // New required keys
    stock: 'Stock',
    deliveryFee: 'Delivery Fee',
    shellfish: 'Shellfish',
    allergenShellfish: 'Shellfish',
    priceUnder20: 'Under $20',
    price20to50: '$20-$50',
    priceOver50: 'Over $50',
    languageCode: 'EN',
    goldenChickenNuggetsDesc: 'Golden chicken nuggets',
    iceCucumbersDesc: 'Ice, Cucumbers, Cherry Rocca, Tomatoes, Lemon Oil',
    breadedChickenDesc: 'Breaded Chicken / Honey Mustard / BBQ, Lettuce, Chips',
    beefPattyDesc: 'Beef Patty, Mozzarella Beef Melt',
    skewersColeslawDesc: 'Skewers, Coleslaw, Fries, Garlic, 2 Hummus, Pickles, Lebanese Bread',
  },
  
  ar: {
    // Navigation & Common
    siteTitle: 'منتجع بورت أنطونيو',
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
    copiedToClipboard: 'تم النسخ إلى الحافظة!',
    shareText: 'شارك هذا العنصر',
    staffLogin: 'تسجيل دخول الموظفين',
    viewFullCart: 'عرض السلة كاملة',
    cartTotal: 'إجمالي السلة',
    proceedToCheckout: 'المتابعة للدفع',
    payNow: 'ادفع الآن',
    removeItem: 'إزالة العنصر',
    updateQuantity: 'تحديث الكمية',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    totalAmount: 'المبلغ الإجمالي',
    continueShopping: 'متابعة التسوق',
    checkoutSuccess: 'تم الدفع بنجاح',
    paymentProcessing: 'جاري معالجة الدفع...',
    paymentError: 'خطأ في الدفع',
    pleaseTryAgain: 'الرجاء المحاولة مرة أخرى',
    orderConfirmation: 'تأكيد الطلب',
    thankYou: 'شكراً لك!',
    emailSent: 'تم إرسال بريد التأكيد',
    orderNumber: 'رقم الطلب',
    estimatedDelivery: 'التسليم المقدر',
    trackOrder: 'تتبع الطلب',
    makeReservation: 'احجز طاولة',
    clearCart: 'إفراغ السلة',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    loggingIn: 'جاري تسجيل الدخول...',
    guestInfo: 'يمكن للضيوف التصفح بدون تسجيل دخول',
    staffRoles: 'أدوار الموظفين: عامل • مدير • مالك',
    
    // Additional UI Elements
    searchMenu: 'البحث في القائمة...',
    quickLinks: 'روابط سريعة',
    accessibility: 'إمكانية الوصول',
    careers: 'الوظائف',
    reservations: 'الحجوزات',
    events: 'الفعاليات',
    diningAvailable24: 'الطعام متوفر ٢٤/٧',
    coastalParadise: 'جنة الساحل',
    coastalParadiseDesc: 'استمتع بهدوء موقعنا على الشاطئ مع إطلالات رائعة على المحيط',
    relaxOnSands: 'استرخ على رمالنا اللبنانية',
    availableInEnglish: 'متوفر باللغة الإنجليزية',
    francais: 'الفرنسية',
    arabic: 'العربية',
    experienceSerenity: 'استمتع بالهدوء',
    beachfrontLocation: 'موقع على الشاطئ',
    stunningOceanViews: 'إطلالات رائعة على المحيط',
    deliciousDish: 'طبق لذيذ',
    glutenTag: 'جلوتين',
    dairyTag: 'ألبان',
    fishTag: 'سمك',
    block: 'متوفر',
    goldenChickenNuggets: 'قطع الدجاج الذهبية',
    crispyBatteredMozzarella: 'موزاريلا مقرمشة',
    curlyFries: 'البطاطس المجعدة',
    regularFries: 'البطاطس المقلية',
    mozzarellaSticks: 'أصابع الموزاريلا',
    chickenNuggets: 'قطع الدجاج',
    
    // Beverages
    signatureMargarita: 'مارجريتا مميزة',
    passionFruitMartini: 'مارتيني فاكهة الآلام',
    lemonDrop: 'قطرة الليمون',
    whiteChardonnay: 'شاردونيه أبيض',
    kasraReserve: 'كسرى احتياطي',
    lebaneseWhiteWine: 'نبيذ أبيض لبناني',
    proseccoWine: 'بروسيكو',
    couventWine: 'كوفينت',
    arakNA: 'عرق (بدون كحول)',
    beirutBeer: 'بيرة بيروت',
    espresso: 'إسبريسو',
    arakBas: 'عرق - باس',
    arabicMuscat: 'قهوة عربية - مسقط',
    freshOrangeJuice: 'عصير البرتقال الطازج',
    freshLemonade: 'عصير الليمون الطازج',
    largeWater: 'مياه كبيرة',
    smallWater: 'مياه صغيرة',
    perrierWater: 'مياه بيرير',
    margaritaPitcher: 'مارجريتا (إبريق)',
    lebaneseCoffe: 'قهوة لبنانية',
    softDrinks: 'مشروبات غازية',
    sangriaPitcher: 'سانجريا (إبريق)',
    vodkaGreyGoose: 'فودكا - جراي جوس',
    vodkaAbsolut: 'فودكا - أبسولوت',
    vodkaRussianStandard: 'فودكا - المعيار الروسي',
    tequilaJoseCuervo: 'تيكيلا - خوسيه كويرفو',
    vodkaGeneric: 'فودكا',
    
    // Food Items
    chickenDelight: 'لذة الدجاج',
    chickenBurgerPlatter: 'طبق برجر الدجاج',
    beefBurgerPlatter: 'طبق برجر اللحم',
    taoukPlatter: 'طبق الطاووق',
    seasonedChickenFajita: 'فاهيتا الدجاج المتبلة',
    chickenMelt: 'ذوبان الدجاج',
    tunaSub: 'ساندويتش التونة',
    taoukSandwich: 'طاووق',
    classicBurger: 'البرجر الكلاسيكي',
    chickenBurger: 'برجر الدجاج',
    mozzarellaChickenMelt: 'ذوبان دجاج بالموزاريلا',
    mozzarellaBeefMelt: 'ذوبان لحم بالموزاريلا',
    crispyChicken: 'دجاج مقرمش',
    
    // New Food Items from Analysis
    chickenWings: 'أجنحة الدجاج المقرمشة',
    pepperoniPizza: 'بيتزا البيبروني',
    cheesePizza: 'بيتزا الجبن',
    veggiePizza: 'بيتزا الخضار',
    greekFusion: 'الخلطة اليونانية',
    crabSalad: 'سلطة السلطعون',
    caesarSalad: 'سلطة قيصر',
    tunaPasta: 'معكرونة التونة',
    seasonalMix: 'الخلطة الموسمية',
    
    // New required keys
    stock: 'المخزون',
    deliveryFee: 'رسوم التوصيل',
    shellfish: 'قشريات',
    allergenShellfish: 'قشريات',
    priceUnder20: 'أقل من ٢٠ دولار',
    price20to50: '٢٠-٥٠ دولار',
    priceOver50: 'أكثر من ٥٠ دولار',
    languageCode: 'ع',
    goldenChickenNuggetsDesc: 'قطع دجاج ذهبية',
    iceCucumbersDesc: 'ثلج، خيار، جرجير كرزي، طماطم، زيت ليمون',
    breadedChickenDesc: 'دجاج مغطى / خردل بالعسل / باربكيو، خس، رقائق',
    beefPattyDesc: 'قرص لحم، ذوبان لحم بالموزاريلا',
    skewersColeslawDesc: 'أسياخ، سلطة كرنب، بطاطا مقلية، ثوم، ٢ حمُص، مخلل، خبز لبناني',
  },
  
  fr: {
    // Navigation & Common
    siteTitle: 'Port Antonio Resort',
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
    copiedToClipboard: 'Copié dans le presse-papiers!',
    shareText: 'Partager cet article',
    staffLogin: 'Connexion Personnel',
    viewFullCart: 'Voir le Panier Complet',
    cartTotal: 'Total du Panier',
    proceedToCheckout: 'Procéder au Paiement',
    payNow: 'Payer Maintenant',
    removeItem: 'Retirer l\'Article',
    updateQuantity: 'Mettre à Jour la Quantité',
    orderSummary: 'Résumé de la Commande',
    subtotal: 'Sous-total',
    tax: 'Taxe',
    totalAmount: 'Montant Total',
    continueShopping: 'Continuer les Achats',
    checkoutSuccess: 'Paiement Réussi',
    paymentProcessing: 'Traitement du Paiement...',
    paymentError: 'Erreur de Paiement',
    pleaseTryAgain: 'Veuillez réessayer',
    orderConfirmation: 'Confirmation de Commande',
    thankYou: 'Merci!',
    emailSent: 'Email de confirmation envoyé',
    orderNumber: 'Numéro de Commande',
    estimatedDelivery: 'Livraison Estimée',
    trackOrder: 'Suivre la Commande',
    makeReservation: 'Réserver une Table',
    clearCart: 'Vider le Panier',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    login: 'Connexion',
    invalidCredentials: 'Nom d\'utilisateur ou mot de passe invalide',
    loggingIn: 'Connexion en cours...',
    guestInfo: 'Les invités peuvent naviguer sans se connecter',
    staffRoles: 'Rôles du Personnel: Employé • Admin • Propriétaire',
    
    // Additional UI Elements
    searchMenu: 'Rechercher dans le menu...',
    quickLinks: 'Liens Rapides',
    accessibility: 'Accessibilité',
    careers: 'Carrières',
    reservations: 'Réservations',
    events: 'Événements',
    diningAvailable24: 'Restauration Disponible 24h/7j',
    coastalParadise: 'Paradis Côtier',
    coastalParadiseDesc: 'Découvrez la sérénité de notre emplacement en bord de mer avec des vues imprenables sur l\'océan',
    relaxOnSands: 'Détendez-vous sur nos sables libanais',
    availableInEnglish: 'Disponible en Anglais',
    francais: 'Français',
    arabic: 'Arabe',
    experienceSerenity: 'Découvrez la sérénité',
    beachfrontLocation: 'emplacement en bord de mer',
    stunningOceanViews: 'vues imprenables sur l\'océan',
    deliciousDish: 'Plat délicieux',
    glutenTag: 'Gluten',
    dairyTag: 'Produits laitiers',
    fishTag: 'Poisson',
    block: 'Disponible',
    goldenChickenNuggets: 'Nuggets de poulet dorés',
    crispyBatteredMozzarella: 'Mozzarella panée croustillante',
    curlyFries: 'Frites Bouclées',
    regularFries: 'Frites',
    mozzarellaSticks: 'Bâtonnets de Mozzarella',
    chickenNuggets: 'Nuggets de Poulet',
    
    // Beverages
    signatureMargarita: 'Margarita Signature',
    passionFruitMartini: 'Martini aux Fruits de la Passion',
    lemonDrop: 'Goutte de Citron',
    whiteChardonnay: 'Chardonnay Blanc',
    kasraReserve: 'Réserve Kasra',
    lebaneseWhiteWine: 'Vin blanc libanais',
    proseccoWine: 'Prosecco',
    couventWine: 'Couvent',
    arakNA: 'Arak (Sans Alcool)',
    beirutBeer: 'Bière de Beyrouth',
    espresso: 'Espresso',
    arakBas: 'Arak - Bas',
    arabicMuscat: 'Café Arabe - Muscat',
    freshOrangeJuice: 'Jus d\'Orange Frais',
    freshLemonade: 'Limonade Fraîche',
    largeWater: 'Grande Eau',
    smallWater: 'Petite Eau',
    perrierWater: 'Eau Perrier',
    margaritaPitcher: 'Margarita (Pichet)',
    lebaneseCoffe: 'Café Libanais',
    softDrinks: 'Boissons Gazeuses',
    sangriaPitcher: 'Sangria (Pichet)',
    vodkaGreyGoose: 'Vodka - Grey Goose',
    vodkaAbsolut: 'Vodka - Absolut',
    vodkaRussianStandard: 'Vodka - Russian Standard',
    tequilaJoseCuervo: 'Tequila - Jose Cuervo',
    vodkaGeneric: 'Vodka',
    
    // Food Items
    chickenDelight: 'Délice de Poulet',
    chickenBurgerPlatter: 'Plateau Burger au Poulet',
    beefBurgerPlatter: 'Plateau Burger au Bœuf',
    taoukPlatter: 'Plateau Taouk',
    seasonedChickenFajita: 'Fajita de Poulet Assaisonnée',
    chickenMelt: 'Fondu au Poulet',
    tunaSub: 'Sandwich au Thon',
    taoukSandwich: 'Taouk',
    classicBurger: 'Burger Classique',
    chickenBurger: 'Burger au Poulet',
    mozzarellaChickenMelt: 'Fondu Poulet Mozzarella',
    mozzarellaBeefMelt: 'Fondu Bœuf Mozzarella',
    crispyChicken: 'Poulet Croustillant',
    
    // New Food Items from Analysis
    chickenWings: 'Ailes de Poulet',
    pepperoniPizza: 'Pizza Pepperoni',
    cheesePizza: 'Pizza Fromage',
    veggiePizza: 'Pizza Végétarienne',
    greekFusion: 'Fusion Grecque',
    crabSalad: 'Salade de Crabe',
    caesarSalad: 'Salade César',
    tunaPasta: 'Pâtes au Thon',
    seasonalMix: 'Mélange Saisonnier',
    
    // New required keys
    stock: 'Stock',
    deliveryFee: 'Frais de Livraison',
    shellfish: 'Fruits de Mer',
    allergenShellfish: 'Fruits de Mer',
    priceUnder20: 'Moins de 20$',
    price20to50: '20$-50$',
    priceOver50: 'Plus de 50$',
    languageCode: 'FR',
    goldenChickenNuggetsDesc: 'Nuggets de poulet dorés',
    iceCucumbersDesc: 'Glace, Concombres, Roquette Cerises, Tomates, Huile de Citron',
    breadedChickenDesc: 'Poulet Pané / Moutarde au Miel / BBQ, Laitue, Chips',
    beefPattyDesc: 'Galette de Bœuf, Fondu Bœuf Mozzarella',
    skewersColeslawDesc: 'Brochettes, Salade de Chou, Frites, Ail, 2 Houmous, Cornichons, Pain Libanais',
  }
}

export function getTranslation(language: Language, key: TranslationKeys): string {
  return translations[language]?.[key] || translations.en[key] || key
}

export function shouldTranslate(language: Language): boolean {
  return language !== 'en'
}