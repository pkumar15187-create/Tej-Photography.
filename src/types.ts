export interface PhotoVideo {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'landscape' | 'portrait' | string;
  url: string;
  price?: number; // Price of print purchase
  resolution: '480p' | '720p' | '1080p' | '2K' | '4K' | '8K';
  description?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
}

export interface ClientGalleryAccess {
  id: string;
  email: string;
  password?: string;
  galleryAccess: string; // "landscape", "portrait", "all", or custom identifier
  allowedDownloads: number;
  downloadsCount: number;
  isVipBypass: boolean;
  expiryDate: string;
  membershipLevelOverride: 'none' | 'bonus' | 'silver' | 'gold' | 'platinum';
  isBlocked?: boolean;
}

export interface SubscriptionPayment {
  id: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  couponCodeUsed: string;
  upiId: string;
  transactionId: string;
  screenshotUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  isReferralReward: boolean;
  referrerEmail?: string;
}

export interface ReferralInfo {
  userEmail: string;
  referralCode: string;
  referredUsers: string[]; // List of referred emails
  earnedCoupons: string[]; // List of discount coupon codes earned
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface AdminSettings {
  upiId: string;
  qrCodeUrl: string; // Base64 or mock QR code
  accountHolderName: string;
  paymentInstructions: string;
  limitedTimeOfferText?: string;
  limitedTimeOfferExpiry?: string;
}

export interface CartItem {
  id: string; // itemId (combination of photoId and size)
  photoId: string;
  title: string;
  url: string;
  size: string; // '5x7', '8x10', '12x18', '20x30'
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  upiId: string;
  transactionId: string;
  screenshotUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  priceINR: number;
  description: string;
  maxPhotoQuality: '480p' | '1080p' | '2K' | '8K';
  maxVideoQuality: 'none' | '720p' | '1080p' | '4K';
  features: string[];
}
