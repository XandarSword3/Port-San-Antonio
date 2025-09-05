'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Phone, Mail, MapPin, Globe } from 'lucide-react'

interface ContactInfo {
  phone: string
  email: string
  address: string
  website: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

export default function ContactManager() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    website: '',
    socialMedia: {}
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load contact info from localStorage or config
    const saved = localStorage.getItem('contactInfo')
    const configData = localStorage.getItem('configData')
    
    if (saved) {
      setContactInfo(JSON.parse(saved))
    } else if (configData) {
      const config = JSON.parse(configData)
      if (config.contactInfo) {
        setContactInfo(config.contactInfo)
      }
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save to localStorage for immediate use
      localStorage.setItem('contactInfo', JSON.stringify(contactInfo))
      
      // In a real app, this would be an API call to update the config file
      // For now, we'll simulate this by updating localStorage and dispatching an event
      const configData = {
        contactInfo: contactInfo
      }
      
      // Simulate saving to config file (in production, this would be an API call)
      localStorage.setItem('configData', JSON.stringify(configData))
      
      // Dispatch event to update the site
      window.dispatchEvent(new CustomEvent('contactInfoUpdated', { detail: contactInfo }))
      
      alert('Contact information saved successfully! The changes will be reflected on the website.')
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Error saving contact information')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="space-y-6">
          {/* Basic Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="+961 1 234 567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                placeholder="info@portsanantonio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Address
            </label>
            <textarea
              value={contactInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="123 Mediterranean Street, Beirut, Lebanon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              Website
            </label>
            <input
              type="url"
              value={contactInfo.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="https://www.portsanantonio.com"
            />
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={contactInfo.socialMedia.facebook || ''}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="https://facebook.com/portsanantonio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={contactInfo.socialMedia.instagram || ''}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="https://instagram.com/portsanantonio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={contactInfo.socialMedia.twitter || ''}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  placeholder="https://twitter.com/portsanantonio"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>Phone:</strong> {contactInfo.phone || 'Not set'}</p>
          <p><strong>Email:</strong> {contactInfo.email || 'Not set'}</p>
          <p><strong>Address:</strong> {contactInfo.address || 'Not set'}</p>
          <p><strong>Website:</strong> {contactInfo.website || 'Not set'}</p>
          {Object.entries(contactInfo.socialMedia).map(([platform, url]) => (
            url && <p key={platform}><strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong> {url}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
