'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, User, Calendar, CheckCircle } from 'lucide-react'
import { Review, Dish } from '@/types'

interface ReviewSystemProps {
  dish: Dish
  onReviewSubmit?: (review: Omit<Review, 'id' | 'createdAt'>) => void
}

export default function ReviewSystem({ dish, onReviewSubmit }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(dish.reviews || [])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  // Generate sample reviews if none exist
  useEffect(() => {
    if (reviews.length === 0) {
      const sampleReviews: Review[] = [
        {
          id: '1',
          dishId: dish.id,
          userId: 'user1',
          userName: 'Ahmad M.',
          rating: 5,
          comment: 'Absolutely delicious! The flavors are authentic and the presentation is beautiful. Highly recommended!',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          helpful: 12,
          verified: true
        },
        {
          id: '2',
          dishId: dish.id,
          userId: 'user2',
          userName: 'Sarah K.',
          rating: 4,
          comment: 'Great taste and fresh ingredients. The portion size was perfect for the price.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          helpful: 8,
          verified: true
        },
        {
          id: '3',
          dishId: dish.id,
          userId: 'user3',
          userName: 'Omar H.',
          rating: 5,
          comment: 'This dish reminds me of home. The chef really knows Lebanese cuisine!',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          helpful: 15,
          verified: true
        }
      ]
      setReviews(sampleReviews)
    }
  }, [dish.id, reviews.length])

  const handleSubmitReview = async () => {
    if (!newReview.userName || newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please fill in all fields and select a rating.')
      return
    }

    setSubmitting(true)
    
    const review: Omit<Review, 'id' | 'createdAt'> = {
      dishId: dish.id,
      userId: `user_${Date.now()}`,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      helpful: 0,
      verified: false
    }

    // Add to local reviews
    const fullReview: Review = {
      ...review,
      id: `review_${Date.now()}`,
      createdAt: new Date()
    }

    setReviews(prev => [fullReview, ...prev])
    
    // Call parent callback if provided
    if (onReviewSubmit) {
      onReviewSubmit(review)
    }

    // Reset form
    setNewReview({ userName: '', rating: 0, comment: '' })
    setShowReviewForm(false)
    setSubmitting(false)

    // Show success message
    alert('Thank you for your review! It will be visible after moderation.')
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`transition-colors ${
              interactive 
                ? 'hover:scale-110 cursor-pointer' 
                : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-luxury-dark-accent dark:text-luxury-dark-accent">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(averageRating)}
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-luxury-dark-accent text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Write Review
        </motion.button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-luxury-light-card dark:bg-luxury-dark-card p-6 rounded-lg border border-luxury-light-border/20 dark:border-luxury-dark-border/20"
          >
            <h3 className="text-lg font-semibold mb-4 text-luxury-light-text dark:text-luxury-dark-text">
              Share Your Experience
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-luxury-light-text dark:text-luxury-dark-text">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-3 py-2 border border-luxury-light-border/30 dark:border-luxury-dark-border/30 rounded-lg bg-luxury-light-bg dark:bg-luxury-dark-bg text-luxury-light-text dark:text-luxury-dark-text focus:outline-none focus:ring-2 focus:ring-luxury-dark-accent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-luxury-light-text dark:text-luxury-dark-text">
                  Rating
                </label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-luxury-light-text dark:text-luxury-dark-text">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-luxury-light-border/30 dark:border-luxury-dark-border/30 rounded-lg bg-luxury-light-bg dark:bg-luxury-dark-bg text-luxury-light-text dark:text-luxury-dark-text focus:outline-none focus:ring-2 focus:ring-luxury-dark-accent resize-none"
                  rows={4}
                  placeholder="Tell us about your experience with this dish..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="px-6 py-2 bg-luxury-dark-accent text-black rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </motion.button>
                
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2 border border-luxury-light-border/30 dark:border-luxury-dark-border/30 text-luxury-light-text dark:text-luxury-dark-text rounded-lg hover:bg-luxury-light-warm/20 dark:hover:bg-luxury-dark-card transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-luxury-light-text dark:text-luxury-dark-text">
          Customer Reviews
        </h3>
        
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-luxury-light-card dark:bg-luxury-dark-card p-4 rounded-lg border border-luxury-light-border/20 dark:border-luxury-dark-border/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-luxury-dark-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-luxury-dark-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-luxury-light-text dark:text-luxury-dark-text">
                      {review.userName}
                    </span>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {renderStars(review.rating)}
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-luxury-dark-accent transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {review.helpful}
              </button>
            </div>
            
            <p className="text-luxury-light-text/80 dark:text-luxury-dark-text/80 leading-relaxed">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
