import React, { useState } from 'react';

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
  // --- STATE 1: FOR TESTIMONIALS SLIDER ---
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // --- STATE 2: FOR INFO TABS ---
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <main id="main-content" className="font-sans text-gray-900 bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Secure Your Health with <br />
              <span className="text-[#1A5EDB]">Flexible & Affordable Plans</span>
            </h1>
            <p className="text-lg mt-6 text-gray-600 max-w-lg mx-auto md:mx-0">
              Protect your loved ones with our easy claim process, wide coverage, and 24/7 support.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              <button className="px-8 py-3.5 bg-[#1A5EDB] text-white rounded-xl text-lg font-semibold hover:bg-[#1149AE] hover:shadow-lg transition transform hover:-translate-y-1">
                Explore Plans
              </button>
              <button className="px-8 py-3.5 border-2 border-[#1A5EDB] text-[#1A5EDB] rounded-xl text-lg font-semibold hover:bg-blue-50 transition">
                Customize Plan
              </button>
            </div>
          </div>
          <div className="flex justify-center relative">
             {/* Decorative blob */}
             <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <img
              src="./images/hero_section/shield.png"
              alt="Health Insurance Protection Shield"
              className="w-72 md:w-96 relative z-10 drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Trusted by Thousands</h2>
          <p className="text-gray-500 mt-2">Our numbers speak for our commitment</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { img: "./images/TRUSTED_STATS/star.png", val: "98.7%", label: "Claim Settlement Ratio" },
            { img: "./images/TRUSTED_STATS/shield.png", val: "4.9/5", label: "10,000+ Reviews" },
            { img: "./images/TRUSTED_STATS/clock.png", val: "6–12 hrs", label: "Fast Claim Approval" },
            { img: "./images/TRUSTED_STATS/hospital.png", val: "13,000+", label: "Network Hospitals" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <img src={stat.img} width="60" alt="" className="mb-4 object-contain" aria-hidden="true" />
              <p className="text-3xl font-bold text-[#1A5EDB]">{stat.val}</p>
              <p className="text-gray-600 mt-1 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6"><hr className="border-gray-200" /></div>

      {/* 3. PLANS SECTION */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-gray-900">Recommended Insurance Plans</h2>
           <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
             Choose from our carefully designed plans that suit different needs and budgets.
           </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* CARD 1 */}
          <article className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm hover:shadow-xl hover:border-[#1A5EDB] transition duration-300 flex flex-col group">
            <div className="h-20 flex items-center justify-center mb-6 bg-blue-50 rounded-2xl group-hover:bg-white transition">
              <img src="./images/RECOMMENDED_PLANS/basic.png" className="w-12" alt="Basic Care Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center text-gray-900">Basic Care Plan</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-1 bg-blue-50 py-1 px-3 rounded-full mx-auto w-fit">Starts @ ₹3 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Single Private AC Room</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> 13,000+ Cashless Hospitals</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Pre & Post Hospitalization</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Daycare Procedures</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-[#1A5EDB] text-white rounded-xl font-semibold hover:bg-[#1149AE] transition shadow-md">
              View Details
            </button>
          </article>

          {/* CARD 2 (Best Seller) */}
          <article className="border-2 border-[#1A5EDB] rounded-3xl p-6 bg-white shadow-lg hover:shadow-2xl transition duration-300 flex flex-col relative transform scale-105 md:scale-100 md:hover:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A5EDB] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
              Best Seller
            </div>
            <div className="h-20 flex items-center justify-center mb-6 bg-blue-50 rounded-2xl">
              <img src="./images/RECOMMENDED_PLANS/family_1.png" className="w-14" alt="Family Shield Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center text-gray-900">Family Shield Plan</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-1 bg-blue-50 py-1 px-3 rounded-full mx-auto w-fit">Starts @ ₹10 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Spouse + Children Covered</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Free Annual Health Checkup</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> No Claim Bonus Benefits</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Maternity Coverage Included</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-[#1A5EDB] text-white rounded-xl font-semibold hover:bg-[#1149AE] transition shadow-md">
              View Details
            </button>
          </article>

          {/* CARD 3 */}
          <article className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm hover:shadow-xl hover:border-[#1A5EDB] transition duration-300 flex flex-col group">
            <div className="h-20 flex items-center justify-center mb-6 bg-blue-50 rounded-2xl group-hover:bg-white transition">
              <img src="./images/RECOMMENDED_PLANS/Senior.png" className="w-16" alt="Senior Protect Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center text-gray-900">Senior Protect Plan</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-1 bg-blue-50 py-1 px-3 rounded-full mx-auto w-fit">Starts @ ₹5 Lakhs</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Special for 60+ Years</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Reduced Waiting Period</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Tele-OPD Consultation</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> No Sub-Limits</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-[#1A5EDB] text-white rounded-xl font-semibold hover:bg-[#1149AE] transition shadow-md">
              View Details
            </button>
          </article>

          {/* CARD 4 */}
          <article className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm hover:shadow-xl hover:border-[#1A5EDB] transition duration-300 flex flex-col group">
            <div className="h-20 flex items-center justify-center mb-6 bg-blue-50 rounded-2xl group-hover:bg-white transition">
              <img src="./images/RECOMMENDED_PLANS/di.png" className="w-14" alt="Universal Coverage Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center text-gray-900">Universal Coverage</h3>
              <p className="text-[#1A5EDB] text-center font-bold text-sm mt-1 bg-blue-50 py-1 px-3 rounded-full mx-auto w-fit">Up to ₹25L – 99Cr</p>
              <ul className="mt-6 text-gray-600 space-y-3 text-sm">
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> High Sum Insured Options</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Any Room Category</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Global Coverage Validity</li>
                <li className="flex gap-3"><span className="text-[#1A5EDB] font-bold">✔</span> Hospital Daily Cash</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 bg-[#1A5EDB] text-white rounded-xl font-semibold hover:bg-[#1149AE] transition shadow-md">
              View Details
            </button>
          </article>
        </div>
      </section>

      {/* 4. CUSTOMIZATION SECTION */}
      <section className="bg-blue-50 py-20 border-y border-blue-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 gap-12">
          <div>
            <span className="text-[#1A5EDB] font-bold tracking-wide uppercase text-sm">Flexible Options</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Customize Your Plan</h2>
            <p className="text-gray-600 mt-4 leading-relaxed text-lg">
              Create a policy that fits your lifestyle perfectly. Choose your base plan, add riders, and adjust your premium to suit your budget.
            </p>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "./images/CUSTOMIZATION_SECTION/room.png", text: "Room Rent Options" },
                { icon: "./images/CUSTOMIZATION_SECTION/maternity.png", text: "Maternity Add-ons" },
                { icon: "./images/CUSTOMIZATION_SECTION/cash.png", text: "Daily Hospital Cash" },
                { icon: "./images/CUSTOMIZATION_SECTION/care.png", text: "Unlimited Care" },
                { icon: "./images/RECOMMENDED_PLANS/globe.png", text: "Global Cover" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <img src={item.icon} className="w-8 h-8 object-contain" alt="" />
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-6 rotate-1 hover:rotate-0 transition duration-500">
              <img src="./images/CUSTOMIZATION_SECTION/CUSTOMIZATION_SECTION.png" className="w-full max-w-sm rounded-xl" alt="Customization Preview" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Why Choose Bharat Suraksha?</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">We are committed to providing the best insurance experience with transparency and care.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { img: "./images/BENEFITS_SECTION/mark.png", title: "Hassle-free Claims", desc: "Cashless claims at all network hospitals." },
            { img: "./images/BENEFITS_SECTION/comment.png", title: "Real-time Updates", desc: "Instant SMS/Email alerts on claim status." },
            { img: "./images/BENEFITS_SECTION/team.png", title: "24/7 Support", desc: "Dedicated team ready to help anytime." },
            { img: "./images/BENEFITS_SECTION/card.png", title: "Best Prices", desc: "Affordable premiums with flexible payment." }
          ].map((benefit, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition duration-300">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <img src={benefit.img} className="w-10 h-10 object-contain" alt="" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="bg-gradient-to-b from-[#E7F2FF] to-[#CBE4FF] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Customers Say 💬</h2>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative">
            {/* Review Content */}
            <div className={`flex flex-col items-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-24 h-24 rounded-full border-4 border-[#1A5EDB] p-1 mb-6 shadow-md">
                <img
                  src={currentReview.img}
                  alt={currentReview.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{currentReview.name}</h3>
              <div className="flex gap-1 my-3 text-yellow-400 text-lg">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-gray-600 text-lg italic leading-relaxed max-w-xl">
                "{currentReview.text}"
              </p>
            </div>

            {/* Nav Buttons (Absolute Positioned for cleaner look) */}
            <button 
              onClick={handlePrev} 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#1A5EDB] hover:bg-blue-50 transition cursor-pointer md:-left-14"
            >
              ❮
            </button>
            <button 
              onClick={handleNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-[#1A5EDB] hover:bg-blue-50 transition cursor-pointer md:-right-14"
            >
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* 7. INFO TABS SECTION */}
      <section className="max-w-5xl mx-auto py-20 px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-gray-200 pb-1">
             {Object.keys(TAB_CONTENT).map((key) => (
               <button
                 key={key}
                 onClick={() => setActiveTab(key)}
                 className={`px-6 py-3 text-lg font-medium transition-all duration-200 border-b-4 rounded-t-lg ${
                   activeTab === key 
                   ? 'border-[#1A5EDB] text-[#1A5EDB] bg-blue-50' 
                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                 }`}
               >
                 {TAB_CONTENT[key].title}
               </button>
             ))}
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 text-center md:text-left animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{TAB_CONTENT[activeTab].title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{TAB_CONTENT[activeTab].content}</p>
          </div>
      </section>

    </main>
  );
}

export default Home;