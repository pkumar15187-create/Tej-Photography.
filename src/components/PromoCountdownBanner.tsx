import React, { useState, useEffect } from 'react';

interface PromoCountdownBannerProps {
  text: string;
  expiry: string;
}

export default function PromoCountdownBanner({ text, expiry }: PromoCountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiry) return;
    const calculate = () => {
      const difference = +new Date(expiry) - +new Date();
      if (difference <= 0) {
        setTimeLeft('Promotion Concluded');
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [expiry]);

  if (!text) return null;

  return (
    <div id="promo-banner" className="bg-amber-500/10 border-b border-amber-500/15 text-amber-300 py-3 px-4 text-center text-xs font-mono tracking-wide flex flex-col sm:flex-row items-center justify-center gap-2.5 z-40 relative mt-[64px] shadow-lg shadow-black/20 animate-fade-in-down">
      <span className="font-sans font-extrabold uppercase bg-amber-500 text-black px-2 py-0.5 rounded text-[9px] tracking-widest leading-relaxed">
        EXCLUSIVE DEAL
      </span>
      <span className="text-zinc-200 font-medium">{text}</span>
      <span className="font-bold tracking-widest text-amber-400 bg-black/55 px-2.5 py-0.5 rounded border border-amber-500/20 shadow-inner">
        Timer: {timeLeft}
      </span>
    </div>
  );
}
