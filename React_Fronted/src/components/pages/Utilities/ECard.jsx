import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./Logo-circle.png";


function ECard() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const logoPath = logo;
  const basePolicyNo = "BS-PARI-2026-0001";
  const sumInsured = 1000000;
  const helpline = "9063807489";
  const email = "mlmmanikanta@outlook.com";

  const suffixes = ["A", "B", "C", "D", "E", "F"];

  const members = [
    { id: "DEP001", name: "Arjun Gupta", relationship: "Self", age: 55 },
    { id: "DEP002", name: "Bhavani Gupta", relationship: "Spouse", age: 47 },
    { id: "DEP003", name: "Maruthi Gupta", relationship: "Son", age: 23 },
    { id: "DEP004", name: "Harshi Gupta", relationship: "Daughter", age: 21 },
    { id: "DEP005", name: "Eswar Gupta", relationship: "Son", age: 17 }
  ].map((member, index) => ({
    ...member,
    policyId: `${basePolicyNo}-${suffixes[index]}` // Generates -A, -B, -C etc.
  }));

  const [activeMember, setActiveMember] = useState(members[0]);

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = (e) => {
    e.stopPropagation();
    const printContents = cardRef.current.innerHTML;
    const win = window.open("", "", "height=800,width=600");
    win.document.write(`
      <html>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <main className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[620px] border border-slate-200">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
          <div className="mb-8 flex items-center gap-3">
           
            <div>
              <h1 className="text-lg font-black text-blue-900 leading-none">E-Cards</h1>
          
            </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">
            Policy Members
          </p>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMember(m);
                  setIsFlipped(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 border ${
                  activeMember.id === m.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                    : "bg-white text-slate-600 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeMember.id === m.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">{m.name}</p>
                  <p className={`text-[9px] uppercase font-bold ${activeMember.id === m.id ? 'opacity-80' : 'opacity-50'}`}>
                    ID: {m.policyId.split('-').pop()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Display */}
        <section className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center relative bg-white">
          <div className="absolute top-8 right-8 flex gap-3">
             <button onClick={handleDownloadPDF} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm group">
                <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             </button>
             <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm group">
                <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             </button>
          </div>

          <div className="perspective-1000 w-full max-w-[420px] h-[260px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full h-full preserve-3d"
            >
              {/* Front Side */}
              <div 
                ref={cardRef}
                className="absolute w-full h-full backface-hidden rounded-[24px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img src={logoPath} alt="Bharat Suraksha" className="w-10 h-10 object-contain" />
                    <div>
                      <p className="text-[10px] font-black leading-none tracking-tight">BHARAT</p>
                      <p className="text-[10px] font-black leading-none tracking-tight text-black">SURAKSHA</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.15em]">
                    ● ACTIVE
                  </span>
                </div>

                <div className="relative z-10">
                  <p className="text-[9px] font-bold text-blue-300/60 uppercase tracking-widest mb-1">Insured Member</p>
                  <h2 className="text-2xl font-bold tracking-tight">{activeMember.name}</h2>
                  <div className="flex gap-4 text-blue-100/70 text-[10px] font-bold uppercase tracking-wider mt-1">
                    <span>{activeMember.relationship}</span>
                    <span>•</span>
                    <span>Age: {activeMember.age}</span>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[8px] font-bold text-blue-300/60 uppercase">Member ID No</p>
                    <p className="font-mono text-sm text-blue-100 font-bold">{activeMember.policyId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-blue-300/60 uppercase">Sum Insured</p>
                    <p className="text-xl font-black">₹{sumInsured.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute w-full h-full backface-hidden rounded-[24px] bg-[#0f172a] p-8 text-white shadow-2xl rotate-y-180 flex flex-col justify-between border border-white/5">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Contact & Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group/item">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-300">📞</div>
                        <div>
                            <p className="text-[8px] uppercase text-slate-500 font-bold">24/7 Helpline</p>
                            <p className="text-sm font-bold tracking-wider">{helpline}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => copyToClipboard(helpline, e)}
                          className="text-[9px] font-black px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition"
                        >
                          {copied ? "COPIED" : "COPY"}
                        </button>
                        <a 
                          href={`tel:${helpline}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[9px] font-black px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded hover:bg-emerald-600 hover:text-white transition"
                        >
                          CALL
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 border border-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-300">✉️</div>
                        <div className="overflow-hidden">
                            <p className="text-[8px] uppercase text-slate-500 font-bold">Email Support</p>
                            <p className="text-sm font-bold truncate">{email}</p>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center border-t border-white/5 pt-4">
                   <p className="text-[8px] font-bold opacity-30 tracking-[0.3em] uppercase">Member Verification Required</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mt-8 text-slate-400 text-[10px] font-bold flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            Click the card to flip for contact options
          </motion.p>
        </section>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </main>
  );
}

export default ECard;