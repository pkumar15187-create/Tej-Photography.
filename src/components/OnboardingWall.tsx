import React, { useState } from 'react';
import { Camera, Mail, Lock, LogIn, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { ClientGalleryAccess } from '../types';

interface OnboardingWallProps {
  onSuccess: (client: ClientGalleryAccess) => void;
  clientsDatabase: ClientGalleryAccess[];
  onAddClient: (newClient: ClientGalleryAccess) => void;
}

export default function OnboardingWall({ onSuccess, clientsDatabase, onAddClient }: OnboardingWallProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      // Check if client already exists in our database
      const exists = clientsDatabase.some(c => c.email.toLowerCase() === trimmedEmail);
      if (exists) {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        return;
      }

      // Generate a new client account profile on signup
      const newClient: ClientGalleryAccess = {
        id: `client-${Date.now()}`,
        email: trimmedEmail,
        password: password,
        galleryAccess: 'all',
        allowedDownloads: 10, // Standard non-member starts with 10 credits
        downloadsCount: 0,
        isVipBypass: false,
        expiryDate: '2426-12-31', // Future-proof
        membershipLevelOverride: 'none'
      };

      onAddClient(newClient);
      onSuccess(newClient);
    } else {
      // Sign In Flow
      const found = clientsDatabase.find(
        c => c.email.toLowerCase() === trimmedEmail && c.password === password
      );

      if (found) {
        onSuccess(found);
      } else {
        setErrorMsg('Invalid email address or incorrect password.');
      }
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    
    // Simulate authentic Google authorization handshake
    setTimeout(() => {
      setIsGoogleLoading(false);
      const googleEmail = `user.${Math.floor(100 + Math.random() * 900)}@gmail.com`;
      
      let existing = clientsDatabase.find(c => c.email.toLowerCase() === googleEmail);
      if (!existing) {
        existing = {
          id: `google-${Date.now()}`,
          email: googleEmail,
          galleryAccess: 'all',
          allowedDownloads: 20, // Give 20 bonus credits for Google sign in, delightful experience!
          downloadsCount: 0,
          isVipBypass: false,
          expiryDate: '2426-12-31',
          membershipLevelOverride: 'none'
        };
        onAddClient(existing);
      }
      
      onSuccess(existing);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center p-4 selection:bg-neutral-800 selection:text-white" id="onboarding_wall_viewport">
      {/* Visual blurred warm ambient lighting elements in background */}
      <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-zinc-800/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card box */}
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 sm:p-10 relative shadow-3xl text-zinc-300 font-sans animate-fade-in" id="onboarding_gate_card">
        
        {/* Header brand details */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-full text-white mb-4 animate-pulse">
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-widest uppercase text-white">
            TEJ <span className="text-zinc-500 font-light">COLLECTION</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1.5 uppercase tracking-wide">
            {isSignUp ? 'Create fine-art portal profile' : 'Sign In to portfolio databases'}
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-950/60 border border-white/5 focus:border-white/20 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Secret Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (Min 6 chars)"
                className="w-full bg-zinc-950/60 border border-white/5 focus:border-white/20 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 mb-1.5 uppercase tracking-widest">Confirm Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/60 border border-white/5 focus:border-white/20 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 rounded text-red-400 text-xs font-mono leading-relaxed">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 text-xs font-semibold font-display uppercase tracking-widest rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
            id="onboarding_form_submit_btn"
          >
            <span>{isSignUp ? 'REGISTER ACCOUNT' : 'SECURE SIGN IN'}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </form>

        {/* Separator line */}
        <div className="relative my-6 select-none">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-neutral-900 px-3 text-zinc-600">or secure verify with</span>
          </div>
        </div>

        {/* Dynamic fake Google Sign In Action */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full bg-zinc-950 border border-white/5 hover:border-white/10 hover:bg-zinc-900/40 text-white rounded-lg py-3.5 px-4 text-xs font-mono flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm relative overflow-hidden"
          id="google_oauth_bypass_btn"
        >
          {isGoogleLoading ? (
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
              <span className="text-zinc-400 text-[11px]">Connecting Google Cloud Auth...</span>
            </div>
          ) : (
            <>
              {/* Inline SVG clean rendering Google icon */}
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.823 5.823 0 0 1 8.12 12.7c0-3.21 2.612-5.82 5.87-5.82 1.485 0 2.84.53 3.89 1.45l3.228-3.228c-2.02-1.886-4.665-3.056-7.118-3.056-5.46 0-9.873 4.413-9.873 9.873s4.413 9.873 9.873 9.873c5.657 0 9.42-3.95 9.42-9.516 0-.58-.06-1.12-.174-1.636z" />
              </svg>
              <span className="font-semibold text-zinc-300">Continue with Google Account</span>
            </>
          )}
        </button>

        {/* Toggler button link */}
        <div className="mt-8 text-center" id="onboarding_auth_switcher">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            className="text-white hover:underline text-xs tracking-wide cursor-pointer"
          >
            {isSignUp ? (
              <span>Already Registered? <strong className="text-zinc-300">Sign In instead &rarr;</strong></span>
            ) : (
              <span>New Visitor? <strong className="text-zinc-300">Create Free Account &rarr;</strong></span>
            )}
          </button>
        </div>

        {/* Bottom context labels */}
        <div className="mt-8 text-center text-[10px] text-zinc-600 font-mono select-none flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
          <span>Secured by local portfolio protection rules.</span>
        </div>

      </div>
    </div>
  );
}
