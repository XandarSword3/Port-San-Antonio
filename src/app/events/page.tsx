'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Plus, Edit2, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  imageUrl?: string
}

export default function EventsPage() {
  const { t, language } = useLanguage()
  const { isLoggedIn } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Mock events data - in real app this would come from API
  useEffect(() => {
    // Simulate API call
    const mockEvents: Event[] = [
      // Add mock events here if needed for testing
    ]
    
    setEvents(mockEvents)
    setLoading(false)
  }, [])

  const canManageEvents = isLoggedIn

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="p-4">
            <BackButton />
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('events')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Discover upcoming events at Port Antonio Resort
                  </p>
                </div>
              </div>
              {canManageEvents && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  {t('createEvent')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('noEventsAtMoment')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {t('checkBackLater')}
              </p>
              {canManageEvents && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
                  <Plus className="w-5 h-5" />
                  {t('createEvent')}
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      {canManageEvents && (
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{event.registered}/{event.capacity} registered</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                      Register for Event
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
