'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Save, X, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { AppData, Ad } from '@/types'

interface AdManagerProps {
  data: AppData
  onDataChange: (data: AppData) => void
}

export default function AdManager({ data, onDataChange }: AdManagerProps) {
  const [editingAd, setEditingAd] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Partial<Ad>>({})
  const [newAd, setNewAd] = useState({
    title: '',
    image: '',
    url: '',
    position: 'side-rail' as 'side-rail' | 'mobile-banner',
    weight: 1
  })

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad.id)
    setEditingData({ ...ad })
  }

  const handleSave = (adId: string) => {
    const updatedAds = data.ads.map(ad =>
      ad.id === adId ? { ...ad, ...editingData } : ad
    )
    
    onDataChange({ ...data, ads: updatedAds })
    setEditingAd(null)
    setEditingData({})
  }

  const handleCancel = () => {
    setEditingAd(null)
    setEditingData({})
  }

  const handleDelete = (adId: string) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      const updatedAds = data.ads.filter(ad => ad.id !== adId)
      onDataChange({ ...data, ads: updatedAds })
    }
  }

  const handleAddAd = () => {
    if (!newAd.title.trim() || !newAd.image.trim() || !newAd.url.trim()) return

    const newAdvertisement: Ad = {
      id: `ad-${Date.now()}`,
      title: newAd.title.trim(),
      image: newAd.image.trim(),
      url: newAd.url.trim(),
      position: newAd.position,
      weight: newAd.weight
    }

    const updatedAds = [...data.ads, newAdvertisement]
    onDataChange({ ...data, ads: updatedAds })
    
    setNewAd({
      title: '',
      image: '',
      url: '',
      position: 'side-rail',
      weight: 1
    })
  }

  const toggleAdVisibility = (adId: string) => {
    const updatedAds = data.ads.map(ad =>
      ad.id === adId ? { ...ad, active: !ad.active } : ad
    )
    onDataChange({ ...data, ads: updatedAds })
  }

  const sideRailAds = (data.ads || []).filter(ad => ad.position === 'side-rail')
  const mobileBannerAds = (data.ads || []).filter(ad => ad.position === 'mobile-banner')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Manager</h2>
          <p className="text-gray-600">Manage promotional content and advertisements</p>
        </div>
      </div>

      {/* Add New Ad */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Advertisement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newAd.title}
            onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
            placeholder="Ad title"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={newAd.image}
            onChange={(e) => setNewAd({ ...newAd, image: e.target.value })}
            placeholder="Image URL"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={newAd.url}
            onChange={(e) => setNewAd({ ...newAd, url: e.target.value })}
            placeholder="Target URL"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex gap-4">
            <select
              value={newAd.position}
              onChange={(e) => setNewAd({ ...newAd, position: e.target.value as 'side-rail' | 'mobile-banner' })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="side-rail">Side Rail (Desktop)</option>
              <option value="mobile-banner">Mobile Banner</option>
            </select>
            <input
              type="number"
              min="1"
              max="10"
              value={newAd.weight}
              onChange={(e) => setNewAd({ ...newAd, weight: parseInt(e.target.value) })}
              placeholder="Weight"
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddAd}
          disabled={!newAd.title.trim() || !newAd.image.trim() || !newAd.url.trim()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Create Ad
        </button>
      </div>

      {/* Side Rail Ads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Side Rail Advertisements</h3>
          <p className="text-sm text-gray-600">Displayed on desktop right sidebar</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sideRailAds.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Ad Preview */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMyOS41IDIwIDIxIDI4LjUgMjEgMzlDMjEgNDkuNSAyOS41IDU4IDQwIDU4QzUwLjUgNTggNTkgNDkuNSA1OSAzOUM1OSAyOC41IDUwLjUgMjAgNDAgMjBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMCA2NkMxMCA2NiAxNiA1OCA0MCA1OEM2NCA1OCA3MCA2NiA3MCA2NlY2OEM3MCA2OS4xIDY5LjEgNzAgNjggNzBIMTJDMTAuOSA3MCAxMCA2OS4xIDEwIDY4VjY2WiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K'
                    }}
                  />
                </div>

                {/* Ad Info */}
                <div className="flex-1">
                  {editingAd === ad.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingData.title || ad.title}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingData.image || ad.image}
                        onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={editingData.url || ad.url}
                        onChange={(e) => setEditingData({ ...editingData, url: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Target URL"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{ad.title}</h4>
                      <p className="text-sm text-gray-500">Weight: {ad.weight}</p>
                      <a
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        View Target <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {editingAd === ad.id ? (
                    <>
                      <button
                        onClick={() => handleSave(ad.id)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleAdVisibility(ad.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {ad.active !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {sideRailAds.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No side rail advertisements configured
            </div>
          )}
        </div>
      </div>

      {/* Mobile Banner Ads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mobile Banner Advertisements</h3>
          <p className="text-sm text-gray-600">Displayed as sticky banners on mobile devices</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mobileBannerAds.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Ad Preview */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMyOS41IDIwIDIxIDI4LjUgMjEgMzlDMjEgNDkuNSAyOS41IDU4IDQwIDU4QzUwLjUgNTggNTkgNDkuNSA1OSAzOUM1OSAyOC41IDUwLjUgMjAgNDAgMjBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMCA2NkMxMCA2NiAxNiA1OCA0MCA1OEM2NCA1OCA3MCA2NiA3MCA2NlY2OEM3MCA2OS4xIDY5LjEgNzAgNjggNzBIMTJDMTAuOSA3MCAxMCA2OS4xIDEwIDY4VjY2WiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K'
                    }}
                  />
                </div>

                {/* Ad Info */}
                <div className="flex-1">
                  {editingAd === ad.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingData.title || ad.title}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editingData.image || ad.image}
                        onChange={(e) => setEditingData({ ...editingData, image: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={editingData.url || ad.url}
                        onChange={(e) => setEditingData({ ...editingData, url: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Target URL"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{ad.title}</h4>
                      <p className="text-sm text-gray-500">Weight: {ad.weight}</p>
                      <a
                        href={ad.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      >
                        View Target <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {editingAd === ad.id ? (
                    <>
                      <button
                        onClick={() => handleSave(ad.id)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleAdVisibility(ad.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {ad.active !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {mobileBannerAds.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No mobile banner advertisements configured
            </div>
          )}
        </div>
      </div>

      {/* Ad Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advertisement Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Total Ads</h4>
            <div className="text-2xl font-bold text-blue-600">{(data.ads || []).length}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Side Rail</h4>
            <div className="text-2xl font-bold text-green-600">{sideRailAds.length}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Mobile Banners</h4>
            <div className="text-2xl font-bold text-purple-600">{mobileBannerAds.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
