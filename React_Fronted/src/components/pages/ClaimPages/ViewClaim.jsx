import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";

const ViewClaim = ({ claimId, displayId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const displayClaimId = displayId || claim?.referenceId || "Claim_2026-000";

  const handleDialogKeyDown = (event) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (isOpen && claimId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/api/claims/${claimId}`, { auth: true });
          setClaim(response);
        } catch (err) {
          console.error("Failed to fetch claim details:", err);
          if (err.status === 401) {
            onClose();
            navigate("/login", {
              state: { message: "Your session has expired. Please log in again." },
            });
          }
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, claimId, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-summary-title"
            aria-describedby="claim-summary-content"
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            ref={dialogRef}
            tabIndex={-1}
            onKeyDown={handleDialogKeyDown}
          >
            {loading ? (
              <div className="p-32 text-center">
                <div className="inline-flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="font-bold text-blue-700 text-lg">Loading Details...</span>
                </div>
              </div>
            ) : claim ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-10 py-8 overflow-hidden sticky top-0 z-10">
                  {/* Decorative circles */}
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-800/30 rounded-full blur-xl"></div>

                  <div className="relative flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-2xl">📋</span>
                        </div>
                        <h2
                          id="claim-summary-title"
                          className="text-3xl font-black text-white tracking-tight"
                        >
                          Claim Summary
                        </h2>
                      </div>
                    </div>
                    <button
                      ref={closeButtonRef}
                      onClick={onClose}
                      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center text-white text-xl font-bold"
                      aria-label="Close claim summary"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div id="claim-summary-content" className="p-10 overflow-y-auto min-h-0">
                  <div className="mb-8 flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                    <span className="text-xs font-semibold text-slate-700">Claim ID</span>
                    <span className="font-mono text-xs font-black text-slate-900">
                      {displayClaimId}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-8 flex justify-center">
                    <div
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg ${
                        claim.status === "Completed" || claim.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200"
                          : claim.status === "Pending"
                            ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                            : claim.status === "In Progress"
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                              : "bg-rose-100 text-rose-700 ring-2 ring-rose-200"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      {claim.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-semibold text-slate-700 block mb-2">
                          👤 Beneficiary
                        </label>
                        <p className="text-lg font-bold text-slate-900">
                          {claim.dependentName || "Primary Member"}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-semibold text-slate-700 block mb-2">
                          📁 Claim Type
                        </label>
                        <p className="text-lg font-bold text-slate-900">
                          {claim.claimType || "Health"}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-semibold text-slate-700 block mb-2">
                          🏥 Hospital Name
                        </label>
                        <p className="text-base font-bold text-slate-900">
                          {claim.hospitalName || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
                        <label className="text-xs font-semibold text-slate-700 block mb-3">
                          💰 Claimed Amount
                        </label>
                        <p className="text-4xl font-black text-blue-900 mb-2">
                          ₹{(claim.claimedAmount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs font-semibold text-slate-600">Indian Rupees</p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-semibold text-slate-700 block mb-2">
                          📅 Admission Date
                        </label>
                        <p className="text-base font-bold text-slate-900">
                          {claim.admissionDate
                            ? new Date(claim.admissionDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Width Sections */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <label className="text-xs font-semibold text-slate-700 block mb-3">
                        📍 Hospital Address
                      </label>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                        {claim.hospitalAddress || "Address not provided"}
                      </p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
                      <label className="text-xs font-semibold text-slate-700 block mb-3">
                        🩺 Diagnosis / Medical Condition
                      </label>
                      <p className="text-sm font-semibold text-amber-900 leading-relaxed italic">
                        "{claim.diagnosis || "No diagnosis information provided"}"
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-20 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-lg font-bold text-red-600">Error loading claim details</p>
                <p className="text-sm text-slate-500 mt-2">Please try again later</p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewClaim;
