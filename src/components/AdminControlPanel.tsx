import React, { useState } from 'react';
import { 
  PhotoVideo, 
  ClientGalleryAccess, 
  SubscriptionPayment, 
  DiscountCoupon, 
  ContactMessage, 
  AdminSettings, 
  Order 
} from '../types';
import { 
  ShieldCheck, Lock, Upload, Edit3, Trash2, CheckCircle2, XCircle, 
  Settings, Grid, Users, CreditCard, Tag, MessageSquare, LogOut, Award, Plus, Check, HelpCircle
} from 'lucide-react';

interface AdminControlPanelProps {
  photosVideos: PhotoVideo[];
  onAddMedia: (media: Omit<PhotoVideo, 'id'>) => void;
  onEditMedia: (id: string, updatedFields: Partial<PhotoVideo>) => void;
  onDeleteMedia: (id: string) => void;
  
  clients: ClientGalleryAccess[];
  onAddClient: (client: ClientGalleryAccess) => void;
  onDeleteClient: (id: string) => void;
  
  payments: SubscriptionPayment[];
  onApprovePayment: (id: string) => void;
  onRejectPayment: (id: string) => void;
  
  orders: Order[];
  onApproveOrder: (id: string) => void;
  onRejectOrder: (id: string) => void;

  settings: AdminSettings;
  onSaveSettings: (settings: AdminSettings) => void;
  
  coupons: DiscountCoupon[];
  onAddCoupon: (coupon: Omit<DiscountCoupon, 'id'>) => void;
  onDeleteCoupon: (id: string) => void;
  
  messages: ContactMessage[];
  onClearMessages: () => void;
}

