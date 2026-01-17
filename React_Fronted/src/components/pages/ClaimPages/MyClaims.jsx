import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CLAIM_CYCLES = [
  { id: "2025-26", label: "Policy Year 2025-26", window: "1 Apr 2025 - 31 Mar 2026" },
  { id: "2024-25", label: "Policy Year 2024-25", window: "1 Apr 2024 - 31 Mar 2025" },
];

const CLAIMS_BY_CYCLE = {
  "2025-26": [
    { id: "CLM001", name: "Rajesh Kumar", claimedAmount: 50000, amountPaid: 45000, raisedOn: "2026-01-10", remarks: "Pre-authorization approved", status: "Completed" },
    { id: "CLM002", name: "Priya Sharma", claimedAmount: 30000, amountPaid: 0, raisedOn: "2026-01-15", remarks: "Under review", status: "Pending" },
    { id: "CLM003", name: "Amit Patel", claimedAmount: 75000, amountPaid: 0, raisedOn: "2026-01-12", remarks: "Documents incomplete", status: "In Progress" },
    { id: "CLM004", name: "Sunita Reddy", claimedAmount: 20000, amountPaid: 0, raisedOn: "2026-01-08", remarks: "Policy conditions not met", status: "Cancelled" },
    { id: "CLM005", name: "Vikram Singh", claimedAmount: 100000, amountPaid: 95000, raisedOn: "2026-01-05", remarks: "Partial payment processed", status: "Completed" },
    { id: "CLM006", name: "Neha Verma", claimedAmount: 45000, amountPaid: 0, raisedOn: "2026-01-18", remarks: "Awaiting discharge summary", status: "In Progress" },
  ],
  "2024-25": [
    { id: "CLM091", name: "Rahul Iyer", claimedAmount: 38000, amountPaid: 38000, raisedOn: "2025-02-14", remarks: "Settled", status: "Completed" },
    { id: "CLM092", name: "Deepa Nair", claimedAmount: 62000, amountPaid: 0, raisedOn: "2025-03-02", remarks: "Query raised for bills", status: "Pending" },
  ],
};

const STATUS_CLASSES = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

const MyClaims = () => {
  const navigate = useNavigate();

  const [cycle, setCycle] = useState(CLAIM_CYCLES[0].id);
  const [claimId, setClaimId] = useState("");
  const [raisedOn, setRaisedOn] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const selectedCycle = useMemo(
    () => CLAIM_CYCLES.find((c) => c.id === cycle) || CLAIM_CYCLES[0],
    [cycle]
  );

  const baseClaims = useMemo(() => CLAIMS_BY_CYCLE[cycle] || [], [cycle]);

  const filteredClaims = useMemo(() => {
    return baseClaims.filter((claim) => {
      const matchesClaimId = !claimId || claim.id.toLowerCase().includes(claimId.toLowerCase());
      const matchesDate = !raisedOn || claim.raisedOn === raisedOn;
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

  const isActionDisabled = (claimStatus) => claimStatus === "Cancelled" || claimStatus === "Completed";

  const getStatusClass = (claimStatus) => STATUS_CLASSES[claimStatus] || "bg-slate-100 text-slate-700";

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
            <Link to="/utilities/e-card" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
              <span aria-hidden>🎫</span>
              <span>Download E-Card</span>
            </Link>
            <Link to="/utilities/hospitals" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
              <span aria-hidden>🏥</span>
              <span>Hospital List</span>
            </Link>
            <Link to="/utilities/justification-letter" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
              <span aria-hidden>📄</span>
              <span>Justification Letter</span>
            </Link>
            <Link to="/utilities/claim-instructions" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
              <span aria-hidden>📘</span>
              <span>Claim Instructions</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">🧾 My Claims</h1>
          <p className="mt-2 text-slate-600">View, filter, track, and manage all submitted insurance claims.</p>
        </div>

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-1/2">
              <label htmlFor="cycle" className="block text-sm font-semibold text-slate-700 mb-2">
                Claim Cycle
              </label>
              <select
                id="cycle"
                value={cycle}
                onChange={(e) => {
                  setCycle(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-inner bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {CLAIM_CYCLES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-slate-700">
              <p>Selected cycle: <span className="font-semibold text-slate-900">{selectedCycle.label}</span></p>
              <p className="text-slate-500">{selectedCycle.window}</p>
            </div>
          </div>
        </section>

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
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 shadow-inner bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Claimed Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Amount Paid</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Raised On</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Remarks</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white" role="rowgroup">
                {currentClaims.length > 0 ? (
                  currentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50" role="row">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-700">
                        <button
                          onClick={() => navigate(`/claims/details/${claim.id}`)}
                          className="hover:underline"
                          aria-label={`View details for claim ${claim.id}`}
                        >
                          {claim.id}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{claim.name}</td>
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
                        <div className="flex items-center gap-2">
                          <button
                            disabled={isActionDisabled(claim.status)}
                            className={`p-2 rounded-lg ${
                              isActionDisabled(claim.status)
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-blue-700 hover:bg-blue-50"
                            }`}
                            aria-label={`Edit claim ${claim.id}`}
                          >
                            ✏️
                          </button>
                          <button
                            disabled={isActionDisabled(claim.status)}
                            className={`p-2 rounded-lg ${
                              isActionDisabled(claim.status)
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-rose-700 hover:bg-rose-50"
                            }`}
                            aria-label={`Cancel claim ${claim.id}`}
                          >
                            ❌
                          </button>
                          <button
                            onClick={handlePrint}
                            className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50"
                            aria-label={`Print claim ${claim.id}`}
                          >
                            🖨️
                          </button>
                        </div>
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
            {currentClaims.length > 0 ? (
              currentClaims.map((claim) => (
                <div key={claim.id} className="border border-slate-200 rounded-xl p-4 shadow-sm bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button
                        onClick={() => navigate(`/claims/details/${claim.id}`)}
                        className="text-sm font-bold text-blue-700 hover:underline"
                      >
                        {claim.id}
                      </button>
                      <p className="text-sm text-slate-900 font-semibold">{claim.name}</p>
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
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      disabled={isActionDisabled(claim.status)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isActionDisabled(claim.status)
                          ? "text-slate-300 bg-slate-100 cursor-not-allowed"
                          : "text-blue-700 bg-blue-50"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      disabled={isActionDisabled(claim.status)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        isActionDisabled(claim.status)
                          ? "text-slate-300 bg-slate-100 cursor-not-allowed"
                          : "text-rose-700 bg-rose-50"
                      }`}
                    >
                      Cancel
                    </button>
                    <button onClick={handlePrint} className="px-3 py-2 rounded-lg text-sm text-emerald-700 bg-emerald-50">
                      Print
                    </button>
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
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
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
