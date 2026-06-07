import React from 'react';
import { Camera, Instagram, Twitter, MessageSquare, ExternalLink, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-zinc-400 border-t border-white/5 py-16 px-4" id="footer_section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1: Brand details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <Camera className="w-5 h-5" />
            <span className="font-display text-lg tracking-widest font-semibold">
              TEJ <span className="text-zinc-500 font-light">PHOTOGRAPHY</span>
            </span>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed font-sans font-light">
            Crafting premium, high-contrast, fine-art photographs spanning breathtaking landscapes and intimate studio portraiture. Over 10 years of visual exploration.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h3 className="text-xs tracking-widest uppercase text-white font-display font-bold mb-4">Portfolios</h3>
          <ul className="space-y-2 text-sm font-sans font-light">
            <li>
              <button onClick={() => onNavigate('landscape')} className="hover:text-white transition-colors cursor-pointer text-left">
                Landscape Masterpieces
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('portrait')} className="hover:text-white transition-colors cursor-pointer text-left">
                Portrait Studio Study
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('prints')} className="hover:text-white transition-colors cursor-pointer text-left">
                Fine-Art Print Shop
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('subscriptions')} className="hover:text-white transition-colors cursor-pointer text-left font-medium text-amber-500 hover:text-amber-400">
                Premium Memberships
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Social & Communities */}
        <div>
          <h3 className="text-xs tracking-widest uppercase text-white font-display font-bold mb-4">Discover Online</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://www.instagram.com/tejash_shroff?igsh=MXdyNTRsd3JhZmk4OA==" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-zinc-500" />
                <span>Instagram (@tejash_shroff)</span>
              </a>
            </li>
            <li>
              <a href="https://vsco.co" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4 text-zinc-500" />
                <span>VSCO Journal</span>
              </a>
            </li>
            <li>
              <a href="https://500px.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <ExternalLink className="w-4 h-4 text-zinc-500" />
                <span>500px Portfolio</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-white transition-colors cursor-pointer">
                <Twitter className="w-4 h-4 text-zinc-500" />
                <span>X / Twitter Feed</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Studio Contact Context */}
        <div className="space-y-4">
          <h3 className="text-xs tracking-widest uppercase text-white font-display font-bold mb-4">Studio</h3>
          <p className="text-sm text-zinc-500 font-sans font-light">
            Tej Photography Studio<br />
            New Delhi, India<br />
            Email: <span className="text-zinc-300">tej@tejphotography.in</span>
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 font-sans">
        <div>
          &copy; {new Date().getFullYear()} Tej Photography. All Rights Reserved. Creative Indian Fine Art.
        </div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="/preview" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 text-left transition-colors">
            Terms of Use
          </a>
          <span>&middot;</span>
          <a href="/preview1" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500 text-left transition-colors">
            Privacy Policy
          </a>
          <span>&middot;</span>
          <button 
            type="button" 
            onClick={() => { window.location.hash = '#nothing'; }} 
            className="hover:text-zinc-500 text-left text-[9px] font-mono tracking-wider italic hover:underline"
            id="hidden_troll_portal"
          >
            Don't Click Me
          </button>
        </div>
      </div>
    </footer>
  );
}
