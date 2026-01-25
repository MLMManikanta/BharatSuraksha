import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../utils/api";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";

const DEPENDENT_NAME_MAP = {
  DEP001: "Arjun Gupta",
  DEP002: "Bhavani Gupta",
  DEP003: "Maruthi Gupta", 
  DEP004: "Harshi Gupta",
  DEP005: "Eswar Gupta",
};

const STATUS_CLASSES = {
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const CustomSelect = ({ value, onChange, options, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedOptions = options?.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  ) || [];

  const currentLabel = formattedOptions.find((o) => o.value === value)?.label || "Select Status";

  return (
    <div className="relative w-full space-y-3" ref={containerRef}>
      {/* Updated Label Styling */}
      <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Filter Status</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName}
      >
        <span className="truncate">{currentLabel}</span>
        <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            {formattedOptions.map((opt) => (
              <div
                key={opt.value}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  value === opt.value ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MyClaims = () => {
  const location = useLocation();
  const { user } = useAuth();
  const hasActivePolicy = Boolean(user?.hasActivePolicy || localStorage.getItem("latestPolicyNumber"));

  const [claimId, setClaimId] = useState("");
  const [raisedOn, setRaisedOn] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadClaims = async () => {
      setLoading(true);
      try {
        if (!hasActivePolicy) {
          setClaims([]);
          return;
        }
        const response = await api.get("/api/claims", { auth: true });
        if (isMounted) {
          setClaims(Array.isArray(response) ? response.map(claim => ({
            id: claim._id || Math.random().toString(36).substr(2, 9),
            displayId: String(claim.dependentId || claim._id || ""),
            name: claim.dependentName || DEPENDENT_NAME_MAP[claim.dependentId] || "Primary Member",
            claimType: claim.claimType || "Health",
            claimedAmount: Number(claim.claimedAmount) || 0,
            raisedOn: claim.createdAt || null,
            status: claim.status || "Pending",
          })) : []);
        }
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
      const matchesId = !claimId || claim.displayId.toLowerCase().includes(claimId.toLowerCase());
      const matchesDate = !raisedOn || (claim.raisedOn && claim.raisedOn.startsWith(raisedOn));
      const matchesStatus = !status || claim.status === status;
      return matchesId && matchesDate && matchesStatus;
    });
  }, [claims, claimId, raisedOn, status]);

  const totalPages = Math.ceil(filteredClaims.length / rowsPerPage) || 1;
  const currentClaims = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredClaims.slice(start, start + rowsPerPage);
  }, [filteredClaims, currentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <ClaimsTopLinks />

      {/* ROYAL BLUE HEADER SECTION */}
      <div className="bg-blue-700 pt-16 pb-24 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header>
            <h1 className="text-4xl font-black text-white tracking-tight">🧾 My Claims</h1>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">Manage and track your reimbursement history</p>
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
                  key={tab.id} to={tab.path}
                  className={`relative flex-1 px-6 py-3 text-[11px] font-black uppercase tracking-normal text-center transition-colors duration-300 ${
                    isCurrent ? 'text-blue-700' : 'text-blue-50 hover:text-white'
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

        {/* Filter Section */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 mb-10 border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Search ID</label>
            <input
              type="text" value={claimId}
              onChange={(e) => { setClaimId(e.target.value); setCurrentPage(1); }}
              placeholder="e.g., #001A"
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Filing Date</label>
            <CustomDatePicker
              value={raisedOn}
              onChange={(val) => { setRaisedOn(val); setCurrentPage(1); }}
              inputClassName="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 focus:bg-white transition-all"
            />
          </div>
          <CustomSelect
            value={status}
            onChange={(val) => { setStatus(val); setCurrentPage(1); }}
            options={[{ value: "", label: "All Statuses" }, "Pending", "In Progress", "Completed", "Cancelled"]}
            buttonClassName="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 flex items-center justify-between hover:bg-slate-100 transition-all"
          />
          <button
            onClick={() => { setClaimId(""); setRaisedOn(""); setStatus(""); setCurrentPage(1); }}
            className="h-14 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
          >
            Clear Filters
          </button>
        </section>

        {/* Results Table */}
        <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-50/50">
                  {["Ref ID", "Beneficiary", "Category", "Amount", "Status", "Raised On", "Action"].map((head) => (
                    <th key={head} className="px-10 py-6 text-left text-sm font-semibold text-blue-700 border-b border-slate-100">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={7} className="py-32 text-center text-sm font-semibold text-blue-700 animate-pulse">Syncing database...</td></tr>
                ) : currentClaims.length > 0 ? (
                  currentClaims.map((claim, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={claim.id} className="group hover:bg-blue-50/30 transition-all"
                    >
                      <td className="px-10 py-6">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          #{claim.displayId ? claim.displayId.slice(-4).toUpperCase() : '----'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="text-sm font-bold text-slate-900 leading-none mb-1">{claim.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Verified Beneficiary</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-xs text-slate-500">{claim.claimType}</td>
                      <td className="px-10 py-6 font-black text-slate-900 text-sm">₹{claim.claimedAmount.toLocaleString("en-IN")}</td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ring-inset ${STATUS_CLASSES[claim.status] || "bg-slate-50 text-slate-600"}`}>
                          ● {claim.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-[11px] font-bold text-slate-400 italic">
                        {claim.raisedOn ? new Date(claim.raisedOn).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending'}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="py-32 text-center text-sm font-semibold text-blue-700">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-700">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-3">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all">Previous</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white disabled:opacity-30 hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">Next Page</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyClaims;