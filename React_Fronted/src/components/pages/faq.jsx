import { useState, useEffect } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "FAQs | Bharat Suraksha";
  }, []);

  // Sample of the 50-100 questions structure
  const faqData = [
    { category: "General", q: "What is Bharat Suraksha?", a: "Bharat Suraksha is a digital platform providing comprehensive health insurance solutions across India." },
    { category: "General", q: "How do I choose the right plan?", a: "You can use our 'Plan Recommender' tool or contact our experts at +91 90638 07489." },
    { category: "Claims", q: "How long does a claim settlement take?", a: "Typically, cashless claims are processed within 2-4 hours, while reimbursement takes 7-10 working days." },
    { category: "Claims", q: "Is COVID-19 covered?", a: "Yes, all our standard health insurance plans cover hospitalization due to COVID-19." },
    { category: "Policy", q: "Can I add my parents to my existing plan?", a: "Yes, you can add dependents during the policy renewal period or via a policy endorsement." },
    { category: "Payments", q: "What payment methods are accepted?", a: "We accept UPI, Credit/Debit Cards, Net Banking, and popular digital wallets." },
    // ... imagine 90+ more entries here
  ];

  // Logic to generate more questions for demonstration
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
    <div className="flex flex-col min-h-screen bg-slate-50">

      <main className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-20 px-6 text-center border-b-8 border-[#1A5EDB]">
          <h1 className="text-4xl md:text-6xl font-black mb-6">How can we <span className="text-[#4A8EFF]">help?</span></h1>
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text"
              placeholder="Search from 100+ questions..."
              className="w-full p-4 rounded-xl text-slate-900 focus:ring-4 focus:ring-[#4A8EFF] outline-none shadow-2xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-4 text-slate-400 text-xl">🔍</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-12 px-6">
          {/* CATEGORY TABS */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeCategory === cat 
                  ? "bg-[#1A5EDB] text-white shadow-lg" 
                  : "bg-white text-slate-600 hover:bg-slate-200"
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
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:shadow-md"
                >
                  <button 
                    className="w-full text-left p-5 flex justify-between items-center group"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="font-bold text-slate-800 group-hover:text-[#1A5EDB] transition-colors">
                      {faq.q}
                    </span>
                    <span className={`transform transition-transform text-[#1A5EDB] font-bold ${openIndex === index ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-5 pb-5 text-slate-600 border-t border-slate-50 pt-4 animate-in fade-in slide-in-from-top-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg italic">No questions match your search. Try different keywords.</p>
              </div>
            )}
          </div>

          {/* HELP CARD */}
          <div className="mt-20 bg-slate-950 rounded-3xl p-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
            <p className="text-slate-400 mb-8">We're available 24/7 to help you with your insurance needs.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="tel:+919063807489" className="bg-[#1A5EDB] hover:bg-[#4A8EFF] px-8 py-3 rounded-xl font-bold transition-all">
                Call Support
              </a>
              <a href="mailto:mlmmanikanta@outlook.com" className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl font-bold transition-all border border-slate-700">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default FAQ;