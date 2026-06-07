import React from 'react';
import { Home } from 'lucide-react';

interface TrollPageProps {
  onReturnHome: () => void;
}

export default function TrollPage({ onReturnHome }: TrollPageProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white text-black flex flex-col items-center justify-center p-4 font-sans" id="hidden_troll_screen">
      <div className="max-w-xl text-center space-y-8 animate-pulse">
        {/* Trolling text requested by user */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-normal leading-relaxed text-[#000000]">
          “Yaha Kuch Bhi Nahi H Pagal Banaya Tumko lolllllll Nothing Here”
        </h1>

        <div className="pt-4 flex justify-center">
          <button
            onClick={onReturnHome}
            className="flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white font-semibold px-6 py-3 tracking-widest text-xs uppercase cursor-pointer transition-all rounded shadow-md"
            id="back_to_website_troll_btn"
          >
            <Home className="w-4 h-4" />
            <span>Back to Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
