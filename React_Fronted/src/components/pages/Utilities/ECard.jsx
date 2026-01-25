import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function ECard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Collect data from navigation state (passed from Entitlement page)
  const { selectedMember, allMembers, policyNo } = location.state || {};
  
  // 2. Local state to manage which card is being viewed
  const [activeMember, setActiveMember] = useState(selectedMember || {
    name: user?.name || "Primary Policyholder",
    relationship: "Self",
    age: "—",
    id: "PRIMARY"
  });

  const policyNumber = policyNo || (user && user.policyNumber) || localStorage.getItem("latestPolicyNumber");

  const handleDownload = () => {
    const cardContent = `
      BHARAT SURAKSHA E-CARD
      ----------------------
      Policy No: ${policyNumber}
      Member Name: ${activeMember.name}
      Relationship: ${activeMember.relationship}
      Age: ${activeMember.age}
      Status: ACTIVE
    `;
    const blob = new Blob([cardContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `E-Card-${activeMember.name.replace(/\s+/g, "_")}.txt`;
    link.click();
  };

  if (!policyNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center p-12 bg-white rounded-[2rem] shadow-sm border border-slate-200 max-w-md">
          <div className="text-5xl mb-6">📭</div>
          <h2 className="text-2xl font-black text-slate-900">No Policy Found</h2>
          <p className="text-slate-500 mt-2 font-medium">Please activate your policy to view digital e-cards.</p>
          <button onClick={() => navigate(-1)} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline mb-3 block"
            >
              ← Back to Dependents
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Digital E-Card</h1>
            <p className="text-slate-500 font-medium mt-1">Instant digital verification for network hospital visits.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleDownload} 
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Download PDF Card
            </button>
          </div>
        </header>

        <section className="grid lg:grid-cols-12 gap-10">
          {/* Member Selector Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Policy Members</h3>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {allMembers ? allMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMember(m)}
                  className={`w-full text-left px-8 py-6 transition-all relative ${
                    activeMember.id === m.id ? "bg-blue-50/50" : "hover:bg-slate-50"
                  }`}
                >
                  {activeMember.id === m.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
                  )}
                  <p className={`font-black text-sm uppercase tracking-tight ${activeMember.id === m.id ? "text-blue-700" : "text-slate-900"}`}>
                    {m.name}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    {m.relationship}
                  </p>
                </button>
              )) : (
                <div className="p-8 text-sm text-slate-400 italic font-medium">Default Policyholder Only</div>
              )}
            </div>
          </div>

          {/* E-Card Visual Preview */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-8">
            <div className="relative w-full max-w-lg aspect-[1.6/1] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20">
              {/* Abstract Design Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
              
              <div className="relative h-full p-10 flex flex-col justify-between z-10">
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-blue-900 text-[10px] font-black">BS</span>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-200">Bharat Suraksha</p>
                    </div>
                    <h2 className="text-xl font-black tracking-tight italic uppercase">Health Insurance</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1 opacity-60">Policy ID</p>
                    <p className="font-mono text-sm font-bold tracking-[0.2em]">{policyNumber}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div>
                  <p className="text-[10px] text-blue-200 uppercase font-black tracking-widest mb-2 opacity-60">Primary Insured Member</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3">{activeMember.name}</h3>
                  <div className="flex gap-6">
                    <div className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-md">
                      <span className="text-[9px] font-black text-blue-200 uppercase mr-2">Relationship</span>
                      <span className="text-[11px] font-bold uppercase">{activeMember.relationship}</span>
                    </div>
                    <div className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-md">
                      <span className="text-[9px] font-black text-blue-200 uppercase mr-2">Age</span>
                      <span className="text-[11px] font-bold uppercase">{activeMember.age} Yrs</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end pt-6 border-t border-white/10">
                  <div className="text-[9px] text-blue-200 font-bold uppercase tracking-widest leading-relaxed">
                    <p>24/7 Helpline: 1800-265-000</p>
                    <p>Network status: Cashless Enabled</p>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-[10px] font-black text-emerald-400 uppercase tracking-widest shadow-inner">
                    Status: Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="w-full max-w-lg bg-blue-50 border border-blue-100 rounded-3xl p-8 shadow-inner shadow-blue-100/50">
              <div className="flex items-start gap-4">
                <div className="text-xl">💡</div>
                <div>
                  <h4 className="text-sm font-black text-blue-900 uppercase tracking-wider mb-2">Usage Guidelines for {activeMember.name}</h4>
                  <ul className="text-xs text-blue-800 space-y-2 font-semibold opacity-80 leading-relaxed">
                    <li>• Please present this e-card along with a valid Government ID at the hospital desk.</li>
                    <li>• For planned hospitalizations, pre-authorization must be submitted 48 hours prior.</li>
                    <li>• This card is accepted at 5,000+ network hospitals across India.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ECard;