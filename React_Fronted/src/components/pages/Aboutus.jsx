import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- DATA: TERMS & DEFINITIONS ---
const TERMS_DATA = {
  intro: { title: "Introduction", content: "Health insurance is a simple way to protect yourself from high medical bills. When you are hospitalized or need treatment, your insurer pays the approved costs so you do not face financial stress. Example: If your hospital bill is ₹1,20,000, your insurance covers the allowed amount." },
  copay: { title: "Co-Payment", content: "You pay a fixed percentage of the bill (e.g., 10%), and the insurer pays the rest (90%). This usually helps lower your policy premium." },
  roomrent: { title: "Room Rent", content: "The daily room charge covered by your insurance. Some plans limit this to 1% of the Sum Insured per day, while others offer 'Any Room' benefits." },
  disease: { title: "Disease Wise Limits", content: "Some treatments (like Cataract, Kidney Stone removal) may have a fixed maximum payout limit, regardless of your total sum insured." },
  waiting: { title: "Waiting Periods", content: "A specific time period (usually 2-4 years) you must wait before claiming for pre-existing diseases like Diabetes or Thyroid." },
  prepost: { title: "Pre & Post Hospitalization", content: "Covers medical expenses incurred before admission (e.g., 30 days) and after discharge (e.g., 60 days), such as tests and medicines." },
  restoration: { title: "Restoration Benefit", content: "If you exhaust your entire Sum Insured during treatment, the insurer 'refills' the amount back to 100% for future claims in the same year." },
  daycare: { title: "Day-care Treatments", content: "Medical procedures that require less than 24 hours of hospitalization due to advanced technology (e.g., Cataract surgery, Dialysis)." },
  domiciliary: { title: "Domiciliary Expense", content: "Covers medical treatment taken at home if the patient’s condition prevents moving them to a hospital or if no hospital beds are available." },
  ncb: { title: "No Claim Bonus (NCB)", content: "A reward for a healthy year! Your coverage amount increases (e.g., by 50%) for every claim-free year at no extra cost." },
  checkups: { title: "Free Health Checkups", content: "Complimentary annual health checkups provided by the insurer to help you monitor your health status." },
  ayush: { title: "AYUSH Treatments", content: "Coverage for alternative treatments including Ayurveda, Yoga, Unani, Siddha, and Homeopathy at government-recognized centers." },
  maternity: { title: "Maternity Coverage", content: "Covers expenses related to pregnancy, delivery (normal or C-section), and newborn baby care. Usually comes with a waiting period." },
  consultations: { title: "Doctor Consultations", content: "Covers Out-Patient Department (OPD) costs for doctor visits and pharmacy bills, even without hospitalization." }
};

