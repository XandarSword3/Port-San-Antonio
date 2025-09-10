'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, CreditCard, Trash2, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentModal from './PaymentModal';
import ReservationModal from './ReservationModal';
import { formatCurrency } from '@/lib/stripe';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    clearCart();
    setShowPayment(false);
    onClose();
  };

  const handleReservationSubmit = () => {
    setShowReservation(false);
  };

  const generateOrderNumber = () => {
    return `ORD-${Date.now()}`;
  };

  const submitOrder = async () => {
    if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
      alert('Please provide your name and email address.');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setSubmittingOrder(true);

    try {
      const orderNumber = generateOrderNumber();
      const subtotal = totalPrice;
      const tax = subtotal * 0.10; // 10% tax
      const total = subtotal + tax;

      // Insert order into database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customerInfo.name.trim(),
          customer_email: customerInfo.email.trim(),
          subtotal: subtotal,
          tax: tax,
          total: total,
          status: 'pending',
          payment_status: 'pending'
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        alert('Failed to submit order. Please try again.');
        setSubmittingOrder(false);
        return;
      }

      // Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        dish_id: item.dish.id,
        quantity: item.quantity,
        price: item.selectedVariant?.price || item.dish.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        alert('Order created but failed to save items. Please contact support.');
        setSubmittingOrder(false);
        return;
      }

      // Success!
      alert(`Order ${orderNumber} submitted successfully! You will receive a confirmation email shortly.`);
      clearCart();
      setCustomerInfo({ name: '', email: '' });
      setShowCustomerForm(false);
      onClose();

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleSubmitOrderClick = () => {
    setShowCustomerForm(true);
  };

  // Convert cart items to payment format
  const paymentItems = items.map(item => ({
    name: `${item.dish.name} ${item.selectedVariant ? `(${item.selectedVariant.name})` : ''}`,
    quantity: item.quantity,
    price: item.selectedVariant?.price || item.dish.price || 0
  }));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-96 max-w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col cart-sidebar-mobile"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  {t('cart')}
                  {totalItems > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                      {totalItems}
                    </span>
                  )}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      {t('cartEmpty')}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{t('exploreMenu')}</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.dish.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {item.dish.name}
                            </h4>
                            {item.selectedVariant && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.selectedVariant.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.dish.id, item.selectedVariant)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title={t('removeItem')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity - 1, item.selectedVariant)}
                              className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.dish.id, item.quantity + 1, item.selectedVariant)}
                              className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="font-bold">
                            {formatCurrency((item.selectedVariant?.price || item.dish.price || 0) * item.quantity)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 p-6 space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t('total')}:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>

                  {/* Customer Info Form */}
                  {showCustomerForm && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Order Information</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {!showCustomerForm ? (
                      <motion.button
                        onClick={handleSubmitOrderClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Submit Order
                      </motion.button>
                    ) : (
                      <div className="space-y-2">
                        <motion.button
                          onClick={submitOrder}
                          disabled={submittingOrder}
                          whileHover={{ scale: submittingOrder ? 1 : 1.02 }}
                          whileTap={{ scale: submittingOrder ? 1 : 0.98 }}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                          {submittingOrder ? (
                            <>Submitting...</>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Confirm Order
                            </>
                          )}
                        </motion.button>
                        <button
                          onClick={() => setShowCustomerForm(false)}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <motion.button
                      onClick={() => setShowPayment(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      {t('payNow')}
                    </motion.button>

                    <motion.button
                      onClick={() => setShowReservation(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      {t('makeReservation')}
                    </motion.button>

                    <button
                      onClick={clearCart}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      {t('clearCart')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={totalPrice}
        items={paymentItems}
        onSuccess={handlePaymentSuccess}
      />

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
        dishName={items.map(item => `${item.dish.name} (${item.quantity}x)`).join(', ')}
      />
    </>
  );
};

export default CartSidebar;
