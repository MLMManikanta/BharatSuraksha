import { useEffect, useState } from "react";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | Bharat Suraksha";

    // 1. Observer for standard scrolling
    const observer = new IntersectionObserver(
      (entries) => {
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

    // 2. Force "Contact" active at bottom of page
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
    { id: "acceptance", title: "Using Our Service" },
    { id: "definitions", title: "Key Terms" },
    { id: "eligibility", title: "Who Can Join" },
    { id: "account-security", title: "Your Account" },
    { id: "prohibited-activities", title: "Rules of Use" },
    { id: "service-disclaimer", title: "Our Role" },
    { id: "payments-refunds", title: "Payments" },
    { id: "intellectual-property", title: "Ownership" },
    { id: "liability", title: "Our Liability" },
    { id: "governing-law", title: "Legal Rules" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#1A5EDB] focus:text-white">
        Skip to main content
      </a>

      <main id="main-content" className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-24 px-6 border-b-8 border-[#1A5EDB]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight">
              Terms of <span className="text-[#4A8EFF]">Service</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-2xl max-w-3xl leading-relaxed font-light">
              Clear and simple rules for using the Bharat Suraksha insurance platform.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-4 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-120px)] pr-8 border-r border-slate-100">
            <nav aria-label="Terms Sections" className="space-y-1">
              <p className="text-sm text-[#1A5EDB] font-bold tracking-widest mb-8 uppercase">Legal Guide</p>
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

          {/* TERMS BODY CONTENT */}
          <article className="lg:col-span-3 prose prose-slate prose-lg max-w-none">
            
            <section id="acceptance" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Using Our Service</h2>
              <p className="text-black">
                By using the Bharat Suraksha website or app, you agree to follow these rules. This is a legal agreement between you and Bharat Suraksha Technologies Pvt. Ltd. If you do not agree, please stop using our services immediately.
              </p>
            </section>

            <section id="definitions" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Key Terms</h2>
              <p className="text-black">To make things clear, here is what we mean by these words:</p>
              <ul className="space-y-4 text-black list-none pl-0">
                <li className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <strong>"Aggregator":</strong> Bharat Suraksha acts as a bridge to show you plans from different insurance companies.
                </li>
                <li className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <strong>"Insurer":</strong> The actual insurance company that provides the policy and pays for your claims.
                </li>
              </ul>
            </section>

            <section id="eligibility" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Who Can Join</h2>
              <p className="text-black">You can use our platform if you meet these conditions:</p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>You are at least 18 years old.</li>
                <li>You live in India and have a permanent address.</li>
                <li>You provide honest information when applying for insurance.</li>
              </ul>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6">
                <p className="text-sm text-amber-900 font-medium m-0">
                  <strong>Warning:</strong> Providing a fake ID or lying about your health is illegal. We will block your account and report fraud to the authorities.
                </p>
              </div>
            </section>

            <section id="account-security" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Your Account</h2>
              <p className="text-black">
                You are responsible for keeping your account details (like your OTP and password) safe. If someone else uses your account because you were not careful, we cannot be held responsible for any loss.
              </p>
            </section>

            <section id="prohibited-activities" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Rules of Use</h2>
              <p className="text-black">You agree <strong>not</strong> to do the following:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-black mt-0">No Stealing Data</h4>
                  <p className="text-sm text-slate-600 mb-0">Do not use automated bots to copy our prices or content.</p>
                </div>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-black mt-0">No Fraud</h4>
                  <p className="text-sm text-slate-600 mb-0">Do not upload fake medical papers to trick insurance companies.</p>
                </div>
              </div>
            </section>

            <section id="service-disclaimer" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Our Role</h2>
              <p className="text-black">
                Bharat Suraksha helps you compare and buy insurance. We do not issue the policies ourselves. Your insurance contract is directly between you and the insurance company.
              </p>
            </section>

            <section id="payments-refunds" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Payments & Refunds</h2>
              <p className="text-black">
                All payments are made through secure, government-approved gateways.
              </p>
              <h3 className="text-xl font-bold text-black mt-6">15-Day Free Look</h3>
              <p className="text-black">
                By law, you have 15 days to review your policy. If you don't like it, you can cancel it for a refund (though the company may deduct small processing fees).
              </p>
            </section>

            <section id="intellectual-property" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Ownership</h2>
              <p className="text-black">
                Everything on this site—the logo, the code, and the design—belongs to Bharat Suraksha. You are not allowed to copy or use it without our permission.
              </p>
            </section>

            <section id="liability" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Our Liability</h2>
              <p className="text-black">
                We are not responsible for any indirect losses or issues caused by the insurance companies we list. We try our best to be accurate, but the final policy details depend on the insurer.
              </p>
            </section>

            <section id="governing-law" className="mb-24 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Legal Rules</h2>
              <div className="bg-slate-900 text-white p-10 rounded-[2rem] shadow-xl">
                <p className="text-slate-300 text-lg leading-relaxed m-0">
                  These rules follow the laws of India. If there is a legal dispute, it will be handled by the courts in <span className="text-[#4A8EFF] font-bold">Vijayawada, Andhra Pradesh</span>.
                </p>
              </div>
            </section>

            <footer id="contact" className="pt-16 border-t border-slate-100 scroll-mt-28">
              <h2 className="text-4xl font-black text-black mb-8 tracking-tight">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-10 rounded-3xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-[#1A5EDB] uppercase tracking-widest mb-2">Legal Support</p>
                  <p className="text-black font-bold m-0 text-xl">Legal Department</p>
                  <p className="text-slate-600 text-sm italic">Bharat Suraksha HQ</p>
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

export default TermsOfService;