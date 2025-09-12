'use client'

import React, { useEffect } from 'react'
import { Dish, Category } from '@/types'

interface MenuStructuredDataProps {
  dishes: Dish[]
  categories: Category[]
}

const MenuStructuredData: React.FC<MenuStructuredDataProps> = ({ dishes, categories }) => {
  useEffect(() => {
    // Generate restaurant structured data
    const restaurantSchema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Port San Antonio Resort Restaurant',
      description: 'Authentic Lebanese Mediterranean cuisine with ocean views at Port San Antonio Resort. Fresh ingredients, traditional recipes, and modern presentation.',
      image: [
        '/images/logo.svg',
        '/images/restaurant-exterior.jpg',
        '/images/dining-room.jpg'
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'San Antonio',
        addressCountry: 'Lebanon',
        streetAddress: 'Port San Antonio Resort'
      },
      telephone: '+961-XX-XXXXXX',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://port-san-antonio.vercel.app',
      menuUrl: typeof window !== 'undefined' ? window.location.href : 'https://port-san-antonio.vercel.app/menu',
      servesCuisine: ['Lebanese', 'Mediterranean', 'Middle Eastern'],
      priceRange: '$$',
      acceptsReservations: true,
      hasMenu: dishes.length > 0 ? {
        '@type': 'Menu',
        name: 'Port San Antonio Resort Menu',
        description: 'Our complete Lebanese Mediterranean menu featuring fresh seafood, traditional mezze, and authentic dishes.',
        hasMenuSection: categories.map(category => ({
          '@type': 'MenuSection',
          name: category.name,
          description: category.description || `Delicious ${category.name.toLowerCase()} dishes`,
          hasMenuItem: dishes
            .filter(dish => dish.categoryId === category.id)
            .filter(dish => dish.available)
            .slice(0, 8) // Limit to prevent huge JSON-LD
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
        })).filter(section => section.hasMenuItem.length > 0)
      } : undefined,
      openingHours: [
        'Mo-Su 11:00-23:00'
      ],
      paymentAccepted: ['Cash', 'Credit Card', 'Digital Wallet'],
      currenciesAccepted: ['USD', 'LBP'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1'
      }
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
          item: typeof window !== 'undefined' ? window.location.origin : 'https://port-san-antonio.vercel.app'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Menu',
          item: typeof window !== 'undefined' ? window.location.href : 'https://port-san-antonio.vercel.app/menu'
        }
      ]
    }

    // Generate website structured data
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Port San Antonio Resort',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://port-san-antonio.vercel.app',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : 'https://port-san-antonio.vercel.app'}/menu?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }

    // Create and inject script tags
    const scripts = [
      { id: 'restaurant-schema', data: restaurantSchema },
      { id: 'breadcrumb-schema', data: breadcrumbSchema },
      { id: 'website-schema', data: websiteSchema }
    ]

    scripts.forEach(({ id, data }) => {
      // Remove existing script if present
      const existing = document.getElementById(id)
      if (existing) {
        existing.remove()
      }

      // Create new script
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data, null, 0)
      document.head.appendChild(script)
    })

    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update Open Graph and Twitter Card meta tags
    const ogTitle = 'Menu - Port San Antonio Resort | Authentic Lebanese Mediterranean Cuisine'
    const ogDescription = `Discover our exquisite Lebanese Mediterranean menu featuring ${dishes.length} authentic dishes across ${categories.length} categories. Fresh ingredients, traditional recipes, modern presentation.`
    const ogImage = '/images/menu-hero.jpg'
    const ogUrl = typeof window !== 'undefined' ? window.location.href : 'https://port-san-antonio.vercel.app/menu'

    updateMetaTag('og:title', ogTitle)
    updateMetaTag('og:description', ogDescription)
    updateMetaTag('og:image', ogImage)
    updateMetaTag('og:url', ogUrl)
    updateMetaTag('og:type', 'restaurant.menu')
    updateMetaTag('og:site_name', 'Port San Antonio Resort')
    updateMetaTag('og:locale', 'en_US')

    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', ogTitle)
    updateMetaTag('twitter:description', ogDescription)
    updateMetaTag('twitter:image', ogImage)

    updateMetaTag('description', ogDescription)
    updateMetaTag('keywords', 'Lebanese restaurant, Mediterranean cuisine, Port San Antonio, menu, fresh seafood, mezze, authentic Lebanese food, resort dining')

    // Cleanup function
    return () => {
      scripts.forEach(({ id }) => {
        const script = document.getElementById(id)
        if (script) {
          script.remove()
        }
      })
    }
  }, [dishes, categories])

  return null // This component only handles SEO metadata, no visual content
}

export default MenuStructuredData
