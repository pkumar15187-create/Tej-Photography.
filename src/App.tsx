/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from './db';
import { 
  PhotoVideo, ClientGalleryAccess, SubscriptionPayment, DiscountCoupon, 
  ContactMessage, AdminSettings, CartItem, Order, MembershipPlan 
} from './types';
import { MEMBERSHIP_PLANS } from './initialData';

// Component imports
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import GalleryView from './components/GalleryView';
import BuyPrints from './components/BuyPrints';
import Subscriptions from './components/Subscriptions';
import ClientGallery from './components/ClientGallery';
import Contact from './components/Contact';
import AdminControlPanel from './components/AdminControlPanel';
import TrollPage from './components/TrollPage';
import OnboardingWall from './components/OnboardingWall';
import PromoCountdownBanner from './components/PromoCountdownBanner';

// Lucide icons
import { Camera, ArrowRight, Sparkles, Award, Shield, ShoppingBag, Eye, Heart, Compass, Check } from 'lucide-react';

export default function App() {
  // Sync page view with standard window.location.hash
  const [currentView, setCurrentView] = useState('home');

  // Database lists
  const [photosVideos, setPhotosVideos] = useState<PhotoVideo[]>([]);
  const [clients, setClients] = useState<ClientGalleryAccess[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({ upiId: '', qrCodeUrl: '', accountHolderName: '', paymentInstructions: '' });
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Shopping cart system and active referral codes
  const [cart, setCart] = useState<CartItem[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState<{ referredUsers: string[]; earnedCoupons: string[] }>({
    referredUsers: [],
    earnedCoupons: []
  });

  // Client Session States
  const [activeClient, setActiveClient] = useState<ClientGalleryAccess | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [overlayEmail, setOverlayEmail] = useState('');
  const [overlayPassword, setOverlayPassword] = useState('');
  const [overlayError, setOverlayError] = useState('');

  // Initialization Hook
  useEffect(() => {
    // Read and fill states from DB / LocalStorage
    setPhotosVideos(db.getPhotosVideos());
    setClients(db.getClients());
    setPayments(db.getPayments());
    setOrders(db.getOrders());
    setCoupons(db.getCoupons());
    const loadedSettings = db.getSettings();
    if (!loadedSettings.upiId || loadedSettings.upiId === 'tejphotography@upi' || loadedSettings.accountHolderName === 'Tejas Kumar') {
      const migratedSettings = {
        ...loadedSettings,
        upiId: '7050831301@ibl',
        accountHolderName: 'Shikha kumari',
        paymentInstructions: '1. Scan the real dynamic PhonePe QR Code above inside any UPI App (PhonePe, Google Pay, Paytm, BHIM).\n2. Note down your 12-digit transaction UTR / Reference ID post-payment.\n3. Type your payment UPI handle ID and UTR code in the validation form to instantly verify and claim your subscription!'
      };
      db.saveSettings(migratedSettings);
      setSettings(migratedSettings);
    } else {
      setSettings(loadedSettings);
    }
    setMessages(db.getMessages());

    // Pull cart if it exists
    const storedCart = localStorage.getItem('tej_cart');
    if (storedCart) {
      try { setCart(JSON.parse(storedCart)); } catch (e) { console.error(e); }
    }

    // Determine referral code or generate a deterministic one for this session visitor
    let sessionRef = localStorage.getItem('tej_my_referral_code');
    if (!sessionRef) {
      sessionRef = `TEJ-REF-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('tej_my_referral_code', sessionRef);
    }
    setReferralCode(sessionRef);

    // Load referral statistics
    const storedStats = localStorage.getItem('tej_referral_stats');
    if (storedStats) {
      try { setReferralStats(JSON.parse(storedStats)); } catch (e) { console.error(e); }
    }

    // Check if client session previously lived
    const activeClientSession = localStorage.getItem('tej_logged_in_client');
    if (activeClientSession) {
      try {
        const parsed = JSON.parse(activeClientSession) as ClientGalleryAccess;
        // Verify against latest list from DB
        const latestClients = db.getClients();
        const matched = latestClients.find(c => c.email.toLowerCase() === parsed.email.toLowerCase());
        if (matched) setActiveClient(matched);
      } catch (e) { console.error(e); }
    }

    // Capture initial URL Hash route
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (['home', 'landscape', 'portrait', 'prints', 'subscriptions', 'private', 'contact', 'tej-admin-panel', 'nothing'].includes(hash)) {
        setCurrentView(hash);
        // Scroll to top automatically on route
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash(); // trigger first check

    // Simulate referral if ref is in URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('tej_referred_by', refCode);
    }

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Sync state writes back to Storage and state lists
  const handleAddMedia = (media: Omit<PhotoVideo, 'id'>) => {
    const list = [...photosVideos, { ...media, id: `media-${Date.now()}` }];
    setPhotosVideos(list);
    db.savePhotosVideos(list);
  };

  const handleEditMedia = (id: string, updatedFields: Partial<PhotoVideo>) => {
    const list = photosVideos.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    setPhotosVideos(list);
    db.savePhotosVideos(list);
  };

  const handleDeleteMedia = (id: string) => {
    const list = photosVideos.filter(item => item.id !== id);
    setPhotosVideos(list);
    db.savePhotosVideos(list);
    alert('Asset deleted successfully from both local databases and public portfolios!');
  };

  const handleAddClient = (client: ClientGalleryAccess) => {
    const list = [...clients, client];
    setClients(list);
    db.saveClients(list);
  };

  const handleDeleteClient = (id: string) => {
    const list = clients.filter(c => c.id !== id);
    setClients(list);
    db.saveClients(list);
  };

  const handleEditClient = (id: string, updatedFields: Partial<ClientGalleryAccess>) => {
    const list = clients.map(c => c.id === id ? { ...c, ...updatedFields } : c);
    setClients(list);
    db.saveClients(list);
    
    // Sync active client session if it's the edited account
    if (activeClient && activeClient.id === id) {
      const updated = list.find(c => c.id === id) || null;
      setActiveClient(updated);
      if (updated) {
        localStorage.setItem('tej_logged_in_client', JSON.stringify(updated));
      } else {
        localStorage.removeItem('tej_logged_in_client');
      }
    }
  };

  const handleApprovePayment = (id: string) => {
    const list = payments.map(p => {
      if (p.id === id) {
        const approvedPay: SubscriptionPayment = { ...p, status: 'Approved' };
        
        // Find matching client email to apply level upgrade
        const currentClients = [...clients];
        const clientIndex = currentClients.findIndex(c => c.email.toLowerCase() === p.userEmail.toLowerCase());
        
        if (clientIndex !== -1) {
          // Already registered client, unlock tier override
          currentClients[clientIndex].membershipLevelOverride = p.planId as any;
          db.saveClients(currentClients);
          setClients(currentClients);

          // Update active layout session if logged in matching current user
          if (activeClient && activeClient.email.toLowerCase() === p.userEmail.toLowerCase()) {
            const updatedActive = { ...activeClient, membershipLevelOverride: p.planId as any };
            setActiveClient(updatedActive);
            localStorage.setItem('tej_logged_in_client', JSON.stringify(updatedActive));
          }
        } else {
          // Create a new client slot on database automatically with this email
          const newCli: ClientGalleryAccess = {
            id: `client-${Date.now()}`,
            email: p.userEmail.toLowerCase(),
            password: 'password123', // safe initial default passes for quick demo log
            galleryAccess: 'all',
            allowedDownloads: 100,
            downloadsCount: 0,
            isVipBypass: false,
            expiryDate: '2026-12-31',
            membershipLevelOverride: p.planId as any
          };
          const updatedClientList = [...currentClients, newCli];
          db.saveClients(updatedClientList);
          setClients(updatedClientList);
        }
        return approvedPay;
      }
      return p;
    });
    setPayments(list);
    db.savePayments(list);
    alert('Membership transfer approved. Client downloads permissions have been updated!');
  };

  const handleRejectPayment = (id: string) => {
    const list = payments.map(p => p.id === id ? { ...p, status: 'Rejected' as const } : p);
    setPayments(list);
    db.savePayments(list);
    alert('Payment claim rejected. Client access remains unchanged.');
  };

  const handleApproveOrder = (id: string) => {
    const list = orders.map(o => o.id === id ? { ...o, status: 'Approved' as const } : o);
    setOrders(list);
    db.saveOrders(list);
    alert('Print order verified! Delivery label and certificate formatted.');
  };

  const handleRejectOrder = (id: string) => {
    const list = orders.map(o => o.id === id ? { ...o, status: 'Rejected' as const } : o);
    setOrders(list);
    db.saveOrders(list);
    alert('Print order purchase verification rejected.');
  };

  const handleAddCoupon = (coupon: Omit<DiscountCoupon, 'id'>) => {
    const list = [...coupons, { ...coupon, id: `coupon-${Date.now()}` }];
    setCoupons(list);
    db.saveCoupons(list);
  };

  const handleDeleteCoupon = (id: string) => {
    const list = coupons.filter(c => c.id !== id);
    setCoupons(list);
    db.saveCoupons(list);
  };

  const handleSaveSettings = (updated: AdminSettings) => {
    setSettings(updated);
    db.saveSettings(updated);
  };

  const handleClearMessages = () => {
    setMessages([]);
    db.saveMessages([]);
  };

  const handleSendMessage = (msgDetails: { name: string; email: string; message: string }) => {
    const list = [...messages, { ...msgDetails, id: `msg-${Date.now()}`, timestamp: new Date().toLocaleDateString() }];
    setMessages(list);
    db.saveMessages(list);
  };

  // Nav routing helper
  const handleNavigate = (viewId: string) => {
    window.location.hash = `#${viewId}`;
    setCurrentView(viewId);
  };

  // Shopping cart operations
  const handleAddToCart = (media: PhotoVideo, size: string, price: number) => {
    const itemId = `${media.id}-${size}`;
    const existingIndex = cart.findIndex(c => c.id === itemId);

    let updatedCart: CartItem[];
    if (existingIndex !== -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [...cart, {
        id: itemId,
        photoId: media.id,
        title: media.title,
        url: media.url,
        size,
        price,
        quantity: 1
      }];
    }

    setCart(updatedCart);
    localStorage.setItem('tej_cart', JSON.stringify(updatedCart));
    alert(`Successfully added "${media.title} (${size})" to your print purchase cart.`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setCart(updated);
    localStorage.setItem('tej_cart', JSON.stringify(updated));
  };

  const handleRemoveCartItem = (id: string) => {
    const updated = cart.filter(it => it.id !== id);
    setCart(updated);
    localStorage.setItem('tej_cart', JSON.stringify(updated));
  };

  const handlePrintsCheckout = (checkoutDetails: {
    email: string;
    upiId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userEmail: checkoutDetails.email,
      items: cart,
      totalAmount: cart.reduce((s, i) => s + (i.price * i.quantity), 0),
      upiId: checkoutDetails.upiId,
      transactionId: checkoutDetails.transactionId,
      screenshotUrl: checkoutDetails.screenshotUrl,
      status: 'Pending',
      timestamp: new Date().toLocaleDateString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    db.saveOrders(updatedOrders);

    // Empty cart State
    setCart([]);
    localStorage.removeItem('tej_cart');
  };

  const handleSubscribePlan = (subDetails: {
    planId: string;
    planName: string;
    amount: number;
    couponCodeUsed: string;
    upiId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => {
    const newPayment: SubscriptionPayment = {
      id: `payment-${Date.now()}`,
      userEmail: subDetails.upiId, // using UPI id or custom login matching
      planId: subDetails.planId,
      planName: subDetails.planName,
      amount: subDetails.amount,
      couponCodeUsed: subDetails.couponCodeUsed,
      upiId: subDetails.upiId,
      transactionId: subDetails.transactionId,
      screenshotUrl: subDetails.screenshotUrl,
      status: 'Pending',
      timestamp: new Date().toLocaleDateString()
    };
    
    // Save to payments listing
    // We bind to subDetails email securely:
    const paymentRecord: SubscriptionPayment = {
      ...newPayment,
      userEmail: overlayEmail || activeClient?.email || 'unregistered_buyer@tej.in' // safe fallback checks
    };

    const updatedPayments = [...payments, paymentRecord];
    setPayments(updatedPayments);
    db.savePayments(updatedPayments);
  };

  // Login authenticator
  const handleClientLogin = (email: string, pass: string): boolean => {
    const latestClients = db.getClients();
    const matched = latestClients.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === pass
    );

    if (matched) {
      setActiveClient(matched);
      localStorage.setItem('tej_logged_in_client', JSON.stringify(matched));
      setShowAuthOverlay(false);
      return true;
    }
    return false;
  };

  const handleClientLogout = () => {
    setActiveClient(null);
    localStorage.removeItem('tej_logged_in_client');
  };

  // Perform overlay login submit
  const handleOverlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOverlayError('');
    if (!overlayEmail || !overlayPassword) {
      setOverlayError('Both credentials must be specified.');
      return;
    }

    const success = handleClientLogin(overlayEmail.trim(), overlayPassword);
    if (!success) {
      setOverlayError('Wrong client email password combination.');
    } else {
      setOverlayEmail('');
      setOverlayPassword('');
    }
  };

  // Safe checks for downloaded contents decrement caps
  const handleDownloadItem = (media: PhotoVideo, quality: string): boolean => {
    if (activeClient && !activeClient.isVipBypass && activeClient.downloadsCount >= activeClient.allowedDownloads) {
      return false; // locked
    }

    // Decrement allowed count and save safely if not VIP and logged in
    if (activeClient && !activeClient.isVipBypass) {
      const currentClientsList = [...clients];
      const index = currentClientsList.findIndex(c => c.email.toLowerCase() === activeClient.email.toLowerCase());
      
      if (index !== -1) {
        currentClientsList[index].downloadsCount += 1;
        setClients(currentClientsList);
        db.saveClients(currentClientsList);

        const updatedSession = { ...activeClient, downloadsCount: currentClientsList[index].downloadsCount };
        setActiveClient(updatedSession);
        localStorage.setItem('tej_logged_in_client', JSON.stringify(updatedSession));
      }
    }

    // Direct automated, frictionless local file download query!
    const cleanFileName = `tej_photography_${media.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${quality}.jpg`;
    
    fetch(media.url)
      .then(res => res.blob())
      .then(blob => {
        const localBlobUrl = URL.createObjectURL(blob);
        const triggerLink = document.createElement('a');
        triggerLink.href = localBlobUrl;
        triggerLink.download = cleanFileName;
        document.body.appendChild(triggerLink);
        triggerLink.click();
        document.body.removeChild(triggerLink);
        URL.revokeObjectURL(localBlobUrl);
      })
      .catch(err => {
        console.warn('CORS or fetch blocked, initiating fallback direct link trigger', err);
        const fallbackLink = document.createElement('a');
        fallbackLink.href = media.url;
        fallbackLink.target = '_blank';
        fallbackLink.download = cleanFileName;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      });

    alert(`Download started! "${media.title}" is downloading in ${quality} resolution directly to your device.`);
    return true;
  };

  // Calculate standard/VIP indicators for header representation
  const headerUserSession = activeClient ? {
    email: activeClient.email,
    isVip: activeClient.isVipBypass,
    membership: activeClient.membershipLevelOverride
  } : null;

  return (
    <div className="bg-[#050505] text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-zinc-800 selection:text-white" id="main_application_shell">
      {/* Dynamic Header */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        loggedInUser={headerUserSession}
        onLogout={handleClientLogout}
        onOpenAuth={() => setShowAuthOverlay(true)}
      />

      {settings.limitedTimeOfferText && (
        <PromoCountdownBanner 
          text={settings.limitedTimeOfferText} 
          expiry={settings.limitedTimeOfferExpiry || ''} 
        />
      )}

      {/* Onboarding block if client is not logged in and not looking at the administrative portal */}
      {!activeClient && currentView !== 'tej-admin-panel' && (
        <OnboardingWall
          onSuccess={(cli) => {
            setActiveClient(cli);
            localStorage.setItem('tej_logged_in_client', JSON.stringify(cli));
          }}
          clientsDatabase={clients}
          onAddClient={handleAddClient}
        />
      )}

      {/* Primary Dynamic State Router */}
      <main className="flex-grow pt-20">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div className="animate-fade-in-up" id="view_home">
            
            {/* Cinematic Landing Showcase Section */}
            <header className="relative h-[85vh] bg-black flex items-center justify-center overflow-hidden border-b border-white/5">
              {/* Overlay shadow lines */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/30 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1600" 
                alt="Tej Hero Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 motion-safe:animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              
              <div className="max-w-4xl mx-auto text-center px-4 z-20 relative space-y-6">
                <span className="text-[11px] font-mono tracking-[0.45em] text-zinc-300 block uppercase pt-2 select-none">DELHI &bull; HIGH-END STUDIO &bull; ESTD 2016</span>
                <h1 className="font-display text-5xl sm:text-7xl font-light tracking-[0.25em] text-white">
                  TEJ <span className="font-extrabold text-zinc-400">PHOTOGRAPHY</span>
                </h1>
                <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-500 font-sans tracking-wide leading-relaxed font-light">
                  Capturing transcendent, high-contrast emotional landscapes and masterclass studio portraiture on 8K digital mediums. Museum-certified prints handcrafted for collectors worldwide.
                </p>
                
                <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                    onClick={() => handleNavigate('landscape')}
                    className="bg-white hover:bg-zinc-200 text-black px-8 py-3.5 text-xs font-bold tracking-widest font-display uppercase rounded transition-colors cursor-pointer"
                  >
                    EXPLORE PORTFOLIO
                  </button>
                  <button 
                    onClick={() => handleNavigate('subscriptions')}
                    className="border border-white/20 hover:border-white text-white px-8 py-3.5 text-xs font-bold tracking-widest font-display uppercase rounded bg-black/40 transition-colors cursor-pointer"
                  >
                    JOIN PREMIUM SUBSCRIPTION
                  </button>
                </div>
              </div>
            </header>

            {/* Aesthetic Bento Directory Grid Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
              
              <div className="text-center">
                <h2 className="font-display text-xs tracking-widest text-zinc-400 uppercase font-extrabold leading-none">CRAFT & SELECTIONS</h2>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-3 uppercase tracking-wider">TEJ STUDIO ARCHIVES</h3>
                <div className="w-10 h-[2px] bg-white mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="home_bento_grid">
                
                {/* Landscape card */}
                <div 
                  onClick={() => handleNavigate('landscape')}
                  className="group relative h-[450px] overflow-hidden rounded-2xl border border-white/5 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200" 
                    alt="Scenic"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute bottom-6 left-6 z-20 space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">PORTFOLIO</span>
                    <h4 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Landscape Masterpieces</h4>
                    <p className="text-zinc-500 text-xs font-light max-w-xs leading-relaxed font-sans">Cosmic midnight horizons, volcanic structures, and mountain quietude captured beautifully.</p>
                  </div>
                </div>

                {/* Portrait card */}
                <div 
                  onClick={() => handleNavigate('portrait')}
                  className="group relative h-[450px] overflow-hidden rounded-2xl border border-white/5 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200" 
                    alt="Humans"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                  />
                  <div className="absolute bottom-6 left-6 z-20 space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">STUDIO</span>
                    <h4 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Portrait Studies</h4>
                    <p className="text-zinc-500 text-xs font-light max-w-xs leading-relaxed font-sans">Human shadows, crimson hues, and elegant gaze interactions caught in balanced light.</p>
                  </div>
                </div>

                {/* Prints buying card */}
                <div 
                  onClick={() => handleNavigate('prints')}
                  className="group relative h-[450px] overflow-hidden rounded-2xl border border-white/5 cursor-pointer md:col-span-2 lg:col-span-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600" 
                    alt="Frames"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-50"
                  />
                  <div className="absolute bottom-6 left-6 z-20 space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1">
                      <ShoppingBag className="w-4.5 h-4.5" /> EXCLUSIVES
                    </span>
                    <h4 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Museum Framing prints</h4>
                    <p className="text-zinc-500 text-xs font-light max-w-xs leading-relaxed font-sans">Cotton archival materials,certified UV stable processes, custom sizes, ready to hang.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Quality Statement Section */}
            <section className="bg-zinc-950 py-24 border-t border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 font-sans">
                
                <div className="space-y-3">
                  <span className="text-xs text-white/50 block font-mono">01 / CAPTURE PROCESS</span>
                  <h4 className="font-display text-lg font-bold uppercase text-white select-none">8K Native Sensors</h4>
                  <p className="text-zinc-500 text-sm font-light leading-relaxed">
                    We capture on master formats to isolate extreme tonal scopes, allowing incredible details to maintain fidelity on screens or giant statement walls.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-white/50 block font-mono">02 / COMPOSITION ART</span>
                  <h4 className="font-display text-lg font-bold uppercase text-white select-none">Architectural Framing</h4>
                  <p className="text-zinc-500 text-sm font-light leading-relaxed">
                    Every capture studies lines, contrast ratios, and structural weight. Tej photography is rooted in pristine symmetry and dark atmospheric moods.
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs text-white/50 block font-mono">03 / PRINT STANDARD</span>
                  <h4 className="font-display text-lg font-bold uppercase text-white select-none">certified cotton Paper</h4>
                  <p className="text-zinc-500 text-sm font-light leading-relaxed">
                    Using museum-approved watercolor medium paper and special carbon black pigments, our physical prints carry verified 100-year UV lifespan ratings.
                  </p>
                </div>

              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: LANDSCAPE GALLERY */}
        {currentView === 'landscape' && (
          <GalleryView
            type="landscape"
            mediaItems={photosVideos}
            userMembership={activeClient ? activeClient.membershipLevelOverride : 'none'}
            isVipBypass={activeClient ? activeClient.isVipBypass : false}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onDownloadItem={handleDownloadItem}
            allowedDownloadsRemaining={activeClient ? (activeClient.isVipBypass ? 9999 : activeClient.allowedDownloads - activeClient.downloadsCount) : 0}
          />
        )}

        {/* VIEW 3: PORTRAIT GALLERY */}
        {currentView === 'portrait' && (
          <GalleryView
            type="portrait"
            mediaItems={photosVideos}
            userMembership={activeClient ? activeClient.membershipLevelOverride : 'none'}
            isVipBypass={activeClient ? activeClient.isVipBypass : false}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onDownloadItem={handleDownloadItem}
            allowedDownloadsRemaining={activeClient ? (activeClient.isVipBypass ? 9999 : activeClient.allowedDownloads - activeClient.downloadsCount) : 0}
          />
        )}

        {/* VIEW 4: BUY PRINTS */}
        {currentView === 'prints' && (
          <BuyPrints
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={handlePrintsCheckout}
            activeCoupons={coupons}
            referralCode={referralCode}
            referralStats={referralStats}
            adminUpiId={settings.upiId}
            adminQrUrl={settings.qrCodeUrl}
            adminAccountHolderName={settings.accountHolderName || ''}
            adminPaymentInstructions={settings.paymentInstructions || ''}
            existingOrders={orders}
          />
        )}

        {/* VIEW 5: MEMBERSHIPS / SUBSCRIPTIONS */}
        {currentView === 'subscriptions' && (
          <Subscriptions
            plans={MEMBERSHIP_PLANS}
            userMembership={activeClient ? activeClient.membershipLevelOverride : 'none'}
            isVipBypass={activeClient ? activeClient.isVipBypass : false}
            activeCoupons={coupons}
            adminUpiId={settings.upiId}
            adminQrUrl={settings.qrCodeUrl}
            adminAccountHolderName={settings.accountHolderName || ''}
            adminPaymentInstructions={settings.paymentInstructions || ''}
            onSubscribe={handleSubscribePlan}
            existingPayments={payments}
          />
        )}

        {/* VIEW 6: PRIVATE CLIENT AREA */}
        {currentView === 'private' && (
          <ClientGallery
            clientsDatabase={clients}
            loggedInClient={activeClient}
            onLogin={handleClientLogin}
            onLogout={handleClientLogout}
            portfolioItems={photosVideos}
            onDownloadItem={handleDownloadItem}
          />
        )}

        {/* VIEW 7: CONTACT OFFICE */}
        {currentView === 'contact' && (
          <Contact onSendMessage={handleSendMessage} />
        )}

        {/* VIEW 8: HIDDEN OWNER BACKOFFICE COCKPIT */}
        {currentView === 'tej-admin-panel' && (
          <AdminControlPanel
            photosVideos={photosVideos}
            onAddMedia={handleAddMedia}
            onEditMedia={handleEditMedia}
            onDeleteMedia={handleDeleteMedia}
            clients={clients}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onEditClient={handleEditClient}
            payments={payments}
            onApprovePayment={handleApprovePayment}
            onRejectPayment={handleRejectPayment}
            orders={orders}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            messages={messages}
            onClearMessages={handleClearMessages}
          />
        )}

        {/* VIEW 9: HIDDEN TROLL PAGE */}
        {currentView === 'nothing' && (
          <TrollPage onReturnHome={() => handleNavigate('home')} />
        )}

      </main>

      {/* Elegant Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global client auth login modal overlay */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" id="overlay_auth_modal">
          <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl font-mono text-xs">
            <button 
              onClick={() => setShowAuthOverlay(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              id="close_auth_modal_btn"
            >
              CLOSE [X]
            </button>
            
            <div className="text-center mb-6">
              <Camera className="w-8 h-8 text-white mx-auto mb-2 animate-bounce" />
              <h3 className="font-display text-lg uppercase tracking-widest text-white font-bold">Client Login</h3>
              <p className="text-[10px] text-zinc-500 mt-1">Unlock your custom fine arts folder archives</p>
            </div>

            <form onSubmit={handleOverlaySubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1">Email ID:</label>
                <input
                  type="email"
                  required
                  value={overlayEmail}
                  onChange={(e) => setOverlayEmail(e.target.value)}
                  placeholder="e.g. client@example.com"
                  className="w-full bg-zinc-900 border border-white/10 py-2 px-3 rounded text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Passkey Word:</label>
                <input
                  type="password"
                  required
                  value={overlayPassword}
                  onChange={(e) => setOverlayPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-white/10 py-2 px-3 rounded text-white focus:outline-none"
                />
              </div>

              {overlayError && <p className="text-rose-400 text-[11px] font-bold">{overlayError}</p>}

              <button
                type="submit"
                className="w-full bg-white text-black font-display font-bold uppercase tracking-wider py-2.5 rounded transition-all cursor-pointer"
                id="overlay_login_submit_btn"
              >
                SIGN INTO SERVICES
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/5 text-center text-[10px] text-zinc-500 font-sans leading-normal">
              Demo logins can be set/reviewed inside the **Owner Backoffice** (linked at the foot of any pages).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
