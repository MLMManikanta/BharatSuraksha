import React, { useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

// Dummy Data for Preview
const CLAIMS = [
  
];

function JustificationLetter() {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const logoPath = "/images/Logo-circle.png";

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-start justify-between gap-6 no-print">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Justification Letter
            </h1>
            <p className="max-w-xl text-sm text-slate-500 font-medium">
              Generate an official statement for your pending claims. This document can be presented to hospital authorities as proof of insurance processing.
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </button>
        </header>

        {/* MAIN BOX */}
        <section className="rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-blue-900/5 overflow-hidden no-print">
          <div className="p-8 space-y-8">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                   Workflow Step 01
                 </label>
                 <h3 className="font-bold text-slate-800">Select Active Claim</h3>
              </div>
              <button
                onClick={handlePrint}
                disabled={!selectedClaim}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-30 disabled:shadow-none transition-all active:scale-95"
              >
                🖨️ Print Document
              </button>
            </div>

            {/* Dropdown Section */}
            <div className="grid md:grid-cols-2 gap-8 items-end">
                <div className="space-y-3">
                    <Listbox value={selectedClaim} onChange={setSelectedClaim}>
                    <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-5 pr-12 text-left focus:outline-none focus:border-blue-500 transition-all">
                        <span className={`block truncate font-bold ${selectedClaim ? 'text-slate-900' : 'text-slate-400'}`}>
                            {selectedClaim ? selectedClaim.id : "Choose a Claim ID..."}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                            ▼
                        </span>
                        </Listbox.Button>
                        <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                            {CLAIMS.map((claim) => (
                            <Listbox.Option
                                key={claim.id}
                                className={({ active }) =>
                                `relative cursor-pointer select-none rounded-xl py-3 px-4 transition-colors ${
                                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                }`
                                }
                                value={claim}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{claim.id}</span>
                                    <span className="text-[10px] opacity-60">{claim.date}</span>
                                </div>
                            </Listbox.Option>
                            ))}
                        </Listbox.Options>
                        </Transition>
                    </div>
                    </Listbox>
                </div>

                {/* Claim Micro-Summary */}
                <AnimatePresence mode="wait">
                    {selectedClaim ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-4 items-center"
                        >
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                🏥
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Hospital / Amount</p>
                                <p className="text-sm font-bold text-slate-700">{selectedClaim.hospital} • {selectedClaim.amount}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 font-medium italic text-center">Please select a claim from the list to populate the letter.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* LETTER PREVIEW AREA */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Letter Preview</h4>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">READ-ONLY DRAFT</span>
                </div>
                
                <div className="print-area rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/30 p-8 md:p-12 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!selectedClaim ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                            >
                                <div className="text-4xl opacity-20">📄</div>
                                <p className="text-slate-400 font-medium">Select a claim above to preview the justification letter.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="prose prose-slate max-w-none text-slate-700"
                            >
                                <div className="mb-10 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-black text-blue-900 m-0">BHARAT SURAKSHA</h2>
                                        <p className="text-xs text-slate-400 font-bold m-0 uppercase tracking-widest">Claims Department</p>
                                    </div>
                                    <div className="text-right text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                        Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>

                                <h3 className="text-center font-black underline underline-offset-8 decoration-blue-200 mb-10">TO WHOMSOEVER IT MAY CONCERN</h3>

                                <p className="leading-relaxed">
                                    This is to certify that the medical insurance claim with ID <strong className="text-blue-700">{selectedClaim.id}</strong>, 
                                    filed on <strong>{selectedClaim.date}</strong> for the amount of <strong>{selectedClaim.amount}</strong> 
                                    at <strong>{selectedClaim.hospital}</strong>, is currently under active review by the Bharat Suraksha 
                                    medical adjudication team.
                                </p>

                                <p className="leading-relaxed">
                                    We confirm that the policy holder is covered under an active health insurance plan. This letter acts 
                                    as a formal justification for the delay in processing while we verify final documentation with 
                                    the healthcare provider.
                                </p>

                                <p className="leading-relaxed">
                                    Please present this letter to the concerned hospital authority as evidence that the claim is 
                                    legitimate and processing is underway. For further clarification, please contact our 
                                    support team.
                                </p>

                                <div className="mt-12 space-y-1">
                                    <p className="font-bold m-0 text-slate-900">Regards,</p>
                                    <p className="font-black text-blue-900 m-0">The Claims Team</p>
                                    <p className="text-xs text-slate-500 font-bold m-0">Bharat Suraksha General Insurance Ltd.</p>
                                </div>

                                <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-[10px] font-bold text-slate-400 uppercase">
                                    <p>📞 9063807489</p>
                                    <p>✉️ care@bharatsuraksha.in</p>
                                    <p>🌐 www.bharatsuraksha.in</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </section>
      </div>

      {/* Global Print Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-area { 
            border: none !important; 
            background: white !important; 
            padding: 0 !important; 
            box-shadow: none !important; 
          }
          main { padding: 0 !important; }
          .mx-auto { max-width: 100% !important; }
        }
      `}} />
    </main>
  );
}

export default JustificationLetter;