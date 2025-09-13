'use client'

import { useState } from 'react'
import { X, Star, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClient } from '@supabase/supabase-js'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  dishId: string
  dishName: string
  onReviewSubmitted?: () => void
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  dishId, 
  dishName, 
  onReviewSubmitted 
}: ReviewModalProps) {
  const { t } = useLanguage()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          dish_id: dishId,
          rating: rating,
          comment: comment.trim() || null,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error submitting review:', error)
        alert('Failed to submit review. Please try again.')
        return
      }

      // Reset form
      setRating(0)
      setComment('')
      onReviewSubmitted?.()
      onClose()
      alert('Thank you for your review!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-luxury-dark-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-luxury-dark-border">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-luxury-dark-text">
            {t('rateAndReview')} {dishName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-luxury-dark-muted transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-luxury-dark-text mb-3">
              {t('rating')} *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 dark:text-luxury-dark-muted mt-2">
                {rating === 1 && t('poor')}
                {rating === 2 && t('fair')}
                {rating === 3 && t('good')}
                {rating === 4 && t('veryGood')}
                {rating === 5 && t('excellent')}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-luxury-dark-text mb-2">
              {t('comment')} ({t('optional')})
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('shareYourExperience')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-luxury-dark-border rounded-md shadow-sm focus:ring-2 focus:ring-luxury-light-accent dark:focus:ring-luxury-dark-accent focus:border-transparent dark:bg-luxury-dark-card dark:text-luxury-dark-text"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-luxury-dark-muted mt-1">
              {comment.length}/500 {t('characters')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-luxury-dark-border text-gray-700 dark:text-luxury-dark-text rounded-md hover:bg-gray-50 dark:hover:bg-luxury-dark-card transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-2 bg-luxury-light-accent dark:bg-luxury-dark-accent text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('submitReview')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
