import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";

// Standardized Member Data
const DEPENDENT_DATA = [
  { id: "DEP001", name: "Arjun Gupta", label: "Arjun Gupta (Self)" },
  { id: "DEP002", name: "Bhavani Gupta", label: "Bhavani Gupta (Spouse)" },
  { id: "DEP003", name: "Maruthi Gupta", label: "Maruthi Gupta (Son)" },
  { id: "DEP004", name: "Harshi Gupta", label: "Harshi Gupta (Daughter)" },
  { id: "DEP005", name: "Eswar Gupta", label: "Eswar Gupta (Son)" },
];

/**
 * INTERNAL COMPONENT: CustomSelect
 */
const CustomSelect = ({ label, value, onChange, options, buttonClassName }) => {
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

  const currentLabel = formattedOptions.find((o) => o.value === value)?.label || "Select Option";

  return (
    <div className="relative w-full space-y-3" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          "w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 flex items-center justify-between hover:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
        }
      >
        <span className="truncate">{currentLabel}</span>
        <span className={`text-[12px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
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

/**
 * MAIN COMPONENT: RaiseClaim
 */
const RaiseClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dependentId: urlDependentId } = useParams();

  // State Management
  const [claimType, setClaimType] = useState("");
  const [form, setForm] = useState({
    claimCycle: "",
    dependentId: urlDependentId || "",
    dependentName: "",
    dayCare: "No",
    admissionDate: "",
    dischargeDate: "",
    hospitalAddress: "",
    diagnosis: "",
    claimedAmount: "",
    consentSummary: false,
    consentTerms: false,
    hospitalizationType: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [stepReady, setStepReady] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const todayString = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Helper to update form fields
  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Handle Date Logic (Syncing for Day Care)
  const handleDateChange = (field, value) => {
    if (form.dayCare === "Yes") {
      setForm((prev) => ({
        ...prev,
        admissionDate: value,
        dischargeDate: value,
      }));
    } else {
      updateField(field, value);
    }
  };

  // Pre-submission validation
  const validate = () => {
    const admission = form.admissionDate ? new Date(form.admissionDate) : null;
    const discharge = form.dischargeDate ? new Date(form.dischargeDate) : null;

    if (!claimType || !form.claimCycle || !form.dependentId) return false;
    if (!form.admissionDate || !form.dischargeDate || !form.hospitalAddress.trim()) return false;
    if (form.dayCare === "No" && admission && discharge && discharge < admission) return false;
    if (!form.claimedAmount || Number(form.claimedAmount) <= 0) return false;
    if (!form.consentSummary || !form.consentTerms) return false;

    return true;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      // Ensure numeric amount and default status before sending
      const payload = {
        ...form,
        claimType,
        claimedAmount: Number(form.claimedAmount),
        status: "Pending"
      };

      await api.post("/api/claims", payload, { auth: true });
      
      // Navigate on success
      navigate("/claims/my-claims", { state: { toast: "Claim Submitted Successfully" } });
    } catch (err) {
      console.error("Claim submission failed:", err);
      // Enhanced error reporting
      const serverMsg = err.response?.data?.error || err.message || "Request failed";
      setSubmitError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isCategoryComplete = useMemo(() => {
    return claimType && form.claimCycle;
  }, [claimType, form.claimCycle]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <div className="no-print">
        <ClaimsTopLinks />
      </div>

      <div className="bg-blue-700 pt-16 pb-24 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header>
            <h1 className="text-4xl font-black text-white tracking-tight">Raise New Claim</h1>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">
              Submit a new request for reimbursement or hospitalization
            </p>
          </header>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Navigation Tabs */}
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] mb-12 max-w-2xl border border-white/20 relative no-print shadow-xl">
          <nav className="flex relative z-10">
            {[
              { id: "claims", label: "MY CLAIMS", path: "/claims/my-claims" },
              { id: "beneficiaries", label: "BENEFICIARIES", path: "/claims/entitlement-dependents" },
              { id: "new-claim", label: "NEW CLAIM", path: "/claims/raise-claim" },
            ].map((tab) => {
              const isCurrent = location.pathname === tab.path;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`relative flex-1 px-6 py-3 text-[11px] font-black uppercase tracking-normal text-center transition-colors duration-300 ${
                    isCurrent ? "text-blue-700" : "text-blue-100 hover:text-white"
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

        {/* STEP 1: CATEGORY SELECTION */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 md:p-10 mb-8 border border-slate-100">
          <div className="flex items-center mb-8 gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200">
              01
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Claim Category</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identify your request type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CustomSelect
              label="Claim Type"
              value={claimType}
              onChange={(v) => { setClaimType(v); setStepReady(false); }}
              options={["Hospitalization", "Pre-Post Hospitalization", "Preventive Health Check-up"]}
            />
            <CustomSelect
              label="Claim Cycle"
              value={form.claimCycle}
              onChange={(v) => { updateField("claimCycle", v); setStepReady(false); }}
              options={["Fresh Claim", "Reimbursement", "Follow-up / Continuation"]}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setStepReady(true)}
                disabled={!isCategoryComplete}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-normal text-[10px] transition-all ${
                  isCategoryComplete ? "bg-slate-900 text-white shadow-xl active:scale-95" : "bg-slate-100 text-slate-300"
                }`}
              >
                {stepReady ? "✓ Category Set" : "Next Step"}
              </button>
            </div>
          </div>
        </section>

        {/* STEP 2: FORM DETAILS */}
        <AnimatePresence>
          {stepReady && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 md:p-10 border border-slate-100">
                <div className="flex items-center mb-8 gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200">
                    02
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Hospital & Member Details</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify beneficiary and facility</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <CustomSelect
                    label="Verified Member"
                    value={form.dependentId}
                    onChange={(v) => {
                      const sel = DEPENDENT_DATA.find((d) => d.id === v);
                      updateField("dependentId", v);
                      updateField("dependentName", sel?.name || "");
                    }}
                    options={DEPENDENT_DATA.map((d) => ({ value: d.id, label: d.label }))}
                  />

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Admission Date</label>
                    <CustomDatePicker
                      value={form.admissionDate}
                      onChange={(val) => handleDateChange("admissionDate", val)}
                      max={todayString}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Discharge Date</label>
                    <CustomDatePicker
                      value={form.dischargeDate}
                      onChange={(val) => handleDateChange("dischargeDate", val)}
                      max={todayString}
                      disabled={form.dayCare === "Yes"}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Hospital Name and Address</label>
                    <textarea
                      rows="3"
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-700 border resize-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.hospitalAddress}
                      onChange={(e) => updateField("hospitalAddress", e.target.value)}
                      placeholder="Full facility name and street address..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Requested Amount (INR)</label>
                    <input
                      type="number"
                      className="w-full h-14 rounded-2xl border-slate-200 bg-slate-50 px-5 font-black text-slate-900 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.claimedAmount}
                      onChange={(e) => updateField("claimedAmount", e.target.value)}
                      placeholder="₹ 0.00"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">Primary Diagnosis</label>
                    <textarea
                      rows="3"
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-700 border resize-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={form.diagnosis}
                      onChange={(e) => updateField("diagnosis", e.target.value)}
                      placeholder="Provide diagnosis details..."
                    />
                  </div>

                  <div className="flex flex-col items-start space-y-3">
                    <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">
                      Day Care Procedure?
                    </label>
                    <div className="flex flex-col gap-2">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            updateField("dayCare", opt);
                            if (opt === "Yes" && form.admissionDate) {
                              setForm((prev) => ({ ...prev, dayCare: opt, dischargeDate: prev.admissionDate }));
                            }
                          }}
                          className={`w-20 h-9 rounded-lg border font-bold text-[10px] uppercase transition-all ${
                            form.dayCare === opt
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CONSENT & ERRORS */}
                <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                  {submitError && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold mb-4 border border-red-100"
                    >
                      ⚠️ Error: {submitError}
                    </motion.div>
                  )}
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consentSummary}
                      onChange={(e) => updateField("consentSummary", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-900 text-blue-600"
                    />
                    <span className="text-m font-bold text-slate-700 leading-relaxed">
                      I certify the information provided is true and complete.
                    </span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consentTerms}
                      onChange={(e) => updateField("consentTerms", e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-900 text-blue-600"
                    />
                    <span className="text-m font-bold text-slate-700 leading-relaxed">
                      I agree to the terms and conditions regarding claim processing.
                    </span>
                  </label>
                </div>
              </section>

              <div className="flex justify-center mb-20">
                <button
                  type="submit"
                  disabled={submitting || !validate()}
                  className={`w-full sm:w-80 h-16 rounded-[2rem] font-black uppercase text-[11px] transition-all shadow-2xl ${
                    validate() && !submitting
                    ? "bg-blue-600 text-white shadow-blue-200 hover:scale-105 active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Processing..." : "Submit Claim Request"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RaiseClaim;