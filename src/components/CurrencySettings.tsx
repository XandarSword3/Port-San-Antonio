'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Save, RefreshCw } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function CurrencySettings() {
  const { currency, setCurrency, exchangeRate, setExchangeRate, formatPrice } = useCurrency()
  const [localRate, setLocalRate] = useState(exchangeRate.toString())
  const [isSaving, setIsSaving] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    setLocalRate(exchangeRate.toString())
  }, [exchangeRate])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const newRate = parseFloat(localRate)
      if (isNaN(newRate) || newRate <= 0) {
        alert('Please enter a valid exchange rate')
        return
      }
      
      setExchangeRate(newRate)
      setLastUpdated(new Date())
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Currency settings saved successfully!')
    } catch (error) {
      alert('Error saving currency settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setLocalRate('90000')
    setExchangeRate(90000)
  }

  const samplePrice = 15.99
  const sampleLBPPrice = Math.round(samplePrice * exchangeRate)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Currency Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Settings</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Primary Currency</span>
                <span className="text-sm font-semibold text-gray-900">{currency}</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Exchange Rate</span>
                <span className="text-sm font-semibold text-gray-900">1 USD = {exchangeRate.toLocaleString()} LBP</span>
              </div>
              
              {lastUpdated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">{lastUpdated.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Price Preview</h3>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-800 mb-2">Sample Item: $15.99</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">USD Display</span>
                  <span className="text-sm font-semibold text-gray-900">${samplePrice.toFixed(2)} USD</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">LBP Display</span>
                  <span className="text-sm font-semibold text-gray-900">{sampleLBPPrice.toLocaleString()} LBP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Rate Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 mb-2">
              USD to LBP Exchange Rate
            </label>
            <div className="flex items-center gap-3">
              <input
                id="exchangeRate"
                type="number"
                value={localRate}
                onChange={(e) => setLocalRate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="90000"
                min="1"
                step="1"
              />
              <span className="text-sm text-gray-500">LBP per USD</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current rate: 1 USD = {parseFloat(localRate || '0').toLocaleString()} LBP
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-luxury-dark-accent to-yellow-600 px-4 py-2 text-sm font-medium text-black transition-colors hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </motion.button>

            <motion.button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-luxury-dark-border/20 px-4 py-2 text-sm font-medium text-luxury-dark-text transition-colors hover:bg-luxury-dark-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Default
            </motion.button>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 mt-0.5">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Exchange rates are updated in real-time across the application</li>
              <li>• All prices are stored in USD and converted to LBP when displayed</li>
              <li>• The default rate is 90,000 LBP per USD (as of 2024)</li>
              <li>• Changes take effect immediately for all users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
