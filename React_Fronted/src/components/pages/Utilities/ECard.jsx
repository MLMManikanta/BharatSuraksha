import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function ECard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve members passed from the Dependents page
  const { selectedMember, allMembers, policyNo } = location.state || {};
  
  // Default to the first member passed, or the user from context
  const [activeMember, setActiveMember] = useState(selectedMember || (allMembers ? allMembers[0] : {
    name: user?.name || "Primary Policyholder",
    relationship: "Self",
    age: "—",
    id: "PRIMARY"
  }));

  const policyNumber = policyNo || (user && user.policyNumber) || localStorage.getItem("latestPolicyNumber");

  const handleDownload = () => {
    const cardContent = `BHARAT SURAKSHA E-CARD\nPolicy: ${policyNumber}\nName: ${activeMember.name}\nRelation: ${activeMember.relationship}`;
    const blob = new Blob([cardContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `E-Card-${activeMember.name.replace(/\s+/g, "_")}.txt`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="text-blue-700 font-semibold mb-2 block">← Back to Dependents</button>
            <h1 className="text-3xl font-bold text-slate-900">Download E-Card</h1>
          </div>
          <button onClick={handleDownload} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700">
            Download current card
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Member Selection List */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Policy Members ({allMembers?.length || 1})</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
              {allMembers?.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMember(m)}
                  className={`w-full text-left px-4 py-4 transition-all ${
                    activeMember.id === m.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50"
                  }`}
                >
                  <p className={`font-bold ${activeMember.id === m.id ? "text-blue-700" : "text-slate-900"}`}>{m.name}</p>
                  <p className="text-xs text-slate-500">{m.relationship} • Age: {m.age}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Preview */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="w-full max-w-md aspect-[1.6/1] bg-gradient-to-br from-blue-800 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-5xl font-black">BHARAT</div>
              
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] tracking-widest font-bold opacity-70">HEALTH E-CARD</p>
                    <p className="text-xl font-black">Bharat Suraksha</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-70">POLICY NUMBER</p>
                    <p className="font-mono font-bold">{policyNumber}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] opacity-70 uppercase">Insured Person</p>
                  <h2 className="text-2xl font-black tracking-tight">{activeMember.name}</h2>
                  <p className="text-sm opacity-90">{activeMember.relationship} | Age: {activeMember.age}</p>
                </div>

                <div className="flex justify-between items-center border-t border-white/20 pt-4">
                  <span className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded">STATUS: ACTIVE</span>
                  <div className="text-right text-[9px] opacity-70 leading-tight">
                    <p>Emergency: 1800-265-000</p>
                    <p>care@bharatsuraksha.in</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-500 italic">This card is valid for all network hospitals under policy {policyNumber}.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ECard;