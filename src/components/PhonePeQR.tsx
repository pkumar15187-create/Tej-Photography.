import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface PhonePeQRProps {
  className?: string;
  upiId?: string;
  accountHolderName?: string;
  paymentInstructions?: string;
  qrUrl?: string;
}

export default function PhonePeQR({ 
  className = '', 
  upiId = '7050831301@ibl', 
  accountHolderName = 'Shikha kumari', 
  paymentInstructions,
  qrUrl
}: PhonePeQRProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // If the admin has specifically uploaded a custom QR image via the Admin Panel, we prioritize that!
    if (qrUrl) {
      setQrCodeDataUrl(qrUrl);
      return;
    }

    // Otherwise, generate a real, live scanable UPI address QR code dynamically!
    // UPI payment deep-link protocol standard: upi://pay?pa=ADDRESS&pn=NAME&am=&cu=INR
    const cleanUpi = upiId ? upiId.trim() : '7050831301@ibl';
    const cleanName = accountHolderName ? accountHolderName.trim() : 'Shikha kumari';
    
    // Construct the official UPI Deep-Link URI
    const upiLink = `upi://pay?pa=${cleanUpi}&pn=${encodeURIComponent(cleanName)}&cu=INR`;

    QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: 'H', // Use high error correction so the center PhonePe logo overlay works perfectly
      margin: 1,
      width: 350,
      color: {
        dark: '#1c1a22', // Deep near-black for high contrast scanner reading
        light: '#ffffff' // Crisp white background
      }
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate high-fidelity scanable QR code:', err);
      });
  }, [upiId, accountHolderName, qrUrl]);

  return (
    <div className={`bg-white rounded-3xl p-5 flex flex-col items-center shadow-xl border border-zinc-100 text-zinc-900 ${className}`} id="inline_phonepe_qr_container">
      {/* PhonePe Branded Header Banner */}
      <div className="flex items-center justify-center gap-2.5 mb-2 select-none">
        {/* Purple PhonePe Logo Orb */}
        <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-sans font-black text-xl shadow-sm">
          पे
        </div>
        <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2d2d2d]">PhonePe</span>
      </div>

      {/* ACCEPTED HERE subtitle */}
      <h5 className="text-[12px] font-black tracking-[0.12em] text-[#5f259f] uppercase mb-0.5 font-sans">
        ACCEPTED HERE
      </h5>
      <p className="text-[10px] text-zinc-500 font-semibold mb-4 font-sans text-center">
        Scan &amp; Pay Using PhonePe App
      </p>

      {/* Highly optimized scanable QR Code frame */}
      <div className="w-48 h-48 bg-white p-2 rounded-2xl border border-zinc-150 flex items-center justify-center relative shadow-sm hover:scale-[1.02] transition-transform duration-300">
        {qrCodeDataUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Real generated QR code image */}
            <img 
              src={qrCodeDataUrl} 
              alt="Scan to pay" 
              className="w-full h-full object-contain"
              draggable="false"
            />
            {/* Center PhonePe Badge Overlay (keeps QR code scanable due to Level H error correction) */}
            {!qrUrl && (
              <div className="absolute w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-zinc-200 select-none">
                <div className="w-8 h-8 rounded-full bg-[#1c1a22] flex items-center justify-center text-white font-sans font-black text-[12px]">
                  पे
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 font-mono animate-pulse">Initializing Scanner...</div>
        )}
      </div>

      {/* Dynamic UPI Information & Verification Guideline Overlay Footer */}
      {(upiId || accountHolderName) && (
        <div className="w-full mt-4 pt-3 border-t border-zinc-100 font-sans text-center text-zinc-700">
          {accountHolderName && (
            <p className="text-[11px] font-bold text-zinc-900 leading-tight">
              {accountHolderName.toUpperCase()}
            </p>
          )}
          {upiId && (
            <p className="text-[10.5px] text-[#5f259f] font-mono tracking-tight font-extrabold select-all mt-1 bg-zinc-50/80 py-1 px-3.5 rounded-lg border border-zinc-200/50 inline-block">
              {upiId}
            </p>
          )}
          {paymentInstructions && (
            <p className="text-[9px] text-zinc-400 leading-normal mt-2 border-t border-dashed border-zinc-100 pt-1 whitespace-pre-line text-left font-medium">
              {paymentInstructions}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
