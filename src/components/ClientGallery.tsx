import React, { useState } from 'react';
import { ClientGalleryAccess, PhotoVideo } from '../types';
import { Lock, User, FileKey, Eye, EyeOff, Award, Sparkles, Download, Calendar, Mail, FileText, ChevronRight } from 'lucide-react';

interface ClientGalleryProps {
  clientsDatabase: ClientGalleryAccess[];
  loggedInClient: ClientGalleryAccess | null;
  onLogin: (email: string, pass: string) => boolean; // returns true if credentials pass
  onLogout: () => void;
  portfolioItems: PhotoVideo[];
  onDownloadItem: (media: PhotoVideo, quality: string) => boolean;
}

export default function ClientGallery({
  clientsDatabase,
  loggedInClient,
  onLogin,
  onLogout,
  portfolioItems,
  onDownloadItem
}: ClientGalleryProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!emailInput || !passwordInput) {
      setLoginError('Please enter both your client email and password.');
      return;
    }

    const success = onLogin(emailInput.trim(), passwordInput);
    if (!success) {
      setLoginError('Invalid client email or password. Please verify your credentials or contact Tej Support.');
    } else {
      // Clear inputs upon successful login
      setEmailInput('');
      setPasswordInput('');
    }
  };

  // Filter client photos/videos based on their galleryAccess permission
  // Options: 'all', 'landscape', 'portrait'
  const accessibleMedia = portfolioItems.filter((item) => {
    if (!loggedInClient) return false;
    const access = loggedInClient.galleryAccess.toLowerCase();
    
    if (access === 'all') return true;
    return item.category.toLowerCase() === access;
  });

  const handleDownload = (media: PhotoVideo) => {
    if (!loggedInClient) return;
    
    // Determine quality to download based on membership level override
    // Default to '1085p' if none, '8K' if platinum/vip
    const targetQual = (loggedInClient.isVipBypass || loggedInClient.membershipLevelOverride === 'platinum') ? '8K' : '1080p';
    
    const wasSuccessful = onDownloadItem(media, targetQual);
    if (wasSuccessful) {
      setDownloadSuccessItem(media.id);
      setTimeout(() => setDownloadSuccessItem(null), 3000);
    } else {
      alert('You have depleted your allowed digital download quota. Please contact management to request extra capacity.');
    }
  };

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id="private_client_gallery_wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title labels */}
        {!loggedInClient && (
          <div className="text-center mb-16 animate-fade-in-up" id="client_lock_titles">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white">
              Private Client Vault
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-zinc-500 tracking-wide font-light">
              Restricted Fine-Art collection archives. Access is limited strictly to verified clients holding unique login-and-password credentials.
            </p>
            <div className="w-16 h-1 bg-white mx-auto mt-6" />
          </div>
        )}

        {/* Logged Out Login Portal screen */}
        {!loggedInClient ? (
          <div className="max-w-md mx-auto bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8 animate-fade-in-up shadow-2xl" id="client_login_form_container">
            <div className="text-center mb-8">
              <div className="inline-flex p-3.5 bg-white/5 border border-white/15 rounded-full text-zinc-300 mb-3">
                <Lock className="w-6 h-6 text-zinc-400" />
              </div>
              <h2 className="font-display text-lg font-bold uppercase tracking-widest text-white">Security Verification</h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Provide your exclusive email and password below</p>
            </div>

            <form onSubmit={handleSubmitLogin} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                  <Mail className="w-3.5 h-3.5" /> Client Email ID:
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs tracking-wider text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5 uppercase text-[10px]">
                  <FileKey className="w-3.5 h-3.5" /> Password Key:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 pl-3 pr-10 text-xs tracking-wider text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg text-[11px] leading-relaxed flex items-start gap-1.5">
                  <span>❌</span>
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 text-xs font-bold font-display uppercase tracking-widest rounded-lg transition-colors cursor-pointer mt-6"
                id="client_sign_in_submit"
              >
                UNLOCK PRIVATE ARCHIVES
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-zinc-600 font-sans leading-relaxed">
              <p>Demo Credentials (Check in Admin Dashboard to edit or create more):</p>
              <p className="mt-1 font-mono text-[10px]">Email: <strong className="text-zinc-500">client@example.com</strong> / Pass: <strong className="text-zinc-500">password123</strong></p>
            </div>
          </div>
        ) : (
          // Logged In Dashboard & Private Vault Page
          <div className="space-y-12 animate-fade-in-up" id="client_dashboard">
            {/* Greeting & Header Overview Info */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Tej Photography Client Access</span>
                <h1 className="font-display text-3xl font-extrabold tracking-widest uppercase text-white mt-1">
                  Private Gallery Space
                </h1>
                <p className="text-sm text-zinc-400 mt-1 select-all font-mono font-medium">{loggedInClient.email}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    window.location.hash = '#contact';
                  }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono tracking-wider rounded"
                >
                  Message Photographer
                </button>
                
                <button
                  onClick={onLogout}
                  className="px-4 py-2 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-rose-300 text-xs font-mono tracking-wider rounded bg-rose-500/5 transition-all"
                  id="client_logout_trigger"
                >
                  DEACTIVATE SESSION
                </button>
              </div>
            </div>

            {/* Grid of details/badges on client account bounds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono" id="client_meta_card_grid">
              
              {/* Box 1: VIP Bypass active status (No premium buttons) as requested */}
              <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/10 space-y-3 relative overflow-hidden">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Licensing Allowance</span>
                {loggedInClient.isVipBypass ? (
                  <>
                    <h3 className="text-amber-400 text-lg font-bold uppercase flex items-center gap-1">
                      <Award className="w-5 h-5 text-amber-500 animate-pulse" /> VIP Access Active
                    </h3>
                    <p className="text-[11px] leading-relaxed font-sans text-zinc-400 font-light">
                      Enjoy unlimited priority free downloads across the landscape and portrait portals. All payment workflows and upgrades are completely bypassed.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-emerald-400 text-lg font-bold uppercase flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Standard Gallery
                    </h3>
                    <p className="text-[11px] leading-relaxed font-sans text-zinc-400 font-light">
                      Unlocked with standard download allocations. Higher tier files require purchase.
                    </p>
                  </>
                )}
              </div>

              {/* Box 2: Quality override limit indicators */}
              <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Resolution Entitlement</span>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <span>Photos Download Limit:</span>
                    <strong className="text-white">
                      {loggedInClient.isVipBypass || loggedInClient.membershipLevelOverride === 'platinum' ? '8K Master Quality' : '1080p HD Quality'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <span>Videos Download Limit:</span>
                    <strong className="text-white">
                      {loggedInClient.isVipBypass || loggedInClient.membershipLevelOverride === 'platinum' ? '4K Full HD+' : 'Not Allowed'}
                    </strong>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-600 uppercase pt-2 border-t border-white/5">
                  Overridden Tier: {loggedInClient.membershipLevelOverride.toUpperCase()}
                </div>
              </div>

              {/* Box 3: Download counter stats */}
              <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/10 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Download Quota Used</span>
                <div className="flex justify-between items-baseline pt-1">
                  <strong className="text-2xl text-white font-extrabold">{loggedInClient.downloadsCount}</strong>
                  <span className="text-zinc-500">/ {loggedInClient.isVipBypass ? 'Unlimited' : loggedInClient.allowedDownloads} File Credits</span>
                </div>
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-white h-full transition-all duration-500"
                    style={{ 
                      width: loggedInClient.isVipBypass 
                        ? '100%' 
                        : `${Math.min(100, (loggedInClient.downloadsCount / loggedInClient.allowedDownloads) * 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Box 4: Vault Expiry Date status */}
              <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Expiration Date
                </span>
                <h3 className="text-white text-base font-bold tracking-wider pt-1">{loggedInClient.expiryDate}</h3>
                <p className="text-[10px] text-zinc-500 leading-tight">Your secure token expires on this date. Access will lock automatically.</p>
              </div>

            </div>

            {/* Custom Gallery Access Listing Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-display text-xl font-bold uppercase tracking-widest text-[#eeeeee] flex items-center gap-2">
                  <span>Your Unlocked Vault Masterpieces</span>
                  <span className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2.5 py-0.5 rounded border border-white/5">
                    {accessibleMedia.length} Photos & Streams
                  </span>
                </h2>
                
                <span className="text-xs text-zinc-500 font-sans mt-2 sm:mt-0 italic">
                  Showing matches for access scopes: "{loggedInClient.galleryAccess.toUpperCase()}"
                </span>
              </div>

              {/* Secure client items grid list */}
              {accessibleMedia.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-white/10 rounded-xl">
                  <p className="text-zinc-500 font-mono text-xs tracking-wider">No matching photos could be found on your client scope profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="client_items_grid">
                  {accessibleMedia.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden h-[340px] flex flex-col justify-between hover:border-white/20 transition-all duration-300"
                    >
                      {/* media thumbnail frame */}
                      <div className="relative w-full h-[220px] bg-black overflow-hidden group">
                        {item.type === 'video' ? (
                          <video src={item.url} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.url} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-0.5 rounded text-[9px] text-zinc-400 font-mono">
                          {item.type.toUpperCase()}
                        </div>
                      </div>

                      {/* item text detail footer */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display text-sm font-semibold text-white tracking-widest truncate flex-1">{item.title}</h4>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase bg-black px-1.5 py-0.5 rounded border border-white/5">{item.resolution} native</span>
                        </div>

                        {/* trigger download directly inside private portal */}
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-zinc-500 font-sans">Watermark-Free License</span>
                          <button
                            onClick={() => handleDownload(item)}
                            className="bg-white hover:bg-zinc-200 text-black px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded transition-colors flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>
                              {downloadSuccessItem === item.id ? 'VERIFIED' : 'SECURE DOWNLOAD'}
                            </span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