function Aboutus() {
  const [activeTab, setActiveTab] = useState('intro');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);


    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (event) => setPrefersReducedMotion(event.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }, []);

  

  return (
    <main id="main-content" className="bg-gray-50 text-gray-900 font-sans" role="main" tabIndex={-1}>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes floatSlow {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out both; }
        .animate-fade-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-float { animation: floatSlow 6s ease-in-out infinite; }

        .focus-ring:focus-visible {
          outline: 3px solid #1A5EDB;
          outline-offset: 3px;
          border-radius: 0.5rem;
        }

        .card-hover:hover { transform: translateY(-4px); }

        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #1A5EDB, #4A8EFF);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: #eef2ff; }
      `}</style>
      
      {/* 1. HERO SECTION */}
      <section className="bg-linear-to-br from-[#dfeaff] via-white to-[#b9d6ff] py-24 px-6 overflow-hidden" aria-labelledby="about-hero-heading">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Left Content */}
          <div className="relative z-10">
            <span className="bg-white text-[#1A5EDB] py-1 px-3 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm border border-blue-100">
              About Us
            </span>
            <h1 id="about-hero-heading" className={`mt-6 text-4xl md:text-5xl font-extrabold text-[#0f2c5c] leading-tight ${prefersReducedMotion ? '' : 'animate-fade-up'}`}>
              Making Healthcare <br/> <span className="text-gray-900">Simple & Accessible</span>
            </h1>
            <p className={`text-gray-700 mt-6 text-lg leading-relaxed max-w-xl ${prefersReducedMotion ? '' : 'animate-fade-up'}`} style={{ animationDelay: prefersReducedMotion ? '0ms' : '80ms' }}>
              Bharat Suraksha is dedicated to transparency. We offer flexible plans, affordable premiums, 
              and 100% cashless support so your family stays protected without financial worry.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/plans"
                className="inline-block px-8 py-3.5 bg-[#1A5EDB] text-white rounded-xl text-lg font-semibold hover:bg-[#1149AE] hover:shadow-lg transition transform hover:-translate-y-1 focus-ring"
                aria-label="Explore our health insurance plans"
              >
                Explore Plans
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center" aria-hidden="true">
            <div className={`bg-white rounded-3xl shadow-2xl p-6 border border-blue-100 ${prefersReducedMotion ? '' : 'animate-float'} ${prefersReducedMotion ? '' : 'hover:shadow-3xl'} transition duration-500`}>
              <img 
                src="./images/About_us/hero_shield_main.jpeg" 
                className="w-full max-w-sm rounded-xl object-cover" 
                alt="About Bharat Suraksha" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-24 px-6 text-center bg-white" aria-labelledby="our-story-heading">
        <h2 id="our-story-heading" className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Our Story 📘</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
          Bharat Suraksha was created to remove the confusion from insurance. 
          Today, we are a trusted partner for thousands of Indian families.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {/* Card 1 */}
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col items-center focus-ring" tabIndex={0}>
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <img src="./images/About_us/story_start.png" className="w-12 h-12 object-contain" alt="Founded" />
            </div>
            <h3 className="text-xl font-bold text-[#1A5EDB]">Founded in 2025</h3>
            <p className="mt-3 text-gray-600">Started with a simple belief: Every family deserves clear and honest guidance.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col items-center focus-ring" tabIndex={0}>
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
               <img src="./images/About_us/family.png" className="w-12 h-12 object-contain" alt="Families" />
            </div>
            <h3 className="text-xl font-bold text-[#1A5EDB]">500+ Families</h3>
            <p className="mt-3 text-gray-600">We are proud to support hundreds of families with plans that fit their specific lifestyles.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col items-center focus-ring" tabIndex={0}>
             <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
               <img src="./images/About_us/hospital_network.png" className="w-12 h-12 object-contain" alt="Hospitals" />
             </div>
            <h3 className="text-xl font-bold text-[#1A5EDB]">13,000+ Hospitals</h3>
            <p className="mt-3 text-gray-600">A massive cashless network ensuring you never have to pay out of pocket during emergencies.</p>
          </div>
        </div>
      </section>

      {/* 3. OUR MISSION & VALUES */}
      <section className="py-20 px-6 bg-[#0A2A5E] text-white" aria-labelledby="mission-values-heading">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 id="mission-values-heading" className="text-3xl md:text-4xl font-black text-white tracking-tight">Our Mission & Values 🎯</h2>
          <p className="mt-4 text-blue-100 leading-relaxed max-w-3xl mx-auto text-lg">
            Guided by clarity, honesty, and care. We put families first.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { icon: "🤝", title: "Trust First", text: "Honesty in every policy clause." },
            { icon: "💙", title: "Care Always", text: "Your well-being guides our decisions." },
            { icon: "🛡️", title: "Strong Protection", text: "Complete support for daily & emergency needs." },
            { icon: "📞", title: "Customer First", text: "24/7 quick response and smooth service." }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition focus-ring ${prefersReducedMotion ? '' : 'animate-fade-up'}`}
              style={{ animationDelay: prefersReducedMotion ? '0ms' : `${idx * 80}ms` }}
              tabIndex={0}
            >
              <div className="text-4xl mb-4" aria-hidden="true">{item.icon}</div>
              <h3 className="font-bold text-lg text-white">{item.title}</h3>
              <p className="text-blue-100 text-sm mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE */}
      <section className="py-24 px-6 bg-blue-50">
        <h2 className="text-3xl font-bold text-center text-[#1A5EDB]">Why Choose Us? 💙</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-14">
          {/* Mapped manually to handle mix of Emojis and Images correctly based on your files */}
          {[
            { type: 'emoji', src: "🏥", title: "Cashless Hospitals", desc: "15,000+ Network" },
            { type: 'emoji', src: "⚡", title: "Quick Claims", desc: "Fast approval process" },
            { type: 'emoji', src: "🤱", title: "Maternity", desc: "Mom & Baby cover" },
            { type: 'image', src: "./images/BENEFITS_SECTION/mark.png", title: "Hassle Free", desc: "Minimal paperwork" },
            { type: 'image', src: "./images/BENEFITS_SECTION/comment.png", title: "Real Updates", desc: "SMS/Email tracking" },
            { type: 'image', src: "./images/BENEFITS_SECTION/team.png", title: "24/7 Support", desc: "Always here for you" },
            { type: 'image', src: "./images/BENEFITS_SECTION/card.png", title: "Best Prices", desc: "Affordable premiums" },
            { type: 'emoji', src: "🛡️", title: "Extra Cover", desc: "Top-up options" }
          ].map((feature, index) => (
             <div
               key={index}
               className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-center flex flex-col items-center focus-ring"
               tabIndex={0}
             >
                <div className="h-16 flex items-center justify-center mb-3">
                    {feature.type === 'emoji' ? (
                        <span className="text-4xl">{feature.src}</span>
                    ) : (
                        <img src={feature.src} className="w-16 h-16 object-contain" alt={feature.title} />
                    )}
                </div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* 5. BY THE NUMBERS */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">By The Numbers 📊</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
               { label: "Claim Settlement", val: "97%" },
               { label: "Network Hospitals", val: "13K+" },
               { label: "Insured Families", val: "7K+" },
               { label: "Customer Rating", val: "4.9 ⭐" },
             ].map((stat, i) => (
               <div key={i}>
                 <p className="text-4xl font-extrabold text-[#1A5EDB]">{stat.val}</p>
                 <p className="text-gray-600 font-medium mt-1">{stat.label}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. HEALTH INSURANCE TERMS (TABS) */}
      <section className="py-24 px-6 bg-linear-to-b from-blue-50 to-white" aria-labelledby="terms-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="terms-heading" className="text-3xl font-bold text-[#1A5EDB] text-center mb-2">Health Insurance Terms 📘</h2>
          <p className="text-center text-gray-600 mb-10 text-lg">Understanding your policy made simple.</p>

          <div className="grid md:grid-cols-12 gap-8">
            {/* LEFT: Scrollable Buttons */}
            <div className="md:col-span-4 bg-white p-2 rounded-2xl shadow-lg border border-gray-100 h-96 overflow-y-auto custom-scrollbar">
              <ul className="space-y-1" role="tablist" aria-label="Insurance terms">
                {Object.keys(TERMS_DATA).map((key) => (
                  <li key={key}>
                    <button 
                      onClick={() => setActiveTab(key)}
                      className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-200 font-medium focus-ring ${
                        activeTab === key 
                        ? 'bg-[#1A5EDB] text-white shadow-md' 
                        : 'text-gray-600 hover:bg-blue-50'
                      }`}
                      role="tab"
                      aria-selected={activeTab === key}
                      aria-controls={`term-panel-${key}`}
                    >
                      {TERMS_DATA[key].title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: Dynamic Content Display */}
            <div className="md:col-span-8">
               <div
                 id={`term-panel-${activeTab}`}
                 role="tabpanel"
                 aria-live="polite"
                 className={`bg-white p-10 rounded-3xl shadow-xl border border-blue-100 h-full flex flex-col justify-center ${prefersReducedMotion ? '' : 'animate-fade-in'}`}
               >
                  <span className="text-6xl mb-4 opacity-20" aria-hidden="true">❝</span>
                  <h3 className="text-3xl font-bold text-[#1A5EDB] mb-4">
                    {TERMS_DATA[activeTab].title}
                  </h3>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    {TERMS_DATA[activeTab].content}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. POLICY SUMMARY */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900">Policy Summary & Exclusions 📄</h2>
          
          <div className="mt-10 grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-bold text-[#1A5EDB] mb-4">What We Cover ✅</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3"><span className="text-green-500">✔</span> Hospitalization (Room, ICU, Nursing)</li>
                <li className="flex gap-3"><span className="text-green-500">✔</span> Day-care Treatments (under 24 hrs)</li>
                <li className="flex gap-3"><span className="text-green-500">✔</span> Pre & Post Hospitalization expenses</li>
                <li className="flex gap-3"><span className="text-green-500">✔</span> Ambulance Charges</li>
                <li className="flex gap-3"><span className="text-green-500">✔</span> AYUSH Treatment</li>
              </ul>
            </div>
            
            <div>
               <h3 className="text-xl font-bold text-red-500 mb-4">What’s Not Covered ❌</h3>
               <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3"><span className="text-red-400">✖</span> Cosmetic Surgeries</li>
                <li className="flex gap-3"><span className="text-red-400">✖</span> Self-inflicted injuries / Suicide</li>
                <li className="flex gap-3"><span className="text-red-400">✖</span> Unproven/Experimental treatments</li>
                <li className="flex gap-3"><span className="text-red-400">✖</span> Drug/Alcohol abuse related issues</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mt-12 text-center">
            <h3 className="text-xl font-bold text-[#1A5EDB]">Ready to secure your future?</h3>
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-3 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition shadow-md">
                Download Policy PDF
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Aboutus;