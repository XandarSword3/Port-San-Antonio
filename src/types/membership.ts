/**
 * Membership and Loyalty System Types
 */

export type MembershipTier = 'free' | 'gold' | 'platinum' | 'diamond';

export interface MembershipBenefits {
  tier: MembershipTier;
  discountPercentage: number;
  freeDelivery: boolean;
  prioritySupport: boolean;
  exclusiveItems: boolean;
  birthdayReward: number; // Dollar amount
  monthlyCredit: number; // Dollar amount
  pointsMultiplier: number; // e.g., 2x points
  earlyAccess: boolean;
  conciergeService: boolean;
  privateEvents: boolean;
  giftWithPurchase: boolean;
}

export interface MembershipPlan {
  tier: MembershipTier;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  benefits: MembershipBenefits;
  features: string[];
  color: string;
  icon: string;
}

export interface UserMembership {
  userId: string;
  tier: MembershipTier;
  startDate: Date;
  renewalDate: Date;
  autoRenew: boolean;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod?: string;
  lifetimeSpent: number;
  monthlySpent: number;
}

export interface LoyaltyPoints {
  userId: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: MembershipTier;
  pointsToNextTier: number;
  rewardsRedeemed: number;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'redeem' | 'expire' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  timestamp: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountAmount?: number;
  discountPercentage?: number;
  freeItem?: string;
  minimumTier?: MembershipTier;
  expiryDays: number;
  image?: string;
  available: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirement: {
    type: 'orders' | 'spending' | 'reviews' | 'referrals' | 'streak' | 'category';
    target: number;
    category?: string;
  };
  unlockedAt?: Date;
  progress: number;
}

export interface SpinWheelPrize {
  id: string;
  name: string;
  type: 'discount' | 'points' | 'freeItem' | 'voucher';
  value: number | string;
  probability: number; // 0-1
  color: string;
  icon: string;
}

export interface SpinWheelState {
  userId: string;
  spinsAvailable: number;
  lastSpinDate: Date;
  totalSpins: number;
  prizesWon: SpinWheelPrize[];
}
