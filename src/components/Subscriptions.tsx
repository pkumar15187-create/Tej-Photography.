import React, { useState } from 'react';
import { MembershipPlan, DiscountCoupon, SubscriptionPayment } from '../types';
import { Check, ShieldCheck, CreditCard, Tag, AlertCircle, Award, Sparkles, Download, HelpCircle } from 'lucide-react';
import PhonePeQR from './PhonePeQR';

interface SubscriptionsProps {
  plans: MembershipPlan[];
  userMembership: string; // 'none', 'bonus', 'silver', 'gold', 'platinum'
  isVipBypass: boolean;
  activeCoupons: DiscountCoupon[];
  adminUpiId: string;
  adminQrUrl: string;
  adminAccountHolderName: string;
  adminPaymentInstructions: string;
  onSubscribe: (paymentDetails: {
    planId: string;
    planName: string;
    amount: number;
    couponCodeUsed: string;
    upiId: string;
    transactionId: string;
    screenshotUrl: string;
  }) => void;
  existingPayments: SubscriptionPayment[];
}

export default function Subscriptions({
  plans,
  userMembership,
  isVipBypass,
  activeCoupons,
  adminUpiId,
  adminQrUrl,
  adminAccountHolderName,
  adminPaymentInstructions,
  onSubscribe,
  existingPayments
}: SubscriptionsProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Checkout inputs
  const [email, setEmail] = useState('');
  const [userUpi, setUserUpi] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Math totals for subscriptions
  const originalPrice = selectedPlan ? selectedPlan.priceINR : 0;
  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = originalPrice - discountAmount;

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
      setCouponSuccess(`Coupon approved! Applied ${matched.discountPercent}% discount to this subscription.`);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userUpi || !transactionId || !screenshot) {
      alert('Please fill out all billing credentials and upload your payment proof screenshot.');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubscribe({
        planId: selectedPlan!.id,
        planName: selectedPlan!.name,
        amount: finalPrice,
        couponCodeUsed: appliedCoupon ? appliedCoupon.code : '',
        upiId: userUpi,
        transactionId,
        screenshotUrl: screenshot
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 1200);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
    setEmail('');
    setUserUpi('');
    setTransactionId('');
    setScreenshot('');
    setSubmittedSuccess(false);
  };

  // Safe checks
  const isPremiumActive = isVipBypass || userMembership !== 'none';
  const getQualityLabel = (tier: string) => {
    if (tier === 'bonus') return 'Photos: 480p | Videos: No Access';
    if (tier === 'silver') return 'Photos: 1080p HD | Videos: 720p HD';
    if (tier === 'gold') return 'Photos: 2K High Res | Videos: 1080p FHD';
    if (tier === 'platinum') return 'Photos: 8K Master | Videos: 4K Full HD+';
    return 'Previews Only';
  };

  // Filter payments belonging to current email or look for pending requests
  const pendingSubscriptions = existingPayments.filter(
    p => p.status === 'Pending'
  );

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id="subscriptions_pricing_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header titles */}
        <div className="text-center mb-16 animate-fade-in-up" id="sub_header_grid">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white">
            Fine-Art Subscriptions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-zinc-500 tracking-wide font-light">
            Gain immediate licensing access to download master-grade copies, commercial rights, and high-fidelity video streams.
          </p>
          <div className="w-16 h-1 bg-white mx-auto mt-6" />
        </div>

        {/* Membership Status Badge Banner */}
        {isPremiumActive && (
          <div className="mb-12 bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl animate-fade-in-up" id="active_membership_banner">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                  {isVipBypass ? 'Elite VIP Service Activated' : 'Premium Membership Active'}
                </h2>
                <div className="flex flex-wrap gap-2 items-center mt-1 text-xs">
                  <span className="text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold select-none">
                    {isVipBypass ? 'VIP Bypass' : `${userMembership} plan`}
                  </span>
                  <span className="text-zinc-500">&middot;</span>
                  <span className="text-zinc-400 font-mono">Allowed: {getQualityLabel(isVipBypass ? 'platinum' : userMembership)}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-auto text-right">
              <span className="inline-block text-xs font-mono text-zinc-500 max-w-[250px] leading-relaxed">
                Enjoy immediate free download access from the Landscape and Portrait galleries. All join prompts have been bypassed.
              </span>
            </div>
          </div>
        )}

        {/* Plans Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch" id="subscriptions_plan_grid">
          {plans.map((plan) => {
            const isActiveTier = userMembership === plan.id;
            
            return (
              <div 
                key={plan.id}
                className={`bg-[#0d0d0d] border rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isActiveTier 
                    ? 'border-white ring-2 ring-white/10 ring-offset-2 ring-offset-black scale-[1.02]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
                id={`plan_card_${plan.id}`}
              >
                {/* Popular Badge */}
                {plan.id === 'gold' && (
                  <span className="absolute top-3 right-3 bg-white text-black font-semibold text-[9px] tracking-widest uppercase font-mono px-2 py-0.5 rounded-full select-none">
                    Most Popular
                  </span>
                )}

                <div>
                  {/* Plan Meta info */}
                  <h3 className="font-display text-lg font-semibold uppercase tracking-widest text-[#eeeeee]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 font-light min-h-[40px]">{plan.description}</p>
                  
                  {/* Base Pricing details */}
                  <div className="my-6">
                    <span className="text-3xl font-extrabold text-white font-mono">₹{plan.priceINR}</span>
                    <span className="text-xs text-zinc-500 font-mono ml-1">/ 1 Year</span>
                  </div>

                  <div className="w-full h-[1px] bg-white/5 my-5" />

                  {/* Quality allowance details */}
                  <div className="space-y-4 text-xs font-sans text-zinc-400 mb-8">
                    <div className="bg-black/40 border border-white/5 p-3 rounded-lg space-y-2">
                      <div>
                        <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-0.5">Max Photo Resolution:</span>
                        <strong className="text-white font-mono">{plan.maxPhotoQuality} Quality</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-0.5">Max Video Resolution:</span>
                        {plan.maxVideoQuality === 'none' ? (
                          <strong className="text-zinc-600 font-mono">Locked / No access</strong>
                        ) : (
                          <strong className="text-white font-mono">{plan.maxVideoQuality} UHD</strong>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2.5 font-light" id={`features_list_${plan.id}`}>
                      {plan.features.map((feat, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subscribing checkout initiator */}
                <div className="pt-4 border-t border-white/5">
                  {isPremiumActive ? (
                    // If premium, hide subscription buttons as rules state
                    <div className="text-center py-2 border border-zinc-800 text-zinc-600 font-mono text-[10px] tracking-widest uppercase rounded cursor-not-allowed">
                      {isActiveTier ? 'CURRENT ACTIVE TIER' : 'UNLOCKED VIA PREMIUM'}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold tracking-widest uppercase rounded transition-colors cursor-pointer text-center"
                      id={`subscribe_trigger_${plan.id}`}
                    >
                      CHOOSE PREMIUM PLAN
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Payment Gateway checkout modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 flex items-center justify-center p-4 sm:p-6" id="subscriptions_checkout_modal">
            <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
              
              {/* Close trigger */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-50 p-2 text-zinc-500 hover:text-white"
                id="close_checkout_modal_btn"
              >
                CLOSE [X]
              </button>

              {submittedSuccess ? (
                // Checkout payment success view (Pending state)
                <div className="w-full p-8 sm:p-12 text-center space-y-6" id="sub_success_feedback">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="font-display text-3xl font-bold uppercase tracking-wider text-white">
                    Membership Receipt Filed
                  </h3>
                  <div className="max-w-md mx-auto space-y-3 font-mono text-zinc-400 text-sm leading-relaxed">
                    <p className="text-emerald-400 font-semibold p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      “Payment submitted. Waiting for owner approval.”
                    </p>
                    <p className="text-zinc-500 font-light text-xs">
                      UPI Ref ID: <strong className="text-white font-mono select-all">{transactionId}</strong>
                    </p>
                    <p className="text-xs">
                      Our administrator checks incoming payments on the bank feed. Once verified, your account <strong>{email}</strong> will be upgraded to the <strong>{selectedPlan.name}</strong> tier. This usually takes under 15 minutes.
                    </p>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={handleCloseModal}
                      className="bg-white hover:bg-zinc-100 text-black px-8 py-3 text-xs tracking-widest font-display font-medium uppercase rounded transition-colors cursor-pointer"
                    >
                      RETURN TO PORTFOLIO
                    </button>
                  </div>
                </div>
              ) : (
                // Interactive split checkout gateway
                <>
                  {/* Left Column: Plan Review  */}
                  <div className="w-full md:w-5/12 bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Order Review</span>
                      <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-white mt-1 border-b border-white/5 pb-4">
                        {selectedPlan.name} Tier
                      </h3>

                      <div className="mt-6 space-y-4 text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Subscription Duration:</span>
                          <span className="text-zinc-300">1 Year (365 Days)</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Original Plan Cost:</span>
                          <span>₹{originalPrice}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>Coupon Reward ({appliedCoupon.code}):</span>
                            <span>-{appliedCoupon.discountPercent}% (-₹{discountAmount})</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-white border-t border-white/10 pt-4 text-lg font-bold font-display mb-4">
                          <span className="uppercase tracking-widest">Total Due:</span>
                          <span>₹{finalPrice}</span>
                        </div>

                        {/* Explicit user-requested PhonePe QR Code precisely below Total Due */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <PhonePeQR 
                            upiId={adminUpiId}
                            accountHolderName={adminAccountHolderName}
                            paymentInstructions={adminPaymentInstructions}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick helper tag */}
                    <div className="mt-8 bg-[#0e0e0e] border border-white/5 rounded-xl p-3 flex gap-2 text-[10px] text-zinc-500 leading-normal font-sans">
                      <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>This payment is secure and handled transparently. It requires an admin screenshot check.</span>
                    </div>
                  </div>

                    {/* Right Column: Secure UPI Payment forms */}
                    <div className="w-full md:w-7/12 p-6 sm:p-8 space-y-5">
                      <h4 className="font-display text-lg font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                        <CreditCard className="w-5 h-5" />
                        <span>Secure Scan & Pay Checkout</span>
                      </h4>

                      {/* Display Clear Required Message */}
                      <p className="text-zinc-300 text-xs font-sans leading-relaxed bg-zinc-900 border border-white/10 p-4 rounded-xl">
                        Please make payment using the QR code below and submit your transaction details for verification.
                      </p>

                      {/* QR and UPI container */}
                      <div className="flex flex-col sm:flex-row items-start gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/10">
                        {adminQrUrl ? (
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <img 
                              src={adminQrUrl} 
                              alt="UPI Payment QR Code" 
                              className="w-32 h-32 object-contain bg-white rounded border border-white/10"
                            />
                            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-[0.05em]">Official Payment QR</span>
                          </div>
                        ) : (
                          <div className="w-32 h-32 shrink-0 bg-neutral-900 rounded border border-dashed border-white/15 flex flex-col items-center justify-center p-2 text-center text-zinc-500 font-mono text-[9px]">
                            <span>NO QR CODE CONFIGURED</span>
                            <span className="text-[7.5px] mt-1.5 text-zinc-600">(Owner configuration pending)</span>
                          </div>
                        )}
                        <div className="flex-1 font-mono text-xs text-zinc-400 space-y-2 w-full">
                          {adminAccountHolderName && (
                            <div>
                              <p className="text-[10px] text-zinc-600 uppercase font-bold">Account Holder Name:</p>
                              <p className="text-zinc-200 text-xs font-semibold">{adminAccountHolderName}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] text-zinc-600 uppercase font-bold">Tej UPI Handle ID:</p>
                            <p className="text-white bg-black/40 px-2.5 py-1.5 rounded text-[11px] select-all truncate border border-white/5 font-bold">{adminUpiId || 'Not Configured'}</p>
                          </div>
                          {adminPaymentInstructions && (
                            <div className="pt-1.5">
                              <p className="text-[10px] text-zinc-600 uppercase font-bold">Payment Description / Guides:</p>
                              <p className="text-[9.5px] text-zinc-300 leading-tight bg-zinc-950/40 p-2 rounded border border-white/5 whitespace-pre-line">{adminPaymentInstructions}</p>
                            </div>
                          )}
                        </div>
                      </div>

                    {/* Coupon Box */}
                    <div className="border-t border-white/5 pt-4">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Enter Coupon (e.g. TEJ50)"
                            value={couponCode}
                            disabled={appliedCoupon !== null}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded py-1.5 pl-8 pr-3 text-xs tracking-wider font-mono text-white placeholder:text-zinc-700 focus:outline-none"
                          />
                        </div>
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 rounded text-[10px] font-mono border border-rose-500/10"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded text-[10px] font-mono border border-white/10"
                          >
                            Apply
                          </button>
                        )}
                      </form>
                      {couponError && <p className="text-rose-400 font-mono text-[10px] mt-1">{couponError}</p>}
                      {couponSuccess && <p className="text-emerald-400 font-mono text-[10px] mt-1">{couponSuccess}</p>}
                    </div>

                    {/* Form Fields  */}
                    <form onSubmit={handleSubmitProof} className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="block text-zinc-500 mb-0.5 uppercase text-[9px]">Account Email (for Membership Access):</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your_email@example.com"
                          className="w-full bg-zinc-900 border border-white/10 rounded py-1.5 px-2.5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-zinc-500 mb-0.5 uppercase text-[9px]">Sender UPI Handle:</label>
                          <input
                            type="text"
                            required
                            value={userUpi}
                            onChange={(e) => setUserUpi(e.target.value)}
                            placeholder="e.g. name@paytm"
                            className="w-full bg-zinc-900 border border-white/10 rounded py-1.5 px-2.5 text-white placeholder:text-zinc-700 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-500 mb-0.5 uppercase text-[9px]">UPI Ref / UTR Ref No (12 Digits):</label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. UTR ID / Reference No"
                            className="w-full bg-zinc-900 border border-white/10 rounded py-1.5 px-2.5 text-white placeholder:text-zinc-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-500 mb-0.5 uppercase text-[9px]">Attach Payment Screenshot Image:</label>
                        <input
                          type="file"
                          required
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-zinc-500 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-white file:text-black hover:file:bg-zinc-200 text-[10px] file:cursor-pointer"
                        />
                        {screenshot && (
                          <span className="inline-block mt-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded uppercase font-semibold">
                            Receipt attached
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-white hover:bg-zinc-200 text-black font-display font-bold uppercase tracking-wider py-3 text-xs rounded transition-all cursor-pointer"
                        id="membership_checkout_submit_btn"
                      >
                        {isSubmitting ? 'PROCESSING...' : 'TRANSLATE TRANSFER PROOF'}
                      </button>
                    </form>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
