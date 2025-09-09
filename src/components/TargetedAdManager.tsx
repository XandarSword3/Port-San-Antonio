'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Image, ExternalLink, Users, BarChart3 } from 'lucide-react'
import { Ad } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCookieConsent } from '@/lib/cookies'

interface TargetedAdManagerProps {
  ads: Ad[]
  onUpdateAds: (ads: Ad[]) => void
}

interface AdFormData {
  title: string
  description: string
  image: string
  url: string
  targetAudience: string
  position: 'side-rail' | 'mobile-banner' | 'header' | 'footer'
  weight: number
  active: boolean
  startDate: string
  endDate: string
  budget: string
  targetKeywords: string
}

export default function TargetedAdManager({ ads, onUpdateAds }: TargetedAdManagerProps) {
  const { t } = useLanguage()
  const { hasConsent } = useCookieConsent()
  const [showAddAd, setShowAddAd] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [showPreview, setShowPreview] = useState<string | null>(null)

  const [adFormData, setAdFormData] = useState<AdFormData>({
    title: '',
    description: '',
    image: '',
    url: '',
    targetAudience: '',
    position: 'side-rail',
    weight: 1,
    active: true,
    startDate: '',
    endDate: '',
    budget: '',
    targetKeywords: ''
  })

  const resetAdForm = () => {
    setAdFormData({
      title: '',
      description: '',
      image: '',
      url: '',
      targetAudience: '',
      position: 'side-rail',
      weight: 1,
      active: true,
      startDate: '',
      endDate: '',
      budget: '',
      targetKeywords: ''
    })
  }

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const adData: Ad = {
      id: editingAd?.id || Date.now().toString(),
      title: adFormData.title,
      image: adFormData.image,
      url: adFormData.url,
      position: adFormData.position,
      weight: adFormData.weight,
      active: adFormData.active,
      description: adFormData.description,
      targetAudience: adFormData.targetAudience,
      startDate: adFormData.startDate ? new Date(adFormData.startDate) : undefined,
      endDate: adFormData.endDate ? new Date(adFormData.endDate) : undefined,
      budget: adFormData.budget || undefined,
      targetKeywords: adFormData.targetKeywords.split(',').map(k => k.trim()).filter(k => k),
      createdAt: editingAd?.createdAt || new Date(),
      updatedAt: new Date()
    }

    if (editingAd) {
      onUpdateAds(ads.map(ad => ad.id === editingAd.id ? adData : ad))
      setEditingAd(null)
    } else {
      onUpdateAds([...ads, adData])
      setShowAddAd(false)
    }
    
    resetAdForm()
  }

  const handleEditAd = (ad: Ad) => {
    setAdFormData({
      title: ad.title,
      description: ad.description || '',
      image: ad.image,
      url: ad.url,
      targetAudience: ad.targetAudience || '',
      position: ad.position,
      weight: ad.weight,
      active: ad.active ?? true,
      startDate: ad.startDate ? ad.startDate.toISOString().split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.toISOString().split('T')[0] : '',
      budget: ad.budget || '',
      targetKeywords: ad.targetKeywords?.join(', ') || ''
    })
    setEditingAd(ad)
    setShowAddAd(true)
  }

  const handleDeleteAd = (id: string) => {
    onUpdateAds(ads.filter(ad => ad.id !== id))
  }

  const handleToggleActive = (id: string) => {
    onUpdateAds(ads.map(ad => 
      ad.id === id ? { ...ad, active: !ad.active } : ad
    ))
  }

  const canShowTargetedAds = hasConsent('marketing')

  return (
    <div className="space-y-6">
      {/* Header with Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Target className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Targeted Advertising System
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>How it works:</strong> Create ads that only show to users who have consented to marketing cookies. 
                This ensures privacy compliance while enabling effective targeted advertising.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Targeting Options:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>Keywords:</strong> Show ads based on menu searches</li>
                    <li>• <strong>Audience:</strong> Target specific customer groups</li>
                    <li>• <strong>Position:</strong> Choose where ads appear</li>
                    <li>• <strong>Schedule:</strong> Set start/end dates for campaigns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Privacy Features:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• Only shown to users who consent to marketing cookies</li>
                    <li>• Users can opt-out anytime in cookie preferences</li>
                    <li>• Full transparency about data usage</li>
                    <li>• Compliant with privacy regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${canShowTargetedAds ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">Current Status:</span>
            <span className={canShowTargetedAds ? 'text-green-600' : 'text-red-600'}>
              {canShowTargetedAds ? 'Targeted ads enabled (user consented)' : 'Targeted ads disabled (no marketing consent)'}
            </span>
          </div>
        </div>
      </div>

      {/* Add Ad Button */}
      <button
        onClick={() => {
          setShowAddAd(true)
          setEditingAd(null)
          resetAdForm()
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Targeted Ad
      </button>

      {/* Add/Edit Ad Form */}
      {showAddAd && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingAd ? 'Edit Targeted Ad' : 'Create New Targeted Ad'}
            </h3>
            <button
              onClick={() => {
                setShowAddAd(false)
                setEditingAd(null)
                resetAdForm()
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ad Title *
                  </label>
                  <input
                    type="text"
                    value={adFormData.title}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="e.g., Special Wine Pairing Dinner"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={adFormData.description}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="Describe your offer or promotion..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={adFormData.image}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="https://example.com/ad-image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target URL *
                  </label>
                  <input
                    type="url"
                    value={adFormData.url}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="Where should this ad link to?"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={adFormData.targetAudience}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="e.g., Wine enthusiasts, Couples, Business travelers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Keywords
                  </label>
                  <input
                    type="text"
                    value={adFormData.targetKeywords}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, targetKeywords: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="wine, seafood, romantic, dinner (comma separated)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Show this ad when users search for these terms
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <select
                    value={adFormData.position}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, position: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                  >
                    <option value="side-rail">Side Rail</option>
                    <option value="mobile-banner">Mobile Banner</option>
                    <option value="header">Header Banner</option>
                    <option value="footer">Footer Banner</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={adFormData.startDate}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={adFormData.endDate}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget (Optional)
                  </label>
                  <input
                    type="text"
                    value={adFormData.budget}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    placeholder="e.g., $500/month"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={adFormData.active}
                onChange={(e) => setAdFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">
                Ad is active and can be shown to users
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingAd ? 'Update Ad' : 'Create Ad'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddAd(false)
                  setEditingAd(null)
                  resetAdForm()
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Ads List */}
      {ads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Targeted Ads ({ads.length})
          </h3>
          
          <div className="grid gap-4">
            {ads.map((ad) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/placeholder-ad.jpg'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {ad.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          ad.active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {ad.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {ad.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {ad.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Position: {ad.position}</span>
                        {ad.targetAudience && <span>Audience: {ad.targetAudience}</span>}
                        {ad.targetKeywords && ad.targetKeywords.length > 0 && (
                          <span>Keywords: {ad.targetKeywords.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(showPreview === ad.id ? null : ad.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Preview Ad"
                    >
                      {showPreview === ad.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleToggleActive(ad.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        ad.active
                          ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title={ad.active ? 'Deactivate' : 'Activate'}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditAd(ad)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="Edit Ad"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preview */}
                {showPreview === ad.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Ad Preview:
                    </h5>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border p-3 max-w-sm">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h6 className="font-medium text-sm text-gray-900 dark:text-white">
                        {ad.title}
                      </h6>
                      {ad.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {ad.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-blue-600 text-xs">
                        <ExternalLink className="w-3 h-3" />
                        Learn More
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {ads.length === 0 && !showAddAd && (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Targeted Ads Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first targeted ad to reach customers who consent to marketing cookies.
          </p>
          <button
            onClick={() => {
              setShowAddAd(true)
              resetAdForm()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Ad
          </button>
        </div>
      )}
    </div>
  )
}
