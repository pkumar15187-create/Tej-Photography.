import React, { useState } from 'react';
import { PhotoVideo } from '../types';
import { Search, Grid, Eye, Share2, Download, Lock, Check, ShoppingBag, Minimize2, Video, Sparkles, Award } from 'lucide-react';

interface GalleryViewProps {
  type: 'landscape' | 'portrait';
  mediaItems: PhotoVideo[];
  userMembership: string; // 'none', 'bonus', 'silver', 'gold', 'platinum'
  isVipBypass: boolean;
  onAddToCart: (media: PhotoVideo, size: string, price: number) => void;
  onNavigate: (view: string) => void;
  onDownloadItem: (media: PhotoVideo, quality: string) => boolean; // returns true if download allowed/completed
  allowedDownloadsRemaining: number;
}

export default function GalleryView({
  type,
  mediaItems,
  userMembership,
  isVipBypass,
  onAddToCart,
  onNavigate,
  onDownloadItem,
  allowedDownloadsRemaining
}: GalleryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<PhotoVideo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrintSize, setSelectedPrintSize] = useState<string>('12x18');

  // Filter media based on type, search term, and subcategory
  const filteredMedia = mediaItems.filter(item => {
    if (item.category !== type) return false;
    
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.resolution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubcategory = selectedCategory === 'all' || 
                               (selectedCategory === 'photos' && item.type === 'photo') ||
                               (selectedCategory === 'videos' && item.type === 'video');
    return matchesSearch && matchesSubcategory;
  });

  // Unique subcategories for additional tag filters
  const filterOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'photos', label: 'Fine-Art Photos' },
    { value: 'videos', label: 'Cinematic Videos' }
  ];

  // Print sizes and their pricing calculations
  const printSizes = [
    { size: '5x7', priceOffset: -300, label: 'Small Desk Print (5" x 7")' },
    { size: '8x10', priceOffset: -100, label: 'Wall Accent Print (8" x 10")' },
    { size: '12x18', priceOffset: 0, label: 'Standard Gallery Master (12" x 18")' },
    { size: '20x30', priceOffset: 800, label: 'Giant Fine-Art Statement (20" x 30")' }
  ];

  const getPriceForSize = (basePrice: number = 1500, size: string) => {
    const option = printSizes.find(o => o.size === size);
    return basePrice + (option ? option.priceOffset : 0);
  };

  // Check if a client-level is authorized to download a given quality
  // Rules:
  // - Bonus: 480p photo only
  // - Silver: 1080p photo, 720p video
  // - Gold: 2K photo, 1080p video
  // - Platinum / VIP: All up to 8K photo, 4K video
  const isResolutionUnlocked = (itemType: 'photo' | 'video', targetRes: string): { unlocked: boolean; reqTier: string } => {
    if (isVipBypass || userMembership === 'platinum') return { unlocked: true, reqTier: 'Any' };

    if (itemType === 'photo') {
      if (targetRes === '480p') {
        const hasAccess = ['bonus', 'silver', 'gold', 'platinum'].includes(userMembership);
        return { unlocked: hasAccess, reqTier: 'Bonus' };
      }
      if (targetRes === '1080p') {
        const hasAccess = ['silver', 'gold', 'platinum'].includes(userMembership);
        return { unlocked: hasAccess, reqTier: 'Silver' };
      }
      if (targetRes === '2K') {
        const hasAccess = ['gold', 'platinum'].includes(userMembership);
        return { unlocked: hasAccess, reqTier: 'Gold' };
      }
      if (targetRes === '4K' || targetRes === '8K') {
        return { unlocked: userMembership === 'platinum', reqTier: 'Platinum' };
      }
    } else { // video
      if (targetRes === '480p' || targetRes === '720p') {
        const hasAccess = ['silver', 'gold', 'platinum'].includes(userMembership);
        return { unlocked: hasAccess, reqTier: 'Silver' };
      }
      if (targetRes === '1080p') {
        const hasAccess = ['gold', 'platinum'].includes(userMembership);
        return { unlocked: hasAccess, reqTier: 'Gold' };
      }
      if (targetRes === '2K' || targetRes === '4K' || targetRes === '8K') {
        return { unlocked: userMembership === 'platinum', reqTier: 'Platinum' };
      }
    }

    return { unlocked: false, reqTier: 'Premium Tier' };
  };

  // Triggers simulator and saves stats
  const handleDownloadClick = (media: PhotoVideo, quality: string) => {
    const { unlocked } = isResolutionUnlocked(media.type, quality);
    if (!unlocked) {
      setSelectedMedia(null);
      onNavigate('subscriptions');
      return;
    }

    setDownloadProgress(quality);
    setTimeout(() => {
      onDownloadItem(media, quality);
      setDownloadProgress(null);
    }, 1500);
  };

  // URL link copier
  const handleShareClick = (media: PhotoVideo) => {
    const mockShareUrl = `${window.location.origin}/#${media.id}`;
    navigator.clipboard.writeText(mockShareUrl);
    setCopiedId(media.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id={`gallery_${type}_section`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Title & Context Header */}
        <div className="text-center mb-16 animate-fade-in-up" id="gallery_header_titles">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white">
            {type === 'landscape' ? 'Landscape Vistas' : 'Portrait Studio'}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-zinc-500 tracking-wide font-light">
            {type === 'landscape' 
              ? 'Immersive fine-art captures of mountain tranquility, cosmic midnight skies, and unyielding coastal horizons.' 
              : 'Intimate visual studies of raw light, deep human expressions, and high-fashion shadow play.'}
          </p>
          <div className="w-16 h-1 bg-white mx-auto mt-6" />
        </div>

        {/* Gallery Filters & Search Box */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-white/5" id="gallery_filter_controls">
          {/* Format selection */}
          <div className="flex bg-zinc-900 pricing-tier border border-white/10 p-1 rounded-lg">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedCategory(opt.value)}
                className={`px-4 py-2 text-xs font-display tracking-widest uppercase rounded-md transition-all cursor-pointer ${
                  selectedCategory === opt.value
                    ? 'bg-white text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Real-time search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search title or quality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs tracking-wider text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Photo/Video Responsive Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-white/10 rounded-xl" id="gallery_empty_state">
            <p className="text-zinc-500 text-sm font-mono tracking-wider">No photograph matching your query could be found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="gallery_master_grid">
            {filteredMedia.map((item, index) => (
              <div 
                key={item.id}
                className="group relative bg-[#0d0d0d] border border-white/5 overflow-hidden rounded-xl h-[400px] hover:border-white/20 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Visual Thumbnail */}
                {item.type === 'video' ? (
                  <div className="relative w-full h-2/3 overflow-hidden bg-black flex items-center justify-center">
                    <video 
                      src={item.url} 
                      muted 
                      loop 
                      playsInline
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                      <Video className="w-3 h-3" /> CLIP
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-2/3 overflow-hidden bg-zinc-900 relative">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                )}

                {/* Info and interaction panel */}
                <div className="p-5 h-1/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-base font-semibold text-white tracking-widest truncate max-w-[70%]">
                        {item.title}
                      </h3>
                      <span className="font-mono text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                        {item.resolution} Native
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 capitalize font-sans">{item.type} &middot; Original Fine Art</p>
                  </div>

                  {/* Operational triggers */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedMedia(item)}
                      className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono"
                    >
                      <Eye className="w-4 h-4" />
                      <span>PREVIEW</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleShareClick(item)}
                        className="p-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy Share Link"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setSelectedMedia(item)}
                        className="bg-white hover:bg-zinc-200 text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                      >
                        DOWNLOAD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox / Preview / Licensing Download Dashboard Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 flex items-center justify-center p-4 sm:p-6" id="gallery_lightbox_modal">
            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full border border-white/10 text-zinc-400 hover:text-white transition-colors"
                id="close_lightbox_btn"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              {/* Left Side: Photo or Video Visual Frame */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {selectedMedia.type === 'video' ? (
                  <video 
                    src={selectedMedia.url} 
                    controls 
                    autoPlay 
                    loop
                    className="w-full max-h-[500px] object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.title}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[500px] object-contain shadow-2xl rounded"
                    />
                    {/* Artistic Watermark to prompt upgrade */}
                    {['none'].includes(userMembership) && !isVipBypass && (
                      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                        <span className="text-white/10 font-display text-4xl sm:text-6xl tracking-[0.55em] uppercase font-bold text-center">
                          TEJ PORTFOLIO
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side: Licensing Panels & Print Purchase Details */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/10 px-2.5 py-1 text-[10px] text-zinc-300 font-mono tracking-widest uppercase rounded">
                      {selectedMedia.category} Fine Art
                    </span>
                    {isVipBypass ? (
                      <span className="bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 text-[9px] text-amber-400 font-mono tracking-wider font-semibold rounded flex items-center gap-0.5 uppercase">
                        <Award className="w-3 h-3" /> VIP UNLOCKED
                      </span>
                    ) : userMembership !== 'none' && (
                      <span className="bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-400 font-mono tracking-wider font-semibold rounded uppercase">
                        {userMembership} tier active
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-bold tracking-wider text-white">
                    {selectedMedia.title}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">Original Native Resolution: {selectedMedia.resolution}</p>

                  {selectedMedia.description && (
                    <p className="text-xs text-zinc-400 mt-3 leading-relaxed border-l-2 border-zinc-700 pl-3 italic">
                      {selectedMedia.description}
                    </p>
                  )}

                  <div className="w-10 h-[2px] bg-white my-5" />

                  {/* Operational Segment 1: Download Media Files depending on Subscriptions */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs tracking-wider uppercase text-zinc-400 font-display font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-glow text-white" /> Download Digital File
                      </h3>
                      {allowedDownloadsRemaining <= 100 && (
                        <span className="text-[10px] text-zinc-500 font-mono leading-none">Downloads Remaining: {allowedDownloadsRemaining}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {/* Resolutions list based on file type */}
                      {selectedMedia.type === 'photo' ? (
                        (['480p', '1080p', '2K', '8K'] as const).map((res) => {
                          const { unlocked, reqTier } = isResolutionUnlocked('photo', res);
                          
                          return (
                            <button
                              key={res}
                              disabled={downloadProgress !== null}
                              onClick={() => handleDownloadClick(selectedMedia, res)}
                              className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                                unlocked 
                                  ? 'bg-zinc-900 border-white/10 text-white hover:border-white cursor-pointer' 
                                  : 'bg-[#0f0f0f] border-zinc-900 text-zinc-500 hover:border-zinc-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {unlocked ? (
                                  <Download className="w-4 h-4 text-zinc-400" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                                )}
                                <span className="font-mono font-medium">{res} Quality Photo</span>
                              </div>
                              <span className="font-mono text-[10px]">
                                {unlocked ? (
                                  downloadProgress === res ? 'Processing...' : 'FREE ACCESS'
                                ) : (
                                  `Requires ${reqTier}`
                                )}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        // Videos: 720p, 1080p, 4K
                        (['720p', '1080p', '4K'] as const).map((res) => {
                          const { unlocked, reqTier } = isResolutionUnlocked('video', res);
                          return (
                            <button
                              key={res}
                              disabled={downloadProgress !== null}
                              onClick={() => handleDownloadClick(selectedMedia, res)}
                              className={`w-full text-left p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                                unlocked 
                                  ? 'bg-zinc-900 border-white/10 text-white hover:border-white cursor-pointer' 
                                  : 'bg-[#0f0f0f] border-zinc-900 text-zinc-500 hover:border-zinc-800'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {unlocked ? (
                                  <Download className="w-4 h-4 text-zinc-400" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                                )}
                                <span className="font-mono font-medium">{res} Quality Clip</span>
                              </div>
                              <span className="font-mono text-[10px]">
                                {unlocked ? (
                                  downloadProgress === res ? 'Compiling...' : 'FREE ACCESS'
                                ) : (
                                  `Requires ${reqTier}`
                                )}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Operational Segment 2: Buy Fine Art Prints (Physical copy) */}
                  <div className="border-t border-white/10 pt-5">
                    <h3 className="text-xs tracking-wider uppercase text-zinc-400 font-display font-semibold mb-3 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-slate-400" /> Buy Exhibition Print
                    </h3>
                    
                    {/* Size Selector */}
                    <div className="mb-4">
                      <label className="block text-[10px] text-zinc-500 font-mono mb-1.5 uppercase">Select Museum Framing Size:</label>
                      <select 
                        value={selectedPrintSize}
                        onChange={(e) => setSelectedPrintSize(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/15 text-xs text-white p-2.5 rounded focus:outline-none focus:border-white font-sans"
                        id="print_size_select"
                      >
                        {printSizes.map((opt) => (
                          <option key={opt.size} value={opt.size}>
                            {opt.label} (₹{getPriceForSize(selectedMedia.price, opt.size)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">Price with frame</span>
                        <span className="text-xl font-bold font-mono tracking-tight text-white">
                          ₹{getPriceForSize(selectedMedia.price, selectedPrintSize)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const calculatedPrice = getPriceForSize(selectedMedia.price, selectedPrintSize);
                          onAddToCart(selectedMedia, selectedPrintSize, calculatedPrice);
                          setSelectedMedia(null);
                        }}
                        className="flex-1 bg-white hover:bg-zinc-200 text-black text-xs font-bold py-3 uppercase tracking-wider rounded text-center transition-all cursor-pointer inline-flex items-center justify-center space-x-2"
                        id="add_to_cart_lightbox_btn"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD TO CART</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
