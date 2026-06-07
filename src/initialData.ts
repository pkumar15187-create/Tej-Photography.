import { PhotoVideo, MembershipPlan, ClientGalleryAccess, DiscountCoupon, AdminSettings } from './types';

export const INITIAL_PHOTOS_VIDEOS: PhotoVideo[] = [
  // Landscapes
  {
    id: 'l1',
    title: 'Himalayan Serenity',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    price: 1500,
    resolution: '8K'
  },
  {
    id: 'l2',
    title: 'Misty Autumn Forest',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200',
    price: 1200,
    resolution: '4K'
  },
  {
    id: 'l3',
    title: 'Glacial Mirror Peak',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    price: 1800,
    resolution: '8K'
  },
  {
    id: 'l4',
    title: 'Coastal Solitude',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    price: 1400,
    resolution: '2K'
  },
  {
    id: 'l5',
    title: 'Milky Way Archway',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200',
    price: 2200,
    resolution: '8K'
  },
  {
    id: 'l6',
    title: 'Cascade of Dreams',
    type: 'photo',
    category: 'landscape',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1200',
    price: 1600,
    resolution: '4K'
  },
  // Videos (Landscapes)
  {
    id: 'lv1',
    title: 'Crashing Waves Ocean Flow',
    type: 'video',
    category: 'landscape',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-a-cliff-43028-large.mp4',
    price: 3500,
    resolution: '4K'
  },
  {
    id: 'lv2',
    title: 'Sunlight Forest Stream',
    type: 'video',
    category: 'landscape',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    price: 3200,
    resolution: '8K'
  },

  // Portraits
  {
    id: 'p1',
    title: 'Ethereal Moonlight',
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    price: 2000,
    resolution: '8K'
  },
  {
    id: 'p2',
    title: 'Shadow and Light Study',
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200',
    price: 1500,
    resolution: '4K'
  },
  {
    id: 'p3',
    title: "The Scholar's Gaze",
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
    price: 1800,
    resolution: '8K'
  },
  {
    id: 'p4',
    title: 'Crimson Veil Elegance',
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200',
    price: 2100,
    resolution: '2K'
  },
  {
    id: 'p5',
    title: 'Golden Hour Smile',
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1200',
    price: 1900,
    resolution: '4K'
  },
  {
    id: 'p6',
    title: 'Reflective Warmth',
    type: 'photo',
    category: 'portrait',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200',
    price: 1600,
    resolution: '8K'
  },
  // Video (Portrait)
  {
    id: 'pv1',
    title: 'Smiling In The Woods',
    type: 'video',
    category: 'portrait',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-smiling-at-the-camera-in-the-forest-41604-large.mp4',
    price: 3900,
    resolution: '4K'
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'bonus',
    name: 'Bonus Membership',
    priceINR: 19,
    description: 'Essential membership to download own photos in standard quality.',
    maxPhotoQuality: '480p',
    maxVideoQuality: 'none',
    features: [
      'Download photos in standard 480p quality',
      'No video downloads allowed',
      'Access to exclusive newsletters',
      'Valid for 1 Year'
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    priceINR: 49,
    description: 'Perfect for enthusiasts who require beautiful HD quality content.',
    maxPhotoQuality: '1080p',
    maxVideoQuality: '720p',
    features: [
      'Download photos in beautiful 1080p HD',
      'Download videos in clear 720p HD',
      'Personal non-commercial reprint permission',
      'Ad-free gallery viewing',
      'Valid for 1 Year'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    priceINR: 99,
    description: 'Excellent for content creators and high-end screens.',
    maxPhotoQuality: '2K',
    maxVideoQuality: '1080p',
    features: [
      'Download photos in pristine 2K resolution',
      'Download videos in 1080p Full HD',
      'Commercial usage license for small business',
      'Exclusive access to raw preview files',
      'Valid for 1 Year'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    priceINR: 199,
    description: 'The ultimate tier for pure perfectionists and ultra-high-definition.',
    maxPhotoQuality: '8K',
    maxVideoQuality: '4K',
    features: [
      'Download master copies in breathtaking 8K resolution',
      'Download videos in ultra UHD 4K Full HD+',
      'Priority client support & print order matching',
      'Full extended commercial rights support',
      'Valid for 1 Year'
    ]
  }
];

export const INITIAL_CLIENTS: ClientGalleryAccess[] = [
  {
    id: 'c1',
    email: 'client@example.com',
    password: 'password123',
    galleryAccess: 'all',
    allowedDownloads: 50,
    downloadsCount: 3,
    isVipBypass: false,
    expiryDate: '2026-12-31',
    membershipLevelOverride: 'none'
  },
  {
    id: 'c2',
    email: 'vip@example.com',
    password: 'vippassword',
    galleryAccess: 'all',
    allowedDownloads: 9999,
    downloadsCount: 12,
    isVipBypass: true,
    expiryDate: '2027-01-01',
    membershipLevelOverride: 'platinum'
  },
  {
    id: 'c3',
    email: 'landscape_fan@example.com',
    password: 'password123',
    galleryAccess: 'landscape',
    allowedDownloads: 10,
    downloadsCount: 0,
    isVipBypass: false,
    expiryDate: '2026-08-15',
    membershipLevelOverride: 'bonus'
  }
];

export const INITIAL_COUPONS: DiscountCoupon[] = [
  {
    id: 'cp1',
    code: 'TEJ50',
    discountPercent: 50,
    isActive: true,
    isReferralReward: false
  },
  {
    id: 'cp2',
    code: 'WELCOME20',
    discountPercent: 20,
    isActive: true,
    isReferralReward: false
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  upiId: '7050831301@ibl',
  qrCodeUrl: '',
  accountHolderName: 'Shikha kumari',
  paymentInstructions: '1. Scan the real dynamic PhonePe QR Code above inside any UPI App (PhonePe, Google Pay, Paytm, BHIM).\n2. Note down your 12-digit transaction UTR / Reference ID post-payment.\n3. Type your payment UPI handle ID and UTR code in the validation form to instantly verify and claim your subscription!'
};
