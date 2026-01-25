import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";
import { api } from "../../../utils/api";

const CLAIMS_DEDUCTIBLE_STATUSES = ["Completed", "Approved", "Pending", "In Progress"];

// Standard data mapping for the 5 verified members
const DEPENDENT_DATA = [
  { id: "DEP001", name: "Arjun Gupta", relationship: "Self", age: 55, status: "Active" },
  { id: "DEP002", name: "Bhavni Gupta", relationship: "Spouse", age: 47, status: "Active" },
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
          coverageLimit: 1_000_000,
          validityFrom: "2026-01-01",
          validityTo: "2026-12-31",
        });
        setClaims(apiClaims || []);
        setDependents(DEPENDENT_DATA);
      } catch (error) {
        if (!isMounted) return;
        setClaims([]);
        setDependents(DEPENDENT_DATA);
        setEntitlement({
          policyNumber: "POL-VAJRA-2026-0001",
          coverageLimit: 1_000_000,
          validityFrom: "2026-01-01",
          validityTo: "2026-12-31",
        });
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

  const isActive = (path) => location.pathname === path;
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
    a.download = `members-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewECard = (member) => {
    navigate("/claims/download-ecard", {
      state: {
        selectedMember: member,
        allMembers: dependents,
        policyNo: entitlement.policyNumber
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <ClaimsTopLinks />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">👪 Entitlement & Dependents</h1>
          <p className="mt-2 text-slate-500 font-medium text-lg">Real-time overview of policy thresholds and verified beneficiaries.</p>
        </header>

        {/* Modern Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-10 overflow-hidden border border-slate-200 p-1">
          <nav className="flex items-center gap-1">
            <Link to="/claims/my-claims" className="flex-1 px-6 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-center transition-all">
              🧾 My Claims
            </Link>
            <span className="flex-1 px-6 py-3.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl text-center shadow-sm ring-1 ring-blue-700/10">
              👪 Entitlement & Dependents
            </span>
            <Link to="/claims/raise-claim" className="flex-1 px-6 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-center transition-all">
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm p-24 text-center text-slate-400 font-black  animate-pulse">
            Syncing policy data...
          </div>
        ) : (
          <div className="space-y-10">
            {/* Policy Summary Card */}
            <section className="bg-white rounded-[2rem] shadow-sm p-10 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[18px] font-black text-blue-900  mb-1">Account Health</p>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Policy Coverage Summary</h2>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center gap-3 px-6 py-3 bg-blue-500 rounded-2xl shadow-xl shadow-slate-200">
                  <span className="text-[14px] font-black text-slate-900  tracking-widest">ID:</span>
                  <span className="text-sm font-mono font-bold text-white tracking-widest">{entitlement.policyNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-8 rounded-3xl bg-white border-slate-300 border-2 transition-all hover:shadow-lg">
                  <p className="text-[16px] font-bold text-blue-500  tracking-widest mb-2">Total Limit</p>
                  <p className="text-3xl font-extrabold text-slate-900">{formatINR(entitlement.coverageLimit)}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white  border-slate-300 border-2 transition-all hover:shadow-lg">
                  <p className="text-[16px] font-bold text-blue-500  tracking-widest mb-2">Remaining</p>
                  <p className="text-3xl font-extrabold text-emerald-700">{formatINR(remainingBalance)}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white border-slate-300 border-2 transition-all hover:shadow-lg">
                  <p className="text-[16px] font-bold text-blue-500  tracking-widest mb-2">Utilized</p>
                  <p className="text-3xl font-extrabold text-amber-700">{formatINR(totalDeducted)}</p>
                </div>
                <div className="p-8 rounded-3xl bg-white border-slate-300 border-2 transition-all hover:shadow-lg">
                  <p className="text-[16px] font-bold text-blue-500  tracking-widest mb-2">Expiry Date</p>
                  <p className="text-base font-extrabold text-slate-900">
                    {new Date(entitlement.validityTo).toLocaleDateString("en-IN", { month: 'short', day: '2-digit', year: 'numeric' })}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-medium text-slate-400  tracking-tighter">Renew in Jan 2027</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Dependents Table Card */}
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Verified Policy Beneficiaries</h2>
                <div className="flex items-center gap-3">
                  <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                    <span>📄</span>
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-200">
                    <tr>
                      {["Full Name", "Relationship", "Age", "Status", "Actions"].map((head) => (
                        <th key={head} className="px-10 py-5 text-left text-[16px] font-bold text-blue-700 ">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dependents.map((d) => (
                      <tr key={d.id} className="hover:bg-blue-50/40 transition-all group">
                        <td className="px-10 py-6 text-sm font-bold text-slate-900">{d.name}</td>
                        <td className="px-10 py-6 text-sm text-slate-500 font-medium">{d.relationship}</td>
                        <td className="px-10 py-6 text-sm text-slate-500 font-medium  tracking-tighter">{d.age} Yrs</td>
                        <td className="px-10 py-6">
                          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-[10px] font-black  tracking-widest ring-1 ring-inset ${STATUS_CLASSES[d.status] || STATUS_CLASSES.Inactive}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex gap-4 items-center">
                            <button 
                              onClick={() => handleViewECard(d)}
                              aria-label={`View e-card for ${d.name}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              View Card
                            </button>
                            
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        <div className="mt-10">
          <Link to="/claims/my-claims" className="inline-flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-blue-600 transition-all px-3 py-2 rounded-md bg-white border border-slate-100 shadow-sm">
            ⬅️ Back to My Claims
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EntitlementDependents;