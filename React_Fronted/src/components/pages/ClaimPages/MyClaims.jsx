import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../utils/api";
import CustomSelect from "../../common/CustomSelect";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";

const getDateOnly = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const DEPENDENT_NAME_MAP = {
  DEP001: "Priya Sharma",
  DEP002: "Aarav Sharma",
  DEP003: "Meera Sharma",
};

const formatClaim = (claim) => ({
  id: claim._id,
  displayId: claim.dependentId || claim._id,
  name:
    claim.dependentName ||
    (claim.dependentId ? DEPENDENT_NAME_MAP[claim.dependentId] : "") ||
    claim.dependentId ||
    "Policyholder",
  claimType: claim.claimType || "",
  claimedAmount: claim.claimedAmount,
  amountPaid: 0,
  raisedOn: claim.createdAt,
  remarks: claim.remarks || "",
  status: claim.status || "Pending",
  claimCycle: claim.claimCycle,
  raw: claim,
});

const STATUS_CLASSES = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const EDITABLE_STATUSES = ["Pending", "In Progress"];
const CANCELLABLE_STATUSES = ["Pending", "In Progress"];

const MyClaims = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const hasActivePolicy = Boolean(user && user.hasActivePolicy) || Boolean(localStorage.getItem("latestPolicyNumber"));

  const [claimId, setClaimId] = useState("");
  const [raisedOn, setRaisedOn] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseClaims = useMemo(() => claims || [], [claims]);

  useEffect(() => {
    let isMounted = true;
    const loadClaims = async () => {
      try {
        // If there's no active policy yet, don't call claims API — keep empty state
        if (!hasActivePolicy) {
          if (isMounted) setClaims([]);
          return;
        }

        const claims = await api.get("/api/claims", { auth: true });
        const formattedClaims = claims.map(formatClaim);
        const dedupedClaims = Object.values(
          formattedClaims.reduce((acc, claim) => {
            const key = claim.displayId;
            if (!acc[key]) {
              acc[key] = claim;
              return acc;
            }
            const currentDate = new Date(acc[key].raisedOn || 0);
            const nextDate = new Date(claim.raisedOn || 0);
            if (nextDate > currentDate) {
              acc[key] = claim;
            }
            return acc;
          }, {})
        );
        if (isMounted) {
          setClaims(dedupedClaims);
        }
      } catch (error) {
        if (isMounted) {
          setClaims([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadClaims();
    return () => {
      isMounted = false;
    };
  }, [hasActivePolicy]);

  const filteredClaims = useMemo(() => {
    return baseClaims.filter((claim) => {
      const matchesClaimId = !claimId || claim.id.toLowerCase().includes(claimId.toLowerCase());
      const matchesDate = !raisedOn || getDateOnly(claim.raisedOn) === raisedOn;
      const matchesStatus = !status || claim.status === status;
      return matchesClaimId && matchesDate && matchesStatus;
    });
  }, [baseClaims, claimId, raisedOn, status]);

  const indexOfLastClaim = currentPage * rowsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - rowsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstClaim, indexOfLastClaim);
  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / rowsPerPage) || 1);

  const handleSearch = () => setCurrentPage(1);

  const handleReset = () => {
    setClaimId("");
    setRaisedOn("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleEdit = (claim) => {
    navigate(`/claims/raise-claim/${claim.displayId}?id=${claim.id}`, {
      state: { mode: "edit", claim: claim.raw },
    });
  };

  const handleCancel = async (claim) => {
    if (!canCancelClaim(claim.status)) return;
    try {
      const updated = await api.patch(`/api/claims/${claim.id}/cancel`, {}, { auth: true });
      setClaims((prev) =>
        prev.map((c) => (c.id === claim.id ? { ...c, status: updated.status } : c))
      );
    } catch (error) {
      // keep silent for now
    }
  };

  const canEditClaim = (claimStatus) => EDITABLE_STATUSES.includes(claimStatus);
  const canCancelClaim = (claimStatus) => CANCELLABLE_STATUSES.includes(claimStatus);
  const isFinalStatus = (claimStatus) => claimStatus === "Cancelled" || claimStatus === "Completed";

  const getStatusClass = (claimStatus) => STATUS_CLASSES[claimStatus] || "bg-slate-100 text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50">
      <ClaimsTopLinks />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">🧾 My Claims</h1>
          <p className="mt-2 text-slate-600">View, filter, track, and manage all submitted insurance claims.</p>
        </div>

        {!hasActivePolicy && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="text-lg font-semibold">No active policy</h2>
            <p className="text-sm text-slate-600 mt-2">Claims will appear here once you purchase a policy.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => navigate('/plans')} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Get a Quote</button>
              <Link to="/claims/raise-claim" className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700">Raise Claim (Policy holder)</Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <nav className="flex border-b border-slate-200" aria-label="Claims Navigation">
            <span className="px-6 py-4 text-sm font-semibold text-blue-700 border-b-2 border-blue-700" aria-current="page">
              🧾 My Claims
            </span>
            <Link
              to="/claims/entitlement-dependents"
              className="px-6 py-4 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 border-b-2 border-transparent transition-colors"
            >
              👪 Entitlement & Dependent Details
            </Link>
            <Link
              to="/claims/raise-claim"
              className="px-6 py-4 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 border-b-2 border-transparent transition-colors"
            >
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">🔎 Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="claimId" className="block text-sm font-semibold text-slate-700 mb-2">Claim ID</label>
              <input
                id="claimId"
                type="text"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                placeholder="Search by Claim ID"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label htmlFor="raisedOn" className="block text-sm font-semibold text-slate-700 mb-2">Raised On</label>
              <input
                id="raisedOn"
                type="date"
                value={raisedOn}
                onChange={(e) => setRaisedOn(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <CustomSelect
                value={status}
                onChange={(val) => setStatus(val)}
                options={[
                  { value: "", label: "All" },
                  "Pending",
                  "In Progress",
                  "Completed",
                  "Cancelled",
                ]}
                placeholder="All"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-inner bg-white"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              >
                🔍 Search
              </button>
              <button
                onClick={handleReset}
                className="inline-flex justify-center items-center gap-2 px-4 py-3 rounded-lg bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
              >
                ♻️ Reset
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-200" role="table">
              <thead className="bg-slate-50" role="rowgroup">
                <tr role="row">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Claim ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Claim Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Claimed Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Amount Paid</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Raised On</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Remarks</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white" role="rowgroup">
                      {loading ? (
                        <tr role="row">
                          <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                            <div className="text-2xl font-semibold">Loading claims…</div>
                          </td>
                        </tr>
                      ) : currentClaims.length > 0 ? (
                  currentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50" role="row">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                        <button
                          onClick={() => handleEdit(claim)}
                          className="hover:underline"
                          aria-label={`Edit claim ${claim.id}`}
                        >
                          {claim.displayId}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{claim.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{claim.claimType || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">₹{claim.claimedAmount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{claim.amountPaid ? `₹${claim.amountPaid.toLocaleString("en-IN")}` : "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{new Date(claim.raisedOn).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={claim.remarks}>{claim.remarks}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isFinalStatus(claim.status) ? (
                          <span className="text-sm text-slate-400">No actions</span>
                        ) : (
                          <div className="flex items-center gap-4 text-sm font-semibold">
                            <button
                              disabled={!canCancelClaim(claim.status)}
                              onClick={() => handleCancel(claim)}
                              className={`text-rose-700 hover:underline focus:outline-none disabled:text-slate-300 disabled:cursor-not-allowed`}
                              aria-label={`Cancel claim ${claim.id}`}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr role="row">
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <div className="text-5xl mb-3" aria-hidden>📂</div>
                      <p className="text-lg font-semibold">No claims found</p>
                      <p className="text-sm text-slate-600">Adjust filters or raise a new claim.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-4 space-y-3 bg-white">
            {loading ? (
              <div className="text-center text-slate-500 text-sm">Loading claims…</div>
            ) : currentClaims.length > 0 ? (
              currentClaims.map((claim) => (
                <div key={claim.id} className="border border-slate-200 rounded-xl p-4 shadow-sm bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button
                        onClick={() => handleEdit(claim)}
                        className="text-sm font-bold text-blue-700 hover:underline"
                      >
                        {claim.displayId}
                      </button>
                      <p className="text-sm text-slate-900 font-semibold">{claim.name}</p>
                      <p className="text-xs text-slate-600">{claim.claimType || "-"}</p>
                      <p className="text-xs text-slate-600">Raised on {new Date(claim.raisedOn).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-800">
                    <div>
                      <p className="text-xs text-slate-500">Claimed</p>
                      <p className="font-semibold">₹{claim.claimedAmount.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Paid</p>
                      <p className="font-semibold">{claim.amountPaid ? `₹${claim.amountPaid.toLocaleString("en-IN")}` : "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Remarks</p>
                      <p className="font-semibold text-slate-800">{claim.remarks}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm font-semibold">
                    {isFinalStatus(claim.status) ? (
                      <span className="text-slate-400">No actions</span>
                    ) : (
                      <button
                        disabled={!canCancelClaim(claim.status)}
                        onClick={() => handleCancel(claim)}
                        className={`text-rose-700 hover:underline focus:outline-none disabled:text-slate-300 disabled:cursor-not-allowed`}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 text-sm">No claims found for this cycle.</p>
            )}
          </div>

          {filteredClaims.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <label htmlFor="rowsPerPage" className="font-semibold">Rows per page:</label>
                <CustomSelect
                  value={String(rowsPerPage)}
                  onChange={(val) => {
                    setRowsPerPage(Number(val));
                    setCurrentPage(1);
                  }}
                  options={[5, 10, 20, 50]}
                  placeholder={String(rowsPerPage)}
                  className="rounded-lg border border-slate-300 px-3 py-1 bg-white"
                />
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-700">
                <span>
                  Showing {indexOfFirstClaim + 1} to {Math.min(indexOfLastClaim, filteredClaims.length)} of {filteredClaims.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === 1 ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage >= totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyClaims;
