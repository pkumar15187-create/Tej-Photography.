import React, { useState } from 'react';
import { Camera, Menu, X, ShoppingCart, User, ShieldAlert, Award } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  loggedInUser: { email: string; isVip: boolean; membership: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navigation({
  currentView,
  onNavigate,
  cartCount,
  loggedInUser,
  onLogout,
  onOpenAuth,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'landscape', label: 'Landscapes' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'prints', label: 'Buy Prints' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'private', label: 'Client Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10" id="nav_container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleItemClick('home')}
            id="logo_btn"
          >
            <Camera className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display text-xl tracking-widest text-white font-semibold">
              TEJ <span className="text-zinc-400 font-light">PHOTOGRAPHY</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav_item_${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-sm tracking-widest font-display uppercase transition-colors px-1 py-2 relative group cursor-pointer ${
                  currentView === item.id 
                    ? 'text-white font-medium' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left ${
                  currentView === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </button>
            ))}
          </div>

          {/* Right side interaction controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <button
              onClick={() => handleItemClick('prints')}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              id="cart_nav_btn"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Session Controller */}
            {loggedInUser ? (
              <div className="flex items-center space-x-2" id="user_dropdown_indicator">
                <div className="flex flex-col items-end text-[11px] leading-tight text-right">
                  <span className="text-zinc-300 font-mono text-xs">{loggedInUser.email}</span>
                  {loggedInUser.isVip ? (
                    <span className="text-amber-400 flex items-center gap-0.5 font-semibold text-[10px] tracking-wider uppercase">
                      <Award className="w-3 h-3 inline" /> VIP Bypass Active
                    </span>
                  ) : loggedInUser.membership !== 'none' ? (
                    <span className="text-emerald-400 font-bold uppercase text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {loggedInUser.membership} Plan Active
                    </span>
                  ) : (
                    <span className="text-zinc-500">Standard Access</span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-black text-xs font-mono tracking-wider transition-all rounded"
                  id="logout_btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2 border border-white/20 hover:border-white hover:bg-white hover:text-black text-xs tracking-widest font-display transition-all cursor-pointer rounded"
                id="login_nav_btn"
              >
                <User className="w-4 h-4" />
                <span>CLEINT LOGIN</span>
              </button>
            )}


          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => handleItemClick('prints')}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
              id="cart_mobile_btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-mono text-[9px] w-4h-4 p-0.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white p-2"
              id="mobile_menu_trigger"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-white/10" id="mobile_nav_drawer">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-md text-base tracking-widest uppercase font-display select-none ${
                  currentView === item.id 
                    ? 'text-white bg-zinc-900 border-l-2 border-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="pt-4 pb-2 border-t border-white/10 px-4">
              {loggedInUser ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-zinc-300 text-xs font-mono truncate">{loggedInUser.email}</div>
                  {loggedInUser.isVip ? (
                    <span className="text-amber-400 text-xs font-semibold uppercase">
                      VIP Bypass Active
                    </span>
                  ) : loggedInUser.membership !== 'none' ? (
                    <span className="text-emerald-400 text-xs font-semibold uppercase">
                      {loggedInUser.membership.toUpperCase()} Active
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-xs">Standard Member</span>
                  )}
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 py-2 text-center border border-white/20 text-xs font-mono tracking-wider text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 text-center border border-white text-xs tracking-wider font-display uppercase text-black bg-white font-semibold"
                >
                  Client Sign In
                </button>
              )}
              

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
