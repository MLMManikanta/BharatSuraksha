import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- DATA: TERMS TABS CONTENT ---
const TAB_CONTENT = {
  intro: {
    title: "Policy Introduction",
    content: "Bharat Suraksha provides comprehensive coverage designed to protect your family's future. Our plans are crafted to offer financial security against rising medical costs."
  },
  eligibility: {
    title: "Eligibility Criteria",
    content: "Adults aged 18-65 years are eligible. Dependent children can be covered from 90 days to 25 years. Senior citizen plans are available for those above 60."
  },
  documents: {
    title: "Required Documents",
    content: "You will need KYC documents (Aadhar/PAN), previous medical records (if any), and a recent passport-sized photograph for policy issuance."
  }
};

function Home() {
  const navigate = useNavigate();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const testimonials = [
    {
      name: "Maruthi Gupta",
      text: "My premium got waived off because of Health Returns. Very satisfied with the benefits!",
      img: "./images/Customer_rating/Customer_rating1.png"
    },
    {
      name: "Harshitha",
      text: "My maternity expenses were covered smoothly. The policy really helped my family during delivery.",
      img: "./images/Customer_rating/Customer_rating2.png"
    },
    {
      name: "Ravi Kumar",
      text: "I received health insurance without any waiting periods. Great support and quick approval!",
      img: "./images/Customer_rating/Customer_rating3.png"
    }
  ];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 150);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 150);
  };

  const currentReview = testimonials[currentReviewIndex];

  const [activeTab, setActiveTab] = useState('intro');

  return (
    isLoading ? (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#1A5EDB] rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading Bharat Suraksha...</p>
        </div>
      </div>
    ) : (
      <main id="main-content" className="font-sans text-gray-900 bg-white" role="main">
        <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(1.5rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-1.5rem);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(1.5rem);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(2rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .hero-title {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
          }

          .hero-subtitle {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
          }

          .hero-buttons {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
          }

          .hero-image {
            animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
          }

          .stat-card {
            animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .plan-card {
            animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .benefit-item {
            animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Smooth interactions */
          button, a {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          button:hover, a:hover {
            transform: translateY(-2px);
          }

          button:active, a:active {
            transform: translateY(0);
          }

          .card-hover:hover {
            transform: translateY(-4px);
          }
        }

        .focus-ring:focus-visible {
          outline: 3px solid #1A5EDB;
          outline-offset: 4px;
          border-radius: 0.375rem;
        }

        button:focus-visible {
          outline: 3px solid #1A5EDB;
          outline-offset: 4px;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <section className="bg-linear-to-br from-blue-50 via-white to-blue-50 py-24 px-6 overflow-hidden" aria-label="Hero section">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <div className="text-center md:text-left">
            <h1 className="hero-title text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 tracking-tight">
              Secure Your Health with <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF]">Flexible & Affordable Plans</span>
            </h1>
            <p className="hero-subtitle text-lg md:text-xl mt-8 text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Protect your loved ones with our easy claim process, wide coverage, and 24/7 support.
            </p>
            <div className="hero-buttons flex flex-wrap justify-center md:justify-start gap-4 mt-10">
              <button 
                onClick={() => navigate('/select-plan')}
                className="px-8 py-4 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white rounded-xl text-lg font-semibold hover:shadow-2xl shadow-lg focus-ring transition-all"
                aria-label="Explore plans"
              >
                Explore Plans
              </button>
              <button 
                onClick={() => navigate('/plan-review', { state: { selectedPlan: { name: 'vajra', isCustom: true }, fromHome: true } })}
                className="px-8 py-4 border-2 border-[#1A5EDB] text-[#1A5EDB] rounded-xl text-lg font-semibold hover:bg-blue-50 focus-ring transition-all"
                aria-label="Customize your plan"
              >
                Customize Plan
              </button>
            </div>
          </div>
          <div className="hero-image flex justify-center relative">
            <div className={`absolute top-10 right-10 w-64 h-64 bg-linear-to-br from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 ${prefersReducedMotion ? "" : "animate-pulse"}`}></div>
            <img
              src="./images/hero_section/shield.png"
              alt="Health insurance protection shield - symbolizing comprehensive coverage"
              className="w-72 md:w-96 relative z-10 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-linear-to-b from-[#F0F6FF] to-white" aria-label="Statistics">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Trusted by Thousands</h2>
          <p className="text-lg text-gray-500">Our numbers speak for our commitment</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { img: "./images/TRUSTED_STATS/star.png", val: "98.7%", label: "Claim Settlement Ratio" },
            { img: "./images/TRUSTED_STATS/shield.png", val: "4.9/5", label: "10,000+ Reviews" },
            { img: "./images/TRUSTED_STATS/clock.png", val: "6–12 hrs", label: "Fast Claim Approval" },
            { img: "./images/TRUSTED_STATS/hospital.png", val: "13,000+", label: "Network Hospitals" }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="stat-card flex flex-col items-center text-center p-7 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:border-[#1A5EDB] border-2 border-transparent transition-all duration-300 card-hover cursor-pointer group"
              role="article"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && null}
            >
              <div className="w-20 h-20 bg-linear-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-5 group-hover:from-[#1A5EDB] group-hover:to-[#4A8EFF] transition-all">
                <img src={stat.img} width="48" alt="" className="object-contain" aria-hidden="true" />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] bg-clip-text text-transparent">{stat.val}</p>
              <p className="text-gray-600 mt-2 text-base font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><hr className="border-gray-200" /></div>

      <section className="max-w-7xl mx-auto py-24 px-6" aria-label="Insurance plans">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Recommended Insurance Plans</h2>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
             Choose from our carefully designed plans that suit different needs and budgets.
           </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8" role="list">
          <article 
            className="plan-card border-2 border-gray-200 rounded-3xl p-7 bg-white shadow-lg hover:shadow-2xl hover:border-[#1A5EDB] transition-all duration-300 flex flex-col group card-hover"
            role="listitem"
          >
            <div className="h-24 flex items-center justify-center mb-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-[#1A5EDB] group-hover:to-[#4A8EFF] transition-all">
              <img src="./images/RECOMMENDED_PLANS/basic.png" className="w-14" alt="" aria-hidden="true" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-extrabold text-center text-gray-900">Neev Suraksha</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-3 bg-blue-50 py-2 px-3 rounded-full mx-auto w-fit">Starts @ ₹3 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm" role="list">
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Single Private AC Room</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>13,000+ Cashless Hospitals</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Pre & Post Hospitalization</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Daycare Procedures</span></li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/plan-review', { state: { selectedPlan: { name: 'neev' }, fromHome: true } })}
              className="mt-8 w-full py-3 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white rounded-xl font-semibold hover:shadow-lg focus-ring transition-all"
              aria-label="View details for Neev Suraksha plan"
            >
              View Details
            </button>
          </article>

          <article 
            className="plan-card border-2 border-[#1A5EDB] rounded-3xl p-7 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col relative z-10 transform md:scale-100 md:hover:scale-105"
            role="listitem"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg">
              Best Seller
            </div>
              <div className="h-24 flex items-center justify-center mb-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl">
              <img src="./images/RECOMMENDED_PLANS/family_1.png" className="w-16" alt="" aria-hidden="true" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-extrabold text-center text-gray-900">Parivar Suraksha</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-3 bg-blue-50 py-2 px-3 rounded-full mx-auto w-fit">Starts @ ₹10 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm" role="list">
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Spouse + Children Covered</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Free Annual Health Checkup</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>No Claim Bonus Benefits</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Maternity Coverage Included</span></li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/plan-review', { state: { selectedPlan: { name: 'parivar' }, fromHome: true } })}
              className="mt-8 w-full py-3 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white rounded-xl font-semibold hover:shadow-lg focus-ring transition-all"
              aria-label="View details for Parivar Suraksha plan - our best seller"
            >
              View Details
            </button>
          </article>

          <article 
            className="plan-card border-2 border-gray-200 rounded-3xl p-7 bg-white shadow-lg hover:shadow-2xl hover:border-[#1A5EDB] transition-all duration-300 flex flex-col group card-hover"
            role="listitem"
          >
            <div className="h-24 flex items-center justify-center mb-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-[#1A5EDB] group-hover:to-[#4A8EFF] transition-all">
              <img src="./images/RECOMMENDED_PLANS/Senior.png" className="w-16" alt="" aria-hidden="true" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-extrabold text-center text-gray-900">Varishtha Suraksha</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-3 bg-blue-50 py-2 px-3 rounded-full mx-auto w-fit">Starts @ ₹5 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm" role="list">
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Special for 60+ Years</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Reduced Waiting Period</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Tele-OPD Consultation</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>No Sub-Limits</span></li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/plan-review', { state: { selectedPlan: { name: 'varishtha' }, fromHome: true } })}
              className="mt-8 w-full py-3 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white rounded-xl font-semibold hover:shadow-lg focus-ring transition-all"
              aria-label="View details for Varishtha Suraksha plan"
            >
              View Details
            </button>
          </article>

          <article 
            className="plan-card border-2 border-gray-200 rounded-3xl p-7 bg-white shadow-lg hover:shadow-2xl hover:border-[#1A5EDB] transition-all duration-300 flex flex-col group card-hover"
            role="listitem"
          >
            <div className="h-24 flex items-center justify-center mb-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-[#1A5EDB] group-hover:to-[#4A8EFF] transition-all">
              <img src="./images/RECOMMENDED_PLANS/di.png" className="w-14" alt="" aria-hidden="true" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-extrabold text-center text-gray-900">Vishwa Suraksha</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-3 bg-blue-50 py-2 px-3 rounded-full mx-auto w-fit">Up to ₹25L – 99Cr</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm" role="list">
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>High Sum Insured Options</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Any Room Category</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Global Coverage Validity</span></li>
                <li className="flex gap-3 items-start"><span className="text-[#1A5EDB] font-bold shrink-0 mt-0.5">✓</span> <span>Hospital Daily Cash</span></li>
              </ul>
            </div>
            <button 
              onClick={() => navigate('/plan-review', { state: { selectedPlan: { name: 'vishwa' }, fromHome: true } })}
              className="mt-8 w-full py-3 bg-linear-to-r from-[#1A5EDB] to-[#4A8EFF] text-white rounded-xl font-semibold hover:shadow-lg focus-ring transition-all"
              aria-label="View details for Vishwa Suraksha plan"
            >
              View Details
            </button>
          </article>
        </div>
      </section>

      <section className="bg-linear-to-b from-blue-50 to-white py-24 border-y-2 border-blue-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 gap-16">
          <div>
            <span className="text-[#1A5EDB] font-bold tracking-widest uppercase text-sm">Flexible Options</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-6">Customize Your Plan</h2>
            <p className="text-gray-600 mt-6 leading-relaxed text-lg">
              Create a policy that fits your lifestyle perfectly. Choose your base plan, add riders, and adjust your premium to suit your budget.
            </p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "./images/CUSTOMIZATION_SECTION/room.png", text: "Room Rent Options" },
                { icon: "./images/CUSTOMIZATION_SECTION/maternity.png", text: "Maternity Add-ons" },
                { icon: "./images/CUSTOMIZATION_SECTION/cash.png", text: "Daily Hospital Cash" },
                { icon: "./images/CUSTOMIZATION_SECTION/care.png", text: "Unlimited Care" },
                { icon: "./images/RECOMMENDED_PLANS/globe.png", text: "Global Cover" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="benefit-item flex items-center gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-[#1A5EDB] transition-all card-hover"
                  role="article"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && null}
                >
                  <div className="shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <img src={item.icon} className="w-6 h-6 object-contain" alt="" aria-hidden="true" />
                  </div>
                  <span className="font-semibold text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className={`bg-white rounded-3xl shadow-2xl p-8 ${prefersReducedMotion ? "" : "hover:shadow-3xl transition-all duration-500 hover:-rotate-1"}`}>
              <img 
                src="./images/CUSTOMIZATION_SECTION/CUSTOMIZATION_SECTION.png" 
                className="w-full max-w-sm rounded-2xl shadow-md" 
                alt="Customization options preview showing plan selection interface"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-24 px-6" aria-label="Why choose us">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Why Choose Bharat Suraksha?</h2>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">We are committed to providing the best insurance experience with transparency and care.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
          {[
            { img: "./images/BENEFITS_SECTION/mark.png", title: "Hassle-free Claims", desc: "Cashless claims at all network hospitals." },
            { img: "./images/BENEFITS_SECTION/comment.png", title: "Real-time Updates", desc: "Instant SMS/Email alerts on claim status." },
            { img: "./images/BENEFITS_SECTION/team.png", title: "24/7 Support", desc: "Dedicated team ready to help anytime." },
            { img: "./images/BENEFITS_SECTION/card.png", title: "Best Prices", desc: "Affordable premiums with flexible payment." }
          ].map((benefit, idx) => (
            <div 
              key={idx} 
              className="benefit-item flex flex-col items-center text-center p-7 rounded-2xl hover:bg-linear-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 card-hover cursor-pointer group"
              role="listitem"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && null}
            >
              <div className="w-20 h-20 bg-linear-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:from-[#1A5EDB] group-hover:to-[#4A8EFF] group-hover:shadow-lg transition-all">
                <img src={benefit.img} className="w-10 h-10 object-contain" alt="" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#1A5EDB] transition-colors">{benefit.title}</h3>
              <p className="text-gray-500 text-base mt-3 leading-relaxed group-hover:text-gray-700 transition-colors">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-b from-[#E7F2FF] to-white py-28" aria-label="Customer testimonials">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-16">What Our Customers Say</h2>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 relative">
            <div 
              className={`flex flex-col items-center transition-all duration-300 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              role="article"
              aria-live="polite"
              aria-label={`Customer testimonial from ${currentReview.name}`}
            >
              <div className="w-32 h-32 rounded-full border-4 border-[#1A5EDB] p-1 mb-8 shadow-lg hover:shadow-xl transition-shadow shrink-0">
                <img
                  src={currentReview.img}
                  alt={currentReview.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{currentReview.name}</h3>
              <div className="flex gap-1 justify-center my-4 text-yellow-400 text-2xl" role="img" aria-label="5 out of 5 stars">
                {Array(5).fill('★').map((star, i) => <span key={i}>{star}</span>)}
              </div>
              <p className="text-gray-600 text-lg italic leading-relaxed max-w-xl">
                "{currentReview.text}"
              </p>
            </div>

            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1A5EDB] hover:bg-blue-50 focus-ring transition-all md:-left-16"
              aria-label={`Previous testimonial - currently viewing testimonial ${currentReviewIndex + 1} of ${testimonials.length}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#1A5EDB] hover:bg-blue-50 focus-ring transition-all md:-right-16"
              aria-label={`Next testimonial - currently viewing testimonial ${currentReviewIndex + 1} of ${testimonials.length}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex justify-center gap-3 mt-10" role="tablist" aria-label="Testimonial selection">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentReviewIndex 
                      ? 'bg-[#1A5EDB] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentReviewIndex(idx);
                      setIsAnimating(false);
                    }, 150);
                  }}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  role="tab"
                  aria-selected={idx === currentReviewIndex}
                  aria-controls="testimonial-content"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-24 px-6" aria-label="Policy information">
        <div className="flex flex-wrap justify-center gap-4 mb-10 border-b-2 border-gray-200 pb-2">
          {Object.keys(TAB_CONTENT).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-4 text-lg font-bold transition-all duration-300 border-b-4 rounded-t-lg focus-ring ${
                activeTab === key 
                  ? 'border-[#1A5EDB] text-[#1A5EDB] bg-blue-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              role="tab"
              aria-selected={activeTab === key}
              aria-controls="tab-content"
            >
              {TAB_CONTENT[key].title}
            </button>
          ))}
        </div>

        <div 
          id="tab-content"
          role="tabpanel"
          className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border-2 border-gray-100 text-center md:text-left animate-fade-in"
        >
          <h3 className="text-3xl font-extrabold text-gray-900 mb-6">{TAB_CONTENT[activeTab].title}</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{TAB_CONTENT[activeTab].content}</p>
        </div>
      </section>

    </main>
    )
  );
}

export default Home;