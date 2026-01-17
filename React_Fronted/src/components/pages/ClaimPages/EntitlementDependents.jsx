import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../../../utils/api";

const CLAIMS_DEDUCTIBLE_STATUSES = ["Completed", "Approved", "Pending", "In Progress"];

function EntitlementDependents() {
  const location = useLocation();

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
          policyNumber: "POL-VAJRA-2026-0001",
          coverageLimit: 1_000_000,
          validityFrom: "2026-01-01",
          validityTo: "2026-12-31",
        });
        setClaims(apiClaims || []);
        setDependents([
          { id: "DEP001", name: "Priya Sharma", relationship: "Spouse", age: 34, status: "Active" },
          { id: "DEP002", name: "Aarav Sharma", relationship: "Son", age: 8, status: "Active" },
          { id: "DEP003", name: "Meera Sharma", relationship: "Mother", age: 62, status: "Inactive" },
        ]);
      } catch (error) {
        if (!isMounted) return;
        setClaims([]);
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
    return () => {
      isMounted = false;
    };
  }, []);

  const totalDeducted = useMemo(() => {
    return claims
      .filter((c) => CLAIMS_DEDUCTIBLE_STATUSES.includes(c.status))
      .reduce((sum, c) => sum + c.claimedAmount, 0);
  }, [claims]);

  const remainingBalance = useMemo(() => {
    if (!entitlement) return 0;
    return Math.max(entitlement.coverageLimit - totalDeducted, 0);
  }, [entitlement, totalDeducted]);

  const isActive = (path) => location.pathname === path;
  const formatINR = (val) => `₹${val.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">👪 Entitlement & Dependent Details</h1>
          <p className="mt-2 text-slate-600">Read-only view of policy coverage, balances, and dependent coverage status.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <nav className="flex border-b border-slate-200" aria-label="Claims Navigation">
            <Link
              to="/claims/my-claims"
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                isActive("/claims/my-claims")
                  ? "text-blue-700 border-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:border-slate-300 border-transparent"
              }`}
            >
              🧾 My Claims
            </Link>
            <span
              className="px-6 py-4 text-sm font-semibold text-blue-700 border-b-2 border-blue-700"
              aria-current="page"
            >
              👪 Entitlement & Dependent Details
            </span>
            <Link
              to="/claims/raise-claim"
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                isActive("/claims/raise-claim")
                  ? "text-blue-700 border-blue-700"
                  : "text-slate-600 hover:text-slate-900 hover:border-slate-300 border-transparent"
              }`}
            >
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-600">Loading entitlement and dependents…</div>
        ) : (
          <>
            <section className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100" aria-labelledby="entitlement-heading">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Entitlement Summary</p>
                  <h2 id="entitlement-heading" className="text-lg font-bold text-slate-900">Policy Coverage</h2>
                </div>
                <span className="text-sm text-slate-600">Policy No: <span className="font-semibold text-slate-900">{entitlement.policyNumber}</span></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <p className="text-sm text-slate-600">Coverage Limit</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{formatINR(entitlement.coverageLimit)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-emerald-50">
                  <p className="text-sm text-emerald-700">Available Balance</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-800">{formatINR(remainingBalance)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-amber-50">
                  <p className="text-sm text-amber-700">Utilized Amount</p>
                  <p className="mt-1 text-2xl font-bold text-amber-800">{formatINR(totalDeducted)}</p>
                  <p className="mt-1 text-xs text-amber-700">Deducts Completed, Approved, Pending, In Progress claims.</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <p className="text-sm text-slate-600">Validity</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {new Date(entitlement.validityFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    <span className="text-slate-500"> — </span>
                    {new Date(entitlement.validityTo).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100" aria-labelledby="dependents-heading">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Dependents</p>
                  <h2 id="dependents-heading" className="text-lg font-bold text-slate-900">Coverage per dependent</h2>
                </div>
                <button className="px-3 py-2 text-sm font-semibold text-blue-700 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                  📄 Download List
                </button>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200" role="table">
                  <thead className="bg-slate-50" role="rowgroup">
                    <tr role="row">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Dependent</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Relationship</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Age</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Coverage Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white" role="rowgroup">
                    {dependents.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50" role="row">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{d.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{d.relationship}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{d.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            d.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50"
                              aria-label={`View details for ${d.name}`}
                            >
                              View details
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
                              aria-label={`Download summary for ${d.name}`}
                            >
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden p-4 space-y-3 bg-white" role="list">
                {dependents.map((d) => (
                  <div key={d.id} role="listitem" className="border border-slate-200 rounded-xl p-4 shadow-sm bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-900">{d.name}</p>
                        <p className="text-sm text-slate-700">{d.relationship} · {d.age} yrs</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-2 rounded-lg text-blue-700 bg-blue-50">View</button>
                      <button className="px-3 py-2 rounded-lg text-emerald-700 bg-emerald-50">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-6">
              <Link to="/claims/my-claims" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold">
                ← Back to My Claims
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EntitlementDependents;
