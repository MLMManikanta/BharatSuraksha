import { useEffect } from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | Bharat Suraksha";
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-grow">
        {/* HERO SECTION */}
        <header className="bg-slate-950 text-white py-16 px-6 border-b-8 border-[#1A5EDB]">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Terms of <span className="text-[#4A8EFF]">Service</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
              The legal framework governing your journey with Bharat Suraksha.
            </p>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block sticky top-24 h-fit">
            <nav className="space-y-4 border-l-2 border-slate-100 pl-6 text-sm font-semibold">
              <p className="text-l uppercase tracking-widest mb-4 text-[#1A5EDB] underline">Legal Sections</p>
              <a href="#acceptance" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">01. Acceptance</a>
              <a href="#eligibility" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">02. Eligibility</a>
              <a href="#user-conduct" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">03. User Conduct</a>
              <a href="#limitations" className="block text-slate-500 hover:text-[#1A5EDB] transition-colors">04. Liability</a>
            </nav>
          </aside>

          {/* TERMS BODY */}
          <div className="lg:col-span-2 prose prose-slate prose-lg max-w-none">
            <p className="text-slate-500 italic mb-8 text-sm">Last revised: January 26, 2026</p>

            <section id="acceptance" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">01. Acceptance of Terms</h2>
              <p>
                By accessing or using the Bharat Suraksha platform, you agree to be bound by these Terms of Service and all applicable laws and regulations in India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            

            <section id="eligibility" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">02. Eligibility</h2>
              <p>
                To use our services, you must be at least 18 years of age and possess the legal authority to create a binding legal obligation. You must provide accurate and complete information during the insurance application process.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
                <p className="text-sm text-amber-800 font-medium m-0">
                  <strong>Note:</strong> Providing fraudulent medical or identity information is a criminal offense and will lead to immediate policy cancellation without refund.
                </p>
              </div>
            </section>

            <section id="user-conduct" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">03. User Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any unauthorized or illegal purpose.</li>
                <li>Attempt to gain unauthorized access to our server or database.</li>
                <li>Interfere with the proper working of the insurance claim processing system.</li>
              </ul>
            </section>

            <section id="limitations" className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">04. Limitation of Liability</h2>
              <p>
                Bharat Suraksha acts as a facilitator for insurance services. While we strive for 100% accuracy, we are not liable for any indirect, incidental, or consequential damages arising out of your use of the platform or any policy disputes with third-party insurance providers.
              </p>
            </section>

            <section className="mb-12 bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Governing Law</h3>
              <p className="text-slate-600 text-base m-0">
                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Vijayawada, Andhra Pradesh.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100">
              <p className="text-sm text-slate-400">
                © {currentYear} Bharat Suraksha. For legal inquiries, contact:
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

export default TermsOfService;