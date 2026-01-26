import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomSelect from '../common/CustomSelect';

function ContactUs() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [queryType, setQueryType] = useState('');



  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    form.reset();
    setStatusMessage('Thank you! Your message has been sent. We will get back to you soon.');
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      // intentionally silent
    } catch (err) {
      // fail silently
    }
  };
  
  

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50 text-gray-900"
      role="main"
      tabIndex={-1}
    >
      <style>{`
        .focus-outline { outline: 2px solid #1A5EDB; outline-offset: 3px; }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-fade-up { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        .animate-soft { animation: softFade 0.5s ease forwards; opacity: 0; }
        .glass-card { backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.9); }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes softFade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-fade-up, .animate-soft { animation: none !important; opacity: 1 !important; }
          * { scroll-behavior: auto; }
        }
        .custom-scroll::-webkit-scrollbar { width: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1A5EDB; border-radius: 999px; }
        .custom-scroll::-webkit-scrollbar-track { background: #e5e7eb; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-50 ${prefersReducedMotion ? '' : 'animate-float'}`}></div>
        <div className={`absolute top-32 -right-10 h-64 w-64 rounded-full bg-indigo-100 blur-3xl opacity-40 ${prefersReducedMotion ? '' : 'animate-float'}`}></div>
      </div>
      
      {/* 1. HERO SECTION */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* LEFT TEXT */}
          <div className={prefersReducedMotion ? '' : 'animate-fade-up'}>
            <span className="bg-blue-100 text-[#1A5EDB] py-1 px-3 rounded-full text-sm font-semibold uppercase tracking-wide inline-flex items-center gap-2">
              24/7 Support
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              We're Here to
              <span className="text-[#1A5EDB] block">Help You! 👋</span>
            </h1>

            <p className="mt-6 text-gray-700 text-lg leading-relaxed max-w-xl">
              Whether you have questions about your policy, need assistance with claims,
              or want to locate a branch, our team is ready to support you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Contact quick actions">
              <a
                href="tel:9063807489"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-[#1A5EDB] text-white font-semibold shadow-lg transition hover:shadow-xl focus-visible:focus-outline"
              >
                <span aria-hidden="true"> 👤</span> Call Us Now
              </a>
              <a
                href="mailto:support@bharatsuraksha.com"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1A5EDB] text-[#1A5EDB] font-semibold bg-white transition hover:bg-blue-50 focus-visible:focus-outline"
              >
                <span aria-hidden="true">✉️</span> Email Support
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE (Placeholder Illustration) */}
          <div className="flex justify-center relative" aria-hidden="true">
            <div className={`absolute top-0 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 ${prefersReducedMotion ? '' : 'animate-float'}`}></div>
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative z-10 transform rotate-1 hover:rotate-0 transition duration-500">
               <img 
                src="/images/contact_us/support_team.jpeg"
                alt="Customer support team"
                className="rounded-2xl w-full h-72 object-cover shadow-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/contact_us/support_team_placeholder.svg'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REACH OUT CARDS SECTION */}
      <section className="max-w-7xl mx-auto -mt-12 px-6 relative z-20" aria-labelledby="reach-out-heading">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="reach-out-heading" className="text-2xl font-bold text-gray-900">Reach out your way</h2>
            <p className="text-gray-600">Choose the channel that suits you best.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Claims Card */}
          <div
            className={`glass-card p-8 rounded-2xl shadow-xl border border-blue-100 hover:-translate-y-2 transition-transform duration-300 focus-within:focus-outline ${prefersReducedMotion ? '' : 'animate-soft'}`}
            tabIndex={0}
            role="article"
            aria-label="Claims support"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB] text-2xl">
              📋
            </div>
            <h3 className="text-xl font-bold text-gray-900">Claims Support</h3>
            <p className="text-gray-600 mt-2 text-sm">Track existing claims or file a new one instantly.</p>
            <Link
              to="/claims"
              className="inline-flex items-center gap-2 mt-4 text-[#1A5EDB] font-semibold hover:underline focus-visible:focus-outline"
              aria-label="Go to claims"
            >
              Go to Claims →
            </Link>
          </div>

          {/* Call Us Card */}
          <div
            className={`glass-card p-8 rounded-2xl shadow-xl border border-blue-100 hover:-translate-y-2 transition-transform duration-300 focus-within:focus-outline ${prefersReducedMotion ? '' : 'animate-soft'}`}
            tabIndex={0}
            role="article"
            aria-label="Call us"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB] text-2xl">📞</div>
            <h3 className="text-xl font-bold text-gray-900">Call Us 24/7</h3>
            <p className="text-gray-600 mt-2 text-sm">Speak directly with our expert agents.</p>
            <button
              type="button"
              onClick={() => copyToClipboard('9063807489', 'Phone number')}
              className="inline-block mt-4 text-2xl font-bold text-[#1A5EDB] focus-visible:focus-outline"
              aria-label="Copy phone number"
            >
              90638 07489
            </button>
          </div>

          {/* Email Card */}
          <div
            className={`glass-card p-8 rounded-2xl shadow-xl border border-blue-100 hover:-translate-y-2 transition-transform duration-300 focus-within:focus-outline ${prefersReducedMotion ? '' : 'animate-soft'}`}
            tabIndex={0}
            role="article"
            aria-label="Email support"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB] text-2xl">✉️</div>
            <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
            <p className="text-gray-600 mt-2 text-sm">Get a response within 24 hours.</p>
            <button
              type="button"
              onClick={() => copyToClipboard('mlmmanikanta@outlook.com', 'Email')}
              className="inline-block mt-4 text-[#1A5EDB] font-semibold break-all focus-visible:focus-outline"
            >
              mlmmanikanta@outlook.com
            </button>
          </div>

        </div>
      </section>

      {/* 3. LOCATIONS SECTION */}
      <section className="max-w-7xl mx-auto mt-20 px-6" aria-labelledby="locations-heading">
        <div className="text-center mb-10">
          <h2 id="locations-heading" className="text-3xl font-bold text-gray-900">Find Us Nearby 📍</h2>
          <p className="text-gray-600 mt-2">Locate branches and hospitals in your area</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition focus-within:focus-outline" tabIndex={0} role="article" aria-label="Nearest branch locator">
            <div className="p-4 bg-blue-50 rounded-lg text-[#1A5EDB] mr-4 text-3xl">🏢</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Nearest Branch</h3>
              <p className="text-sm text-gray-500 mb-2">Visit us for face-to-face assistance</p>
              <Link to="/utilities/hospitals" className="text-[#1A5EDB] text-sm font-semibold hover:underline focus-visible:focus-outline">Locate Now</Link>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition focus-within:focus-outline" tabIndex={0} role="article" aria-label="Network hospitals locator">
            <div className="p-4 bg-blue-50 rounded-lg text-[#1A5EDB] mr-4 text-3xl">🚑</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Network Hospitals</h3>
              <p className="text-sm text-gray-500 mb-2">Find cashless hospitals nearby</p>
              <Link to="/utilities/hospitals" className="text-[#1A5EDB] text-sm font-semibold hover:underline focus-visible:focus-outline">Locate Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT FORM SECTION */}
      <section className="max-w-4xl mx-auto mt-24 mb-20 px-6" aria-labelledby="contact-form-heading">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-50">
          <div className="bg-[#1A5EDB] py-6 text-center px-4">
            <h2 id="contact-form-heading" className="text-3xl font-bold text-white">Write to Us ✍️</h2>
            <p className="text-blue-100 mt-1">Fill out the form below and we will get back to you.</p>
          </div>

          <form className="p-8 md:p-12 space-y-6 custom-scroll" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
                <input 
                  id="name" 
                  name="name"
                  type="text" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="e.g. Rahul Kumar" 
                  aria-required="true"
                />
              </div>

              {/* PHONE */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                <input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="+91 98765 43210" 
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                <input 
                  id="email" 
                  name="email"
                  type="email" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="you@example.com" 
                  aria-required="true"
                />
              </div>

              {/* QUERY TYPE */}
              <div>
                <label htmlFor="queryType" className="block text-sm font-semibold text-gray-800 mb-2">Query Type</label>
                <CustomSelect
                  value={queryType}
                  onChange={(v) => setQueryType(v)}
                  options={["Claim Issue", "Policy Update", "New Policy Inquiry", "Branch Info"]}
                  placeholder="Select Query Type"
                  className="w-full"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">Your Message</label>
              <textarea 
                id="message" 
                name="message"
                rows="4" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                placeholder="How can we help you today?"
                aria-required="false"
              ></textarea>
            </div>

            {/*  SUBMIT */}
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <button 
                type="submit" 
                className="w-full py-3 bg-[#1A5EDB] text-white rounded-lg font-bold text-lg hover:bg-[#114BB7] active:scale-95 transition shadow-lg hover:shadow-xl focus-visible:focus-outline"
              >
                Submit Request
              </button>
              {statusMessage && (
                <p className="md:col-span-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3" aria-live="polite">
                  {statusMessage}
                </p>
              )}
            </div>

          </form>
        </div>
      </section>

    </main>
  );
}

export default ContactUs;