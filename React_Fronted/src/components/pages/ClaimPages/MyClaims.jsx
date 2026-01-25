import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../utils/api";
import CustomSelect from "../../common/CustomSelect";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";

const getDateOnly = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

// Updated with the 5 members from your image
const DEPENDENT_NAME_MAP = {
  DEP001: "Arjun Gupta",
  DEP002: "Bhavni Gupta",
  DEP003: "Maruthi Gupta",
  DEP004: "Harshi Gupta",
  DEP005: "Eswar Gupta",
};

const formatClaim = (claim) => ({
  id: claim._id,
  displayId: claim.dependentId || claim._id,
  name:
    claim.dependentName ||
    (claim.dependentId ? DEPENDENT_NAME_MAP[claim.dependentId] : "") ||
    claim.dependentId ||
    "Arjun Gupta", // Fallback to policyholder name
  claimType: claim.claimType || "Health",
  claimedAmount: claim.claimedAmount,
  amountPaid: claim.amountPaid || 0,
  raisedOn: claim.createdAt,
  remarks: claim.remarks || "No remarks provided",
  status: claim.status || "Pending",
  claimCycle: claim.claimCycle,
  raw: claim,
});

// Modern status styling matching your image
const STATUS_CLASSES = {
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  "In Progress": "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
  Cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

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

  useEffect(() => {
    let isMounted = true;
    const loadClaims = async () => {
      try {
        if (!hasActivePolicy) {
          if (isMounted) setClaims([]);
          return;
        }
        const response = await api.get("/api/claims", { auth: true });
        const formattedClaims = response.map(formatClaim);
        if (isMounted) setClaims(formattedClaims);
      } catch (error) {
        if (isMounted) setClaims([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadClaims();
    return () => { isMounted = false; };
  }, [hasActivePolicy]);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesId = !claimId || claim.id.toLowerCase().includes(claimId.toLowerCase());
      const matchesDate = !raisedOn || getDateOnly(claim.raisedOn) === raisedOn;
      const matchesStatus = !status || claim.status === status;
      return matchesId && matchesDate && matchesStatus;
    });
  }, [claims, claimId, raisedOn, status]);

  const currentClaims = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredClaims.slice(start, start + rowsPerPage);
  }, [filteredClaims, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredClaims.length / rowsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <ClaimsTopLinks />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">🧾 My Claims</h1>
          <p className="mt-2 text-lg text-slate-600">Track and manage your insurance claims in real-time.</p>
        </header>

        {/* Modern Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden border border-slate-200">
          <nav className="flex divide-x divide-slate-200">
            <span className="flex-1 px-6 py-4 text-sm font-bold text-blue-700 bg-blue-50/50 text-center border-b-2 border-blue-700">
              🧾 My Claims
            </span>
            <Link to="/claims/entitlement-dependents" className="flex-1 px-6 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 text-center transition-all">
              👪 Entitlement & Dependents
            </Link>
            <Link to="/claims/raise-claim" className="flex-1 px-6 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 text-center transition-all">
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        {/* Modern Filter Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <span className="text-xl">🔎</span>
            <h2 className="text-lg font-bold">Search Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claim ID</label>
              <input
                type="text"
                value={claimId}
                onChange={(e) => setClaimId(e.target.value)}
                placeholder="Enter ID..."
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none border"
              />
            </div>
            <div className="space-y-2">
              <CustomDatePicker
                label="Raised On"
                value={raisedOn}
                onChange={setRaisedOn}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claim Status</label>
              <CustomSelect
                label="Claim Status"
                value={status}
                onChange={setStatus}
                options={[{ value: "", label: "All Statuses" }, "Pending", "In Progress", "Completed", "Cancelled"]}
                className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => setCurrentPage(1)} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Search
              </button>
              <button onClick={() => { setClaimId(""); setRaisedOn(""); setStatus(""); }} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                ♻️
              </button>
            </div>
          </div>
        </section>

        {/* Data Table Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  {["Claim ID", "Member Name", "Type", "Claimed", "Status", "Raised On", "Actions"].map((head) => (
                    <th key={head} className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={7} className="py-20 text-center text-slate-400 font-medium">Processing your data...</td></tr>
                ) : currentClaims.length > 0 ? (
                  currentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5 text-sm font-bold text-blue-600">{claim.displayId}</td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-slate-900">{claim.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Member</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">{claim.claimType}</td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">₹{claim.claimedAmount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${STATUS_CLASSES[claim.status] || STATUS_CLASSES.Pending}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                        {new Date(claim.raisedOn).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                          <span className="text-lg">⚙️</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="py-20 text-center bg-slate-50/30"><p className="text-slate-400 font-bold uppercase tracking-widest">No matching records found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Showing {currentClaims.length} of {filteredClaims.length} Records
            </p>
            <div className="flex gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50 transition-all"
              >
                Prev
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-slate-900 text-white disabled:opacity-50 hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyClaims;