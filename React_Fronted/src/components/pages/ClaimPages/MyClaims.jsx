import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../utils/api";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";
import TabLoader from "../../common/TabLoader";

/**
 * CONSTANTS & MAPPINGS
 */
const STATUS_CLASSES = {
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

/**
 * INTERNAL COMPONENT: CustomSelect
 */
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

  const formattedOptions =
    options?.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt,
    ) || [];

  const currentLabel =
    formattedOptions.find((o) => o.value === value)?.label || "Select Status";

  return (
    <div className="relative w-full space-y-3" ref={containerRef}>
      <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">
        Filter Status
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName}
      >
        <span className="truncate">{currentLabel}</span>
        <span
          className={`text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
          >
            {formattedOptions.map((opt) => (
              <div
                key={opt.value}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  value === opt.value
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [claimSearch, setClaimSearch] = useState("");
  const [raisedOn, setRaisedOn] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;
  const hasActivePolicy = Boolean(
    user?.hasActivePolicy || localStorage.getItem("latestPolicyNumber"),
  );

  // UPDATED: handleNav no longer triggers global loading for tab switching
  const handleNav = (path) => {
    if (location.pathname === path) return;
    navigate(path);
  };

  useEffect(() => {
    let isMounted = true;
    const loadClaims = async () => {
      try {
        if (!hasActivePolicy) {
          setClaims([]);
          return;
        }
        const response = await api.get("/api/claims", { auth: true });
        if (isMounted) {
          setClaims(
            Array.isArray(response)
              ? response.map((claim, index) => ({
                  id: claim._id,
                  displayId: `Claim_2026-${String(index + 1).padStart(3, "0")}`,
                  name: claim.dependentName || "Primary Member",
                  claimType: claim.claimType || "Health",
                  claimedAmount: Number(claim.claimedAmount) || 0,
                  raisedOn: claim.createdAt || null,
                  status: claim.status || "Pending",
                }))
              : [],
          );
        }
      } catch (error) {
        if (isMounted) setClaims([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadClaims();
    return () => {
      isMounted = false;
    };
  }, [hasActivePolicy]);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesId =
        !claimSearch ||
        claim.displayId.toLowerCase().includes(claimSearch.toLowerCase());
      const matchesDate =
        !raisedOn || (claim.raisedOn && claim.raisedOn.startsWith(raisedOn));
      const matchesStatus = !status || claim.status === status;
      return matchesId && matchesDate && matchesStatus;
    });
  }, [claims, claimSearch, raisedOn, status]);

  const totalPages = Math.ceil(filteredClaims.length / rowsPerPage) || 1;
  const currentClaims = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredClaims.slice(start, start + rowsPerPage);
  }, [filteredClaims, currentPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* LOADING OVERLAY: Removed from tab switching, logic remains for initial data fetch if needed */}
      <div className="no-print">
        <ClaimsTopLinks />
      </div>

      <div className="bg-blue-700 pt-16 pb-24 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header>
            <h1 className="text-4xl font-black text-white tracking-tight">
              🧾 My Claims
            </h1>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">
              Manage and track your reimbursement history
            </p>
          </header>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* TAB NAVIGATION */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] mb-12 max-w-2xl border border-white/20 relative no-print shadow-xl">
          <nav className="flex relative z-10">
            {[
              { id: "claims", label: "MY CLAIMS", path: "/claims/my-claims" },
              {
                id: "beneficiaries",
                label: "BENEFICIARIES",
                path: "/claims/entitlement-dependents",
              },
              {
                id: "new-claim",
                label: "NEW CLAIM",
                path: "/claims/raise-claim",
              },
            ].map((tab) => {
              const isCurrent = location.pathname === tab.path;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNav(tab.path)}
                  className={`relative flex-1 px-6 py-3 text-[11px] font-black uppercase tracking-normal text-center transition-colors duration-300 ${
                    isCurrent
                      ? "text-blue-700"
                      : "text-blue-50 hover:text-white"
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-[1.5rem] shadow-sm"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-20">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SEARCH & FILTERS */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 mb-10 border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">
              Search ID
            </label>
            <input
              type="text"
              value={claimSearch}
              onChange={(e) => {
                setClaimSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="e.g., Claim_2026-001"
              className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">
              Filing Date
            </label>
            <CustomDatePicker
              value={raisedOn}
              onChange={(val) => {
                setRaisedOn(val);
                setCurrentPage(1);
              }}
              inputClassName="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 focus:bg-white transition-all"
            />
          </div>
          <CustomSelect
            value={status}
            onChange={(val) => {
              setStatus(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "", label: "All Statuses" },
              "Pending",
              "In Progress",
              "Completed",
              "Cancelled",
            ]}
            buttonClassName="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 flex items-center justify-between hover:bg-slate-100 transition-all"
          />
          <button
            onClick={() => {
              setClaimSearch("");
              setRaisedOn("");
              setStatus("");
              setCurrentPage(1);
            }}
            className="h-14 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            Clear Filters
          </button>
        </section>

        {/* RESULTS TABLE */}
        <section className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-blue-50/50">
                  {[
                    "Beneficiary",
                    "Claim ID",
                    "Category",
                    "Amount",
                    "Status",
                    "Raised On",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-10 py-6 text-left text-sm font-semibold text-blue-700 border-b border-slate-100"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentClaims.length > 0 ? (
                  currentClaims.map((claim, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      key={claim.id}
                      className="group hover:bg-blue-50/30 transition-all"
                    >
                      <td className="px-10 py-6">
                        <div className="text-sm font-bold text-slate-900 leading-none">
                          {claim.name}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {claim.displayId}
                        </span>
                      </td>
                      <td className="px-10 py-6 font-bold text-xs text-slate-500">
                        {claim.claimType}
                      </td>
                      <td className="px-10 py-6 font-black text-slate-900 text-sm italic">
                        ₹{claim.claimedAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ring-inset ${STATUS_CLASSES[claim.status] || "bg-slate-50 text-slate-600"}`}
                        >
                          ● {claim.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-[11px] font-bold text-slate-400 italic">
                        {claim.raisedOn
                          ? new Date(claim.raisedOn).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "Pending"}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button
                          onClick={() => navigate(`/claims/view/${claim.id}`)} 
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-lg hover:bg-slate-900 transition-all shadow-sm"
                        >
                          <span>👁️</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-32 text-center text-sm font-semibold text-blue-700"
                    >
                      {loading ? "Syncing data..." : "No records found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-700">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white disabled:opacity-30 hover:bg-blue-600 transition-all shadow-lg"
              >
                Next Page
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyClaims;