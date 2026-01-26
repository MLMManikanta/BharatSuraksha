import { useEffect, useState } from "react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | Bharat Suraksha";

    // 1. Observer for standard scrolling (Works for sections 1-10)
    const observer = new IntersectionObserver(
      (entries) => {
        // Only run observer logic if we are NOT at the very bottom
        if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 50) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        }
      },
      { threshold: 0.2, rootMargin: "-15% 0px -60% 0px" }
    );

    const sections = document.querySelectorAll("section[id], footer[id]");
    sections.forEach((section) => observer.observe(section));

    // 2. Specific Listener for Section 11 (Contact)
    const handleScroll = () => {
      const isAtBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      
      if (isAtBottom) {
        setActiveSection("contact");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "data-collection", title: "What We Collect" },
    { id: "usage-purpose", title: "How We Use Data" },
    { id: "medical-confidentiality", title: "Medical Privacy" },
    { id: "sharing-disclosure", title: "Data Sharing" },
    { id: "data-retention", title: "Storage Rules" },
    { id: "security-protocols", title: "Security Protocols" },
    { id: "user-rights", title: "Your Legal Rights" },
    { id: "cookie-policy", title: "Cookie Policy" },
    { id: "compliance", title: "Compliance" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#1A5EDB] focus:text-white">
        Skip to main content
      </a>

      <main id="main-content" className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-24 px-6 border-b-8 border-[#1A5EDB]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight">
              Privacy <span className="text-[#4A8EFF]">Policy</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-2xl max-w-3xl leading-relaxed font-light">
              We believe your privacy is a fundamental right. This policy outlines how Bharat Suraksha protects your personal and medical information with transparency and care.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-120px)] pr-8 border-r border-slate-100">
            <nav aria-label="Policy Sections" className="space-y-1">
              <p className="text-xl text-[#1A5EDB] font-bold mb-8">Policy Guide</p>
              {sections.map((section, index) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`} 
                  className={`group flex items-center py-3 text-sm transition-all duration-300 ${
                    activeSection === section.id 
                    ? "text-[#1A5EDB] font-bold translate-x-2 border-r-2 border-[#1A5EDB] pr-4" 
                    : "text-slate-500 hover:text-black"
                  }`}
                >
                  <span className={`mr-3 font-mono text-xs transition-opacity ${activeSection === section.id ? "opacity-100" : "opacity-40"}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* POLICY BODY CONTENT */}
          <article className="lg:col-span-3 prose prose-slate prose-lg max-w-none">
            
            {/* 01. INTRODUCTION */}
            <section id="introduction" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">01. Introduction</h2>
              <p className="text-black">
                At Bharat Suraksha, we recognize that privacy is essential. This Privacy Policy governs how we collect, store, and process your data across our insurance platforms. Our commitment is built on three pillars: <strong>Transparency, Your Consent, and Data Safety.</strong>
              </p>
              <p className="text-black">
                This policy applies to all users accessing our services through our app or website. By using our platform, you are trusting us with sensitive information; this document explains the strict rules we follow to honor that trust.
              </p>
            </section>

            {/* 02. DATA COLLECTION */}
            <section id="data-collection" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">02. What We Collect</h2>
              <p className="text-black">We only collect data that you choose to give us. We focus on two main types of information:</p>
              <div className="space-y-6 mt-8">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-black mt-0">Identity & Personal Data</h3>
                  <p className="text-black text-sm mb-0">Includes your name, age, gender, and ID documents. This is necessary to calculate insurance prices and verify who you are.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-black mt-0">Device & Tech Data</h3>
                  <p className="text-black text-sm mb-0">Includes your IP address and device ID. This helps us keep our app secure and prevents hackers from accessing your account.</p>
                </div>
              </div>
            </section>

            {/* 03. USAGE & PURPOSE */}
            <section id="usage-purpose" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">03. How We Use Data</h2>
              <p className="text-black">We use your information only for the following business needs:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <span className="text-[#1A5EDB] font-bold">✓</span>
                  <span className="text-sm text-black">Calculating insurance rates and risks.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <span className="text-[#1A5EDB] font-bold">✓</span>
                  <span className="text-sm text-black">Checking medical history for policy approval.</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <span className="text-[#1A5EDB] font-bold">✓</span>
                  <span className="text-sm text-black">Meeting government and insurance laws (IRDAI).</span>
                </li>
                <li className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <span className="text-[#1A5EDB] font-bold">✓</span>
                  <span className="text-sm text-black">Coordinating with partners for your claims.</span>
                </li>
              </ul>
            </section>

            {/* 04. MEDICAL CONFIDENTIALITY */}
            <section id="medical-confidentiality" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">04. Medical Privacy</h2>
              <p className="text-black">Your health records are treated with the highest level of confidentiality. Unlike basic contact info, medical data is only accessible to those who absolutely need it.</p>
              <p className="text-black">Access to health records is always recorded. No one at Bharat Suraksha has permanent access to your raw medical files; they can only view them during the short window when your insurance is being approved or if you file a claim.</p>
            </section>

            {/* 05. SHARING & DISCLOSURE */}
            <section id="sharing-disclosure" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">05. Data Sharing</h2>
              <p className="text-black">We <strong>never</strong> sell, rent, or trade your personal data to outside marketing companies. Information sharing is limited to:</p>
              <ul className="text-black">
                <li><strong>Insurance Partners:</strong> To get you quotes and issue your policies.</li>
                <li><strong>Legal Bodies:</strong> Only when required by Indian law or a court order.</li>
                <li><strong>Fraud Protection:</strong> Shared with verified registries to prevent identity theft.</li>
              </ul>
            </section>

            {/* 06. DATA RETENTION */}
            <section id="data-retention" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">06. Storage Rules</h2>
              <p className="text-black">We only keep your data for as long as it is needed. We store your data while you are a customer and for <strong>10 years</strong> afterward, as required by Indian tax and insurance laws.</p>
              <p className="text-black">Once this time period ends, your data is permanently deleted using secure methods so it can never be recovered.</p>
            </section>

            {/* 07. SECURITY PROTOCOLS */}
            <section id="security-protocols" className="mb-24 scroll-mt-28 bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl">
              <h2 className="text-3xl font-bold text-[#4A8EFF] mt-0 mb-6">Security Protocols</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300">
                <div>
                  <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">Strong Encryption</h4>
                  <p className="text-sm leading-relaxed">All information is encrypted (scrambled) so it cannot be read by unauthorized parties. We use the same security standards as major banks.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs">Safe Infrastructure</h4>
                  <p className="text-sm leading-relaxed">Your data is stored on secure servers located within India, ensuring your information never leaves the country without protection.</p>
                </div>
              </div>
            </section>

            {/* 08. YOUR LEGAL RIGHTS */}
            <section id="user-rights" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">08. Your Legal Rights</h2>
              <p className="text-black">Under India's Privacy Laws (DPDP Act), you have the right to:</p>
              <div className="grid grid-cols-1 gap-4">
                {['Right to Correction (Fix wrong info)', 'Right to Erasure (Ask us to delete data)', 'Right to Grievance (File a complaint)', 'Right to Nominate (Assign a representative)'].map((right) => (
                  <div key={right} className="p-4 border-l-4 border-black bg-slate-50 font-bold text-black uppercase text-xs tracking-widest">{right}</div>
                ))}
              </div>
            </section>

            {/* 09. COOKIE POLICY */}
            <section id="cookie-policy" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">09. Cookie Policy</h2>
              <p className="text-black">
                We use "cookies" to keep you logged in and make our website work properly. You can turn them off in your browser, but some features might stop working. 
              </p>
              <p className="text-black mt-4">
                We <strong>do not</strong> use third-party tracking pixels that share your health searches with social media sites like Facebook or Google.
              </p>
            </section>

            {/* 10. REGULATORY COMPLIANCE */}
            <section id="compliance" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">10. Compliance</h2>
              <p className="text-black">
                Bharat Suraksha operates in full compliance with Indian Information Technology laws. we perform security checks every three months to make sure our systems stay resilient against new threats.
              </p>
            </section>

            {/* 11. CONTACT (Footer) */}
            <footer id="contact" className="pt-16 border-t border-slate-100 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">11. Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-10 rounded-3xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-[#1A5EDB] uppercase tracking-widest mb-2">Grievance Officer</p>
                  <p className="text-black font-bold m-0 text-xl">M.L.M. Manikanta</p>
                  <p className="text-black text-sm italic">Privacy Oversight Division</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A5EDB] uppercase tracking-widest mb-2">Email Address</p>
                  <a href="mailto:mlmmanikanta@outlook.com" className="text-black font-bold text-lg hover:text-[#1A5EDB] transition-colors break-all underline decoration-slate-200 underline-offset-8">
                    mlmmanikanta@outlook.com
                  </a>
                </div>
              </div>
            </footer>
            
          </article>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;