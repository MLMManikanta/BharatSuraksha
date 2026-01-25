import React from "react";
import { motion } from "framer-motion";

function ClaimInstructions() {
  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; color-adjust: exact; background: white !important; }
          .no-print { display: none !important; }
          #main-content { background: #fff !important; padding: 0 !important; }
          .rounded-2xl { border-radius: 0 !important; border: none !important; }
          .shadow-sm { box-shadow: none !important; }
          .bg-slate-50 { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      <main
        id="main-content"
        aria-label="Claim Instructions"
        className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-10 font-sans"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* TOP ACTION BAR */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between no-print border-b border-slate-200 pb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Claim Instructions
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Essential guidelines for seamless insurance settlement and documentation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white font-bold text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                🖨️ Print Handbook
              </button>
            </div>
          </header>

          {/* MAIN CONTENT CARD */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden">
            
            {/* Step-by-Step Section */}
            <div className="p-8 md:p-12 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                Claim Settlement Process Overview 🛠️
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Notify", desc: "Inform us within 24h for planned or 48h for emergency admissions.", icon: "🔔" },
                  { title: "Pre-auth", desc: "Submit the pre-authorization form at the network hospital desk.", icon: "📝" },
                  { title: "Documents", desc: "Keep bills, discharge summary, and diagnostics ready for upload.", icon: "📂" },
                  { title: "Review", desc: "Our medical team verifies eligibility, coverage, and limits.", icon: "🔍" },
                  { title: "Settlement", desc: "Direct cashless at network; reimbursement for non-network.", icon: "💳" },
                  { title: "Track", desc: "Monitor live status on 'My Claims' and respond to queries.", icon: "📍" },
                ].map((step, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform inline-block">{step.icon}</div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{idx + 1}. {step.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-12 grid gap-10 md:grid-cols-2 bg-slate-50/30">
              
              {/* Eligibility & Documents */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">Eligibility Criteria</h3>
                  <ul className="space-y-3">
                    {["Active policy with up-to-date premium.", "Conditions within policy terms & waiting periods.", "Treatment at registered medical facilities.", "Submission within filing timelines."].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                        <span className="text-blue-500 text-xs">✔</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">Required Documents</h3>
                  <ul className="space-y-3">
                    {["Itemized hospital bills & receipts.", "Discharge summary & admission note.", "Prescriptions & diagnostic reports.", "Photo ID & Cancelled cheque."].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium">
                        <span className="text-blue-500 text-xs">📁</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timelines & Dos/Don'ts */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">Strict Timelines</h3>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-emerald-800">Planned Intimation</span>
                      <span className="font-black text-emerald-900">48 Hours Prior</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-emerald-800">Emergency Intimation</span>
                      <span className="font-black text-emerald-900">24-48 Hours</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-emerald-800">Submission Window</span>
                      <span className="font-black text-emerald-900">30 Days Post-Discharge</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-600">The Do's & Don'ts</h3>
                  <ul className="space-y-3 text-xs font-bold">
                    <li className="flex gap-3 text-slate-700">✅ Keep original documents until full settlement.</li>
                    <li className="flex gap-3 text-slate-700">✅ Respond to query letters within 48 hours.</li>
                    <li className="flex gap-3 text-rose-600">❌ Never submit altered or manually edited bills.</li>
                    <li className="flex gap-3 text-rose-600">❌ Don't delay hospital intimation in emergencies.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Contact Section */}
            <div className="p-8 md:p-12 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Need Instant Help?</p>
                <p className="text-sm font-medium opacity-80">Our claims desk is available 24/7 for your assistance.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:9063807489" className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-xs font-black hover:bg-white/20 transition-all flex items-center gap-2">
                  📞 9063807489
                </a>
                <a href="mailto:mlmmanikanta@outlook.com" className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-xs font-black hover:bg-white/20 transition-all flex items-center gap-2">
                  ✉️ Email Support
                </a>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </>
  );
}

export default ClaimInstructions;