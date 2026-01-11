import React, { useState } from 'react';

function Home() {
  // --- STATE 1: FOR TESTIMONIALS SLIDER ---
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Your specific testimonial data
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
    }, 150); // Small delay for fade effect
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAnimating(false);
    }, 150);
  };

  const currentReview = testimonials[currentReviewIndex];

  // --- STATE 2: FOR INFO TABS (Intro/Eligibility/Documents) ---
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <main id="main-content">
      
      {/* 1. HERO SECTION */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#000000]">
              Secure Your Health with <br /> Flexible & Affordable Insurance Plans
            </h1>
            <p className="text-lg mt-4 text-gray-600">
              Protect your loved ones with our easy claim process and wide plan coverage
            </p>
            <div className="flex flex-wrap gap-5 mt-6">
              <button className="px-6 py-3 bg-[#1A5EDB] text-white rounded-lg text-lg hover:bg-[#1149AE] transition">
                Explore Plans
              </button>
              <button className="px-6 py-3 border border-[#1A5EDB] text-[#1A5EDB] rounded-lg text-lg hover:bg-blue-100 transition outline-2">
                Customize Your Plan
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="./images/hero_section/shield.png"
              alt="Illustration of shield representing health insurance protection"
              className="w-72 md:w-80"
            />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Trusted by Thousands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="flex flex-col items-center text-center">
            <img src="./images/TRUSTED_STATS/star.png" width="90" alt="" aria-hidden="true" />
            <p className="text-4xl font-bold text-[#1A5EDB]">98.7%</p>
            <p className="text-gray-600 mt-2">Claim Settlement Ratio</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="./images/TRUSTED_STATS/shield.png" width="90" alt="" aria-hidden="true" />
            <p className="text-4xl font-bold text-[#1A5EDB] mt-2">4.9/5</p>
            <p className="text-gray-600 mt-1">10,000+ Customer Reviews</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="./images/TRUSTED_STATS/clock.png" width="60" alt="" aria-hidden="true" />
            <p className="text-4xl font-bold text-[#1A5EDB]">6–12 hrs</p>
            <p className="text-gray-600 mt-2">Fast Claim Approval</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <img src="./images/TRUSTED_STATS/hospital.png" width="60" alt="" aria-hidden="true" />
            <p className="text-4xl font-bold text-[#1A5EDB]">13,000+</p>
            <p className="text-gray-600 mt-2">Network Hospitals</p>
          </div>
        </div>
      </section>

      <hr className="outline-1 border-[#1A5EDB] outline-[#1A5EDB]" />

      {/* 3. PLANS SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center">Recommended Insurance Plans</h2>
        <p className="text-center text-gray-500 mt-2">
          Choose From Our Carefully Designed Plans That Suit Different Needs And Budgets
        </p>

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          {/* CARD 1 */}
          <article className="border-2 border-[#1A5EDB] rounded-2xl p-6 bg-white shadow hover:shadow-xl transition duration-300 flex flex-col">
            <div className="h-24 flex items-center justify-center mb-4">
              <img src="./images/RECOMMENDED_PLANS/basic.png" className="w-14" alt="Basic Care Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center">Basic Care Plan</h3>
              <p className="text-[#1A5EDB] text-center font-semibold mt-1">Starts from ₹3 Lakhs</p>
              <ul className="mt-4 text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB] text-lg">✔</span><span>Starting at ₹3 Lakhs</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB] text-lg">✔</span><span>Room rent: Single Private AC</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB] text-lg">✔</span><span>Cashless hospitals: 13,000+</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB] text-lg">✔</span><span>Pre & post hospitalization covered</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB] text-lg">✔</span><span>Daycare procedures covered</span></li>
              </ul>
            </div>
            <button className="mt-auto w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
              View Details
            </button>
          </article>

          {/* CARD 2 */}
          <article className="border-2 border-[#1A5EDB] rounded-2xl p-6 bg-white shadow hover:shadow-xl transition duration-300 flex flex-col relative">
            <div className="BestSeller absolute -top-3 left-[150px] bg-[#1A5EDB] text-white w-[90px] h- border-2 border-[#1A5EDB] rounded-[10px] flex justify-center items-center">
              Best Seller
            </div>
            <div className="h-24 flex items-center justify-center mb-4">
              <img src="./images/RECOMMENDED_PLANS/family_1.png" className="w-16" alt="Family Shield Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center">Family Shield Plan</h3>
              <p className="text-[#1A5EDB] text-center font-semibold mt-1">Starts from ₹10 Lakhs</p>
              <ul className="mt-4 text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Coverage up to ₹10 Lakhs</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Covers spouse + children</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Free annual health checkup</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>No claim bonus benefits</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Maternity coverage included</span></li>
              </ul>
            </div>
            <button className="mt-auto w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
              View Details
            </button>
          </article>

          {/* CARD 3 */}
          <article className="border-2 border-[#1A5EDB] rounded-2xl p-6 bg-white shadow hover:shadow-xl transition duration-300 flex flex-col">
            <div className="h-24 flex items-center justify-center mb-4">
              <img src="./images/RECOMMENDED_PLANS/Senior.png" className="w-24" alt="Senior Protect Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center">Senior Protect Plan</h3>
              <p className="text-[#1A5EDB] text-center font-semibold mt-1">Starts from ₹5 Lakhs</p>
              <ul className="mt-4 text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Special for 60+ years</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Reduced waiting period</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Tele-OPD Consultation</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Pre-existing diseases covered from 31st day</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>No Sub-Limits</span></li>
              </ul>
            </div>
            <button className="mt-auto w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
              View Details
            </button>
          </article>

          {/* CARD 4 */}
          <article className="border-2 border-[#1A5EDB] rounded-2xl p-6 bg-white shadow hover:shadow-xl transition duration-300 flex flex-col">
            <div className="h-24 flex items-center justify-center mb-4">
              <img src="./images/RECOMMENDED_PLANS/di.png" className="w-17" alt="Universal Coverage Plan" />
            </div>
            <div className="flex flex-col grow">
              <h3 className="text-xl font-bold text-center">Universal Coverage</h3>
              <p className="text-[#1A5EDB] text-center font-semibold mt-1">Up to ₹25L – 99Cr</p>
              <ul className="mt-4 text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>₹25 Lakhs – 99Cr Coverage</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Any room category</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Inbuilt unlimited care</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Hospital Daily Cash Benefit</span></li>
                <li className="flex items-start gap-2"><span className="text-[#1A5EDB]">✔</span><span>Worldwide validity</span></li>
              </ul>
            </div>
            <button className="mt-auto w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
              View Details
            </button>
          </article>
        </div>
      </section>

      {/* 4. CUSTOMIZATION SECTION */}
      <section className="bg-[#CFE6FF] py-16 border-[#1A5EDB] border-2">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-black">Customize Your Health Insurance Plan</h2>
            <p className="text-gray-700 mt-3 leading-relaxed">
              Create a policy that fits your needs. Choose your base plan, add-ons, riders, and adjust your premium.
            </p>
            <p className="font-semibold text-xl mt-8 mb-4">Customize with:</p>
            <ul className="space-y-6 text-lg text-gray-800">
              <li className="flex items-center gap-3 ml-5"><img src="./images/CUSTOMIZATION_SECTION/room.png" className="w-8" alt="" />Room Rent Options </li>
              <li className="flex items-center gap-3 ml-5"><img src="./images/CUSTOMIZATION_SECTION/maternity.png" className="w-8" alt="" />Maternity & Newborn Add-ons</li>
              <li className="flex items-center gap-3 ml-5"><img src="./images/CUSTOMIZATION_SECTION/cash.png" className="w-8" alt="" />Daily Hospital Cash</li>
              <li className="flex items-center gap-3 ml-5"><img src="./images/CUSTOMIZATION_SECTION/care.png " className="w-8" alt="" />Unlimited Care</li>
              <li className="flex items-center gap-3 ml-5"><img src="./images/RECOMMENDED_PLANS/globe.png" className="w-8" alt="" />Global Cover</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <img src="./images/CUSTOMIZATION_SECTION/CUSTOMIZATION_SECTION.png" className="w-80" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-10 p-4">
          <h2 className="text-4xl font-bold text-black">Why Choose Bharat Suraksha</h2>
          <p className="mt-3">We're committed to providing the best insurance experience</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="w-20 h-20 bg-[#1A5EDB] rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="./images/BENEFITS_SECTION/mark.png" className="w-10" alt="" />
            </div>
            <p className="text-gray-700 text-sm leading-tight">Hassle-free cashless <br />claims at all our <br />network hospitals</p>
          </div>
          <div>
            <div className="flex items-center justify-center mx-auto mb-4">
              <img src="./images/BENEFITS_SECTION/comment.png" className="w-20" alt="" />
            </div>
            <p className="text-gray-700 text-sm leading-tight">Real-time updates on <br />your claim status and <br />policy details</p>
          </div>
          <div>
            <div className="flex items-center justify-center mx-auto mb-4">
              <img src="./images/BENEFITS_SECTION/team.png" className="w-20" alt="" />
            </div>
            <p className="text-gray-700 text-sm leading-tight">24/7 support team ready <br />to help you with any <br />queries</p>
          </div>
          <div>
            <div className="flex items-center justify-center mx-auto mb-4">
              <img src="./images/BENEFITS_SECTION/card.png" className="w-20" alt="" />
            </div>
            <p className="text-gray-700 text-sm leading-tight">Best prices in the <br />market with flexible <br />payment options</p>
          </div>
        </div>
      </section>

      <hr className="outline-1 outline-[#1A5EDB]" />

      {/* 6. CUSTOMER REVIEWS SECTION (Dynamic) */}
      <section className="bg-gradient-to-b from-[#DDF0FF] to-[#B3DAFF] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-black mb-12">
            What Our Customers Say
          </h2>

          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl mx-auto">
            <div className={`flex flex-col items-center transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              
              <div className="w-28 h-28 rounded-full relative mb-6 flex items-center justify-center shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 rounded-full border-4 border-[#3171FF] shadow-[0_0_20px_#3b82f6aa]"></div>
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={currentReview.img}
                    alt={currentReview.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800">
                {currentReview.name}
              </h3>
              
              <p className="mt-4 text-gray-600 leading-relaxed max-w-xl italic">
                "{currentReview.text}"
              </p>

            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              className="w-12 h-12 bg-[#3171FF] text-white rounded-full flex items-center justify-center text-2xl hover:bg-[#1E5CE5] transition shadow-md hover:shadow-xl cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 bg-[#3171FF] text-white rounded-full flex items-center justify-center text-2xl hover:bg-[#1E5CE5] transition shadow-md hover:shadow-xl cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* 7. TERMS / INFO SECTION (Dynamic Tabs) */}
      <section className="max-w-5xl mx-auto py-16 px-6">
          <div className="flex justify-center gap-8 mb-8 border-b border-gray-200 pb-4">
              <button 
                onClick={() => setActiveTab('intro')}
                className={`text-lg transition-colors ${activeTab === 'intro' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
              >
                Introduction
              </button>
              <button 
                onClick={() => setActiveTab('eligibility')}
                className={`text-lg transition-colors ${activeTab === 'eligibility' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
              >
                Eligibility
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`text-lg transition-colors ${activeTab === 'documents' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-400'}`}
              >
                Documents
              </button>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 min-h-[150px]">
              {activeTab === 'intro' && (
                  <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Policy Introduction</h3>
                      <p className="text-gray-700">Bharat Suraksha provides comprehensive coverage designed to protect your family's future. (This content appears when "Introduction" is active).</p>
                  </div>
              )}

              {activeTab === 'eligibility' && (
                  <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Eligibility Criteria</h3>
                      <p className="text-gray-700">Adults aged 18-65 years are eligible. Dependent children can be covered from 90 days to 25 years.</p>
                  </div>
              )}

              {activeTab === 'documents' && (
                  <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Required Documents</h3>
                      <p className="text-gray-700">You will need KYC documents (Aadhar/PAN), previous medical records (if any), and a passport-sized photograph.</p>
                  </div>
              )}
          </div>
      </section>

    </main>
  );
}

export default Home;