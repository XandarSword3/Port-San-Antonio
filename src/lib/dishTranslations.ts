import { Dish, Category } from '@/types'
import { Language, getTranslation, TranslationKeys } from './translations'

// Sample translated dish data - in a real app, this would come from a CMS or database
const translatedDishes: Record<Language, Record<string, Partial<Dish>>> = {
  en: {
    'edamame': {
      name: 'Edamame',
      shortDesc: 'Steamed soybeans with sea salt',
      fullDesc: 'Fresh edamame pods steamed to perfection and lightly salted with sea salt. A healthy and delicious appetizer.',
      ingredients: ['Soybeans', 'Sea salt', 'Water']
    },
    'mozzarella-sticks': {
      name: 'Mozzarella Sticks (5pcs)',
      shortDesc: 'Crispy breaded mozzarella with marinara sauce',
      fullDesc: 'Golden crispy mozzarella sticks served with our house-made marinara sauce. Perfect for sharing.',
      ingredients: ['Mozzarella cheese', 'Breadcrumbs', 'Eggs', 'Flour', 'Marinara sauce']
    },
    'chicken-strips': {
      name: 'Chicken Strips (4pcs)',
      shortDesc: 'Crispy chicken strips served with fries',
      fullDesc: 'Crispy breaded chicken strips served with house-made fries and dipping sauce.',
      ingredients: ['Chicken breast', 'Breadcrumbs', 'Eggs', 'Flour', 'Fries', 'Dipping sauce']
    },
    'nuggets': {
      name: 'Nuggets (6pcs)',
      shortDesc: 'Crispy chicken nuggets with fries',
      fullDesc: 'Breaded chicken nuggets served with house-made fries and dipping sauce.',
      ingredients: ['Chicken breast', 'Breadcrumbs', 'Eggs', 'Flour', 'Fries', 'Dipping sauce']
    },
    'curly-fries': {
      name: 'Curly Fries',
      shortDesc: 'Crispy curly potato fries',
      fullDesc: 'Crispy curly potato fries seasoned with our special blend of spices.',
      ingredients: ['Potatoes', 'Vegetable oil', 'Spices', 'Salt']
    },
    'fries': {
      name: 'Fries',
      shortDesc: 'House-made crispy potato fries',
      fullDesc: 'Crispy house-made potato fries seasoned with sea salt.',
      ingredients: ['Potatoes', 'Vegetable oil', 'Sea salt']
    },
    'greek-fusion': {
      name: 'Greek Fusion',
      shortDesc: 'Fresh Greek salad with feta cheese',
      fullDesc: 'Fresh Greek salad with feta cheese, olives, tomatoes, and our signature dressing.',
      ingredients: ['Mixed greens', 'Feta cheese', 'Olives', 'Tomatoes', 'Greek dressing']
    },
    'tuna-pasta': {
      name: 'Tuna Pasta',
      shortDesc: 'Pasta with fresh tuna and vegetables',
      fullDesc: 'Pasta with fresh tuna, seasonal vegetables, and our house-made sauce.',
      ingredients: ['Pasta', 'Fresh tuna', 'Vegetables', 'House sauce']
    },
    'crab-salad': {
      name: 'Crab Salad',
      shortDesc: 'Fresh salad with crab meat',
      fullDesc: 'Fresh salad with premium crab meat, mixed greens, and light dressing.',
      ingredients: ['Crab meat', 'Mixed greens', 'Light dressing', 'Vegetables']
    },
    'chicken-caesar': {
      name: 'Chicken Caesar',
      shortDesc: 'Classic Caesar salad with grilled chicken',
      fullDesc: 'Classic Caesar salad with grilled chicken breast, romaine lettuce, and Caesar dressing.',
      ingredients: ['Grilled chicken', 'Romaine lettuce', 'Caesar dressing', 'Parmesan cheese']
    },
    'seasoned-mix': {
      name: 'Seasoned Mix',
      shortDesc: 'Seasoned vegetable mix',
      fullDesc: 'Fresh seasonal vegetables with our special blend of herbs and spices.',
      ingredients: ['Seasonal vegetables', 'Herbs', 'Spices', 'Olive oil']
    },
    'pepperoni-pizza': {
      name: 'Pepperoni Pizza',
      shortDesc: 'Classic pepperoni pizza with cheese',
      fullDesc: 'Traditional Italian pizza with pepperoni, mozzarella cheese, and our signature sauce.',
      ingredients: ['Pizza dough', 'Pepperoni', 'Mozzarella cheese', 'Pizza sauce']
    },
    'cheese-ham-pizza': {
      name: 'Cheese & Ham Pizza',
      shortDesc: 'Pizza with ham and cheese',
      fullDesc: 'Delicious pizza with premium ham, mozzarella cheese, and our signature sauce.',
      ingredients: ['Pizza dough', 'Ham', 'Mozzarella cheese', 'Pizza sauce']
    },
    'vegetarian-pizza': {
      name: 'Vegetarian Pizza',
      shortDesc: 'Vegetarian pizza with fresh vegetables',
      fullDesc: 'Fresh vegetarian pizza with seasonal vegetables, mozzarella cheese, and our signature sauce.',
      ingredients: ['Pizza dough', 'Seasonal vegetables', 'Mozzarella cheese', 'Pizza sauce']
    },
    'cheese-pizza': {
      name: 'Cheese Pizza',
      shortDesc: 'Classic cheese pizza',
      fullDesc: 'Classic Italian cheese pizza with mozzarella and our signature sauce.',
      ingredients: ['Pizza dough', 'Mozzarella cheese', 'Pizza sauce', 'Fresh basil']
    },
    'chicken-melt': {
      name: 'Chicken Melt',
      shortDesc: 'Chicken sandwich with melted cheese',
      fullDesc: 'Grilled chicken sandwich with melted cheese, served on artisan bread.',
      ingredients: ['Grilled chicken', 'Melted cheese', 'Artisan bread', 'Lettuce', 'Tomato']
    },
    'mozzarella-beef-melt': {
      name: 'Mozzarella Beef Melt',
      shortDesc: 'Beef sandwich with melted mozzarella',
      fullDesc: 'Premium beef sandwich with melted mozzarella cheese, served on artisan bread.',
      ingredients: ['Premium beef', 'Mozzarella cheese', 'Artisan bread', 'Lettuce', 'Tomato']
    },
    'cheese-burger': {
      name: 'Cheese Burger',
      shortDesc: 'Classic cheeseburger',
      fullDesc: 'Classic cheeseburger with premium beef, melted cheese, and fresh vegetables.',
      ingredients: ['Premium beef', 'Melted cheese', 'Bun', 'Lettuce', 'Tomato', 'Onion']
    },
    'classic-burger': {
      name: 'Classic Burger',
      shortDesc: 'Traditional beef burger',
      fullDesc: 'Traditional beef burger with premium beef and fresh vegetables.',
      ingredients: ['Premium beef', 'Bun', 'Lettuce', 'Tomato', 'Onion', 'Pickles']
    },
    'chicken-burger': {
      name: 'Chicken Burger',
      shortDesc: 'Chicken Breast, Lettuce, Tomato, Garlic Mayo',
      fullDesc: 'Grilled chicken breast burger with fresh lettuce, tomato, and garlic mayo.',
      ingredients: ['Chicken breast', 'Bun', 'Lettuce', 'Tomato', 'Garlic mayo']
    },
    'crispy-chicken': {
      name: 'Crispy Chicken',
      shortDesc: 'Breaded Chicken (plain / honey mustard / BBQ), Lettuce, Chips',
      fullDesc: 'Crispy breaded chicken burger with choice of sauce, lettuce and chips.',
      ingredients: ['Breaded chicken', 'Bun', 'Lettuce', 'Chips', 'Sauce']
    },
    'mozz-beef-melt': {
      name: 'Mozzarella Beef Melt',
      shortDesc: 'Beef Patty, Breaded Mozzarella, Lettuce',
      fullDesc: 'Beef patty with breaded mozzarella and fresh lettuce.',
      ingredients: ['Beef patty', 'Breaded mozzarella', 'Bun', 'Lettuce']
    },
    'mozz-chicken-melt': {
      name: 'Mozzarella Chicken Melt',
      shortDesc: 'Chicken Breast, Breaded Mozzarella',
      fullDesc: 'Grilled chicken breast with breaded mozzarella cheese.',
      ingredients: ['Chicken breast', 'Breaded mozzarella', 'Bun']
    },
    'fajita-fusion': {
      name: 'Fajita Fusion',
      shortDesc: 'Seasoned Chicken, Mozzarella, Peppers, Onions, Corn, Secret Sauce',
      fullDesc: 'Fusion sandwich with seasoned chicken, mozzarella, peppers, onions, corn and our secret sauce.',
      ingredients: ['Seasoned chicken', 'Mozzarella', 'Peppers', 'Onions', 'Corn', 'Secret sauce']
    },
    'taouk-sandwich': {
      name: 'Taouk',
      shortDesc: 'Lebanese Bread, Marinated Chicken, Fries, Garlic Paste, Pickles, Coleslaw',
      fullDesc: 'Traditional Lebanese taouk sandwich with marinated chicken, served with fries, garlic paste, pickles and coleslaw in Lebanese bread.',
      ingredients: ['Lebanese bread', 'Marinated chicken', 'Fries', 'Garlic paste', 'Pickles', 'Coleslaw']
    },
    'taouk-platter': {
      name: 'Taouk Platter',
      shortDesc: '2 Skewers, Coleslaw, Fries, Garlic Paste, Hummus, Pickles, Lebanese Bread',
      fullDesc: 'Traditional Lebanese taouk platter with 2 skewers, coleslaw, fries, garlic paste, hummus, pickles and Lebanese bread.',
      ingredients: ['Chicken skewers', 'Coleslaw', 'Fries', 'Garlic paste', 'Hummus', 'Pickles', 'Lebanese bread']
    },
    'chicken-sub': {
      name: 'ساندويتش الدجاج',
      shortDesc: 'ساندويتش دجاج طازج',
      fullDesc: 'ساندويتش دجاج طازج مع الخضروات، يُقدم في خبز طري.',
      ingredients: ['دجاج مشوي', 'خبز ساب', 'خس', 'طماطم', 'بصل', 'مايونيز']
    },
    'tawouk': {
      name: 'Tawouk',
      shortDesc: 'Lebanese grilled chicken',
      fullDesc: 'Traditional Lebanese grilled chicken with our signature marinade and spices.',
      ingredients: ['Chicken breast', 'Lebanese marinade', 'Spices', 'Garlic', 'Lemon']
    },
    'tuna-sub': {
      name: 'Tuna Sub',
      shortDesc: 'Fresh tuna sandwich',
      fullDesc: 'Fresh tuna sandwich with vegetables, served on a soft sub roll.',
      ingredients: ['Fresh tuna', 'Sub roll', 'Lettuce', 'Tomato', 'Onion', 'Mayo']
    },
    'chicken-delight': {
      name: 'Chicken Delight',
      shortDesc: 'Special chicken dish with signature sauce',
      fullDesc: 'Special chicken dish with our signature sauce, served with rice and vegetables.',
      ingredients: ['Chicken breast', 'Signature sauce', 'Rice', 'Vegetables', 'Spices']
    },
    'tawouk-platter': {
      name: 'Tawouk Platter',
      shortDesc: 'Tawouk platter with rice and vegetables',
      fullDesc: 'Lebanese tawouk platter with rice, vegetables, and our signature sauce.',
      ingredients: ['Tawouk chicken', 'Rice', 'Vegetables', 'Signature sauce', 'Hummus']
    },
    'chicken-burger-platter': {
      name: 'Chicken Burger Platter',
      shortDesc: 'Chicken burger with fries',
      fullDesc: 'Chicken burger platter served with fries and coleslaw.',
      ingredients: ['Chicken burger', 'Fries', 'Coleslaw', 'Dipping sauce']
    },
    'beef-burger-platter': {
      name: 'Beef Burger Platter',
      shortDesc: 'Beef burger with fries',
      fullDesc: 'Beef burger platter served with fries and coleslaw.',
      ingredients: ['Beef burger', 'Fries', 'Coleslaw', 'Dipping sauce']
    },
    'vodka-grey-goose': {
      name: 'Grey Goose Vodka',
      shortDesc: 'Premium French vodka',
      fullDesc: 'Premium French vodka, perfect for cocktails or neat.',
      ingredients: ['Grey Goose vodka']
    },
    'vodka-stolichnaya': {
      name: 'فودكا ستوليتشنايا',
      shortDesc: 'Traditional Russian vodka',
      fullDesc: 'Traditional Russian vodka with a smooth finish.',
      ingredients: ['Stolichnaya vodka']
    },
    'vodka-absolut': {
      name: 'فودكا أبسولوت',
      shortDesc: 'Distinctive Swedish vodka',
      fullDesc: 'Distinctive Swedish vodka with a clean, crisp taste.',
      ingredients: ['Absolut vodka']
    },
    'vodka-russian-standard': {
      name: 'فودكا روسيان ستاندرد',
      shortDesc: 'Classic Russian vodka',
      fullDesc: 'Classic Russian vodka with traditional character.',
      ingredients: ['Russian Standard vodka']
    },
    'sangria-pitcher': {
      name: 'Sangria Pitcher',
      shortDesc: 'Fresh sangria with fruits',
      fullDesc: 'Fresh sangria made with red wine, fruits, and our signature blend.',
      ingredients: ['Red wine', 'Fresh fruits', 'Brandy', 'Orange juice']
    },
    'tequila-jose-cuervo': {
      name: 'تكيلا خوسيه كويرفو',
      shortDesc: 'Authentic Mexican tequila',
      fullDesc: 'Authentic Mexican tequila with traditional character.',
      ingredients: ['Jose Cuervo tequila']
    },
    'gin-gordons': {
      name: 'جين جوردونز',
      shortDesc: 'Classic British gin',
      fullDesc: 'Classic British gin with juniper and botanical notes.',
      ingredients: ['Gordons gin']
    },
    'jame': {
      name: 'Jame',
      shortDesc: 'Distinctive Scottish whisky',
      fullDesc: 'Distinctive Scottish whisky with rich character.',
      ingredients: ['Jame whisky']
    },
    'soft-drink': {
      name: 'Soft Drink',
      shortDesc: 'Refreshing soft drink',
      fullDesc: 'Refreshing soft drink, perfect with any meal.',
      ingredients: ['Carbonated water', 'Sugar', 'Natural flavors']
    },
    'ice-tea': {
      name: 'Ice Tea',
      shortDesc: 'Black iced tea with lemon',
      fullDesc: 'Refreshing black iced tea with fresh lemon.',
      ingredients: ['Black tea', 'Lemon', 'Sugar', 'Ice']
    },
    'perrier-water': {
      name: 'Perrier Water',
      shortDesc: 'Sparkling mineral water',
      fullDesc: 'Refreshing sparkling mineral water.',
      ingredients: ['Mineral water', 'Carbon dioxide']
    },
    'fresh-orange-juice': {
      name: 'Fresh Orange Juice',
      shortDesc: 'Freshly squeezed orange juice',
      fullDesc: 'Freshly squeezed orange juice made from premium oranges, served chilled.',
      ingredients: ['Fresh oranges']
    },
    'almaza': {
      name: 'Almaza',
      shortDesc: 'Light Lebanese beer',
      fullDesc: 'Light and refreshing Lebanese beer.',
      ingredients: ['Malt', 'Hops', 'Water', 'Yeast']
    },
    'beirut': {
      name: 'Beirut',
      shortDesc: 'Distinctive Lebanese beer',
      fullDesc: 'Distinctive Lebanese beer with rich flavor.',
      ingredients: ['Malt', 'Hops', 'Water', 'Yeast']
    },
    'arak': {
      name: 'Arak (N/A)',
      shortDesc: 'Traditional Lebanese aniseed spirit',
      fullDesc: 'Traditional Lebanese aniseed spirit, currently unavailable.',
      ingredients: ['Aniseed', 'Grapes', 'Water']
    },
    'couvent': {
      name: 'Couvent',
      shortDesc: 'French sparkling wine',
      fullDesc: 'Elegant French sparkling wine.',
      ingredients: ['Grapes', 'Yeast', 'Sugar']
    },
    'prosecco': {
      name: 'Prosecco',
      shortDesc: 'Italian sparkling wine',
      fullDesc: 'Refreshing Italian sparkling wine.',
      ingredients: ['Glera grapes', 'Yeast', 'Sugar']
    },
    'white-chardonnay': {
      name: 'White Chardonnay',
      shortDesc: 'Classic French white wine',
      fullDesc: 'Classic French white wine with elegant character.',
      ingredients: ['Chardonnay grapes', 'Yeast']
    },
    'ksar-reserve': {
      name: 'Ksar Reserve',
      shortDesc: 'Distinctive reserve wine',
      fullDesc: 'Distinctive reserve wine with rich character.',
      ingredients: ['Premium grapes', 'Yeast', 'Oak aging']
    },
    'signature-margarita': {
      name: 'Signature Margarita',
      shortDesc: 'Signature margarita cocktail',
      fullDesc: 'Our signature margarita cocktail with premium tequila and fresh lime.',
      ingredients: ['Premium tequila', 'Fresh lime', 'Triple sec', 'Salt']
    },
    'passion-fruit-martini': {
      name: 'Passion Fruit Martini',
      shortDesc: 'Martini with passion fruit',
      fullDesc: 'Elegant martini cocktail with passion fruit and premium vodka.',
      ingredients: ['Premium vodka', 'Passion fruit', 'Vermouth', 'Lime']
    },
    'lemon-drop': {
      name: 'Lemon Drop',
      shortDesc: 'Refreshing lemon cocktail',
      fullDesc: 'Refreshing lemon cocktail with premium vodka and fresh lemon.',
      ingredients: ['Premium vodka', 'Fresh lemon', 'Sugar', 'Ice']
    },
    'mozz-sticks': {
      name: 'Mozzarella Sticks (5pcs)',
      shortDesc: 'Crispy battered mozzarella',
      fullDesc: 'Golden crispy mozzarella sticks served with marinara sauce.',
      ingredients: ['Mozzarella cheese', 'Breadcrumbs', 'Eggs', 'Flour', 'Marinara sauce']
    },
    'nuggets-6': {
      name: 'Nuggets (6pcs)',
      shortDesc: 'Golden chicken nuggets',
      fullDesc: 'Crispy golden chicken nuggets served with dipping sauce.',
      ingredients: ['Chicken breast', 'Breadcrumbs', 'Eggs', 'Flour', 'Dipping sauce']
    },
    'espresso': {
      name: 'Espresso',
      shortDesc: 'Strong Italian coffee',
      fullDesc: 'Rich and strong Italian espresso coffee.',
      ingredients: ['Premium coffee beans', 'Water']
    },
    'fresh-lemonade': {
      name: 'Fresh Lemonade',
      shortDesc: 'Fresh squeezed lemonade',
      fullDesc: 'Refreshing fresh squeezed lemonade made daily.',
      ingredients: ['Fresh lemons', 'Sugar', 'Water', 'Ice']
    },
    'small-water': {
      name: 'Small Water',
      shortDesc: 'Small bottle of water',
      fullDesc: 'Small bottle of pure drinking water.',
      ingredients: ['Pure water']
    },
    'large-water': {
      name: 'Large Water',
      shortDesc: 'Large bottle of water',
      fullDesc: 'Large bottle of pure drinking water.',
      ingredients: ['Pure water']
    },
    'soft-drinks': {
      name: 'Soft Drinks',
      shortDesc: 'Assorted soft drinks',
      fullDesc: 'Selection of popular soft drinks and sodas.',
      ingredients: ['Carbonated water', 'Flavoring', 'Sugar']
    },
    'juices': {
      name: 'Juices',
      shortDesc: 'Fresh fruit juices',
      fullDesc: 'Selection of fresh fruit juices.',
      ingredients: ['Fresh fruits', 'Water']
    },
    'lebanese-coffee': {
      name: 'Lebanese Coffee',
      shortDesc: 'Traditional Lebanese coffee',
      fullDesc: 'Traditional Lebanese coffee, finely ground and aromatic.',
      ingredients: ['Lebanese coffee beans', 'Water', 'Cardamom']
    },
    'margarita-pitcher': {
      name: 'Margarita (Pitcher)',
      shortDesc: 'Premium margarita pitcher',
      fullDesc: 'Large pitcher of premium margarita cocktail, perfect for sharing.',
      ingredients: ['Tequila', 'Triple sec', 'Lime juice', 'Salt', 'Ice']
    },
    'perrier-soda-water': {
      name: 'Perrier / Soda Water',
      shortDesc: 'Sparkling mineral water',
      fullDesc: 'Refreshing sparkling mineral water.',
      ingredients: ['Mineral water', 'Carbon dioxide']
    },
    'ksara-reserve': {
      name: 'Ksara Reserve',
      shortDesc: 'Lebanese red wine',
      fullDesc: 'Premium Lebanese red wine from Ksara winery.',
      ingredients: ['Red grapes', 'Yeast']
    },
    'beirut-beer': {
      name: 'Beirut',
      shortDesc: 'Lebanese beer',
      fullDesc: 'Distinctive Lebanese beer with rich flavor.',
      ingredients: ['Malt', 'Hops', 'Water', 'Yeast']
    },
    'arak-na': {
      name: 'Arak (N/A)',
      shortDesc: 'Traditional Lebanese arak',
      fullDesc: 'Traditional Lebanese arak with anise flavor.',
      ingredients: ['Grapes', 'Anise', 'Water']
    },
    'arguileh-mouassal': {
      name: 'Arguileh — Mouassal',
      shortDesc: 'Traditional Lebanese water pipe with molasses tobacco',
      fullDesc: 'Traditional Lebanese water pipe (hookah) with premium molasses tobacco flavors.',
      ingredients: ['Molasses tobacco', 'Charcoal', 'Water']
    },
    'arguileh-ras': {
      name: 'Arguileh — Ras',
      shortDesc: 'Traditional Lebanese water pipe with tobacco head',
      fullDesc: 'Traditional Lebanese water pipe (hookah) with tobacco head preparation.',
      ingredients: ['Tobacco', 'Charcoal', 'Water']
    },
    'tequila-jose-white': {
      name: 'Tequila — Jose Cuervo White',
      shortDesc: 'Premium white tequila',
      fullDesc: 'Premium Jose Cuervo white tequila, perfect for cocktails.',
      ingredients: ['Agave', 'Water']
    },
    'vodka-stoli': {
      name: 'Vodka — Stolichnaya',
      shortDesc: 'Traditional Russian vodka',
      fullDesc: 'Traditional Russian vodka with smooth finish.',
      ingredients: ['Grain', 'Water']
    },
    'perrier': {
      name: 'Perrier / Soda Water',
      shortDesc: 'Sparkling mineral water',
      fullDesc: 'Premium French sparkling mineral water.',
      ingredients: ['Water', 'CO2']
    },
    'fresh-orange': {
      name: 'Fresh Orange Juice',
      shortDesc: 'Freshly squeezed orange juice',
      fullDesc: 'Freshly squeezed orange juice, no additives.',
      ingredients: ['Orange']
    }
  },
  
  ar: {
    'edamame': {
      name: 'إدامامي',
      shortDesc: 'فول الصويا المطهو على البخار مع ملح البحر',
      fullDesc: 'قرون إدامامي طازجة مطهوة على البخار بشكل مثالي ومملحة قليلاً بملح البحر. مقبلات صحية ولذيذة.',
      ingredients: ['فول الصويا', 'ملح البحر', 'ماء']
    },
    'mozzarella-sticks': {
      name: 'عصي الموزاريلا (5 قطع)',
      shortDesc: 'موزاريلا مقرمشة مع صلصة المارينارا',
      fullDesc: 'عصي موزاريلا ذهبية مقرمشة تقدم مع صلصة المارينارا المصنوعة في المنزل. مثالية للمشاركة.',
      ingredients: ['جبن الموزاريلا', 'فتات الخبز', 'بيض', 'دقيق', 'صلصة المارينارا']
    },
    'chicken-strips': {
      name: 'شرائح الدجاج المقرمشة',
      shortDesc: 'شرائح دجاج مقرمشة تقدم مع البطاطس المقلية',
      fullDesc: 'شرائح دجاج مقرمشة تقدم مع بطاطس منزلية وصلصة غمس.',
      ingredients: ['صدر دجاج', 'فتات الخبز', 'بيض', 'دقيق', 'بطاطس مقلية', 'صلصة غمس']
    },
    'nuggets': {
      name: 'قطع الدجاج المقرمشة',
      shortDesc: 'ناجتس دجاج مقرمشة تقدم مع البطاطس المقلية',
      fullDesc: 'ناجتس دجاج مقرمشة تقدم مع بطاطس منزلية وصلصة غمس.',
      ingredients: ['صدر دجاج', 'فتات الخبز', 'بيض', 'دقيق', 'بطاطس مقلية', 'صلصة غمس']
    },
    'curly-fries': {
      name: 'بطاطس مجعدة',
      shortDesc: 'بطاطس مقلية مجعدة ومقرمشة',
      fullDesc: 'بطاطس مقلية مجعدة ومقرمشة مع التوابل الخاصة.',
      ingredients: ['بطاطس', 'زيت نباتي', 'توابل', 'ملح']
    },
    'fries': {
      name: 'بطاطس مقلية',
      shortDesc: 'بطاطس مقلية منزلية مقرمشة',
      fullDesc: 'بطاطس مقلية منزلية مقرمشة مع ملح البحر.',
      ingredients: ['بطاطس', 'زيت نباتي', 'ملح البحر']
    },
    'greek-fusion': {
      name: 'سلطة يونانية',
      shortDesc: 'سلطة يونانية طازجة مع جبن الفيتا',
      fullDesc: 'سلطة يونانية طازجة مع جبن الفيتا والزيتون والطماطم وصلصة يونانية مميزة.',
      ingredients: ['خضروات مختلطة', 'جبن الفيتا', 'زيتون', 'طماطم', 'صلصة يونانية']
    },
    'tuna-pasta': {
      name: 'معكرونة التونة',
      shortDesc: 'معكرونة مع التونة والخضروات الطازجة',
      fullDesc: 'معكرونة مع التونة الطازجة والخضروات الموسمية وصلصة منزلية.',
      ingredients: ['معكرونة', 'تونة طازجة', 'خضروات', 'صلصة منزلية']
    },
    'crab-salad': {
      name: 'سلطة السلطعون',
      shortDesc: 'سلطة طازجة مع لحم السلطعون',
      fullDesc: 'سلطة طازجة مع لحم سلطعون مميز وخضروات مختلطة وصلصة خفيفة.',
      ingredients: ['لحم سلطعون', 'خضروات مختلطة', 'صلصة خفيفة', 'خضروات']
    },
    'chicken-caesar': {
      name: 'سلطة قيصر بالدجاج',
      shortDesc: 'سلطة قيصر كلاسيكية مع الدجاج المشوي',
      fullDesc: 'سلطة قيصر كلاسيكية مع صدر دجاج مشوي وخس الرومين وصلصة قيصر.',
      ingredients: ['دجاج مشوي', 'خس الرومين', 'صلصة قيصر', 'جبن البارميزان']
    },
    'seasoned-mix': {
      name: 'خليط متبل',
      shortDesc: 'خليط من الخضروات الطازجة مع التوابل',
      fullDesc: 'خضروات موسمية طازجة مع مزيج خاص من الأعشاب والتوابل.',
      ingredients: ['خضروات موسمية', 'أعشاب', 'توابل', 'زيت زيتون']
    },
    'pepperoni-pizza': {
      name: 'بيتزا الببروني',
      shortDesc: 'بيتزا ببروني كلاسيكية مع الجبن',
      fullDesc: 'بيتزا إيطالية تقليدية مع الببروني وجبن الموزاريلا وصلصة البيتزا المميزة.',
      ingredients: ['عجين البيتزا', 'ببروني', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'cheese-ham-pizza': {
      name: 'بيتزا الجبن واللحم',
      shortDesc: 'بيتزا مع اللحم المقدد والجبن',
      fullDesc: 'بيتزا لذيذة مع لحم مقدد مميز وجبن الموزاريلا وصلصة البيتزا المميزة.',
      ingredients: ['عجين البيتزا', 'لحم مقدد', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'vegetarian-pizza': {
      name: 'بيتزا نباتية',
      shortDesc: 'بيتزا نباتية مع الخضروات الطازجة',
      fullDesc: 'بيتزا نباتية طازجة مع الخضروات الموسمية وجبن الموزاريلا وصلصة البيتزا المميزة.',
      ingredients: ['عجين البيتزا', 'خضروات موسمية', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'cheese-pizza': {
      name: 'بيتزا الجبن',
      shortDesc: 'بيتزا جبن كلاسيكية',
      fullDesc: 'بيتزا إيطالية كلاسيكية بالجبن مع الموزاريلا وصلصة البيتزا المميزة.',
      ingredients: ['عجين البيتزا', 'جبن الموزاريلا', 'صلصة البيتزا', 'ريحان طازج']
    },
    'chicken-melt': {
      name: 'ساندويتش دجاج مذاب',
      shortDesc: 'ساندويتش دجاج مع الجبن الذائب',
      fullDesc: 'ساندويتش دجاج مشوي مع الجبن الذائب، يقدم على خبز حرفي.',
      ingredients: ['دجاج مشوي', 'جبن ذائب', 'خبز حرفي', 'خس', 'طماطم']
    },
    'mozzarella-beef-melt': {
      name: 'ساندويتش اللحم والموزاريلا',
      shortDesc: 'ساندويتش لحم مع جبن الموزاريلا الذائب',
      fullDesc: 'ساندويتش لحم مميز مع جبن الموزاريلا الذائب، يقدم على خبز حرفي.',
      ingredients: ['لحم مميز', 'جبن الموزاريلا', 'خبز حرفي', 'خس', 'طماطم']
    },
    'chicken-wings': {
      name: 'أجنحة الدجاج المقرمشة',
      shortDesc: 'أجنحة دجاج مقرمشة',
      fullDesc: 'أجنحة دجاج مقرمشة متبلة ومقلية حتى الكمال.',
      ingredients: ['أجنحة دجاج', 'توابل', 'زيت نباتي', 'صلصة خاصة']
    },
    'seasonal-mix': {
      name: 'الخلطة الموسمية',
      shortDesc: 'خلطة موسمية من الخضروات',
      fullDesc: 'خلطة موسمية طازجة من الثلج والخيار والجرجير الكرزي والطماطم مع زيت الليمون.',
      ingredients: ['ثلج', 'خيار', 'جرجير كرزي', 'طماطم', 'زيت ليمون']
    },
    'pizza-cheese': {
      name: 'بيتزا الجبن',
      shortDesc: 'بيتزا جبن كلاسيكية',
      fullDesc: 'بيتزا إيطالية كلاسيكية بالجبن مع الموزاريلا وصلصة المارينارا.',
      ingredients: ['عجين البيتزا', 'جبن الموزاريلا', 'صلصة المارينارا', 'أوريغانو']
    },
    'pizza-pepperoni': {
      name: 'بيتزا الببروني',
      shortDesc: 'بيتزا ببروني كلاسيكية',
      fullDesc: 'بيتزا إيطالية تقليدية مع الببروني وجبن الموزاريلا.',
      ingredients: ['عجين البيتزا', 'ببروني', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'pizza-ham': {
      name: 'بيتزا الجبن واللحم',
      shortDesc: 'بيتزا مع اللحم والجبن',
      fullDesc: 'بيتزا لذيذة مع لحم مقدد وجبن الموزاريلا.',
      ingredients: ['عجين البيتزا', 'لحم مقدد', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'pizza-veg': {
      name: 'بيتزا نباتية',
      shortDesc: 'بيتزا نباتية مع الخضروات',
      fullDesc: 'بيتزا نباتية طازجة مع الخضروات الموسمية.',
      ingredients: ['عجين البيتزا', 'خضروات موسمية', 'جبن الموزاريلا', 'صلصة البيتزا']
    },
    'cheese-burger': {
      name: 'برجر الجبن',
      shortDesc: 'برجر جبن كلاسيكي',
      fullDesc: 'برجر جبن كلاسيكي مع لحم مميز وجبن ذائب وخضروات طازجة.',
      ingredients: ['لحم مميز', 'جبن ذائب', 'خبز البرجر', 'خس', 'طماطم', 'بصل']
    },
    'classic-burger': {
      name: 'البرجر الكلاسيكي',
      shortDesc: 'برجر لحم تقليدي',
      fullDesc: 'برجر لحم تقليدي مع لحم مميز وخضروات طازجة.',
      ingredients: ['لحم مميز', 'خبز البرجر', 'خس', 'طماطم', 'بصل', 'مخلل']
    },
    'chicken-burger': {
      name: 'برجر الدجاج',
      shortDesc: 'صدر دجاج، خس، طماطم، مايونيز بالثوم',
      fullDesc: 'برجر دجاج مشوي مع خس طازج وطماطم ومايونيز بالثوم.',
      ingredients: ['صدر دجاج', 'خبز البرجر', 'خس', 'طماطم', 'مايونيز بالثوم']
    },
    'crispy-chicken': {
      name: 'دجاج مقرمش',
      shortDesc: 'دجاج مغطى (عادي / خردل بالعسل / باربكيو)، خس، رقائق',
      fullDesc: 'برجر دجاج مقرمش مغطى مع اختيار الصلصة، خس ورقائق.',
      ingredients: ['دجاج مغطى', 'خبز البرجر', 'خس', 'رقائق', 'صلصة']
    },
    'mozz-beef-melt': {
      name: 'ساندويتش اللحم والموزاريلا',
      shortDesc: 'قرص لحم، موزاريلا مغطاة، خس',
      fullDesc: 'قرص لحم مع موزاريلا مغطاة وخس طازج.',
      ingredients: ['قرص لحم', 'موزاريلا مغطاة', 'خبز البرجر', 'خس']
    },
    'mozz-chicken-melt': {
      name: 'ساندويتش الدجاج والموزاريلا',
      shortDesc: 'صدر دجاج، موزاريلا مغطاة',
      fullDesc: 'صدر دجاج مشوي مع جبن الموزاريلا المغطى.',
      ingredients: ['صدر دجاج', 'موزاريلا مغطاة', 'خبز البرجر']
    },
    'fajita-fusion': {
      name: 'فاهيتا فيوجن',
      shortDesc: 'دجاج متبل، موزاريلا، فلفل، بصل، ذرة، صلصة سرية',
      fullDesc: 'ساندويتش فيوجن مع دجاج متبل وموزاريلا وفلفل وبصل وذرة وصلصتنا السرية.',
      ingredients: ['دجاج متبل', 'موزاريلا', 'فلفل', 'بصل', 'ذرة', 'صلصة سرية']
    },
    'taouk-sandwich': {
      name: 'طاووق',
      shortDesc: 'خبز لبناني، دجاج متبل، بطاطس، معجون الثوم، مخلل، سلطة كرنب',
      fullDesc: 'ساندويتش طاووق لبناني تقليدي مع دجاج متبل، يقدم مع بطاطس ومعجون الثوم والمخلل وسلطة الكرنب في خبز لبناني.',
      ingredients: ['خبز لبناني', 'دجاج متبل', 'بطاطس', 'معجون الثوم', 'مخلل', 'سلطة كرنب']
    },
    'taouk-platter': {
      name: 'صينية طاووق',
      shortDesc: '٢ سيخ، سلطة كرنب، بطاطس، معجون الثوم، حمُص، مخلل، خبز لبناني',
      fullDesc: 'صينية طاووق لبنانية تقليدية مع ٢ سيخ وسلطة كرنب وبطاطس ومعجون الثوم وحمُص ومخلل وخبز لبناني.',
      ingredients: ['أسياخ الدجاج', 'سلطة كرنب', 'بطاطس', 'معجون الثوم', 'حمُص', 'مخلل', 'خبز لبناني']
    },
    'chicken-sub': {
      name: 'ساندويتش الدجاج',
      shortDesc: 'ساندويتش دجاج طازج',
      fullDesc: 'ساندويتش دجاج طازج مع الخضروات، يقدم في خبز طري.',
      ingredients: ['دجاج مشوي', 'خبز سوب', 'خس', 'طماطم', 'بصل', 'مايونيز']
    },
    'tawouk': {
      name: 'طاووق',
      shortDesc: 'دجاج مشوي على الطريقة اللبنانية',
      fullDesc: 'دجاج مشوي لبناني تقليدي مع التتبيلة المميزة والتوابل.',
      ingredients: ['صدر دجاج', 'تتبيلة لبنانية', 'توابل', 'ثوم', 'ليمون']
    },
    'tuna-sub': {
      name: 'ساندويتش التونة',
      shortDesc: 'ساندويتش تونة طازجة',
      fullDesc: 'ساندويتش تونة طازجة مع الخضروات، يقدم على خبز سوب ناعم.',
      ingredients: ['تونة طازجة', 'خبز سوب', 'خس', 'طماطم', 'بصل', 'مايونيز']
    },
    'chicken-delight': {
      name: 'دجاج ديلايت',
      shortDesc: 'طبق دجاج مميز مع الصلصة الخاصة',
      fullDesc: 'طبق دجاج مميز مع الصلصة الخاصة، يقدم مع الأرز والخضروات.',
      ingredients: ['صدر دجاج', 'صلصة خاصة', 'أرز', 'خضروات', 'توابل']
    },
    'tawouk-platter': {
      name: 'صينية التاووك',
      shortDesc: 'صينية تاووك مع الأرز والخضروات',
      fullDesc: 'صينية تاووك لبنانية مع الأرز والخضروات والصلصة الخاصة.',
      ingredients: ['دجاج تاووك', 'أرز', 'خضروات', 'صلصة خاصة', 'حمص']
    },
    'chicken-burger-platter': {
      name: 'صينية برجر الدجاج',
      shortDesc: 'برجر دجاج مع البطاطس المقلية',
      fullDesc: 'صينية برجر دجاج تقدم مع البطاطس المقلية والسلطة.',
      ingredients: ['برجر دجاج', 'بطاطس مقلية', 'سلطة', 'صلصة غمس']
    },
    'beef-burger-platter': {
      name: 'صينية برجر اللحم',
      shortDesc: 'برجر لحم مع البطاطس المقلية',
      fullDesc: 'صينية برجر لحم تقدم مع البطاطس المقلية والسلطة.',
      ingredients: ['برجر لحم', 'بطاطس مقلية', 'سلطة', 'صلصة غمس']
    },
    'vodka-grey-goose': {
      name: 'فودكا جري جوز',
      shortDesc: 'فودكا فرنسية مميزة',
      fullDesc: 'فودكا فرنسية مميزة، مثالية للكوكتيلات أو نقية.',
      ingredients: ['فودكا جري جوز']
    },
    'vodka-stolichnaya': {
      name: 'فودكا ستوليتشنايا',
      shortDesc: 'فودكا روسية تقليدية',
      fullDesc: 'فودكا روسية تقليدية مع نهاية ناعمة.',
      ingredients: ['فودكا ستوليتشنيا']
    },
    'vodka-absolut': {
      name: 'فودكا أبسولوت',
      shortDesc: 'فودكا سويدية مميزة',
      fullDesc: 'فودكا سويدية مميزة مع طعم نظيف ومنعش.',
      ingredients: ['فودكا أبسولوت']
    },
    'vodka-russian-standard': {
      name: 'فودkا روسيان ستاندرد',
      shortDesc: 'فودكا روسية كلاسيكية',
      fullDesc: 'فودكا روسية كلاسيكية مع طابع تقليدي.',
      ingredients: ['فودكا راشن ستاندرد']
    },
    'sangria-pitcher': {
      name: 'سانجريا',
      shortDesc: 'سانجريا طازجة مع الفواكه',
      fullDesc: 'سانجريا طازجة مع النبيذ الأحمر والفواكه والمزيج الخاص.',
      ingredients: ['نبيذ أحمر', 'فواكه طازجة', 'كونياك', 'عصير برتقال']
    },
    'tequila-jose-cuervo': {
      name: 'تكيلا خوسيه كويرفو',
      shortDesc: 'تيكيلا مكسيكية أصيلة',
      fullDesc: 'تيكيلا مكسيكية أصيلة مع طابع تقليدي.',
      ingredients: ['تيكيلا خوسيه كويرفو']
    },
    'gin-gordons': {
      name: 'جين جوردونز',
      shortDesc: 'جن بريطاني كلاسيكي',
      fullDesc: 'جن بريطاني كلاسيكي مع نكهات العرعر والنباتات.',
      ingredients: ['جن جوردون']
    },
    'jame': {
      name: 'ويسكي جيمسون',
      shortDesc: 'ويسكي اسكتلندي مميز',
      fullDesc: 'ويسكي اسكتلندي مميز مع طابع غني.',
      ingredients: ['ويسكي جيم']
    },
    'soft-drink': {
      name: 'مشروبات غازية',
      shortDesc: 'مشروب غازي منعش',
      fullDesc: 'مشروب غازي منعش، مثالي مع أي وجبة.',
      ingredients: ['ماء غازي', 'سكر', 'نكهات طبيعية']
    },
    'ice-tea': {
      name: 'شاي مثلج',
      shortDesc: 'شاي أسود مثلج مع الليمون',
      fullDesc: 'شاي أسود مثلج منعش مع الليمون الطازج.',
      ingredients: ['شاي أسود', 'ليمون', 'سكر', 'ثلج']
    },
    'perrier-water': {
      name: 'مياه بيرير',
      shortDesc: 'مياه معدنية فوارة',
      fullDesc: 'مياه معدنية فوارة منعشة.',
      ingredients: ['مياه معدنية', 'ثاني أكسيد الكربون']
    },
    'fresh-orange-juice': {
      name: 'عصير البرتقال الطازج',
      shortDesc: 'عصير برتقال معصور طازجاً',
      fullDesc: 'عصير برتقال معصور طازجاً من البرتقال الممتاز، يقدم بارداً.',
      ingredients: ['برتقال طازج']
    },
    'almaza': {
      name: 'البيرة اللبنانية',
      shortDesc: 'بيرة لبنانية خفيفة',
      fullDesc: 'بيرة لبنانية خفيفة ومنعشة.',
      ingredients: ['شعير', 'جنجل', 'ماء', 'خميرة']
    },
    'beirut': {
      name: 'بيرة بيروت',
      shortDesc: 'بيرة لبنانية مميزة',
      fullDesc: 'بيرة لبنانية مميزة مع نكهة غنية.',
      ingredients: ['شعير', 'جنجل', 'ماء', 'خميرة']
    },
    'arak': {
      name: 'العرق اللبناني',
      shortDesc: 'عرق لبناني تقليدي باليانسون',
      fullDesc: 'عرق لبناني تقليدي باليانسون، غير متوفر حالياً.',
      ingredients: ['يانسون', 'عنب', 'ماء']
    },
    'couvent': {
      name: 'نبيذ كوفنت الأحمر',
      shortDesc: 'نبيذ فوار فرنسي',
      fullDesc: 'نبيذ فوار فرنسي أنيق.',
      ingredients: ['عنب', 'خميرة', 'سكر']
    },
    'prosecco': {
      name: 'بروسيكو إيطالي',
      shortDesc: 'نبيذ فوار إيطالي',
      fullDesc: 'نبيذ فوار إيطالي منعش.',
      ingredients: ['عنب غليرا', 'خميرة', 'سكر']
    },
    'white-chardonnay': {
      name: 'شاردونيه الأبيض',
      shortDesc: 'نبيذ أبيض فرنسي كلاسيكي',
      fullDesc: 'نبيذ أبيض فرنسي كلاسيكي مع طابع أنيق.',
      ingredients: ['عنب شاردونيه', 'خميرة']
    },
    'ksar-reserve': {
      name: 'كسار ريزيرف',
      shortDesc: 'نبيذ احتياطي مميز',
      fullDesc: 'نبيذ احتياطي مميز مع طابع غني.',
      ingredients: ['عنب مميز', 'خميرة', 'تقدم في البلوط']
    },
    'signature-margarita': {
      name: 'مارغريتا مميزة',
      shortDesc: 'كوكتيل مارغريتا مميز',
      fullDesc: 'كوكتيل مارغريتا المميز مع تيكيلا مميزة وليمون أخضر طازج.',
      ingredients: ['تيكيلا مميزة', 'ليمون أخضر طازج', 'تريبل سيك', 'ملح']
    },
    'passion-fruit-martini': {
      name: 'مارتيني فاكهة العاطفة',
      shortDesc: 'كوكتيل مارتيني مع فاكهة العاطفة',
      fullDesc: 'كوكتيل مارتيني أنيق مع فاكهة العاطفة وفودكا مميزة.',
      ingredients: ['فودكا مميزة', 'فاكهة العاطفة', 'فيرموث', 'ليمون أخضر']
    },
    'lemon-drop': {
      name: 'كوكتيل الليمون المنعش',
      shortDesc: 'كوكتيل ليمون منعش',
      fullDesc: 'كوكتيل ليمون منعش مع فودكا مميزة وليمون طازج.',
      ingredients: ['فودكا مميزة', 'ليمون طازج', 'سكر', 'ثلج']
    },
    'mozz-sticks': {
      name: 'أصابع الموزاريلا (٥ قطع)',
      shortDesc: 'موزاريلا مقرمشة مغطاة',
      fullDesc: 'أصابع موزاريلا ذهبية مقرمشة تقدم مع صلصة المارينارا.',
      ingredients: ['جبن الموزاريلا', 'فتات الخبز', 'بيض', 'دقيق', 'صلصة المارينارا']
    },
    'nuggets-6': {
      name: 'ناجتس (٦ قطع)',
      shortDesc: 'ناجتس دجاج ذهبية',
      fullDesc: 'ناجتس دجاج مقرمشة ذهبية تقدم مع صلصة غمس.',
      ingredients: ['صدر دجاج', 'فتات الخبز', 'بيض', 'دقيق', 'صلصة غمس']
    },
    'espresso': {
      name: 'إسبريسو',
      shortDesc: 'قهوة إيطالية قوية',
      fullDesc: 'قهوة إسبريسو إيطالية غنية وقوية.',
      ingredients: ['حبوب قهوة مميزة', 'ماء']
    },
    'fresh-lemonade': {
      name: 'ليمونادة طازجة',
      shortDesc: 'ليمونادة معصورة طازجة',
      fullDesc: 'ليمونادة طازجة معصورة يومياً ومنعشة.',
      ingredients: ['ليمون طازج', 'سكر', 'ماء', 'ثلج']
    },
    'small-water': {
      name: 'مياه صغيرة',
      shortDesc: 'زجاجة مياه صغيرة',
      fullDesc: 'زجاجة صغيرة من المياه النقية للشرب.',
      ingredients: ['مياه نقية']
    },
    'large-water': {
      name: 'مياه كبيرة',
      shortDesc: 'زجاجة مياه كبيرة',
      fullDesc: 'زجاجة كبيرة من المياه النقية للشرب.',
      ingredients: ['مياه نقية']
    },
    'soft-drinks': {
      name: 'مشروبات غازية',
      shortDesc: 'مشروبات غازية متنوعة',
      fullDesc: 'مجموعة من المشروبات الغازية والمرطبات الشائعة.',
      ingredients: ['مياه غازية', 'نكهات', 'سكر']
    },
    'juices': {
      name: 'عصائر',
      shortDesc: 'عصائر فواكه طازجة',
      fullDesc: 'مجموعة من عصائر الفواكه الطازجة.',
      ingredients: ['فواكه طازجة', 'ماء']
    },
    'lebanese-coffee': {
      name: 'قهوة لبنانية',
      shortDesc: 'قهوة لبنانية تقليدية',
      fullDesc: 'قهوة لبنانية تقليدية مطحونة ناعماً وعطرة.',
      ingredients: ['حبوب قهوة لبنانية', 'ماء', 'هيل']
    },
    'margarita-pitcher': {
      name: 'مارغريتا (إبريق)',
      shortDesc: 'إبريق مارغريتا مميز',
      fullDesc: 'إبريق كبير من كوكتيل المارغريتا المميز، مثالي للمشاركة.',
      ingredients: ['تكيلا', 'ترايبل سيك', 'عصير ليمون', 'ملح', 'ثلج']
    },
    'perrier-soda-water': {
      name: 'بيرييه / مياه غازية',
      shortDesc: 'مياه معدنية فوارة',
      fullDesc: 'مياه معدنية فوارة منعشة.',
      ingredients: ['مياه معدنية', 'ثاني أكسيد الكربون']
    },
    'ksara-reserve': {
      name: 'كسارة ريزيرف',
      shortDesc: 'نبيذ أحمر لبناني',
      fullDesc: 'نبيذ أحمر لبناني مميز من مصنع كسارة.',
      ingredients: ['عنب أحمر', 'خميرة']
    },
    'beirut-beer': {
      name: 'بيرة بيروت',
      shortDesc: 'بيرة لبنانية',
      fullDesc: 'بيرة لبنانية مميزة بطعم غني.',
      ingredients: ['شعير', 'جنجل', 'ماء', 'خميرة']
    },
    'arak-na': {
      name: 'العرق',
      shortDesc: 'عرق لبناني تقليدي',
      fullDesc: 'عرق لبناني تقليدي بنكهة اليانسون.',
      ingredients: ['عنب', 'يانسون', 'ماء']
    },
    'arguileh-mouassal': {
      name: 'أرجيلة — معسل',
      shortDesc: 'أرجيلة لبنانية تقليدية مع تبغ معسل',
      fullDesc: 'أرجيلة لبنانية تقليدية مع نكهات التبغ المعسل المميزة.',
      ingredients: ['تبغ معسل', 'فحم', 'ماء']
    },
    'arguileh-ras': {
      name: 'أرجيلة — رأس',
      shortDesc: 'أرجيلة لبنانية تقليدية مع رأس تبغ',
      fullDesc: 'أرجيلة لبنانية تقليدية مع تحضير رأس التبغ.',
      ingredients: ['تبغ', 'فحم', 'ماء']
    },
    'tequila-jose-white': {
      name: 'تكيلا — خوسيه كويرفو الأبيض',
      shortDesc: 'تكيلا بيضاء مميزة',
      fullDesc: 'تكيلا خوسيه كويرفو البيضاء المميزة، مثالية للكوكتيلات.',
      ingredients: ['أغاف', 'ماء']
    },
    'vodka-stoli': {
      name: 'فودكا — ستوليتشنايا',
      shortDesc: 'فودكا روسية تقليدية',
      fullDesc: 'فودكا روسية تقليدية بنهاية ناعمة.',
      ingredients: ['حبوب', 'ماء']
    },
    'perrier': {
      name: 'مياه بيرييه / مياه صودا',
      shortDesc: 'مياه معدنية فوارة',
      fullDesc: 'مياه معدنية فرنسية فوارة مميزة.',
      ingredients: ['ماء', 'ثاني أكسيد الكربون']
    },
    'fresh-orange': {
      name: 'عصير برتقال طازج',
      shortDesc: 'عصير برتقال معصور طازج',
      fullDesc: 'عصير برتقال معصور طازج، بدون إضافات.',
      ingredients: ['برتقال']
    }
  },
  
  fr: {
    'edamame': {
      name: 'Edamame',
      shortDesc: 'Fèves de soja cuites à la vapeur avec sel de mer',
      fullDesc: 'Cosses d\'edamame fraîches cuites à la vapeur à la perfection et légèrement salées avec du sel de mer. Un apéritif sain et délicieux.',
      ingredients: ['Fèves de soja', 'Sel de mer', 'Eau']
    },
    'mozzarella-sticks': {
      name: 'Bâtonnets de Mozzarella (5pcs)',
      shortDesc: 'Mozzarella panée croustillante avec sauce marinara',
      fullDesc: 'Bâtonnets de mozzarella dorés et croustillants servis avec notre sauce marinara maison. Parfait pour partager.',
      ingredients: ['Fromage mozzarella', 'Chapelure', 'Œufs', 'Farine', 'Sauce marinara']
    },
    'chicken-strips': {
      name: 'Aiguillettes de Poulet (4pcs)',
      shortDesc: 'Aiguillettes de poulet panées et frites',
      fullDesc: 'Aiguillettes de poulet panées et croustillantes servies avec des frites maison et une sauce.',
      ingredients: ['Blanc de poulet', 'Chapelure', 'Œufs', 'Farine', 'Frites', 'Sauce']
    },
    'nuggets': {
      name: 'Nuggets de Poulet (6pcs)',
      shortDesc: 'Nuggets de poulet panés et frits',
      fullDesc: 'Nuggets de poulet panés et frits servis avec des frites maison et une sauce.',
      ingredients: ['Blanc de poulet', 'Chapelure', 'Œufs', 'Farine', 'Frites', 'Sauce']
    },
    'curly-fries': {
      name: 'Frites Bouclées Maison',
      shortDesc: 'Frites de pommes de terre frisées et croustillantes',
      fullDesc: 'Frites de pommes de terre frisées et croustillantes assaisonnées avec notre mélange d\'épices spécial.',
      ingredients: ['Pommes de terre', 'Huile végétale', 'Épices', 'Sel']
    },
    'fries': {
      name: 'Frites Maison Classiques',
      shortDesc: 'Frites de pommes de terre maison croustillantes',
      fullDesc: 'Frites de pommes de terre maison croustillantes assaisonnées avec du sel de mer.',
      ingredients: ['Pommes de terre', 'Huile végétale', 'Sel de mer']
    },
    'greek-fusion': {
      name: 'Salade Grecque Fusion',
      shortDesc: 'Salade grecque fraîche avec fromage feta',
      fullDesc: 'Salade grecque fraîche avec fromage feta, olives, tomates et notre vinaigrette signature.',
      ingredients: ['Mélange de salades', 'Fromage feta', 'Olives', 'Tomates', 'Vinaigrette grecque']
    },
    'tuna-pasta': {
      name: 'Pâtes au Thon Frais',
      shortDesc: 'Pâtes avec thon frais et légumes',
      fullDesc: 'Pâtes avec thon frais, légumes de saison et notre sauce maison.',
      ingredients: ['Pâtes', 'Thon frais', 'Légumes', 'Sauce maison']
    },
    'crab-salad': {
      name: 'Salade de Crabe Premium',
      shortDesc: 'Salade fraîche avec chair de crabe',
      fullDesc: 'Salade fraîche avec chair de crabe premium, mélange de salades et vinaigrette légère.',
      ingredients: ['Chair de crabe', 'Mélange de salades', 'Vinaigrette légère', 'Légumes']
    },
    'chicken-caesar': {
      name: 'Salade César au Poulet',
      shortDesc: 'Salade César classique avec poulet grillé',
      fullDesc: 'Salade César classique avec blanc de poulet grillé, laitue romaine et vinaigrette César.',
      ingredients: ['Poulet grillé', 'Laitue romaine', 'Vinaigrette César', 'Fromage parmesan']
    },
    'seasoned-mix': {
      name: 'Mélange de Légumes de Saison',
      shortDesc: 'Mélange de légumes assaisonnés',
      fullDesc: 'Légumes de saison frais avec notre mélange spécial d\'herbes et d\'épices.',
      ingredients: ['Légumes de saison', 'Herbes', 'Épices', 'Huile d\'olive']
    },
    'pepperoni-pizza': {
      name: 'Pizza Pepperoni Classique',
      shortDesc: 'Pizza pepperoni classique avec fromage',
      fullDesc: 'Pizza italienne traditionnelle avec pepperoni, fromage mozzarella et notre sauce signature.',
      ingredients: ['Pâte à pizza', 'Pepperoni', 'Fromage mozzarella', 'Sauce à pizza']
    },
    'cheese-ham-pizza': {
      name: 'Pizza Jambon-Fromage - Cheese & Ham Pizza',
      shortDesc: 'Pizza avec jambon et fromage',
      fullDesc: 'Délicieuse pizza avec jambon premium, fromage mozzarella et notre sauce signature.',
      ingredients: ['Pâte à pizza', 'Jambon', 'Fromage mozzarella', 'Sauce à pizza']
    },
    'vegetarian-pizza': {
      name: 'Pizza Végétarienne',
      shortDesc: 'Pizza végétarienne avec légumes frais',
      fullDesc: 'Pizza végétarienne fraîche avec légumes de saison, fromage mozzarella et notre sauce signature.',
      ingredients: ['Pâte à pizza', 'Légumes de saison', 'Fromage mozzarella', 'Sauce à pizza']
    },
    'cheese-pizza': {
      name: 'Pizza Margherita Classique',
      shortDesc: 'Pizza au fromage classique',
      fullDesc: 'Pizza italienne classique au fromage avec mozzarella et notre sauce signature.',
      ingredients: ['Pâte à pizza', 'Fromage mozzarella', 'Sauce à pizza', 'Basilic frais']
    },
    'chicken-melt': {
      name: 'Sandwich Poulet Fondu',
      shortDesc: 'Sandwich au poulet avec fromage fondu',
      fullDesc: 'Sandwich au poulet grillé avec fromage fondu, servi sur du pain artisanal.',
      ingredients: ['Poulet grillé', 'Fromage fondu', 'Pain artisanal', 'Laitue', 'Tomate']
    },
    'mozzarella-beef-melt': {
      name: 'Sandwich Bœuf-Mozzarella - Mozzarella Beef Melt',
      shortDesc: 'Sandwich au bœuf avec mozzarella fondue',
      fullDesc: 'Sandwich au bœuf premium avec fromage mozzarella fondu, servi sur du pain artisanal.',
      ingredients: ['Bœuf premium', 'Fromage mozzarella', 'Pain artisanal', 'Laitue', 'Tomate']
    },
    'cheese-burger': {
      name: 'Cheeseburger Classique',
      shortDesc: 'Cheeseburger classique',
      fullDesc: 'Cheeseburger classique avec bœuf premium, fromage fondu et légumes frais.',
      ingredients: ['Bœuf premium', 'Fromage fondu', 'Pain à burger', 'Laitue', 'Tomate', 'Oignon']
    },
    'classic-burger': {
      name: 'Burger Classique au Bœuf',
      shortDesc: 'Burger au bœuf traditionnel',
      fullDesc: 'Burger au bœuf traditionnel avec bœuf premium et légumes frais.',
      ingredients: ['Bœuf premium', 'Pain à burger', 'Laitue', 'Tomate', 'Oignon', 'Cornichons']
    },
    'chicken-burger': {
      name: 'Burger au Poulet Grillé',
      shortDesc: 'Blanc de poulet, laitue, tomate, mayo à l\'ail',
      fullDesc: 'Burger au poulet grillé avec laitue fraîche, tomate et mayo à l\'ail.',
      ingredients: ['Blanc de poulet', 'Pain à burger', 'Laitue', 'Tomate', 'Mayo à l\'ail']
    },
    'crispy-chicken': {
      name: 'Burger Poulet Croustillant',
      shortDesc: 'Poulet pané (nature / moutarde au miel / BBQ), laitue, chips',
      fullDesc: 'Burger au poulet pané croustillant avec choix de sauce, laitue et chips.',
      ingredients: ['Poulet pané', 'Pain à burger', 'Laitue', 'Chips', 'Sauce']
    },
    'mozz-beef-melt': {
      name: 'Burger Bœuf Mozzarella',
      shortDesc: 'Galette de bœuf, mozzarella panée, laitue',
      fullDesc: 'Galette de bœuf avec mozzarella panée et laitue fraîche.',
      ingredients: ['Galette de bœuf', 'Mozzarella panée', 'Pain à burger', 'Laitue']
    },
    'mozz-chicken-melt': {
      name: 'Burger Poulet Mozzarella',
      shortDesc: 'Blanc de poulet, mozzarella panée',
      fullDesc: 'Blanc de poulet grillé avec fromage mozzarella pané.',
      ingredients: ['Blanc de poulet', 'Mozzarella panée', 'Pain à burger']
    },
    'fajita-fusion': {
      name: 'Sandwich Fajita Fusion',
      shortDesc: 'Poulet assaisonné, mozzarella, poivrons, oignons, maïs, sauce secrète',
      fullDesc: 'Sandwich fusion avec poulet assaisonné, mozzarella, poivrons, oignons, maïs et notre sauce secrète.',
      ingredients: ['Poulet assaisonné', 'Mozzarella', 'Poivrons', 'Oignons', 'Maïs', 'Sauce secrète']
    },
    'taouk-sandwich': {
      name: 'Sandwich Taouk Libanais',
      shortDesc: 'Pain libanais, poulet mariné, frites, pâte d\'ail, cornichons, salade de chou',
      fullDesc: 'Sandwich taouk libanais traditionnel avec poulet mariné, servi avec frites, pâte d\'ail, cornichons et salade de chou dans du pain libanais.',
      ingredients: ['Pain libanais', 'Poulet mariné', 'Frites', 'Pâte d\'ail', 'Cornichons', 'Salade de chou']
    },
    'taouk-platter': {
      name: 'Plateau Taouk Libanais',
      shortDesc: '2 brochettes, salade de chou, frites, pâte d\'ail, houmous, cornichons, pain libanais',
      fullDesc: 'Plateau taouk libanais traditionnel avec 2 brochettes, salade de chou, frites, pâte d\'ail, houmous, cornichons et pain libanais.',
      ingredients: ['Brochettes de poulet', 'Salade de chou', 'Frites', 'Pâte d\'ail', 'Houmous', 'Cornichons', 'Pain libanais']
    },
    'chicken-sub': {
      name: 'Sub au Poulet Frais',
      shortDesc: 'Sandwich au poulet frais',
      fullDesc: 'Sandwich au poulet frais avec légumes, servi sur un petit pain sub moelleux.',
      ingredients: ['Poulet grillé', 'Pain sub', 'Laitue', 'Tomate', 'Oignon', 'Mayo']
    },
    'tawouk': {
      name: 'Tawouk Libanais Grillé',
      shortDesc: 'Poulet grillé à la libanaise',
      fullDesc: 'Poulet grillé libanais traditionnel avec notre marinade signature et épices.',
      ingredients: ['Blanc de poulet', 'Marinade libanaise', 'Épices', 'Ail', 'Citron']
    },
    'tuna-sub': {
      name: 'Sub au Thon Frais',
      shortDesc: 'Sandwich au thon frais',
      fullDesc: 'Sandwich au thon frais avec légumes, servi sur un petit pain sub moelleux.',
      ingredients: ['Thon frais', 'Pain sub', 'Laitue', 'Tomate', 'Oignon', 'Mayo']
    },
    'chicken-delight': {
      name: 'Délice de Poulet Signature',
      shortDesc: 'Plat de poulet spécial avec sauce signature',
      fullDesc: 'Plat de poulet spécial avec notre sauce signature, servi avec riz et légumes.',
      ingredients: ['Blanc de poulet', 'Sauce signature', 'Riz', 'Légumes', 'Épices']
    },
    'tawouk-platter': {
      name: 'Plateau Tawouk Complet',
      shortDesc: 'Plateau tawouk avec riz et légumes',
      fullDesc: 'Plateau tawouk libanais avec riz, légumes et notre sauce signature.',
      ingredients: ['Poulet tawouk', 'Riz', 'Légumes', 'Sauce signature', 'Houmous']
    },
    'chicken-burger-platter': {
      name: 'Plateau Burger au Poulet',
      shortDesc: 'Burger au poulet avec frites',
      fullDesc: 'Plateau burger au poulet servi avec frites et coleslaw.',
      ingredients: ['Burger au poulet', 'Frites', 'Coleslaw', 'Sauce']
    },
    'beef-burger-platter': {
      name: 'Plateau Burger au Bœuf',
      shortDesc: 'Burger au bœuf avec frites',
      fullDesc: 'Plateau burger au bœuf servi avec frites et coleslaw.',
      ingredients: ['Burger au bœuf', 'Frites', 'Coleslaw', 'Sauce']
    },
    'vodka-grey-goose': {
      name: 'Vodka Grey Goose',
      shortDesc: 'Vodka française premium',
      fullDesc: 'Vodka française premium, parfaite pour les cocktails ou nature.',
      ingredients: ['Vodka Grey Goose']
    },
    'vodka-stolichnaya': {
      name: 'Vodka Stolichnaya',
      shortDesc: 'Vodka russe traditionnelle',
      fullDesc: 'Vodka russe traditionnelle avec une finition douce.',
      ingredients: ['Vodka Stolichnaya']
    },
    'vodka-absolut': {
      name: 'Vodka Absolut',
      shortDesc: 'Vodka suédoise distinctive',
      fullDesc: 'Vodka suédoise distinctive avec un goût propre et frais.',
      ingredients: ['Vodka Absolut']
    },
    'vodka-russian-standard': {
      name: 'Vodka Russian Standard',
      shortDesc: 'Vodka russe classique',
      fullDesc: 'Vodka russe classique avec un caractère traditionnel.',
      ingredients: ['Vodka Russian Standard']
    },
    'sangria-pitcher': {
      name: 'Pichet de Sangria Maison',
      shortDesc: 'Sangria fraîche avec fruits',
      fullDesc: 'Sangria fraîche préparée avec vin rouge, fruits et notre mélange signature.',
      ingredients: ['Vin rouge', 'Fruits frais', 'Cognac', 'Jus d\'orange']
    },
    'tequila-jose-cuervo': {
      name: 'Tequila José Cuervo',
      shortDesc: 'Tequila mexicaine authentique',
      fullDesc: 'Tequila mexicaine authentique avec un caractère traditionnel.',
      ingredients: ['Tequila Jose Cuervo']
    },
    'gin-gordons': {
      name: 'Gin Gordon\'s - Gin Gordons',
      shortDesc: 'Gin britannique classique',
      fullDesc: 'Gin britannique classique avec des notes de genièvre et botaniques.',
      ingredients: ['Gin Gordon\'s']
    },
    'jame': {
      name: 'Whisky Jameson',
      shortDesc: 'Whisky écossais distinctive',
      fullDesc: 'Whisky écossais distinctive avec un caractère riche.',
      ingredients: ['Whisky Jame']
    },
    'soft-drink': {
      name: 'Boisson Gazeuse',
      shortDesc: 'Soda rafraîchissant',
      fullDesc: 'Soda rafraîchissant, parfait avec n\'importe quel repas.',
      ingredients: ['Eau gazeuse', 'Sucre', 'Arômes naturels']
    },
    'ice-tea': {
      name: 'Thé Glacé au Citron',
      shortDesc: 'Thé noir glacé avec citron',
      fullDesc: 'Thé noir glacé rafraîchissant avec citron frais.',
      ingredients: ['Thé noir', 'Citron', 'Sucre', 'Glace']
    },
    'perrier-water': {
      name: 'Eau Perrier',
      shortDesc: 'Eau minérale pétillante',
      fullDesc: 'Eau minérale pétillante rafraîchissante.',
      ingredients: ['Eau minérale', 'Dioxyde de carbone']
    },
    'fresh-orange-juice': {
      name: 'Jus d\'Orange Frais - Fresh Orange Juice',
      shortDesc: 'Jus d\'orange fraîchement pressé',
      fullDesc: 'Jus d\'orange fraîchement pressé à partir d\'oranges premium, servi frais.',
      ingredients: ['Oranges fraîches']
    },
    'almaza': {
      name: 'Bière Almaza',
      shortDesc: 'Bière libanaise légère',
      fullDesc: 'Bière libanaise légère et rafraîchissante.',
      ingredients: ['Malt', 'Houblon', 'Eau', 'Levure']
    },
    'beirut': {
      name: 'Bière Beirut',
      shortDesc: 'Bière libanaise distinctive',
      fullDesc: 'Bière libanaise distinctive avec une saveur riche.',
      ingredients: ['Malt', 'Houblon', 'Eau', 'Levure']
    },
    'arak': {
      name: 'Arak Libanais',
      shortDesc: 'Spiritueux libanais traditionnel à l\'anis',
      fullDesc: 'Spiritueux libanais traditionnel à l\'anis, actuellement indisponible.',
      ingredients: ['Anis', 'Raisins', 'Eau']
    },
    'couvent': {
      name: 'Vin Couvent Rouge',
      shortDesc: 'Vin français effervescent',
      fullDesc: 'Vin français effervescent élégant.',
      ingredients: ['Raisins', 'Levure', 'Sucre']
    },
    'prosecco': {
      name: 'Prosecco Italien',
      shortDesc: 'Vin italien effervescent',
      fullDesc: 'Vin italien effervescent rafraîchissant.',
      ingredients: ['Raisins Glera', 'Levure', 'Sucre']
    },
    'white-chardonnay': {
      name: 'Chardonnay Blanc',
      shortDesc: 'Vin blanc français classique',
      fullDesc: 'Vin blanc français classique avec un caractère élégant.',
      ingredients: ['Raisins Chardonnay', 'Levure']
    },
    'ksar-reserve': {
      name: 'Ksar Réserve',
      shortDesc: 'Vin de réserve distinctive',
      fullDesc: 'Vin de réserve distinctive avec un caractère riche.',
      ingredients: ['Raisins premium', 'Levure', 'Vieillissement en chêne']
    },
    'signature-margarita': {
      name: 'Margarita Signature',
      shortDesc: 'Cocktail margarita signature',
      fullDesc: 'Notre cocktail margarita signature avec tequila premium et citron vert frais.',
      ingredients: ['Tequila premium', 'Citron vert frais', 'Triple sec', 'Sel']
    },
    'passion-fruit-martini': {
      name: 'Martini Fruit de la Passion',
      shortDesc: 'Martini avec fruit de la passion',
      fullDesc: 'Cocktail martini élégant avec fruit de la passion et vodka premium.',
      ingredients: ['Vodka premium', 'Fruit de la passion', 'Vermouth', 'Citron vert']
    },
    'lemon-drop': {
      name: 'Lemon Drop Cocktail',
      shortDesc: 'Cocktail citron rafraîchissant',
      fullDesc: 'Cocktail citron rafraîchissant avec vodka premium et citron frais.',
      ingredients: ['Vodka premium', 'Citron frais', 'Sucre', 'Glace']
    },
    'mozz-sticks': {
      name: 'Bâtonnets de Mozzarella',
      shortDesc: 'Mozzarella panée croustillante',
      fullDesc: 'Bâtonnets de mozzarella dorés et croustillants servis avec sauce marinara.',
      ingredients: ['Fromage mozzarella', 'Chapelure', 'Œufs', 'Farine', 'Sauce marinara']
    },
    'nuggets-6': {
      name: 'Nuggets de Poulet (6pcs)',
      shortDesc: 'Nuggets de poulet dorés',
      fullDesc: 'Nuggets de poulet croustillants et dorés servis avec sauce.',
      ingredients: ['Blanc de poulet', 'Chapelure', 'Œufs', 'Farine', 'Sauce']
    },
    'espresso': {
      name: 'Espresso Italien',
      shortDesc: 'Café italien fort',
      fullDesc: 'Espresso italien riche et fort.',
      ingredients: ['Grains de café premium', 'Eau']
    },
    'fresh-lemonade': {
      name: 'Limonade Fraîche Maison',
      shortDesc: 'Limonade fraîche pressée',
      fullDesc: 'Limonade fraîche pressée quotidiennement et rafraîchissante.',
      ingredients: ['Citrons frais', 'Sucre', 'Eau', 'Glace']
    },
    'small-water': {
      name: 'Eau Naturelle (33cl)',
      shortDesc: 'Petite bouteille d\'eau',
      fullDesc: 'Petite bouteille d\'eau pure potable.',
      ingredients: ['Eau pure']
    },
    'large-water': {
      name: 'Eau Naturelle (1.5L)',
      shortDesc: 'Grande bouteille d\'eau',
      fullDesc: 'Grande bouteille d\'eau pure potable.',
      ingredients: ['Eau pure']
    },
    'soft-drinks': {
      name: 'Boissons Gazeuses',
      shortDesc: 'Boissons gazeuses assorties',
      fullDesc: 'Sélection de boissons gazeuses et sodas populaires.',
      ingredients: ['Eau gazeuse', 'Arômes', 'Sucre']
    },
    'juices': {
      name: 'Jus de Fruits Frais',
      shortDesc: 'Jus de fruits frais',
      fullDesc: 'Sélection de jus de fruits frais.',
      ingredients: ['Fruits frais', 'Eau']
    },
    'lebanese-coffee': {
      name: 'Café Turc Libanais',
      shortDesc: 'Café libanais traditionnel',
      fullDesc: 'Café libanais traditionnel, finement moulu et aromatique.',
      ingredients: ['Grains de café libanais', 'Eau', 'Cardamome']
    },
    'margarita-pitcher': {
      name: 'Pichet Margarita Premium',
      shortDesc: 'Margarita (Pichet)',
      fullDesc: 'Grand pichet de cocktail margarita premium, parfait pour partager.',
      ingredients: ['Tequila', 'Triple sec', 'Jus de citron vert', 'Sel', 'Glace']
    },
    'perrier-soda-water': {
      name: 'Eau Perrier Pétillante',
      shortDesc: 'Eau minérale pétillante',
      fullDesc: 'Eau minérale pétillante rafraîchissante.',
      ingredients: ['Eau minérale', 'Dioxyde de carbone']
    },
    'ksara-reserve': {
      name: 'Ksara Réserve Rouge',
      shortDesc: 'Vin rouge libanais',
      fullDesc: 'Vin rouge libanais premium de la cave Ksara.',
      ingredients: ['Raisins rouges', 'Levure']
    },
    'beirut-beer': {
      name: 'Bière Beirut Premium',
      shortDesc: 'Bière libanaise',
      fullDesc: 'Bière libanaise distinctive au goût riche.',
      ingredients: ['Malt', 'Houblon', 'Eau', 'Levure']
    },
    'arak-na': {
      name: 'Arak Libanais Traditionnel',
      shortDesc: 'Arak libanais traditionnel',
      fullDesc: 'Arak libanais traditionnel au goût d\'anis.',
      ingredients: ['Raisins', 'Anis', 'Eau']
    },
    'arguileh-mouassal': {
      name: 'Narguilé Mouassal Premium',
      shortDesc: 'Narguilé libanais traditionnel avec tabac mélassé',
      fullDesc: 'Narguilé libanais traditionnel avec saveurs de tabac mélassé premium.',
      ingredients: ['Tabac mélassé', 'Charbon', 'Eau']
    },
    'arguileh-ras': {
      name: 'Narguilé Ras Traditionnel',
      shortDesc: 'Narguilé libanais traditionnel avec tête de tabac',
      fullDesc: 'Narguilé libanais traditionnel avec préparation de tête de tabac.',
      ingredients: ['Tabac', 'Charbon', 'Eau']
    },
    'tequila-jose-white': {
      name: 'Tequila José Cuervo Silver',
      shortDesc: 'Tequila blanche premium',
      fullDesc: 'Tequila blanche Jose Cuervo premium, parfaite pour les cocktails.',
      ingredients: ['Agave', 'Eau']
    },
    'vodka-stoli': {
      name: 'Vodka Stolichnaya Premium',
      shortDesc: 'Vodka russe traditionnelle',
      fullDesc: 'Vodka russe traditionnelle avec une finition douce.',
      ingredients: ['Céréales', 'Eau']
    },
    'perrier': {
      name: 'Perrier Eau Minérale',
      shortDesc: 'Eau minérale pétillante',
      fullDesc: 'Eau minérale française pétillante premium.',
      ingredients: ['Eau', 'CO2']
    },
    'fresh-orange': {
      name: 'Jus d\'Orange Pressé',
      shortDesc: 'Jus d\'orange frais pressé',
      fullDesc: 'Jus d\'orange frais pressé, sans additifs.',
      ingredients: ['Orange']
    }
  }
}

const translatedCategories: Record<Language, Record<string, Partial<Category>>> = {
  en: {
    'starters': { name: 'Starters', description: 'Perfect appetizers to start your meal' },
    'salads': { name: 'Salads', description: 'Fresh and healthy salad options' },
    'pizza': { name: 'Pizza', description: 'Authentic Italian pizzas' },
    'pasta': { name: 'Pasta', description: 'Classic Italian pasta dishes' },
    'mains': { name: 'Main Courses', description: 'Hearty main dishes' },
    'desserts': { name: 'Desserts', description: 'Sweet endings to your meal' },
    'beverages': { name: 'Beverages', description: 'Refreshing drinks and beverages' },
    'burgers': { name: 'Burgers', description: 'Juicy burgers with premium ingredients' },
    'sandwiches': { name: 'Sandwiches', description: 'Fresh sandwiches and wraps' },
    'platters': { name: 'Platters', description: 'Sharing platters for groups' },
    'drinks': { name: 'Drinks', description: 'Refreshing beverages and soft drinks' },
    'beers': { name: 'Beers', description: 'Local and international beers' },
    'arak': { name: 'Arak', description: 'Traditional Lebanese aniseed spirit' },
    'prosecco': { name: 'Prosecco & Couvent', description: 'Sparkling wines and champagne' },
    'wine': { name: 'Wine', description: 'Fine wines from around the world' },
    'signatureCocktails': { name: 'Signature Cocktails', description: 'Our signature mixed drinks' },
    'cocktails': { name: 'Signature Cocktails', description: 'Our signature mixed drinks' },
    'spa': { name: 'Mediterranean Relaxation', description: 'Spa and wellness services' }
  },
  ar: {
    'starters': { name: 'المقبلات', description: 'مقبلات مثالية لبدء وجبتك' },
    'salads': { name: 'السلطات', description: 'خيارات السلطات الطازجة والصحية' },
    'pizza': { name: 'البيتزا', description: 'بيتزا إيطالية أصيلة' },
    'pasta': { name: 'المعكرونة', description: 'أطباق المعكرونة الإيطالية الكلاسيكية' },
    'mains': { name: 'الأطباق الرئيسية', description: 'أطباق رئيسية مشبعة' },
    'desserts': { name: 'الحلويات', description: 'نهايات حلوة لوجبتك' },
    'beverages': { name: 'المشروبات', description: 'مشروبات منعشة' },
    'burgers': { name: 'البرجر', description: 'برجرات عصارية بمكونات مميزة' },
    'sandwiches': { name: 'الساندويتشات', description: 'ساندويتشات ولفائف طازجة' },
    'platters': { name: 'الصواني', description: 'صواني للمشاركة مع الأصدقاء' },
    'drinks': { name: 'المشروبات', description: 'مشروبات منعشة ومرطبات' },
    'beers': { name: 'البيرة', description: 'بيرة محلية ودولية' },
    'arak': { name: 'العرق', description: 'عرق لبناني تقليدي باليانسون' },
    'prosecco': { name: 'البروسيكو والكوفنت', description: 'نبيذ فوار وشامبانيا' },
    'wine': { name: 'النبيذ', description: 'نبيذ فاخر من حول العالم' },
    'signatureCocktails': { name: 'الكوكتيلات المميزة', description: 'مشروبات مختلطة مميزة' },
    'cocktails': { name: 'الكوكتيلات المميزة', description: 'مشروبات مختلطة مميزة' },
    'spa': { name: 'الاسترخاء المتوسطي', description: 'خدمات السبا والعافية' }
  },
  fr: {
    'starters': { name: 'Entrées', description: 'Entrées parfaites pour commencer votre repas' },
    'salads': { name: 'Salades', description: 'Options de salades fraîches et saines' },
    'pizza': { name: 'Pizza', description: 'Pizzas italiennes authentiques' },
    'pasta': { name: 'Pâtes', description: 'Plats de pâtes italiennes classiques' },
    'mains': { name: 'Plats Principaux', description: 'Plats principaux copieux' },
    'desserts': { name: 'Desserts', description: 'Fins sucrées à votre repas' },
    'beverages': { name: 'Boissons', description: 'Boissons rafraîchissantes' },
    'burgers': { name: 'Burgers', description: 'Burgers juteux aux ingrédients premium' },
    'sandwiches': { name: 'Sandwiches', description: 'Sandwiches et wraps frais' },
    'platters': { name: 'Plateaux', description: 'Plateaux à partager entre amis' },
    'drinks': { name: 'Boissons', description: 'Boissons rafraîchissantes et soft drinks' },
    'beers': { name: 'Bières', description: 'Bières locales et internationales' },
    'arak': { name: 'Arak', description: 'Spiritueux libanais traditionnel à l\'anis' },
    'prosecco': { name: 'Prosecco & Couvent', description: 'Vins effervescents et champagne' },
    'wine': { name: 'Vin', description: 'Vins fins du monde entier' },
    'signatureCocktails': { name: 'Cocktails Signature', description: 'Nos boissons mélangées signature' },
    'cocktails': { name: 'Cocktails Signature', description: 'Nos boissons mélangées signature' },
    'spa': { name: 'Détente Méditerranéenne', description: 'Services de spa et bien-être' }
  }
}

export function translateDish(dish: Dish, language: Language): Dish {
  const translations = translatedDishes[language]?.[dish.id]
  if (!translations) return dish
  
  // Show only the translated text for non-English languages
  const getTranslatedText = (original: string, translated: string, lang: Language) => {
    if (lang === 'en') return original
    return translated || original
  }

  // Get translated name - if empty, try to use shortDesc as name for Arabic
  const getTranslatedName = () => {
    if (language === 'en') return dish.name
    if (translations.name && translations.name.trim()) {
      return translations.name
    }
    // If Arabic name is empty but shortDesc exists, use shortDesc as name
    if (language === 'ar' && translations.shortDesc && translations.shortDesc.trim()) {
      return translations.shortDesc
    }
    return dish.name
  }
  
  return {
    ...dish,
    name: getTranslatedName(),
    shortDesc: translations.shortDesc ? getTranslatedText(dish.shortDesc || '', translations.shortDesc, language) : dish.shortDesc,
    fullDesc: translations.fullDesc ? getTranslatedText(dish.fullDesc || '', translations.fullDesc, language) : dish.fullDesc,
    ingredients: translations.ingredients || dish.ingredients
  }
}

export function translateCategory(category: Category, language: Language): Category {
  const translations = translatedCategories[language]?.[category.id]
  if (!translations) return category
  
  return {
    ...category,
    name: translations.name || category.name,
    description: translations.description || category.description
  }
}

export function translateDietTag(tag: string, language: Language): string {
  const tagMap: Record<string, TranslationKeys> = {
    'vegetarian': 'vegetarian',
    'vegan': 'vegan',
    'gluten-free': 'glutenFree',
    'nuts-free': 'nutsFree',
    'sugar-free': 'sugarFree',
    'dairy-free': 'dairyFree',
    'keto': 'keto',
    'paleo': 'paleo'
  }
  
  const translationKey = tagMap[tag]
  if (!translationKey) return tag
  
  return getTranslation(language, translationKey)
}

export function translateAllergen(allergen: string, language: Language): string {
  const allergenMap: Record<string, TranslationKeys> = {
    'gluten': 'allergenGluten',
    'dairy': 'allergenDairy',
    'nuts': 'allergenNuts',
    'sugar': 'allergenSugar',
    'shellfish': 'allergenShellfish',
    'fish': 'allergenFish'
  }
  
  const key = allergenMap[allergen.toLowerCase()]
  if (key) {
    return getTranslation(language, key)
  }
  
  // Fallback to original allergen
  return allergen
}
