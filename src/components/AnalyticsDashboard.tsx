'use client'

import React, { useState, useEffect } from 'react'
import { AnalyticsManager, ItemAnalytics, AnalyticsEvent } from '../lib/analytics'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsDashboardProps {
  className?: string
}

interface PopularityData {
  name: string
  views: number
  clicks: number
  longPresses: number
  cartAdds: number
  purchases: number
  conversionRate: number
  avgViewTime: number
  popularityScore: number
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [itemAnalytics, setItemAnalytics] = useState<ItemAnalytics[]>([])
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>('24h')
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'popularity' | 'views' | 'conversion' | 'revenue'>('popularity')

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    try {
      const analytics = AnalyticsManager.getItemAnalytics()
      const allEvents = AnalyticsManager.getStoredEvents()
      
      setItemAnalytics(analytics)
      setEvents(allEvents)
      setLoading(false)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setLoading(false)
    }
  }

  const filterEventsByTimeframe = (events: AnalyticsEvent[]): AnalyticsEvent[] => {
    if (selectedTimeframe === 'all') return events

    const now = Date.now()
    const timeframes = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }

    const cutoff = now - timeframes[selectedTimeframe]
    return events.filter(event => event.timestamp >= cutoff)
  }

  const getPopularityData = (): PopularityData[] => {
    const filteredEvents = filterEventsByTimeframe(events)
    
    return itemAnalytics
      .map(item => {
        const itemEvents = filteredEvents.filter(e => e.itemId === item.itemId)
        const viewEvents = itemEvents.filter(e => e.type === 'view' && e.duration)
        const avgViewTime = viewEvents.length > 0 
          ? viewEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / viewEvents.length 
          : 0

        return {
          name: item.itemName.length > 20 ? item.itemName.substring(0, 20) + '...' : item.itemName,
          views: item.totalViews,
          clicks: item.totalClicks,
          longPresses: item.totalLongPresses,
          cartAdds: item.totalAddToCarts,
          purchases: item.totalPurchaseAttempts,
          conversionRate: item.conversionRate,
          avgViewTime: avgViewTime / 1000, // Convert to seconds
          popularityScore: item.popularityScore
        }
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'views': return b.views - a.views
          case 'conversion': return b.conversionRate - a.conversionRate
          case 'revenue': return b.purchases - a.purchases
          default: return b.popularityScore - a.popularityScore
        }
      })
      .slice(0, 20) // Top 20 items
  }

  const getInteractionBreakdown = () => {
    const filteredEvents = filterEventsByTimeframe(events)
    const breakdown = {
      views: filteredEvents.filter(e => e.type === 'view').length,
      clicks: filteredEvents.filter(e => e.type === 'click').length,
      longPresses: filteredEvents.filter(e => e.type === 'long_press').length,
      cartAdds: filteredEvents.filter(e => e.type === 'add_to_cart').length,
      purchases: filteredEvents.filter(e => e.type === 'purchase_attempt').length
    }

    return [
      { name: 'Views', value: breakdown.views, color: COLORS[0] },
      { name: 'Clicks', value: breakdown.clicks, color: COLORS[1] },
      { name: 'Long Presses', value: breakdown.longPresses, color: COLORS[2] },
      { name: 'Cart Adds', value: breakdown.cartAdds, color: COLORS[3] },
      { name: 'Purchases', value: breakdown.purchases, color: COLORS[4] }
    ].filter(item => item.value > 0)
  }

  const getTopPerformers = () => {
    return itemAnalytics
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 5)
  }

  const getTrendData = () => {
    const filteredEvents = filterEventsByTimeframe(events)
    const now = Date.now()
    const intervals = selectedTimeframe === '1h' ? 12 : selectedTimeframe === '24h' ? 24 : 7
    const intervalDuration = selectedTimeframe === '1h' ? 5 * 60 * 1000 : 
                           selectedTimeframe === '24h' ? 60 * 60 * 1000 : 
                           24 * 60 * 60 * 1000

    const trendData = []
    for (let i = intervals - 1; i >= 0; i--) {
      const intervalStart = now - ((i + 1) * intervalDuration)
      const intervalEnd = now - (i * intervalDuration)
      
      const intervalEvents = filteredEvents.filter(e => 
        e.timestamp >= intervalStart && e.timestamp < intervalEnd
      )

      const label = selectedTimeframe === '1h' 
        ? `${Math.floor(i * 5)}m ago`
        : selectedTimeframe === '24h'
        ? `${24 - i}h ago`
        : `${7 - i}d ago`

      trendData.push({
        time: label,
        interactions: intervalEvents.length,
        views: intervalEvents.filter(e => e.type === 'view').length,
        clicks: intervalEvents.filter(e => e.type === 'click').length,
        cartAdds: intervalEvents.filter(e => e.type === 'add_to_cart').length
      })
    }

    return trendData
  }

  const getDetailedItemStats = (itemId: string) => {
    const item = itemAnalytics.find(a => a.itemId === itemId)
    if (!item) return null

    const itemEvents = filterEventsByTimeframe(events).filter(e => e.itemId === itemId)
    const viewEvents = itemEvents.filter(e => e.type === 'view' && e.duration)
    const clickEvents = itemEvents.filter(e => e.type === 'click')
    
    // Calculate session-based metrics
    const sessions = new Set(itemEvents.map(e => e.sessionId))
    const avgClicksPerSession = sessions.size > 0 ? clickEvents.length / sessions.size : 0
    
    // Calculate time-based metrics
    const avgViewTime = viewEvents.length > 0 
      ? viewEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / viewEvents.length / 1000 
      : 0

    const minViewTime = viewEvents.length > 0 
      ? Math.min(...viewEvents.map(e => e.duration || 0)) / 1000 
      : 0

    const maxViewTime = viewEvents.length > 0 
      ? Math.max(...viewEvents.map(e => e.duration || 0)) / 1000 
      : 0

    return {
      ...item,
      avgClicksPerSession,
      avgViewTime,
      minViewTime,
      maxViewTime,
      uniqueSessions: sessions.size,
      recentEvents: itemEvents.slice(-10)
    }
  }

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

  const popularityData = getPopularityData()
  const interactionBreakdown = getInteractionBreakdown()
  const topPerformers = getTopPerformers()
  const trendData = getTrendData()
  const detailedStats = selectedItem ? getDetailedItemStats(selectedItem) : null

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Popularity Analytics Dashboard</h1>
        <div className="flex gap-4">
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="popularity">Popularity Score</option>
            <option value="views">Total Views</option>
            <option value="conversion">Conversion Rate</option>
            <option value="revenue">Purchase Attempts</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Items Tracked</h3>
          <p className="text-2xl font-bold text-blue-600">{itemAnalytics.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Interactions</h3>
          <p className="text-2xl font-bold text-green-600">{filterEventsByTimeframe(events).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Avg. Conversion Rate</h3>
          <p className="text-2xl font-bold text-orange-600">
            {itemAnalytics.length > 0 
              ? (itemAnalytics.reduce((sum, item) => sum + item.conversionRate, 0) / itemAnalytics.length).toFixed(1)
              : 0}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Top Item Score</h3>
          <p className="text-2xl font-bold text-purple-600">
            {topPerformers.length > 0 ? Math.round(topPerformers[0].popularityScore) : 0}
          </p>
        </div>
      </div>

      {/* Interaction Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Interaction Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="interactions" stroke="#8884d8" name="Total" strokeWidth={2} />
            <Line type="monotone" dataKey="views" stroke="#82ca9d" name="Views" />
            <Line type="monotone" dataKey="clicks" stroke="#ffc658" name="Clicks" />
            <Line type="monotone" dataKey="cartAdds" stroke="#ff7300" name="Cart Adds" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popularity Chart */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Item Performance Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={popularityData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={10}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  typeof value === 'number' ? value.toFixed(name === 'avgViewTime' ? 1 : 0) : value,
                  name === 'avgViewTime' ? 'Avg View Time (s)' : name
                ]}
              />
              <Bar dataKey="popularityScore" fill="#8884d8" name="Popularity Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interaction Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Interaction Breakdown</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={interactionBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }: any) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {interactionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Detailed Item Metrics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on an item to see detailed analytics and user behavior patterns
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Long Press</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cart Adds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg View Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {popularityData.map((item, index) => (
                <tr 
                  key={index}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedItem === itemAnalytics.find(a => a.itemName.includes(item.name.replace('...', '')))?.itemId 
                      ? 'bg-blue-50' 
                      : ''
                  }`}
                  onClick={() => {
                    const fullItem = itemAnalytics.find(a => a.itemName.includes(item.name.replace('...', '')))
                    if (fullItem) {
                      setSelectedItem(selectedItem === fullItem.itemId ? '' : fullItem.itemId)
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.clicks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.longPresses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cartAdds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.purchases}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgViewTime.toFixed(1)}s</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.conversionRate.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{Math.round(item.popularityScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Item Stats */}
      {detailedStats && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Detailed Analysis: {detailedStats.itemName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Average View Duration</h3>
              <p className="text-xl font-bold text-blue-600">{detailedStats.avgViewTime.toFixed(1)}s</p>
              <p className="text-xs text-blue-600">Min: {detailedStats.minViewTime.toFixed(1)}s | Max: {detailedStats.maxViewTime.toFixed(1)}s</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Clicks per Session</h3>
              <p className="text-xl font-bold text-green-600">{detailedStats.avgClicksPerSession.toFixed(1)}</p>
              <p className="text-xs text-green-600">Across {detailedStats.uniqueSessions} sessions</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-800">Purchase Rate</h3>
              <p className="text-xl font-bold text-orange-600">{detailedStats.purchaseConversionRate.toFixed(1)}%</p>
              <p className="text-xs text-orange-600">Of cart additions</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Last Updated</h3>
              <p className="text-xl font-bold text-purple-600">
                {new Date(detailedStats.lastUpdated).toLocaleDateString()}
              </p>
              <p className="text-xs text-purple-600">
                {new Date(detailedStats.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div>
            <h3 className="text-md font-semibold mb-3">Recent User Interactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Duration</th>
                    <th className="px-4 py-2 text-left">Session</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailedStats.recentEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(event.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.type === 'view' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'click' ? 'bg-green-100 text-green-800' :
                          event.type === 'long_press' ? 'bg-yellow-100 text-yellow-800' :
                          event.type === 'add_to_cart' ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {event.duration ? `${(event.duration / 1000).toFixed(1)}s` : '-'}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">
                        {event.sessionId.split('_')[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Export Data */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Data Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const data = AnalyticsManager.exportAnalyticsData()
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`
              a.click()
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export Data
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
                AnalyticsManager.clearAllData()
                loadAnalyticsData()
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear All Data
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Export your analytics data for external analysis or clear all data for privacy compliance.
        </p>
      </div>
    </div>
  )
}
