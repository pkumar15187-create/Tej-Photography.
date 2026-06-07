import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, Clock, CheckCircle } from 'lucide-react';

interface ContactProps {
  onSendMessage: (message: { name: string; email: string; message: string }) => void;
}

export default function Contact({ onSendMessage }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('All fields are mandatory. Please provide correct details.');
      return;
    }

    onSendMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="min-h-screen py-24 bg-neutral-950 font-sans" id="contact_studio_section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title labels */}
        <div className="text-center mb-16 animate-fade-in-up" id="contact_headings">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white">
            Connect With Tej
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-zinc-500 tracking-wide font-light">
            Inquire about fine-art prints, book portrait studio sessions, custom-sized gallery framing, or request special corporate rights licensing.
          </p>
          <div className="w-16 h-1 bg-white mx-auto mt-6" />
        </div>

        {/* Form responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Studio contact context details */}
          <div className="lg:col-span-5 bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between" id="studio_meta_card">
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-widest text-white">Studio Headquarters</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">Book an appointment or visit exhibition lounges</p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded text-zinc-400 mt-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-display select-none">Exhibition Address</h5>
                    <p className="text-zinc-400 mt-1 font-light leading-relaxed">
                      Studio 18, Block B, Connaught Place,<br />
                      New Delhi, 110001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded text-zinc-400 mt-1">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-display select-none">Electronic Mail (Direct)</h5>
                    <p className="text-zinc-400 mt-1 font-mono hover:text-white transition-colors cursor-pointer select-all">
                      contact@tejphotography.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded text-zinc-400 mt-1">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-display select-none">Studio Hotlines</h5>
                    <p className="text-zinc-400 mt-1 font-mono hover:text-white transition-colors cursor-pointer">
                      +91 7050831301
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded text-zinc-400 mt-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-display select-none">Exhibition Lounges Timing</h5>
                    <p className="text-zinc-400 mt-1 font-light">
                      Tuesday – Sunday: 11:00 AM – 07:00 PM<br />
                      Mondays: Closed (Studio Exploration Day)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5 text-[11px] leading-relaxed text-zinc-500 font-sans">
              All messages submitted are tracked transparently inside our local storage messaging logs. Rest assured, our studio management will reply to you within 24 business hours.
            </div>
          </div>

          {/* Right Column: Dynamic Contact Submission Form Form */}
          <div className="lg:col-span-7 bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-center" id="contact_form_container">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in-up" id="contact_success_badge">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-white">Message Logged Successfully</h3>
                <p className="text-zinc-400 text-xs font-mono max-w-md mx-auto leading-relaxed">
                  Thank you! Your message has been saved in the photographer control log. Head to the Admin panel to check or approve message tickets!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-2 font-sans select-none">
                  Request Custom Quote
                </h3>

                <div>
                  <label className="block text-zinc-400 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanshu Kumar"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Electronic Email Address:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Detail Inquiry / Message Content:</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your session specs, printing sizes, or feedback here..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-rose-400 font-mono text-xs">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-zinc-200 text-black py-4 text-xs font-bold font-display uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-4 flex items-center justify-center space-x-2"
                  id="submit_message_btn"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH MESSAGE INQUIRY</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
