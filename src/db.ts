import { 
  PhotoVideo, 
  ClientGalleryAccess, 
  SubscriptionPayment, 
  DiscountCoupon, 
  ReferralInfo, 
  ContactMessage, 
  AdminSettings, 
  Order 
} from './types';
import { 
  INITIAL_PHOTOS_VIDEOS, 
  INITIAL_CLIENTS, 
  INITIAL_COUPONS, 
  DEFAULT_ADMIN_SETTINGS 
} from './initialData';

// Safe localStorage helper
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
};

export const db = {
  // Photos and Videos List
  getPhotosVideos: (): PhotoVideo[] => {
    return getStorageItem<PhotoVideo[]>('tej_photos_videos', INITIAL_PHOTOS_VIDEOS);
  },
  savePhotosVideos: (data: PhotoVideo[]): void => {
    setStorageItem('tej_photos_videos', data);
  },

  // Private Clients
  getClients: (): ClientGalleryAccess[] => {
    return getStorageItem<ClientGalleryAccess[]>('tej_clients', INITIAL_CLIENTS);
  },
  saveClients: (data: ClientGalleryAccess[]): void => {
    setStorageItem('tej_clients', data);
  },

  // Subscription Payments
  getPayments: (): SubscriptionPayment[] => {
    return getStorageItem<SubscriptionPayment[]>('tej_payments', []);
  },
  savePayments: (data: SubscriptionPayment[]): void => {
    setStorageItem('tej_payments', data);
  },

  // Discount Coupons
  getCoupons: (): DiscountCoupon[] => {
    return getStorageItem<DiscountCoupon[]>('tej_coupons', INITIAL_COUPONS);
  },
  saveCoupons: (data: DiscountCoupon[]): void => {
    setStorageItem('tej_coupons', data);
  },

  // Referrals database
  getReferrals: (): ReferralInfo[] => {
    return getStorageItem<ReferralInfo[]>('tej_referrals', []);
  },
  saveReferrals: (data: ReferralInfo[]): void => {
    setStorageItem('tej_referrals', data);
  },

  // Contact form messages
  getMessages: (): ContactMessage[] => {
    return getStorageItem<ContactMessage[]>('tej_messages', []);
  },
  saveMessages: (data: ContactMessage[]): void => {
    setStorageItem('tej_messages', data);
  },

  // Admin and configuration settings
  getSettings: (): AdminSettings => {
    return getStorageItem<AdminSettings>('tej_settings', DEFAULT_ADMIN_SETTINGS);
  },
  saveSettings: (data: AdminSettings): void => {
    setStorageItem('tej_settings', data);
  },

  // Print purchase orders
  getOrders: (): Order[] => {
    return getStorageItem<Order[]>('tej_orders', []);
  },
  saveOrders: (data: Order[]): void => {
    setStorageItem('tej_orders', data);
  }
};
