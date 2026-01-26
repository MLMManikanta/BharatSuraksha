import { useEffect } from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | Bharat Suraksha";
  }, []);

  const lastUpdated = "January 26, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-16 px-6 border-b-8 border-[#1A5EDB]">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Privacy <span className="text-[#4A8EFF]">Policy</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
              How Bharat Suraksha handles your medical and personal data with integrity.
            </p>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <nav className="space-y-4 border-l-2 border-slate-100 pl-6 text-sm font-semibold">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
              <a href="#data-collection" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">01. Data Collection</a>
              <a href="#data-usage" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">02. Purpose of Use</a>
              <a href="#security" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">03. Security Protocols</a>
            </nav>
          </aside>

          {/* POLICY BODY */}
          <div className="lg:col-span-2 prose prose-slate prose-lg max-w-none">
            <p className="text-slate-500 italic mb-8">Effective Date: {lastUpdated}</p>

            <section id="data-collection" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">01. Information Collection</h2>
              <p>
                To provide accurate insurance quotes and policy management, we require specific categories of information:
              </p>
              <ul className="bg-slate-50 p-6 rounded-2xl list-none space-y-4 border border-slate-100">
                <li><strong className="text-[#1A5EDB]">Personal Identifiers:</strong> Name, Email, and Phone number.</li>
                <li><strong className="text-[#1A5EDB]">Health Profiles:</strong> Medical history and current health status.</li>
                <li><strong className="text-[#1A5EDB]">Technical Data:</strong> IP addresses for fraud prevention and system security.</li>
              </ul>
            </section>

            

            <section id="data-usage" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">02. Purpose of Processing</h2>
              <p>
                We use your information strictly for insurance-related functions. We do not sell your personal data to third-party marketing firms or advertisers.
              </p>
            </section>

            <section id="security" className="mb-12 bg-blue-50 p-8 rounded-3xl border border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-3">🛡️ Security Commitment</h3>
              <p className="text-slate-700 text-base leading-relaxed">
                Bharat Suraksha utilizes <strong>AES-256 bit encryption</strong> for all stored medical data. Our systems are audited regularly to ensure compliance with Indian data protection laws.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-sm text-slate-400">
                For privacy-related inquiries:
                <br />
                <span className="text-slate-950 font-bold">mlmmanikanta@outlook.com</span>
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PrivacyPolicy;