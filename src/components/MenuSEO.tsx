import React from 'react'
import { Dish, Category } from '@/types'
import Head from 'next/head'

interface MenuSEOProps {
  dishes: Dish[]
  categories: Category[]
  currentUrl?: string
}

const MenuSEO: React.FC<MenuSEOProps> = ({ dishes, categories, currentUrl }) => {
  // Generate restaurant structured data
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Port Antonio Resort Restaurant',
    description: 'Authentic Lebanese Mediterranean cuisine with ocean views at Port Antonio Resort. Fresh ingredients, traditional recipes, and modern presentation.',
    image: [
      '/images/logo.svg',
      '/images/restaurant-exterior.jpg',
      '/images/dining-room.jpg'
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mastita',
      addressCountry: 'Lebanon',
      streetAddress: 'Port Antonio Resort'
    },
    telephone: '+961-XX-XXXXXX',
    url: currentUrl || 'https://port-san-antonio.vercel.app',
    menuUrl: `${currentUrl || 'https://port-san-antonio.vercel.app'}/menu`,
    servesCuisine: ['Lebanese', 'Mediterranean', 'Middle Eastern'],
    priceRange: '$$',
    acceptsReservations: true,
    hasMenu: {
      '@type': 'Menu',
      name: 'Port Antonio Resort Menu',
      description: 'Our complete Lebanese Mediterranean menu featuring fresh seafood, traditional mezze, and authentic dishes.',
      hasMenuSection: categories.map(category => ({
        '@type': 'MenuSection',
        name: category.name,
        description: category.description || `Delicious ${category.name.toLowerCase()} dishes`,
        hasMenuItem: dishes
          .filter(dish => dish.categoryId === category.id)
          .slice(0, 10) // Limit to prevent huge JSON-LD
          .map(dish => ({
            '@type': 'MenuItem',
            name: dish.name,
            description: dish.shortDesc || dish.fullDesc || dish.name,
            offers: {
              '@type': 'Offer',
              price: dish.price,
              priceCurrency: dish.currency || 'USD',
              availability: dish.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            },
            image: dish.image && dish.image !== '/images/placeholder.jpg' ? dish.image : undefined,
            menuAddOn: dish.dietTags?.map(tag => ({
              '@type': 'MenuSection',
              name: tag,
              description: `${tag} option available`
            })) || []
          }))
      }))
    },
    openingHours: [
      'Mo-Su 11:00-23:00'
    ],
    paymentAccepted: ['Cash', 'Credit Card', 'Digital Wallet'],
    currenciesAccepted: ['USD', 'LBP']
  }

  // Generate breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: currentUrl?.replace('/menu', '') || 'https://port-san-antonio.vercel.app'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Menu',
        item: currentUrl || 'https://port-san-antonio.vercel.app/menu'
      }
    ]
  }

  // Generate Open Graph data
  const ogTitle = 'Menu - Port Antonio Resort | Authentic Lebanese Mediterranean Cuisine'
  const ogDescription = `Discover our exquisite Lebanese Mediterranean menu featuring ${dishes.length} authentic dishes across ${categories.length} categories. Fresh ingredients, traditional recipes, modern presentation.`
  const ogImage = '/images/menu-hero.jpg'
  const ogUrl = currentUrl || 'https://port-san-antonio.vercel.app/menu'

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Open Graph Meta Tags */}
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="restaurant.menu" />
        <meta property="og:site_name" content="Port Antonio Resort" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="keywords" content="Lebanese restaurant, Mediterranean cuisine, Port Antonio, Lebanon, menu, fresh seafood, mezze, authentic Lebanese food, resort dining" />
        <meta name="author" content="Port Antonio Resort" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={ogUrl} />
        
        {/* Language alternatives */}
        <link rel="alternate" hrefLang="en" href={ogUrl} />
        <link rel="alternate" hrefLang="ar" href={`${ogUrl}?lang=ar`} />
        <link rel="alternate" hrefLang="fr" href={`${ogUrl}?lang=fr`} />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#0066cc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PSA Menu" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/logo.svg" as="image" type="image/svg+xml" />
      </Head>
    </>
  )
}

export default MenuSEO
