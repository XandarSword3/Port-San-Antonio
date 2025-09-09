'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Phone, Mail, MessageSquare, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Reservation } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface ReservationManagerProps {
  reservations: Reservation[]
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void
  onUpdateReservation: (id: string, reservation: Partial<Reservation>) => void
  onDeleteReservation: (id: string) => void
}

export default function ReservationManager({
  reservations,
  onAddReservation,
  onUpdateReservation,
  onDeleteReservation
}: ReservationManagerProps) {
  const { t } = useLanguage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const reservationData = {
      ...formData,
      date: new Date(formData.date),
      createdBy: 'current-user-id' // In real app, get from auth context
    }

    if (editingReservation) {
      onUpdateReservation(editingReservation.id, {
        ...reservationData,
        updatedAt: new Date()
      })
      setEditingReservation(null)
    } else {
      onAddReservation(reservationData)
      setShowAddForm(false)
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: 1,
      specialRequests: '',
      status: 'pending',
      notes: ''
    })
  }

  const handleEdit = (reservation: Reservation) => {
    setFormData({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      date: reservation.date.toISOString().split('T')[0],
      time: reservation.time,
      guests: reservation.guests,
      specialRequests: reservation.specialRequests || '',
      status: reservation.status,
      notes: reservation.notes || ''
    })
    setEditingReservation(reservation)
    setShowAddForm(true)
  }

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerPhone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('reservationManager')}
        </h2>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingReservation(null)
            resetForm()
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('addReservation')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">{t('pending')}</option>
            <option value="confirmed">{t('confirmed')}</option>
            <option value="cancelled">{t('cancelled')}</option>
            <option value="completed">{t('completed')}</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingReservation ? t('editReservation') : t('addReservation')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customerName')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customerEmail')}
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customerPhone')}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('numberOfGuests')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reservationDate')}
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reservationTime')}
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reservationStatus')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="pending">{t('pending')}</option>
                <option value="confirmed">{t('confirmed')}</option>
                <option value="cancelled">{t('cancelled')}</option>
                <option value="completed">{t('completed')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('specialRequests')}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('reservationNotes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingReservation ? t('save') : t('addReservation')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingReservation(null)
                  resetForm()
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reservations List */}
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'all' ? 'No reservations match your filters' : 'No reservations yet'}
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              layout
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {reservation.customerName}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reservation.status)}`}>
                    {t(reservation.status)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(reservation)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteReservation(reservation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {reservation.date.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  {reservation.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Users className="w-4 h-4" />
                  {reservation.guests} guests
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  {reservation.customerEmail}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4" />
                  {reservation.customerPhone}
                </div>
              </div>
              
              {reservation.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Special Requests:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{reservation.specialRequests}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {reservation.notes && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-yellow-700 dark:text-yellow-300">Staff Notes:</span>
                      <p className="text-yellow-600 dark:text-yellow-400 mt-1">{reservation.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
