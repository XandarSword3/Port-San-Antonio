'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SPIN_WHEEL_PRIZES } from '@/lib/membershipConfig';
import { SpinWheelPrize } from '@/types/membership';
import {
  Sparkles,
  Gift,
  Coins,
  Tag,
  RotateCcw,
  Trophy,
  X,
} from 'lucide-react';
import {
  getAdaptiveDuration,
  isFeatureEnabled,
  type DeviceTier,
  getPerformanceManager,
} from '@/lib/hardwareDetection';

interface SpinWheelProps {
  spinsAvailable: number;
  onSpin?: (prize: SpinWheelPrize) => void;
  onClose?: () => void;
  className?: string;
}

export default function SpinWheel({
  spinsAvailable,
  onSpin,
  onClose,
  className = '',
}: SpinWheelProps) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [deviceTier, setDeviceTier] = useState<DeviceTier>('medium');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<SpinWheelPrize | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const perfManager = getPerformanceManager();
    setDeviceTier(perfManager.getCurrentTier());
  }, []);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Coins,
      Tag,
      Gift,
      RotateCcw,
    };
    return icons[iconName] || Gift;
  };

  const selectPrize = (): SpinWheelPrize => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const prize of SPIN_WHEEL_PRIZES) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability) {
        return prize;
      }
    }

    return SPIN_WHEEL_PRIZES[0]; // Fallback
  };

  const handleSpin = () => {
    if (isSpinning || spinsAvailable <= 0) return;

    setIsSpinning(true);
    const selectedPrize = selectPrize();
    
    // Calculate the angle for the selected prize
    const prizeIndex = SPIN_WHEEL_PRIZES.findIndex(p => p.id === selectedPrize.id);
    const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;
    const targetAngle = prizeIndex * segmentAngle;
    
    // Add multiple full rotations for excitement + land on prize
    const fullRotations = 5 + Math.random() * 2; // 5-7 full spins
    const finalRotation = rotation + (360 * fullRotations) + (360 - targetAngle);

    setRotation(finalRotation);

    // Show prize after animation
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      setShowPrizeModal(true);
      onSpin?.(selectedPrize);
    }, getAdaptiveDuration(4000, deviceTier));
  };

  const segmentAngle = 360 / SPIN_WHEEL_PRIZES.length;

  return (
    <div className={`relative ${className}`}>
      {/* Main Wheel Container */}
      <div className="flex flex-col items-center">
        {/* Spins Available */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 text-center px-6 py-3 rounded-full ${
            isDark
              ? 'bg-luxury-dark-card border border-luxury-dark-border'
              : 'bg-luxury-light-card border border-luxury-light-border shadow-lg'
          }`}
        >
          <p className={`text-sm ${isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'}`}>
            Spins Available
          </p>
          <p className={`text-3xl font-bold ${isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'}`}>
            {spinsAvailable}
          </p>
        </motion.div>

        {/* Wheel */}
        <div className="relative">
          {/* Pointer */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-8 left-1/2 transform -translate-x-1/2 z-20 ${
              isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
            }`}
          >
            <div className="relative">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px]"
                style={{ borderTopColor: isDark ? '#D4AF37' : '#D4AF37' }}
              />
              <Trophy className="absolute top-1 left-1/2 transform -translate-x-1/2 h-5 w-5 text-black" />
            </div>
          </motion.div>

          {/* Spinning Wheel */}
          <motion.div
            ref={wheelRef}
            className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl"
            style={{
              rotate: rotation,
              boxShadow: isDark
                ? '0 0 60px rgba(212, 175, 55, 0.4)'
                : '0 0 40px rgba(212, 175, 55, 0.3)',
            }}
            transition={{
              duration: getAdaptiveDuration(4, deviceTier),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Wheel Segments */}
            {SPIN_WHEEL_PRIZES.map((prize, index) => {
              const Icon = getIconComponent(prize.icon);
              const angle = index * segmentAngle;
              const nextAngle = (index + 1) * segmentAngle;

              return (
                <div
                  key={prize.id}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${
                      50 + 50 * Math.sin((angle * Math.PI) / 180)
                    }%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${
                      50 + 50 * Math.sin((nextAngle * Math.PI) / 180)
                    }%)`,
                    backgroundColor: prize.color,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white font-bold"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle + segmentAngle / 2}deg) translateY(-100px)`,
                    }}
                  >
                    <Icon className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center whitespace-nowrap">{prize.name}</span>
                  </div>
                </div>
              );
            })}

            {/* Center Circle */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center ${
                isDark ? 'bg-luxury-dark-accent' : 'bg-luxury-light-accent'
              }`}
              style={{
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              }}
            >
              <Sparkles className="h-8 w-8 text-black" />
            </div>
          </motion.div>
        </div>

        {/* Spin Button */}
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning || spinsAvailable <= 0}
          whileHover={!isSpinning && spinsAvailable > 0 ? { scale: 1.1 } : {}}
          whileTap={!isSpinning && spinsAvailable > 0 ? { scale: 0.95 } : {}}
          className={`mt-8 px-12 py-4 rounded-full text-xl font-bold transition-all ${
            isSpinning || spinsAvailable <= 0
              ? isDark
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isDark
              ? 'bg-luxury-dark-accent text-black hover:bg-yellow-400'
              : 'bg-luxury-light-accent text-white hover:bg-amber-600'
          }`}
          style={{
            boxShadow:
              !isSpinning && spinsAvailable > 0
                ? isDark
                  ? '0 10px 30px rgba(212, 175, 55, 0.4)'
                  : '0 10px 30px rgba(212, 175, 55, 0.3)'
                : 'none',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RotateCcw className="h-6 w-6" />
              </motion.div>
              Spinning...
            </span>
          ) : spinsAvailable <= 0 ? (
            'No Spins Left'
          ) : (
            'SPIN NOW!'
          )}
        </motion.button>

        {/* How to Earn More Spins */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 text-center text-sm ${
            isDark ? 'text-luxury-dark-muted' : 'text-luxury-light-text/70'
          }`}
        >
          <p>Earn more spins by:</p>
          <ul className="mt-2 space-y-1">
            <li>• Completing 3 orders (+1 spin)</li>
            <li>• Referring a friend (+2 spins)</li>
            <li>• Writing reviews (+1 spin per 5 reviews)</li>
          </ul>
        </motion.div>
      </div>

      {/* Prize Modal */}
      <AnimatePresence>
        {showPrizeModal && wonPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPrizeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-md w-full rounded-3xl p-8 text-center ${
                isDark ? 'bg-luxury-dark-card border-2 border-luxury-dark-accent' : 'bg-white border-2 border-luxury-light-accent'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 20px 60px rgba(212, 175, 55, 0.4)'
                  : '0 20px 60px rgba(212, 175, 55, 0.3)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPrizeModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  isDark ? 'hover:bg-luxury-dark-bg' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`h-5 w-5 ${isDark ? 'text-luxury-dark-muted' : 'text-gray-600'}`} />
              </button>

              {/* Celebration Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <div
                  className="inline-flex p-6 rounded-full"
                  style={{ backgroundColor: wonPrize.color }}
                >
                  {(() => {
                    const Icon = getIconComponent(wonPrize.icon);
                    return <Icon className="h-16 w-16 text-white" />;
                  })()}
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`text-3xl font-bold mb-3 ${
                  isDark ? 'text-luxury-dark-accent' : 'text-luxury-light-accent'
                }`}
              >
                🎉 Congratulations! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-xl mb-2 ${isDark ? 'text-luxury-dark-text' : 'text-luxury-light-text'}`}
              >
                You won:
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold mb-6"
                style={{ color: wonPrize.color }}
              >
                {wonPrize.name}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowPrizeModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-xl font-semibold ${
                  isDark
                    ? 'bg-luxury-dark-accent text-black hover:bg-yellow-400'
                    : 'bg-luxury-light-accent text-white hover:bg-amber-600'
                }`}
              >
                Claim Prize
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
