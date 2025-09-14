'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, User, Calendar } from 'lucide-react'
import { Dish, Review } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'

interface ReviewSystemProps {
  dish: Dish
}

interface ReviewFormData {
  rating: number
  comment: string
  name: string
  email: string
}

export default function ReviewSystem({ dish }: ReviewSystemProps) {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
    name: '',
    email: ''
  })
  const [hoveredStar, setHoveredStar] = useState(0)

  // Load reviews for this dish
  useEffect(() => {
    const loadReviews = async () => {
      if (!isSupabaseAvailable() || !supabase) return
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('dish_id', dish.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setReviews(data || [])
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [dish.id])

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.rating === 0) return

    setSubmitting(true)
    try {
      if (!isSupabaseAvailable() || !supabase) {
        throw new Error('Database not available')
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          dish_id: dish.id,
          rating: formData.rating,
          comment: formData.comment.trim(),
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          status: 'pending' // Will be approved by admin
        })

      if (error) throw error

      // Reset form
      setFormData({
        rating: 0,
        comment: '',
        name: '',
        email: ''
      })
      setShowForm(false)

      // Reload reviews
      const { data, error: reloadError } = await supabase
        .from('reviews')
        .select('*')
        .eq('dish_id', dish.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!reloadError) {
        setReviews(data || [])
      }

      alert(t('reviewSubmitted') || 'Thank you for your review! It will be published after approval.')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(t('reviewError') || 'Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle star rating
  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  // Handle star hover
  const handleStarHover = (rating: number) => {
    setHoveredStar(rating)
  }

  // Handle star leave
  const handleStarLeave = () => {
    setHoveredStar(0)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-LB' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= averageRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} ({reviews.length} {t('reviews') || 'reviews'})
        </div>
      </div>

      {/* Leave Review Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          isDark
            ? 'bg-luxury-dark-accent/20 text-luxury-dark-accent border border-luxury-dark-accent/30 hover:bg-luxury-dark-accent/30'
            : 'bg-luxury-light-accent/20 text-luxury-light-accent border border-luxury-light-accent/30 hover:bg-luxury-light-accent/30'
        }`}
      >
        {showForm ? (t('cancelReview') || 'Cancel Review') : (t('leaveReview') || 'Leave a Review')}
      </button>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-luxury-dark-card/50">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rating') || 'Rating'} *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="p-1 transition-colors duration-200"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoveredStar || formData.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name') || 'Name'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-luxury-light-accent dark:focus:ring-luxury-dark-accent focus:border-transparent bg-white dark:bg-luxury-dark-card text-gray-900 dark:text-luxury-dark-text"
                  placeholder={t('enterName') || 'Enter your name'}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('email') || 'Email'} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-luxury-light-accent dark:focus:ring-luxury-dark-accent focus:border-transparent bg-white dark:bg-luxury-dark-card text-gray-900 dark:text-luxury-dark-text"
                  placeholder={t('enterEmail') || 'Enter your email'}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('comment') || 'Comment'}
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-luxury-light-accent dark:focus:ring-luxury-dark-accent focus:border-transparent bg-white dark:bg-luxury-dark-card text-gray-900 dark:text-luxury-dark-text resize-none"
                  placeholder={t('writeReview') || 'Write your review...'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || formData.rating === 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  formData.rating === 0 || submitting
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : isDark
                    ? 'bg-luxury-dark-accent text-luxury-dark-text hover:bg-luxury-dark-accent/90'
                    : 'bg-luxury-light-accent text-white hover:bg-luxury-light-accent/90'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t('submitting') || 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('submitReview') || 'Submit Review'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          {t('loadingReviews') || 'Loading reviews...'}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-luxury-dark-text">
            {t('reviews') || 'Reviews'} ({reviews.length})
          </h4>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-luxury-dark-card/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-luxury-dark-text">
                    {review.customer_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {review.comment && (
                <p className="text-gray-700 dark:text-luxury-dark-text/80 mb-2">
                  {review.comment}
                </p>
              )}
              
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(review.created_at)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p>{t('noReviews') || 'No reviews yet. Be the first to review this dish!'}</p>
        </div>
      )}
    </div>
  )
}
