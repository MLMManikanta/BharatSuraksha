import { useState, useEffect } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "FAQs | Bharat Suraksha";
  }, []);

  // Expanded Data Structure
  const faqData = [
    { 
      category: "General", 
      q: "What is Bharat Suraksha?", 
      a: "Bharat Suraksha is a digital-first insurance aggregator platform. We provide comprehensive health, life, and motor insurance solutions across India, partnering with top-tier IRDAI-approved insurers." 
    },
    { 
      category: "General", 
      q: "How do I choose the right plan?", 
      a: "We recommend using our AI-driven 'Plan Recommender' tool on the homepage. Alternatively, you can schedule a free consultation with our certified experts at +91 90638 07489." 
    },
    { 
      category: "Claims", 
      q: "How long does a claim settlement take?", 
      a: "Timelines depend on the claim type. Cashless claims are typically authorized within 2-4 hours at network hospitals. Reimbursement claims generally take 7-10 working days after document submission." 
    },
    { 
      category: "Claims", 
      q: "Is COVID-19 hospitalization covered?", 
      a: "Yes, all our standard comprehensive health insurance plans cover hospitalization expenses arising from COVID-19, subject to the policy's specific waiting periods." 
    },
    { 
      category: "Policy", 
      q: "Can I add my parents to my existing plan?", 
      a: "Yes. You can add dependents (spouse, children, parents) either during the annual policy renewal period or by requesting a mid-term policy endorsement, depending on the insurer's rules." 
    },
    { 
      category: "Payments", 
      q: "What payment methods are accepted?", 
      a: "We accept a wide range of secure payment methods including UPI (GPay, PhonePe), Credit/Debit Cards (Visa, Rupay, Mastercard), Net Banking, and major digital wallets." 
    },
    { 
      category: "Policy", 
      q: "What happens if I miss my premium due date?", 
      a: "Most health policies offer a 'Grace Period' of 15 to 30 days. You are covered during this time, but if you fail to pay by the end of the grace period, the policy will lapse and you will lose all accumulated benefits like the No Claim Bonus." 
    },
    {
      category: "Claims",
      q: "What documents do I need for a reimbursement claim?",
      a: "You typically need: 1) Duly filled claim form, 2) Discharge summary, 3) Hospital bills & receipts, 4) Pharmacy bills with prescriptions, and 5) Diagnostic reports. Original copies are usually required."
    }
  ];

  const categories = ["All", "General", "Claims", "Policy", "Payments"];
  
  const filteredFaqs = faqData.filter(item => {
    const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* WCAG Skip Link */}
      <a href="#faq-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#1A5EDB] focus:text-white">
        Skip to main content
      </a>

      <main className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-24 px-6 text-center border-b-8 border-[#1A5EDB]">
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">
            How can we <span className="text-[#4A8EFF]">help?</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 text-xl group-focus-within:text-[#1A5EDB] transition-colors">🔍</span>
            </div>
            <input 
              type="text"
              aria-label="Search frequently asked questions"
              placeholder="Search topics like 'Claims' or 'Payments'..."
              className="w-full pl-12 pr-4 py-5 rounded-2xl text-lg font-medium text-slate-900 bg-white placeholder-slate-400 focus:ring-4 focus:ring-[#4A8EFF]/50 outline-none shadow-2xl transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div id="faq-content" className="max-w-4xl mx-auto py-16 px-6">
          
          {/* CATEGORY TABS */}
          <div 
            role="tablist" 
            className="flex flex-wrap justify-center gap-3 mb-16"
            aria-label="FAQ Categories"
          >
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                aria-controls={`panel-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#1A5EDB] ${
                  activeCategory === cat 
                  ? "bg-[#1A5EDB] text-white shadow-lg scale-105" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-black border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ACCORDION LIST */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    openIndex === index 
                    ? "border-[#1A5EDB] shadow-lg ring-1 ring-[#1A5EDB]/20" 
                    : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button 
                    className="w-full text-left p-6 flex justify-between items-center group outline-none focus-visible:bg-slate-50"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className={`text-lg font-bold transition-colors ${
                      openIndex === index ? "text-[#1A5EDB]" : "text-black group-hover:text-slate-700"
                    }`}>
                      {faq.q}
                    </span>
                    <span className={`transform transition-transform duration-300 text-[#1A5EDB] font-black text-xl ml-4 ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}>
                      ▼
                    </span>
                  </button>
                  
                  {/* Content with Animation */}
                  <div 
                    id={`faq-answer-${index}`}
                    className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-slate-800 text-base leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-3xl mb-2">🤔</p>
                <p className="text-black font-bold text-lg">No questions found.</p>
                <p className="text-slate-500">Try adjusting your search terms.</p>
              </div>
            )}
          </div>

          {/* HELP CARD */}
          <div className="mt-24 bg-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative Blur */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full -ml-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Still have questions?</h3>
              <p className="text-slate-300 mb-10 text-lg max-w-xl mx-auto">
                We're available 24/7. Reach out to our dedicated support team for personalized assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="tel:+919063807489" 
                  className="bg-[#1A5EDB] hover:bg-[#154bb0] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 focus-visible:ring-4 focus-visible:ring-blue-400 outline-none"
                >
                  Call +91 90638 07489
                </a>
                <a 
                  href="mailto:mlmmanikanta@outlook.com" 
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold transition-all shadow-lg focus-visible:ring-4 focus-visible:ring-white/50 outline-none"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default FAQ;