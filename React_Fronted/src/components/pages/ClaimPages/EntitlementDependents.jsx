import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";
import { api } from "../../../utils/api";

const CLAIMS_DEDUCTIBLE_STATUSES = ["Completed", "Approved", "Pending", "In Progress"];

const DEPENDENT_DATA = [
  { id: "DEP001", name: "Arjun Gupta", relationship: "Self", age: 55, status: "Active" },
  { id: "DEP002", name: "Bhavani Gupta", relationship: "Spouse", age: 47, status: "Active" },
  { id: "DEP003", name: "Maruthi Gupta", relationship: "Son", age: 23, status: "Active" },
  { id: "DEP004", name: "Harshi Gupta", relationship: "Daughter", age: 21, status: "Active" },
  { id: "DEP005", name: "Eswar Gupta", relationship: "Son", age: 17, status: "Active" },
];

const STATUS_CLASSES = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Inactive: "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-600/10",
};

function EntitlementDependents() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entitlement, setEntitlement] = useState(null);
  const [claims, setClaims] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadEntitlement = async () => {
      try {
        const apiClaims = await api.get("/api/claims", { auth: true });
        if (!isMounted) return;
        setEntitlement({
          policyNumber: "BS-PARI-2026-0001",
          coverageLimit: 1000000,
          validityFrom: "2026-01-01",
          validityTo: "2026-12-31",
        });
        setClaims(apiClaims || []);
        setDependents(DEPENDENT_DATA);
      } catch (error) {
        if (!isMounted) return;
        setEntitlement({
          policyNumber: "BS-PARI-2026-0001",
          coverageLimit: 1000000,
          validityFrom: "2026-01-01",
          validityTo: "2026-12-31",
        });
        setClaims([]);
        setDependents(DEPENDENT_DATA);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadEntitlement();
    return () => { isMounted = false; };
  }, []);

  const totalDeducted = useMemo(() => {
    return claims
      .filter((c) => CLAIMS_DEDUCTIBLE_STATUSES.includes(c.status))
      .reduce((sum, c) => sum + (c.claimedAmount || 0), 0);
  }, [claims]);

  const remainingBalance = useMemo(() => {
    if (!entitlement) return 0;
    return Math.max(entitlement.coverageLimit - totalDeducted, 0);
  }, [entitlement, totalDeducted]);

  const formatINR = (val) => `₹${val.toLocaleString("en-IN")}`;

  const handleExportCSV = () => {
    if (!dependents || dependents.length === 0) return;
    const headers = ["id", "name", "relationship", "age", "status"];
    const rows = dependents.map(d => headers.map(h => JSON.stringify(d[h] ?? "")).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewECard = (member) => {
    navigate("/utilities/e-card", {
      state: {
        selectedMember: member,
        allMembers: dependents,
        policyNo: entitlement?.policyNumber
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="no-print">
        <ClaimsTopLinks />
      </div>
      
      {/* ROYAL BLUE HEADER SECTION */}
      <div className="bg-blue-700 pt-16 pb-24 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Policy Coverage
              </h1>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">View limits and verified beneficiaries</p>
            </div>
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/30 shadow-lg">
              <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">ID:</span>
              <span className="text-sm font-mono font-bold text-white tracking-widest">{entitlement?.policyNumber}</span>
            </div>
          </header>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* FIXED TAB NAVIGATION */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] mb-12 max-w-2xl border border-white/20 relative no-print shadow-xl">
          <nav className="flex relative z-10">
            {[
              { id: 'claims', label: 'MY CLAIMS', path: '/claims/my-claims' },
              { id: 'beneficiaries', label: 'BENEFICIARIES', path: '/claims/entitlement-dependents' },
              { id: 'new-claim', label: 'NEW CLAIM', path: '/claims/raise-claim' }
            ].map((tab) => {
              const isCurrent = location.pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`relative flex-1 px-6 py-3 text-[11px] font-black uppercase tracking-normal text-center transition-colors duration-300 ${
                    isCurrent ? 'text-blue-700' : 'text-blue-100 hover:text-white'
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-[1.5rem] shadow-sm"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-20">{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] p-24 text-center border border-slate-100 animate-pulse">
            <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Syncing Policy Data...</p>
          </div>
        ) : (
          <div className="space-y-10">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Limit", val: formatINR(entitlement.coverageLimit), color: "text-slate-900" },
                { label: "Remaining", val: formatINR(remainingBalance), color: "text-emerald-600" },
                { label: "Utilized", val: formatINR(totalDeducted), color: "text-amber-600" },
                { label: "Expiry Date", val: "31 Dec 2026", color: "text-slate-900", sub: "Renew in Jan 2027" }
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -4 }} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.15em] mb-3">{item.label}</p>
                  <p className={`text-3xl font-black tracking-tight ${item.color}`}>{item.val}</p>
                  {item.sub && (
                    <div className="mt-3 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                       <p className="text-[10px] font-bold text-slate-400">{item.sub}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </section>

            <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-12">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Verified Beneficiaries</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Dependents linked to policy</p>
                </div>
                <button onClick={handleExportCSV} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {["Full Name", "Relationship", "Age", "Status", "Actions"].map((head) => (
                        <th key={head} className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {dependents.map((d) => (
                      <tr key={d.id} className="group hover:bg-blue-50/30 transition-all">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {d.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-xs text-slate-500 font-bold uppercase tracking-tight">{d.relationship}</td>
                        <td className="px-10 py-6 text-sm text-slate-900 font-black">{d.age} <span className="text-[10px] text-slate-400 font-bold ml-0.5">YRS</span></td>
                        <td className="px-10 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${STATUS_CLASSES[d.status]}`}>
                             {d.status}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <button onClick={() => handleViewECard(d)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all">
                            View Card
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        <div className="mt-12 mb-20 flex justify-center">
          <Link to="/claims/my-claims" className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
            <span>←</span> Return to Claim History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EntitlementDependents;