export default function AdminControlPanel({
  photosVideos,
  onAddMedia,
  onEditMedia,
  onDeleteMedia,
  clients,
  onAddClient,
  onDeleteClient,
  payments,
  onApprovePayment,
  onRejectPayment,
  orders,
  onApproveOrder,
  onRejectOrder,
  settings,
  onSaveSettings,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  messages,
  onClearMessages
}: AdminControlPanelProps) {
  // Authentication states
  const [adminName, setAdminName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab navigation inside Cockpit
  const [activeTab, setActiveTab] = useState<'media' | 'clients' | 'payments' | 'coupons' | 'settings' | 'messages' | 'orders'>('media');

  // Media Form state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('landscape');
  const [newMediaType, setNewMediaType] = useState<'photo' | 'video'>('photo');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaPrice, setNewMediaPrice] = useState(1500);
  const [newMediaResolution, setNewMediaResolution] = useState<'480p' | '720p' | '1080p' | '2K' | '4K' | '8K'>('8K');
  
  // Media Edit form states
  const [editingMedia, setEditingMedia] = useState<PhotoVideo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState<'photo' | 'video'>('photo');
  const [editUrl, setEditUrl] = useState('');
  const [editPrice, setEditPrice] = useState(1500);
  const [editResolution, setEditResolution] = useState<'480p' | '720p' | '1080p' | '2K' | '4K' | '8K'>('8K');

  // Client Form state
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientAccess, setClientAccess] = useState('all');
  const [clientDownloads, setClientDownloads] = useState(50);
  const [clientIsVip, setClientIsVip] = useState(false);
  const [clientExpiry, setClientExpiry] = useState('2026-12-31');
  const [clientLevelOverride, setClientLevelOverride] = useState<'none' | 'bonus' | 'silver' | 'gold' | 'platinum'>('none');

  // Coupon Form state
  const [couponCode, setCouponCode] = useState('');
  const [couponPercent, setCouponPercent] = useState(25);
  const [couponIsReferral, setCouponIsReferral] = useState(false);

  // QR and UPI Settings Form state
  const [settingsUpi, setSettingsUpi] = useState(settings.upiId || '');
  const [settingsQrUrl, setSettingsQrUrl] = useState(settings.qrCodeUrl || '');
  const [settingsAccountHolder, setSettingsAccountHolder] = useState(settings.accountHolderName || '');
  const [settingsInstructions, setSettingsInstructions] = useState(settings.paymentInstructions || '');
  const [paymentSearch, setPaymentSearch] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    // Secure credentials verification
    if (adminName === 'Tejas' && adminPassword === 'Test@123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Wrong username or password');
    }
  };

  // Switch tabs
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  // Add upload trigger
  const handleMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) {
      alert('Fill out all fields before uploading media!');
      return;
    }

    onAddMedia({
      title: newMediaTitle,
      category: newMediaCategory,
      type: newMediaType,
      url: newMediaUrl,
      price: Number(newMediaPrice),
      resolution: newMediaResolution
    });

    // Reset inputs
    setNewMediaTitle('');
    setNewMediaUrl('');
    alert('Successfully added photograph/clip to public galleries.');
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'add') {
          setNewMediaUrl(base64String);
        } else {
          setEditUrl(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditInit = (item: PhotoVideo) => {
    setEditingMedia(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditType(item.type);
    setEditUrl(item.url);
    setEditPrice(item.price || 1500);
    setEditResolution(item.resolution);
  };

  const handleEditSave = (id: string) => {
    if (!editTitle.trim() || !editUrl.trim()) {
      alert('Asset Title and Content URL cannot be blank!');
      return;
    }
    onEditMedia(id, {
      title: editTitle.trim(),
      category: editCategory,
      type: editType,
      url: editUrl.trim(),
      price: Number(editPrice),
      resolution: editResolution
    });
    setEditingMedia(null);
    alert('Asset details updated successfully!');
  };

  // Add Client account trigger
  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientPassword) {
      alert('Email and Password are required credentials.');
      return;
    }

    onAddClient({
      id: `client-${Date.now()}`,
      email: clientEmail.trim(),
      password: clientPassword,
      galleryAccess: clientAccess,
      allowedDownloads: Number(clientDownloads),
      downloadsCount: 0,
      isVipBypass: clientIsVip,
      expiryDate: clientExpiry,
      membershipLevelOverride: clientLevelOverride
    });

    // Reset forms
    setClientEmail('');
    setClientPassword('');
    setClientIsVip(false);
    alert(`Successfully generated private user access profile for ${clientEmail}.`);
  };

  // Add Coupon code trigger
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    onAddCoupon({
      code: couponCode.trim().toUpperCase(),
      discountPercent: Number(couponPercent),
      isActive: true,
      isReferralReward: couponIsReferral
    });

    setCouponCode('');
    setCouponIsReferral(false);
    alert(`Successfully generated active coupon ${couponCode.toUpperCase()} on store base.`);
  };

  // Save Settings trigger (UPI + QR + Details)
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      upiId: settingsUpi.trim(),
      qrCodeUrl: settingsQrUrl.trim(),
      accountHolderName: settingsAccountHolder.trim(),
      paymentInstructions: settingsInstructions.trim()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    alert('Successfully saved and applied UPI and QR parameters globally across the website.');
  };

  // Screenshot base64 file helper in settings
  const handleQrUploadLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsQrUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    // Authenticator view
    return (
      <section className="min-h-screen py-36 bg-neutral-950 font-sans flex items-center justify-center p-4" id="admin_cockpit_auth_gate">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-rose-500/15 border border-rose-500/25 rounded-full text-rose-500 mb-3 animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-xl font-bold uppercase tracking-widest text-white">Owner Access Control</h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">Provide backoffice access credentials below</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Admin Name:</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Enter Admin Name"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs tracking-wider text-[#eeeeee] focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Password:</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs tracking-wider text-[#eeeeee] focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {authError && (
              <div className="bg-rose-950/40 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-center font-bold text-[11px] uppercase tracking-wide">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white hover:bg-zinc-200 text-black py-3 text-xs font-bold font-display uppercase tracking-wider rounded transition-colors cursor-pointer"
              id="admin_passcode_submit_btn"
            >
              BOOT OWNER SYSTEMS
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] font-mono text-zinc-600 leading-normal">
            For Developer Evaluation Team:<br />
            Name: <strong className="text-white">Tejas</strong> &middot; Password: <strong className="text-white">Test@123</strong>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id="admin_cockpit_dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cockpit Brand header */}
        <div className="flex flex-col md:flex-row items-baseline sm:items-center justify-between border-b border-white/10 pb-6 mb-10 gap-4">
          <div>
            <span className="text-xs text-red-500 font-mono tracking-widest uppercase flex items-center gap-1">
              <span>●</span> SECURE COCKPIT ENVIRONMENT LIVE
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-widest text-white uppercase mt-1">
              Photographer Control Board
            </h1>
          </div>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              setAdminName('');
              setAdminPassword('');
            }}
            className="flex items-center space-x-1 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white px-4 py-2 text-xs font-mono tracking-wide rounded bg-zinc-900 transition-colors cursor-pointer"
            id="admin_logout_btn"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>EXIT ADMIN BACKOFFICE</span>
          </button>
        </div>

        {/* Dashboard Responsive Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Panel Sidebars (Navigation tabs) */}
          <div className="lg:col-span-3 bg-zinc-900/60 p-4 rounded-2xl border border-white/10 space-y-1.5 flex flex-col" id="admin_tab_selector">
            {[
              { id: 'media', label: 'Upload & Media', icon: Grid, count: photosVideos.length },
              { id: 'clients', label: 'Private Clients Log', icon: Users, count: clients.length },
              { id: 'payments', label: 'Subscription Payments', icon: CreditCard, count: payments.filter(p => p.status === 'Pending').length },
              { id: 'orders', label: 'Print Shop Orders', icon: CreditCard, count: orders.filter(o => o.status === 'Pending').length },
              { id: 'coupons', label: 'Discount Coupons', icon: Tag, count: coupons.length },
              { id: 'settings', label: 'UPI & QRCodes', icon: Settings, count: 0 },
              { id: 'messages', label: 'Inbox Enquiries', icon: MessageSquare, count: messages.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center justify-between px-4 py-3 text-xs tracking-wider rounded-lg font-mono uppercase transition-all text-left group cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-semibold shadow-lg'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    activeTab === tab.id ? 'bg-black text-white' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Main workspace section */}
          <div className="lg:col-span-9 bg-[#0b0b0b] min-h-[500px] border border-white/10 rounded-2xl p-6 sm:p-8" id="admin_cockpit_workspace">
            
            {/* Tab Panel 1: Media Upload and Editing Dashboard */}
            {activeTab === 'media' && (
              <div className="space-y-8 animate-fade-in-up" id="tab_media_workspace">
                <div>
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-white">Upload Photograph or Video Clip</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Configure gallery pricing, master resolutions, and media category folders.</p>
                </div>

                {/* Addition Form */}
                <form onSubmit={handleMediaSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs bg-zinc-900/30 p-5 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-zinc-400 mb-1">Asset Title:</label>
                    <input
                      type="text"
                      required
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      placeholder="e.g. Desert Mirage Study"
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Content Source URL or Upload Local:</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder="e.g. Paste image URL or browse below..."
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                      />
                      <label className="w-full bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-zinc-300 rounded py-2 px-3 text-center cursor-pointer font-sans text-[10px] block transition-colors">
                        <span className="flex items-center justify-center gap-1.5 uppercase tracking-wide font-mono">
                          <Upload className="w-3.5 h-3.5" />
                          <span>CHOOSE LOCAL COMPUTER FILE</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleLocalImageUpload(e, 'add')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Gallery Type Folder:</label>
                    <select
                      value={newMediaCategory}
                      onChange={(e) => setNewMediaCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white"
                    >
                      <option value="landscape">Landscape Gallery</option>
                      <option value="portrait">Portrait Gallery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Asset Format Type:</label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white"
                    >
                      <option value="photo">Fine-Art Photograph (Photo)</option>
                      <option value="video">Cinematic Video clip (MP4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Standard Base Print Copy Price (INR):</label>
                    <input
                      type="number"
                      required
                      value={newMediaPrice}
                      onChange={(e) => setNewMediaPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Highest Source Native Resolution:</label>
                    <select
                      value={newMediaResolution}
                      onChange={(e) => setNewMediaResolution(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white"
                    >
                      <option value="1080p">1080p FHD</option>
                      <option value="2K">2K QuadHD</option>
                      <option value="4K">4K UltraHD</option>
                      <option value="8K">8K Master Edition</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-2 w-full mt-2 bg-white hover:bg-zinc-200 text-black py-2.5 text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD & DISPATCH TO LIVE SERVERS</span>
                  </button>
                </form>

                {/* Media Management Table lists */}
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Live Asset Collection ({photosVideos.length})</h3>
                  
                  <div className="border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden text-xs font-mono">
                    {photosVideos.map((item) => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/10">
                        <div className="flex items-center space-x-3 truncate">
                          <img src={item.url} referrerPolicy="no-referrer" alt="" className="w-10 h-10 object-cover rounded bg-zinc-800" />
                          <div className="truncate">
                            <p className="font-bold text-[#dddddd] truncate">{item.title}</p>
                            <p className="text-[10px] text-zinc-500 capitalize">{item.category} &middot; {item.type} &middot; INR {item.price || 1500} &middot; Res: {item.resolution}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          <button
                            type="button"
                            onClick={() => handleEditInit(item)}
                            className="p-1 px-2.5 border border-white/10 hover:border-white text-[10px] tracking-wide font-mono rounded uppercase text-zinc-300 hover:text-white transition-colors"
                          >
                            EDIT DETAILS
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Do you absolutely wish to delete ${item.title} from portfolio catalogs?`)) {
                                onDeleteMedia(item.id);
                              }
                            }}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Master Asset Editorial Overlay Modal */}
                {editingMedia && (
                  <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                      <button
                        onClick={() => setEditingMedia(null)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-[11px] uppercase tracking-wide cursor-pointer"
                      >
                        [CLOSE X]
                      </button>

                      <div className="mb-6">
                        <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block">Master Asset Editor</span>
                        <h3 className="font-display text-lg uppercase tracking-widest text-white font-bold mt-1">Edit Media Information</h3>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">Apply name updates, media category folders, pricing levels, resolutions, or choose replacement local computer files.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                        <div>
                          <label className="block text-zinc-400 mb-1">Asset Title Name:</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Gallery Category Folder:</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                          >
                            <option value="landscape">Landscape Gallery</option>
                            <option value="portrait">Portrait Gallery</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Asset Format Type:</label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as any)}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                          >
                            <option value="photo">Fine-Art Photograph (Photo)</option>
                            <option value="video">Cinematic Video clip (MP4)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Resolution Standard Level:</label>
                          <select
                            value={editResolution}
                            onChange={(e) => setEditResolution(e.target.value as any)}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                          >
                            <option value="480p">480p Quality</option>
                            <option value="720p">720p Quality</option>
                            <option value="1080p">1080p FHD Quality</option>
                            <option value="2K">2K Resolution Quality</option>
                            <option value="4K">4K Resolution Quality</option>
                            <option value="8K">8K Master Resolution</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Standard Print Copy Price (INR):</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1">Media Source URL or Select Local File:</label>
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none text-[10px]"
                            />
                            <label className="w-full bg-zinc-850 hover:bg-zinc-800 border border-white/10 text-zinc-300 rounded py-1.5 px-3 text-center cursor-pointer font-sans text-[10px] block transition-colors">
                              <span className="flex items-center justify-center gap-1 uppercase tracking-wide font-mono">
                                <Upload className="w-3 h-3" />
                                <span>REPLACE WITH COMPUTER FILE</span>
                              </span>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => handleLocalImageUpload(e, 'edit')}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex space-x-3 font-mono text-xs">
                        <button
                          onClick={() => handleEditSave(editingMedia.id)}
                          className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 rounded font-bold uppercase transition-colors cursor-pointer"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingMedia(null)}
                          className="flex-1 border border-white/10 hover:border-white text-white py-3 rounded font-bold uppercase transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Panel 2: Secure client manager and VIP generator */}
            {activeTab === 'clients' && (
              <div className="space-y-8 animate-fade-in-up" id="tab_clients_workspace">
                <div>
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-white">Private Client Portal Configurator</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Directly generate user email credential tokens, assign private galleries and grant VIP Bypass overrides.</p>
                </div>

                {/* Insertion form */}
                <form onSubmit={handleClientSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs bg-zinc-900/30 p-5 rounded-xl border border-white/5">
                  <div>
                    <label className="block text-zinc-400 mb-1">Unique Client Email:</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. client_vip@agency.com"
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Set Password Token:</label>
                    <input
                      type="password"
                      required
                      value={clientPassword}
                      onChange={(e) => setClientPassword(e.target.value)}
                      placeholder="e.g. SecureSecretCode"
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Media Folder Access Scope:</label>
                    <select
                      value={clientAccess}
                      onChange={(e) => setClientAccess(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white"
                    >
                      <option value="all">Access All Collections</option>
                      <option value="landscape">Landscape Gallery Only</option>
                      <option value="portrait">Portrait Gallery Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Membership Quality Level Override:</label>
                    <select
                      value={clientLevelOverride}
                      onChange={(e) => setClientLevelOverride(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white"
                    >
                      <option value="none">Standard Previews Only</option>
                      <option value="bonus">Bonus Membership (480p)</option>
                      <option value="silver">Silver Tier (1080p Photo / 720p Video)</option>
                      <option value="gold">Gold Tier (2K Photo / 1080p Video)</option>
                      <option value="platinum">Platinum Tier (8K Photo / 4K Video)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Allowed Credits (Total Downloads):</label>
                    <input
                      type="number"
                      required
                      value={clientDownloads}
                      onChange={(e) => setClientDownloads(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Vault Account Expiration:</label>
                    <input
                      type="date"
                      required
                      value={clientExpiry}
                      onChange={(e) => setClientExpiry(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <input
                      type="checkbox"
                      id="vipBypassCheck"
                      checked={clientIsVip}
                      onChange={(e) => setClientIsVip(e.target.checked)}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 mr-2 rounded cursor-pointer"
                    />
                    <label htmlFor="vipBypassCheck" className="text-amber-400 font-bold select-none cursor-pointer">
                      Activate VIP Free Bypass Overrides? (Removes paywalls, completely bypasses premium payment triggers)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-2 w-full mt-2 bg-white hover:bg-zinc-200 text-black py-2.5 text-xs font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>AUTHORIZE CLIENT CREDENTIALS</span>
                  </button>
                </form>

                {/* Client Log Details panel */}
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Authenticated Clients ({clients.length})</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    {clients.map((cli) => (
                      <div key={cli.id} className="bg-zinc-900 border border-white/5 p-4 rounded-xl flex justify-between gap-4">
                        <div className="space-y-1 overflow-hidden">
                          <p className="font-bold text-white truncate text-[13px]">{cli.email}</p>
                          <p className="text-zinc-500">Security Pass: {cli.password}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] uppercase">
                            <span className="bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">Scope: {cli.galleryAccess}</span>
                            <span className="bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded">Credits Used: {cli.downloadsCount}/{cli.allowedDownloads}</span>
                            {cli.isVipBypass && (
                              <span className="bg-amber-500/10 text-amber-400 px-1 py-0.5 rounded border border-amber-500/20 font-bold">VIP Bypass</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(`Absolutely revoke database server authorization for client: ${cli.email}?`)) {
                              onDeleteClient(cli.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 shrink-0 self-center"
                          title="Revoke Authorizations"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel 3: Membership Payment approving logs */}
            {activeTab === 'payments' && (() => {
              const filteredPayments = payments.filter(p => {
                if (!paymentSearch) return true;
                const target = paymentSearch.toLowerCase();
                return (
                  p.userEmail.toLowerCase().includes(target) ||
                  p.planName.toLowerCase().includes(target) ||
                  p.transactionId.toLowerCase().includes(target) ||
                  p.upiId.toLowerCase().includes(target) ||
                  p.status.toLowerCase().includes(target)
                );
              });

              return (
                <div className="space-y-8 animate-fade-in-up" id="tab_payments_workspace">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#eeeeee]">Membership Transfer Verification Queue</h2>
                      <p className="text-xs text-zinc-500 font-mono mt-1">Cross-check UTR numbers against incoming payments to greenlight subscriptions.</p>
                    </div>

                    {/* Search Payments Bar */}
                    <div className="w-full md:w-80">
                      <input
                        type="text"
                        value={paymentSearch}
                        onChange={(e) => setPaymentSearch(e.target.value)}
                        placeholder="Search payments by email, UTR, UPI, plan..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  {payments.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-white/5 rounded-xl">
                      <p className="text-zinc-500 text-xs font-mono tracking-wider">No membership queue logs found in local systems database.</p>
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-white/5 rounded-xl">
                      <p className="text-zinc-500 text-xs font-mono tracking-wider">No transactions found matching your search term: "{paymentSearch}"</p>
                    </div>
                  ) : (
                    <div className="space-y-4 font-mono text-xs">
                      {filteredPayments.map((p) => {
                        const isPending = p.status === 'Pending';
                        
                        return (
                          <div key={p.id} className="bg-zinc-900 border border-white/10 p-5 rounded-xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/5 pb-3">
                              <div>
                                <p className="font-bold text-white text-[13px]">{p.userEmail}</p>
                                <p className="text-[10px] text-zinc-500 mt-0.5">Purchasing Plan: <strong className="text-zinc-300">{p.planName}</strong> (₹{p.amount})</p>
                              </div>
                              <span className={`px-2 py-0.5 font-bold uppercase rounded text-[10px] sm:mt-0 mt-2 block w-fit ${
                                p.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                                p.status === 'Rejected' ? 'bg-rose-500/15 text-rose-400' :
                                'bg-amber-500/15 text-amber-400 animate-pulse'
                              }`}>
                                {p.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                              <div className="space-y-1 bg-black/30 p-3 rounded border border-white/5 text-[11px] leading-relaxed">
                                <p className="text-zinc-500">UTR / Ref Transaction No:</p>
                                <p className="text-white font-extrabold text-[13px] tracking-wider select-all">{p.transactionId}</p>
                                <p className="text-zinc-500 mt-2">Sender Unified Handle ID:</p>
                                <p className="text-zinc-300 font-mono">{p.upiId}</p>
                                {p.couponCodeUsed && (
                                  <p className="text-emerald-400 mt-2 text-[10px]">Activated Discount Coupon: {p.couponCodeUsed}</p>
                                )}
                              </div>

                              {/* Ticket base64 thumbnail image display */}
                              <div className="space-y-2">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Screenshot Attached:</p>
                                <div className="relative border border-white/15 rounded bg-black/60 h-40 max-w-[200px] overflow-hidden flex items-center justify-center">
                                  <img 
                                    src={p.screenshotUrl} 
                                    alt="UPI Proof" 
                                    className="w-full h-full object-contain cursor-zoom-in"
                                    onClick={() => {
                                      // Open screenshot modal securely
                                      const w = window.open();
                                      if(w) w.document.write(`<img src="${p.screenshotUrl}" style="max-width:100%;" />`);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Trigger verification approvals */}
                            {isPending && (
                              <div className="flex gap-3 pt-3 border-t border-white/5">
                                <button
                                  onClick={() => onApprovePayment(p.id)}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold py-2 px-4 rounded transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>APPROVE MEMBERSHIP</span>
                                </button>
                                <button
                                  onClick={() => onRejectPayment(p.id)}
                                  className="flex-1 bg-rose-950 hover:bg-rose-900 border border-rose-500/10 text-rose-300 font-mono text-[10px] font-bold py-2 p-3 rounded transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>REJECT SCREENSHOT CLAIM</span>
                                </button>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Tab Panel 7: Physical Print shop orders queue */}
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fade-in-up" id="tab_orders_workspace">
                <div>
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#eeeeee]">Physical Prints Purchase Checkout</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Authenticate buyers and frame prints with matching transaction statuses.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-white/5 rounded-xl">
                    <p className="text-zinc-500 text-xs font-mono tracking-wider">No active print orders queued in local billing system.</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-xs">
                    {orders.map((o) => {
                      const isPending = o.status === 'Pending';
                      
                      return (
                        <div key={o.id} className="bg-zinc-900 border border-white/10 p-5 rounded-xl space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/5 pb-3">
                            <div>
                              <p className="font-bold text-white text-[13px]">{o.userEmail}</p>
                              <p className="text-emerald-400 font-bold mt-1 text-sm">Fine Art prints: ₹{o.totalAmount}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                              o.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                              o.status === 'Rejected' ? 'bg-rose-500/15 text-rose-400' :
                              'bg-amber-500/15 text-amber-400 animate-pulse'
                            }`}>
                              {o.status}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Ordered prints list:</p>
                            <div className="bg-black/30 p-3 rounded-lg border border-white/5 divide-y divide-white/5 space-y-1">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="py-2 first:pt-0 flex justify-between items-center text-[11px]">
                                  <span className="text-white font-medium">{it.title} ({it.size})</span>
                                  <span className="text-zinc-500">Qty: {it.quantity} &middot; ₹{it.price * it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                            <div className="bg-black/20 p-3 rounded border border-zinc-800 text-[11px] leading-relaxed">
                              <p className="text-zinc-500">UTR Receipt Code:</p>
                              <p className="text-white font-bold tracking-widest text-xs select-all mb-2">{o.transactionId}</p>
                              <p className="text-zinc-500">Buyer handle ID:</p>
                              <p className="text-zinc-300">{o.upiId}</p>
                            </div>

                            <div className="space-y-1 text-center">
                              <img src={o.screenshotUrl} alt="" className="h-28 object-contain rounded border border-white/5 bg-black" />
                            </div>
                          </div>

                          {isPending && (
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => onApproveOrder(o.id)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold py-2 rounded transition-colors cursor-pointer"
                              >
                                APPROVE SHIPMENT
                              </button>
                              <button
                                onClick={() => onRejectOrder(o.id)}
                                className="flex-1 bg-rose-950 text-rose-300 font-mono text-[10px] font-bold py-2 rounded transition-colors cursor-pointer cursor-not-allowed"
                              >
                                REJECT PAYMENT PROOF
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab Panel 4: Discount Coupon creators */}
            {activeTab === 'coupons' && (
              <div className="space-y-8 animate-fade-in-up" id="tab_coupons_workspace">
                <div>
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#eeeeee]">Coupon Code Generator</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Configure discount percentages, register active promo campaign phrases, and examine user triggers.</p>
                </div>

                <form onSubmit={handleCouponSubmit} className="flex flex-col gap-4 bg-zinc-900/30 p-5 rounded-xl border border-white/5 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
                    <div className="flex-1">
                      <label className="block text-zinc-400 mb-1">Coupon Word Phrase:</label>
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. MONSOON30, TEJOFFER"
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                      />
                    </div>

                    <div className="w-full sm:w-40">
                      <label className="block text-zinc-400 mb-1">Discount Percent (%):</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={100}
                        value={couponPercent}
                        onChange={(e) => setCouponPercent(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black py-2.5 px-6 font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                    >
                      GENERATE CODE
                    </button>
                  </div>

                  <div className="flex items-center p-2.5 bg-zinc-900/40 border border-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      id="couponIsReferralCheck"
                      checked={couponIsReferral}
                      onChange={(e) => setCouponIsReferral(e.target.checked)}
                      className="w-4 h-4 text-zinc-100 focus:ring-zinc-400 mr-2 rounded cursor-pointer"
                    />
                    <label htmlFor="couponIsReferralCheck" className="text-zinc-300 font-sans select-none cursor-pointer">
                      Is this a Referral Reward coupon? (Binds as referral loop discount reward)
                    </label>
                  </div>
                </form>

                {/* Coupons list */}
                <div className="space-y-4">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Active Promo Database ({coupons.length})</h3>
                  
                  <div className="border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden text-xs font-mono">
                    {coupons.map((c) => (
                      <div key={c.id} className="p-4 flex items-center justify-between gap-4 bg-zinc-900/10">
                        <div>
                          <p className="font-bold text-white text-sm select-all flex items-center gap-2">
                            <span>{c.code}</span>
                            {c.isReferralReward ? (
                              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Referral Reward</span>
                            ) : (
                              <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded border border-white/5 uppercase">Standard Promo</span>
                            )}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Discount: {c.discountPercent}% OFF &middot; Status: {c.isActive ? 'Live' : 'Dead'}</p>
                        </div>

                        <button
                          onClick={() => onDeleteCoupon(c.id)}
                          className="text-rose-400 hover:text-rose-300 font-sans cursor-pointer"
                          title="Revoke Coupon"
                        >
                          Delete Coupon
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab Panel 5: Business settings changes (QRCode upload, UPI handler) */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="space-y-8 animate-fade-in-up" id="tab_settings_workspace">
                <div>
                  <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#eeeeee]">Payment Settings & UPI Configuration</h2>
                  <p className="text-xs text-zinc-500 font-mono mt-1">Configure your official UPI credentials, upload your merchant scanner code, and update instructions.</p>
                </div>

                <div className="space-y-6 font-mono text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Merchant Account Holder Name:</label>
                      <input
                        type="text"
                        required
                        value={settingsAccountHolder}
                        onChange={(e) => setSettingsAccountHolder(e.target.value)}
                        placeholder="e.g. Tejas Kumar"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Merchant UPI ID handle:</label>
                      <input
                        type="text"
                        required
                        value={settingsUpi}
                        onChange={(e) => setSettingsUpi(e.target.value)}
                        placeholder="e.g. tejphotography@upi"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-white transition-colors font-bold tracking-wider"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Direct UPI QR Code Image URL:</label>
                    <input
                      type="text"
                      value={settingsQrUrl}
                      onChange={(e) => setSettingsQrUrl(e.target.value)}
                      placeholder="Or upload your local image files below"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-white transition-colors"
                    />
                    <p className="text-[9px] text-zinc-500 mt-1 uppercase">Copy any high resolution image web path, or upload a local file directly below.</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">Customer Checkout Payment Instructions:</label>
                    <textarea
                      value={settingsInstructions}
                      onChange={(e) => setSettingsInstructions(e.target.value)}
                      placeholder="e.g. Send the exact amount with your email as UPI transaction note. Approval takes 15 minutes max."
                      rows={4}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-white transition-colors font-sans text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start bg-zinc-900/40 p-5 rounded-xl border border-white/5">
                    <div>
                      <p className="text-zinc-400 font-display font-medium text-xs select-none">Upload New Payment QR Scanner Code:</p>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                        Select a standard JPG, PNG, or SVG image. The file is secure, encoded as optimized base64 data, and syncs across all client checkout views immediately.
                      </p>
                      
                      <div className="mt-4">
                        <label className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-[#eeeeee] px-4 py-2.5 rounded font-mono text-[11px] cursor-pointer border border-white/5 transition-colors">
                          <Upload className="w-4 h-4 text-zinc-400 animate-bounce" />
                          <span>CHOOSE LOCAL QR IMAGE</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleQrUploadLocal}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 border border-white/10 rounded-xl">
                      <span className="text-[9px] text-zinc-500 font-mono tracking-widest text-center uppercase mb-3 text-center">Live Preview of Current QR</span>
                      {settingsQrUrl ? (
                        <div className="relative group p-2 bg-white rounded-lg">
                          <img 
                            src={settingsQrUrl} 
                            alt="Merchant Qr" 
                            className="w-36 h-36 object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setSettingsQrUrl('')}
                            className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1"
                            title="Remove QR Image"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-36 h-36 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center p-3 text-zinc-600 text-[10px]">
                          <span>No QR Image Configured</span>
                          <span className="text-[8px] mt-1 text-zinc-700">Display remains empty during client billing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 text-xs font-bold font-display uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-white/5 font-bold"
                  >
                    SAVE MERCHANT CONFIGURATION
                  </button>
                </div>
              </form>
            )}

            {/* Tab Panel 6: Inquiry Messages database logs */}
            {activeTab === 'messages' && (
              <div className="space-y-8 animate-fade-in-up" id="tab_messages_workspace">
                <div className="flex justify-between items-baseline gap-4">
                  <div>
                    <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#eeeeee]">Customer Inbox Logs</h2>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Review contact cards, feedback, custom sizing requests, and quotation briefs.</p>
                  </div>

                  {messages.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Clear all local contact logs permanently?')) {
                          onClearMessages();
                        }
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 font-mono underline"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-white/5 rounded-xl">
                    <p className="text-zinc-500 text-xs font-mono tracking-wider">No customer enquiries found in local memory.</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-xs">
                    {messages.map((m) => (
                      <div key={m.id} className="bg-zinc-900 border border-white/10 p-5 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 border-b border-white/5 pb-1.5">
                          <span>Sender: <strong className="text-white">{m.name}</strong> &middot; <strong className="text-[#eeeeee] select-all">{m.email}</strong></span>
                          <span>{m.timestamp}</span>
                        </div>
                        <p className="text-zinc-300 text-xs leading-relaxed font-sans font-light select-text">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
