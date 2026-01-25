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
          policyNumber: "POL-PARI-2026-0001",
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <ClaimsTopLinks />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">👪 Entitlement & Dependents</h1>
          <p className="mt-2 text-lg text-slate-600">Review policy coverage limits and verified member details.</p>
        </header>

        {/* Modern Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden border border-slate-200">
          <nav className="flex divide-x divide-slate-200">
            <Link to="/claims/my-claims" className="flex-1 px-6 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 text-center transition-all">
              🧾 My Claims
            </Link>
            <span className="flex-1 px-6 py-4 text-sm font-bold text-blue-700 bg-blue-50/50 text-center border-b-2 border-blue-700">
              👪 Entitlement & Dependents
            </span>
            <Link to="/claims/raise-claim" className="flex-1 px-6 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 text-center transition-all">
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
            Syncing policy data...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Policy Summary Cards */}
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1">Policy Status</p>
                  <h2 className="text-xl font-black text-slate-900">Current Coverage</h2>
                </div>
                <div className="mt-4 sm:mt-0 px-4 py-2 bg-slate-900 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Policy No:</span>
                  <span className="ml-2 text-sm font-mono font-bold text-white">{entitlement.policyNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Limit</p>
                  <p className="text-2xl font-black text-slate-900">{formatINR(entitlement.coverageLimit)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Available</p>
                  <p className="text-2xl font-black text-emerald-700">{formatINR(remainingBalance)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Utilized</p>
                  <p className="text-2xl font-black text-amber-700">{formatINR(totalDeducted)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Validity</p>
                  <p className="text-sm font-bold text-slate-900">
                    {new Date(entitlement.validityTo).toLocaleDateString("en-IN", { month: 'short', day: '2-digit', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Renewal Required</p>
                </div>
              </div>
            </section>

            {/* Dependents Table */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h2 className="text-lg font-black text-slate-900">Verified Members</h2>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors">
                  📄 Export List
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      {["Full Name", "Relationship", "Age", "Status", "Actions"].map((head) => (
                        <th key={head} className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dependents.map((d) => (
                      <tr key={d.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{d.name}</td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">{d.relationship}</td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">{d.age} Yrs</td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_CLASSES[d.status]}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-4">
                            <button 
                              onClick={() => handleViewECard(d)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                            >
                              View Card
                            </button>
                            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tighter">
                              Details
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

        <div className="mt-8">
          <Link to="/claims/my-claims" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EntitlementDependents;