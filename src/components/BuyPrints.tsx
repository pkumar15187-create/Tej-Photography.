import React, { useState } from 'react';
import { CartItem, DiscountCoupon, Order, PhotoVideo } from '../types';
import { ShoppingBag, Trash2, Send, HelpCircle, CheckCircle, Tag, Award, Gift, Share2, Copy } from 'lucide-react';
import PhonePeQR from './PhonePeQR';

interface BuyPrintsProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (orderDetails: {
    email: string;
    upiId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => void;
  activeCoupons: DiscountCoupon[];
  referralCode: string;
  referralStats: { referredUsers: string[]; earnedCoupons: string[] };
  adminUpiId: string;
  adminQrUrl: string;
  adminAccountHolderName: string;
  adminPaymentInstructions: string;
  existingOrders: Order[];
}

export default function BuyPrints({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  activeCoupons,
  referralCode,
  referralStats,
  adminUpiId,
  adminQrUrl,
  adminAccountHolderName,
  adminPaymentInstructions,
  existingOrders
}: BuyPrintsProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  
  // Checkout form state
  const [email, setEmail] = useState('');
  const [userUpi, setUserUpi] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'pay' | 'success'>('cart');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referralFriendEmail, setReferralFriendEmail] = useState('');
  const [referralSuccessMsg, setReferralSuccessMsg] = useState('');

  // Calculate pricing sums
  const originalSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const discountAmount = Math.round((originalSubtotal * discountPercent) / 100);
  const finalPrice = originalSubtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const matched = activeCoupons.find(
      c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );

    if (matched) {
      setAppliedCoupon(matched);
      setCouponSuccess(`Coupon approved! Applied ${matched.discountPercent}% discount code.`);
    } else {
      setCouponError('This coupon code is invalid or has expired.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Convert uploaded image to Base64 for localStorage database support
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userUpi || !transactionId || !screenshot) {
      alert('Please fill out all billing credentials and upload your payment proof screenshot.');
      return;
    }

    /* 
      TECHNICAL INTEGRATION SEPARATION NOTE:
      - DEMO IMPLEMENTATION: This code writes to the client-side State and syncs with Db / LocalStorage
        so that the administrative control panel can authorize, approve, or reject this order transaction.
      - PRODUCTION IMPLEMENTATION: Integrate Razorpay, Stripe, or Paytm webhooks to catch 
        the transaction instantly. Trigger an automated email with print shipping labels and receipt.
    */
    onCheckout({
      email,
      upiId: userUpi,
      transactionId,
      screenshotUrl: screenshot
    });

    setCheckoutStep('success');
  };

  const copyReferralCode = () => {
    const shareUrl = `${window.location.origin}/?ref=${referralCode}#subscriptions`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const simulateReferralInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralFriendEmail.trim()) return;

    // Simulate standard friend referral link use
    setReferralSuccessMsg(`Successful! We simulated your friend ${referralFriendEmail} using your referral code. A new 25% Discount Coupon has been unlocked for you!`);
    setReferralFriendEmail('');
    
    // Auto add a coupon for user in localStorage
    try {
      const storedCouponsStr = localStorage.getItem('tej_coupons') || '[]';
      const storedCoupons: DiscountCoupon[] = JSON.parse(storedCouponsStr);
      const generatedCode = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRewardCoupon: DiscountCoupon = {
        id: `reward-${Date.now()}`,
        code: generatedCode,
        discountPercent: 25,
        isActive: true,
        isReferralReward: true,
        referrerEmail: email || 'your_referral@tej.in'
      };
      storedCoupons.push(newRewardCoupon);
      localStorage.setItem('tej_coupons', JSON.stringify(storedCoupons));

      // Also trigger update page reload or callback if required
      // Refresh local list
      const storedStats = localStorage.getItem('tej_referral_stats') || '{"referredUsers":[],"earnedCoupons":[]}';
      const parsedStats = JSON.parse(storedStats);
      parsedStats.referredUsers.push(referralFriendEmail || 'friend@tej.com');
      parsedStats.earnedCoupons.push(generatedCode);
      localStorage.setItem('tej_referral_stats', JSON.stringify(parsedStats));
    } catch (e) {
      console.error(e);
    }
  };

  // Safe pending status messages matching current checkout user email
  const userOrdersList = existingOrders.filter(o => o.userEmail.toLowerCase() === email.toLowerCase() && email !== '');

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id="prints_and_shop_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-16 animate-fade-in-up" id="shop_headers">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white">
            Fine-Art Prints
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-zinc-500 tracking-wide font-light animate-pulse">
            Adorn your spaces with gallery-grade museum prints. Handmade frames, cotton rag paper, and certified UV long-lasting ink.
          </p>
          <div className="w-16 h-1 bg-white mx-auto mt-6" />
        </div>

        {/* Outer Split Layout: Cart vs Refer & Earn */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Left: Shopping Cart / Receipt Processing */}
          <div className="lg:col-span-8 space-y-8" id="shop_main_area">
            {checkoutStep === 'cart' && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8" id="cart_editor">
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                    <ShoppingBag className="w-6 h-6 text-zinc-400" />
                    <span>Your Selected Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  </h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20" id="cart_empty_notice">
                    <p className="text-zinc-500 text-sm font-mono tracking-wider mb-6">Your shopping cart is currently empty.</p>
                    <button 
                      onClick={() => { window.location.hash = ''; }}
                      className="inline-flex items-center bg-white hover:bg-zinc-200 text-black px-6 py-3 text-xs tracking-widest font-display font-bold uppercase rounded transition-colors"
                    >
                      BROWSE PORTFOLIOS
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Cart Items List */}
                    <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0" id={`cart_item_${item.id}`}>
                          <div className="flex items-center space-x-4">
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0" 
                            />
                            <div>
                              <h3 className="text-sm font-semibold tracking-wider text-white font-display select-none">{item.title}</h3>
                              <p className="text-xs text-zinc-500 mt-1 font-mono uppercase">Size Selected: {item.size}</p>
                              <p className="text-xs text-zinc-400 font-mono mt-0.5">Unit Price: ₹{item.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-white/15 rounded bg-zinc-900 font-mono text-xs">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="px-2.5 py-1 text-zinc-500 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-white select-none">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="px-2.5 py-1 text-zinc-500 hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            {/* Total and Trash */}
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-semibold font-mono text-white w-20 text-right">
                                ₹{item.price * item.quantity}
                              </span>
                              <button 
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1 text-zinc-500 hover:text-rose-500 transition-colors"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Check discount/coupon code */}
                    <div className="border-t border-white/10 pt-6">
                      <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Enter Coupon (e.g. TEJ50, WELCOME20)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={appliedCoupon !== null}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs tracking-wider font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-4 py-2 text-xs font-semibold tracking-wider font-display rounded border border-rose-500/20"
                          >
                            REMOVE COUPON
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 text-xs font-semibold tracking-wider font-display rounded border border-white/10 cursor-pointer"
                          >
                            APPLY CODE
                          </button>
                        )}
                      </form>
                      {couponError && <p className="text-rose-400 font-mono text-xs mt-2">{couponError}</p>}
                      {couponSuccess && <p className="text-emerald-400 font-mono text-xs mt-2">{couponSuccess}</p>}
                    </div>

                    {/* Price Breakdown Details */}
                    <div className="border-t border-white/10 pt-6 bg-zinc-900/20 p-4 rounded-xl space-y-2 text-sm font-mono" id="checkout_pricing_box">
                      <div className="flex justify-between text-zinc-400">
                        <span>Items Subtotal:</span>
                        <span>₹{originalSubtotal}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-400 text-xs">
                          <span>Discount (Coupon {appliedCoupon.code} -{appliedCoupon.discountPercent}%):</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-zinc-400 text-xs">
                        <span>GST & Shipping (Eco-friendly):</span>
                        <span className="text-emerald-500 font-medium uppercase">Free Shipping</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-2 font-display mb-4">
                        <span className="uppercase tracking-widest text-[#dcdcdc]">Final Billing Sum:</span>
                        <span>₹{finalPrice}</span>
                      </div>

                      {/* Direct user-requested PhonePe QR Code precisely below Final Billing Sum */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <PhonePeQR 
                          upiId={adminUpiId}
                          accountHolderName={adminAccountHolderName}
                          paymentInstructions={adminPaymentInstructions}
                          qrUrl={adminQrUrl}
                        />
                      </div>
                    </div>

                    {/* Forward Checkout Trigger */}
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setCheckoutStep('pay')}
                        className="bg-white hover:bg-zinc-200 text-black px-8 py-3 text-sm font-bold tracking-widest font-display uppercase rounded-lg shadow-xl cursor-pointer"
                        id="checkout_proceed_btn"
                      >
                        PROCEED TO SECURE UPI CHECKOUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

             {/* Step 2: Pay via UPI/QR Form */}
            {checkoutStep === 'pay' && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8" id="payment_receipt_panel">
                <button 
                  onClick={() => setCheckoutStep('cart')}
                  className="text-zinc-500 hover:text-white font-mono text-xs mb-6 inline-flex items-center gap-1.5"
                >
                  &larr; Return to Cart Editor
                </button>

                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white mb-6">
                  Secure UPI QR Payment Gateway
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* QR Branded Column */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <PhonePeQR 
                      className="w-full shadow-2xl"
                      upiId={adminUpiId}
                      accountHolderName={adminAccountHolderName}
                      paymentInstructions={adminPaymentInstructions}
                      qrUrl={adminQrUrl}
                    />
                  </div>

                  {/* Submission Form Column */}
                  <form onSubmit={handleCheckoutSubmit} className="md:col-span-7 space-y-4">
                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/10 font-sans text-xs leading-relaxed text-zinc-300 mb-2">
                      <p className="font-bold text-white uppercase text-[10px] mb-1.5 font-mono tracking-wider text-rose-400">Payment Verification Required:</p>
                      Please make payment using the QR code below and submit your transaction details for verification.
                      <p className="mt-2 text-zinc-400">
                        Amount to transfer: <strong className="text-emerald-400 font-mono text-sm font-bold">₹{finalPrice}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 font-mono mb-1">Contact Email Address (for receipt / shipment tracking):</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. client@example.com"
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-xs tracking-wider text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 font-mono mb-1">Your Sender UPI ID:</label>
                      <input 
                        type="text" 
                        required
                        value={userUpi}
                        onChange={(e) => setUserUpi(e.target.value)}
                        placeholder="e.g. yourname@ybl, sender@okaxis"
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-xs tracking-wider text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 font-mono mb-1">Transaction Ref / UTR ID (12-Digit Receipt ID):</label>
                      <input 
                        type="text" 
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 529364952014"
                        className="w-full bg-zinc-900 border border-white/10 rounded py-2 px-3 text-xs tracking-wider text-white font-mono placeholder:text-zinc-700 focus:outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 font-mono mb-1">Upload Payment Receipt Screenshot:</label>
                      <input 
                        type="file" 
                        required
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="w-full text-xs text-zinc-500 font-mono file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 file:cursor-pointer"
                        id="receipt_file_upload"
                      />
                      {screenshot && (
                        <div className="mt-2 bg-black border border-white/10 rounded p-2 flex items-center space-x-3 w-fit">
                          <img src={screenshot} alt="Screenshot Preview" className="w-10 h-10 object-cover rounded" />
                          <span className="text-[10px] text-zinc-500 font-mono">Attachment Secured</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 bg-white hover:bg-zinc-200 text-black py-3.5 text-xs font-bold font-display uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      id="submit_payment_proof_btn"
                    >
                      SUBMIT SECURE PAYMENT PROOF
                    </button>
                  </form>

                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation screen */}
            {checkoutStep === 'success' && (
              <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-6 animate-fade-in-up" id="checkout_success_panel">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                
                <h3 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
                  Payment Submitted Successfully
                </h3>
                
                <div className="max-w-md mx-auto space-y-3 font-mono text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  <p className="text-emerald-400 font-semibold p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    “Payment submitted. Waiting for owner approval.”
                  </p>
                  <p className="font-light text-zinc-500">
                    Our team is currently verifying Transaction Ref <strong className="text-white select-all">{transactionId}</strong> on UPI network. This process takes 5–15 minutes.
                  </p>
                  <p>
                    A purchase invoice and high-resolution digital download permissions have been queued for <strong className="text-white select-all">{email}</strong>.
                  </p>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      setEmail('');
                      setUserUpi('');
                      setTransactionId('');
                      setScreenshot('');
                      setAppliedCoupon(null);
                      setCheckoutStep('cart');
                    }}
                    className="bg-white hover:bg-zinc-200 text-black px-6 py-3 text-xs tracking-widest font-display font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    CONTINUE PORTFOLIO SHOPPING
                  </button>
                  <button
                    onClick={() => {
                      window.location.hash = '#contact';
                    }}
                    className="border border-white/20 hover:border-white px-6 py-3 text-xs tracking-widest font-display uppercase rounded-lg transition-all"
                  >
                    CONTACT SUPPORT TEAM
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area: Refer and Earn Board */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Referral Dashboard block */}
            <div className="bg-zinc-900/50 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4" id="referral_box">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="font-display text-lg font-bold tracking-widest text-white uppercase">
                  Refer & Earn (25% Reward)
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
                Spread Tej Fine-Art. Share your unique code with fellow art collectors. When they join any subscription plan or order prints, they save, and we instantly credit a **25% discount coupon** straight to your profile!
              </p>

              <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 font-mono">
                <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Your Unique Invite Code:</span>
                <div className="flex bg-zinc-900 border border-white/10 p-2.5 rounded justify-between items-center text-xs">
                  <span className="text-white font-bold select-all">{referralCode}</span>
                  <button 
                    onClick={copyReferralCode}
                    className="text-zinc-400 hover:text-white transition-colors p-1"
                    title="Copy Invite Code Link"
                  >
                    {copiedReferral ? <span className="text-[10px] text-emerald-400">COPIED</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Referral dashboard indicators */}
              <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-center">
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-zinc-500 uppercase">Invites Used</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{referralStats.referredUsers.length}</span>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="block text-[10px] text-zinc-500 uppercase">Coupons Earned</span>
                  <span className="text-lg font-extrabold text-emerald-400 mt-1 block">{referralStats.earnedCoupons.length}</span>
                </div>
              </div>

              {/* Reward list */}
              {referralStats.earnedCoupons.length > 0 && (
                <div className="bg-zinc-950/50 p-4 border border-zinc-800 rounded-xl space-y-2 font-mono" id="earned_coupons_list">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Active referral rewards:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {referralStats.earnedCoupons.map((code, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-zinc-900 rounded border border-white/5 text-[11px]">
                        <span className="text-emerald-400 font-bold">{code}</span>
                        <span className="text-zinc-500">(25% OFF)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation input */}
              <form onSubmit={simulateReferralInvite} className="pt-2 border-t border-white/5 space-y-2">
                <span className="block text-[10px] text-zinc-500 font-mono uppercase">Quick test friend invite (Demo):</span>
                <div className="flex gap-2">
                  <input 
                    type="email"
                    required
                    value={referralFriendEmail}
                    onChange={(e) => setReferralFriendEmail(e.target.value)}
                    placeholder="friend_email@example.com"
                    className="flex-1 bg-zinc-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-700 font-mono focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-3 rounded text-xs font-mono"
                  >
                    Simulate
                  </button>
                </div>
                {referralSuccessMsg && <p className="text-emerald-400 text-[10px] font-mono leading-tight mt-1">{referralSuccessMsg}</p>}
              </form>
            </div>

            {/* Dynamic personal purchase records */}
            {userOrdersList.length > 0 && (
              <div className="bg-zinc-900/40 border border-white/10 p-5 rounded-2xl space-y-3 font-mono text-xs" id="your_orders_history">
                <h4 className="text-xs uppercase text-white font-display font-semibold tracking-wider flex items-center gap-1">
                  <span>Your Order Submissions ({userOrdersList.length})</span>
                </h4>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {userOrdersList.map(order => (
                    <div key={order.id} className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-zinc-500 overflow-hidden truncate max-w-[50%]">ID: {order.id}</span>
                        <span className={`px-1.5 py-0.5 rounded uppercase font-semibold text-[9px] ${
                          order.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10' :
                          order.status === 'Rejected' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10' :
                          'bg-amber-500/15 text-amber-400 border border-amber-500/10 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-white text-xs font-bold font-display">Print Order total: ₹{order.totalAmount}</p>
                      <p className="text-[10px] text-zinc-500">Tx: {order.transactionId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </section>
  );
}
