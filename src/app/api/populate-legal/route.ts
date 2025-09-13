import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

const legalContent = {
  privacy: {
    type: 'privacy',
    title: 'Privacy Policy',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        content: 'At Port Antonio Resort, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.',
        order: 1
      },
      {
        id: 'information-collect',
        title: 'Information We Collect',
        content: 'Personal Information:\n• Name and contact information for reservations\n• Email address for newsletters and updates\n• Phone number for booking confirmations\n• Payment information for transactions\n\nAutomatically Collected Information:\n• IP address and browser information\n• Pages visited and time spent on our website\n• Device information and screen resolution\n• Referral source and search terms',
        order: 2
      },
      {
        id: 'how-we-use',
        title: 'How We Use Your Information',
        content: 'We use the information we collect to:\n• Process reservations and provide our services\n• Send booking confirmations and important updates\n• Improve our website and user experience\n• Send promotional offers and newsletters (with your consent)\n• Comply with legal obligations and prevent fraud\n• Analyze website usage and optimize our services',
        order: 3
      },
      {
        id: 'cookies-storage',
        title: 'Cookies & Data Storage',
        content: 'We use both cookies and local storage to enhance your browsing experience. All cookies are completely optional and you can use our website fully without accepting any cookies beyond the essential ones.\n\nCookie Categories:\n• Essential Cookies (Required): Necessary for the website to function properly. These include authentication tokens and security preferences.\n• Analytics Cookies (Optional): Help us understand how visitors use our website to improve your experience. Examples: page views, user interactions.\n• Preference Cookies (Optional): Remember your choices like theme, language, and layout preferences for a personalized experience.\n• Marketing Cookies (Optional): Used to show you relevant content and advertisements. Only set if you provide explicit consent.\n\nLocal Storage:\n• Settings: Theme, language, currency, and accessibility preferences\n• Session Data: Admin authentication and temporary user preferences\n• Content: Menu data and configuration for offline access\n\nYour Control:\n• You can change your cookie preferences at any time\n• You can use our website fully without optional cookies\n• Clear your browser data to remove all stored information\n• We respect your privacy choices completely',
        order: 4
      },
      {
        id: 'data-security',
        title: 'Data Security',
        content: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.',
        order: 5
      },
      {
        id: 'your-rights',
        title: 'Your Rights',
        content: 'You have the right to:\n• Access your personal data we hold\n• Correct inaccurate or incomplete information\n• Request deletion of your personal data\n• Object to processing of your data\n• Request data portability\n• Withdraw consent at any time',
        order: 6
      },
      {
        id: 'contact',
        title: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us:\n\nEmail: privacy@portantonioresort.com\nPhone: +961 1 234 567\nAddress: Mastita, Lebanon',
        order: 7
      }
    ]
  },
  
  terms: {
    type: 'terms',
    title: 'Terms of Service',
    sections: [
      {
        id: 'agreement',
        title: 'Agreement to Terms',
        content: 'By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Port Antonio Resort reserves the right to update these terms at any time.',
        order: 1
      },
      {
        id: 'use-services',
        title: 'Use of Our Services',
        content: 'Permitted Use:\n• Browse our menu and make reservations\n• Access information about our services\n• Use our website for legitimate business purposes\n• Contact us for inquiries and support\n\nProhibited Use:\n• Violate any applicable laws or regulations\n• Impersonate another person or entity\n• Interfere with or disrupt our services\n• Use our services for spam or unauthorized marketing\n• Attempt to gain unauthorized access to our systems',
        order: 2
      },
      {
        id: 'reservations-payments',
        title: 'Reservations and Payments',
        content: 'Booking Policy:\n• All reservations are subject to availability\n• We reserve the right to refuse service to anyone\n• Large group bookings may require advance deposit\n• Special dietary requirements must be communicated in advance\n\nCancellation Policy:\n• Standard reservations can be canceled up to 2 hours before\n• Large group bookings require 24-hour cancellation notice\n• No-shows may be subject to cancellation fees\n• Weather-related cancellations will be handled case by case\n\nPayment Terms:\n• We accept major credit cards and cash\n• Payment is due upon service completion\n• Gratuity is optional but appreciated\n• Disputed charges must be reported within 30 days',
        order: 3
      },
      {
        id: 'liability',
        title: 'Limitation of Liability',
        content: 'Port Antonio Resort shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services. Our total liability shall not exceed the amount paid for services.',
        order: 4
      },
      {
        id: 'food-safety',
        title: 'Food Safety',
        content: 'While we maintain the highest standards of food safety and preparation, we cannot guarantee that our food is free from allergens. Please inform us of any allergies or dietary restrictions.',
        order: 5
      },
      {
        id: 'intellectual-property',
        title: 'Intellectual Property',
        content: 'All content on this website, including text, graphics, logos, images, and software, is the property of Port Antonio Resort and is protected by copyright and trademark laws.\n\nYou may not reproduce, distribute, or create derivative works from our content without express written permission.',
        order: 6
      },
      {
        id: 'changes',
        title: 'Changes to Terms',
        content: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after changes indicates your acceptance of the new terms.',
        order: 7
      },
      {
        id: 'contact',
        title: 'Questions About These Terms',
        content: 'If you have any questions about these Terms of Service, please contact us:\n\nEmail: legal@portantonioresort.com\nPhone: +961 1 234 567\nAddress: Mastita, Lebanon',
        order: 8
      }
    ]
  },

  accessibility: {
    type: 'accessibility',
    title: 'Accessibility Statement',
    sections: [
      {
        id: 'commitment',
        title: 'Our Commitment',
        content: 'At Port Antonio Resort, we believe that everyone should be able to enjoy exceptional dining experiences. We are committed to ensuring that our website and physical facilities are accessible to people with disabilities and conform to accessibility standards.',
        order: 1
      },
      {
        id: 'website-features',
        title: 'Website Accessibility Features',
        content: 'Visual Accessibility:\n• High contrast colors for better readability\n• Large, clear fonts and scalable text\n• Alternative text for all images\n• Screen reader compatibility\n• Dark mode support for reduced eye strain\n\nNavigation Accessibility:\n• Full keyboard navigation support\n• Skip links for main content\n• Logical tab order and focus indicators\n• ARIA labels for screen readers\n• Reduced motion options',
        order: 2
      },
      {
        id: 'physical-location',
        title: 'Physical Location Accessibility',
        content: 'For information about physical accessibility features at our resort location, please contact us directly. We\'re happy to discuss specific accommodation needs and provide detailed information about our facilities.',
        order: 3
      },
      {
        id: 'contact-accessibility',
        title: 'Contact for Accessibility Information',
        content: '📞 Phone: Contact us for specific accessibility details\n📧 Email: accessibility@portsanantonio.com\n💬 In-person: Speak with our staff about your needs\n\nWe are committed to providing equal access to all guests and continuously work to improve our accessibility features. Please let us know how we can best accommodate your visit.',
        order: 4
      },
      {
        id: 'multilanguage',
        title: 'Multi-Language Support',
        content: 'Our website is available in multiple languages to serve our diverse community:\n\n• English: Full website support\n• العربية: Right-to-left layout\n• Français: Complete translation',
        order: 5
      },
      {
        id: 'standards',
        title: 'Standards Compliance',
        content: 'We strive to meet or exceed the following accessibility standards:\n\n• WCAG 2.1 Level AA: Web Content Accessibility Guidelines\n• ADA Compliance: Americans with Disabilities Act standards\n• Section 508: Federal accessibility requirements\n• AODA: Accessibility for Ontarians with Disabilities Act',
        order: 6
      },
      {
        id: 'feedback',
        title: 'Your Feedback Matters',
        content: 'We are continuously working to improve accessibility at Port Antonio Resort. If you encounter any barriers or have suggestions for improvement, please let us know.\n\nAccessibility Coordinator:\nEmail: accessibility@portantonioresort.com\nPhone: +961 1 234 567\nAddress: Mastita, Lebanon\n\nWe will respond to accessibility feedback within 48 hours and work to address any issues as quickly as possible.',
        order: 7
      },
      {
        id: 'tools',
        title: 'Recommended Accessibility Tools',
        content: 'While our website is designed to be accessible, you may find these tools helpful:\n\n• Screen Readers: NVDA, JAWS, VoiceOver\n• Browser Extensions: High contrast, zoom tools\n• Voice Recognition: Dragon NaturallySpeaking\n• Keyboard Navigation: Built-in browser shortcuts',
        order: 8
      }
    ]
  }
};

export async function POST() {
  try {
    if (!isSupabaseAvailable() || !supabase) {
      return NextResponse.json({ 
        error: 'Supabase not available',
        success: false 
      }, { status: 500 })
    }

    const results = []

    // Insert each legal page
    for (const [key, page] of Object.entries(legalContent)) {
      try {
        // First, delete existing content for this type
        await supabase
          .from('legal_pages')
          .delete()
          .eq('type', page.type)

        // Insert new content
        const { data, error } = await supabase
          .from('legal_pages')
          .insert({
            type: page.type,
            title: page.title,
            sections: page.sections
          })
          .select()

        if (error) throw error

        results.push({
          type: page.type,
          success: true,
          sections: page.sections.length,
          data
        })
      } catch (error: any) {
        results.push({
          type: page.type,
          success: false,
          error: error?.message || 'Unknown error'
        })
      }
    }

    return NextResponse.json({ 
      message: 'Legal content population completed',
      results,
      success: true 
    })

  } catch (error: any) {
    console.error('Error populating legal content:', error)
    return NextResponse.json({ 
      error: error?.message || 'Unknown error',
      success: false 
    }, { status: 500 })
  }
}
