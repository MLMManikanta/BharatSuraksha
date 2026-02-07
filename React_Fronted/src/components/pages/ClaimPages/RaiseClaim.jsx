import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";
import TabLoader from "../../common/TabLoader";

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

  const formattedOptions =
    options?.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)) || [];

  const currentLabel = formattedOptions.find((o) => o.value === value)?.label || "Select Option";

  return (
    <div className="relative w-full space-y-3" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-blue-700 ml-1 block mb-1">{label}</label>
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
        <span
          className={`text-[12px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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

/**
 * MAIN COMPONENT: RaiseClaim
 */
const RaiseClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dependentId: urlDependentId } = useParams();

  const [claimType, setClaimType] = useState("");
  const [form, setForm] = useState({
    claimCycle: "",
    dependentId: urlDependentId || "",
    dependentName: "",
    dayCare: "No",
    admissionDate: "",
    dischargeDate: "",
    hospitalName: "",
    hospitalAddress: "",
    diagnosis: "",
    claimedAmount: "",
    referenceId: "",
    consentSummary: false,
    consentTerms: false,
    hospitalizationType: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [stepReady, setStepReady] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const todayString = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

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

  const validate = () => {
    const admission = form.admissionDate ? new Date(form.admissionDate) : null;
    const discharge = form.dischargeDate ? new Date(form.dischargeDate) : null;

    if (!claimType || !form.claimCycle || !form.dependentId) return false;
    if (
      claimType === "Pre-Post Hospitalization" &&
      (!form.hospitalizationType || !form.referenceId.trim())
    )
      return false;
    if (!form.admissionDate || !form.dischargeDate || !form.hospitalAddress.trim()) return false;
    if (form.dayCare === "No" && admission && discharge && discharge < admission) return false;
    if (!form.claimedAmount || Number(form.claimedAmount) <= 0) return false;
    if (!form.consentSummary || !form.consentTerms) return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...form,
        claimType,
        treatmentType: claimType,
        claimedAmount: Number(form.claimedAmount),
        status: "Pending",
      };

      await api.post("/api/claims", payload, { auth: true });
      navigate("/claims/my-claims", { state: { toast: "Claim Submitted Successfully" } });
    } catch (err) {
      console.error("Claim submission failed:", err);

      if (err.status === 401) {
        navigate("/login", {
          state: { message: "Your session has expired. Please log in again." },
        });
        return;
      }

      const serverMsg = err.response?.data?.error || err.message || "Request failed";
      setSubmitError(serverMsg);
      setSubmitting(false);
    }
  };

  const isCategoryComplete = useMemo(() => {
    return claimType && form.claimCycle;
  }, [claimType, form.claimCycle]);

  const handleNav = (path) => {
    if (location.pathname === path) return;
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <div className="no-print">
        <ClaimsTopLinks />
      </div>

      <AnimatePresence>{submitting && <TabLoader />}</AnimatePresence>

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
        <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-[2rem] mb-12 max-w-2xl border border-white/20 relative no-print shadow-xl">
          <nav className="flex relative z-10">
            {[
              { id: "claims", label: "MY CLAIMS", path: "/claims/my-claims" },
              {
                id: "beneficiaries",
                label: "BENEFICIARIES",
                path: "/claims/entitlement-dependents",
              },
              { id: "new-claim", label: "NEW CLAIM", path: "/claims/raise-claim" },
            ].map((tab) => {
              const isCurrent = location.pathname === tab.path;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNav(tab.path)}
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
                </button>
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Identify your request type
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CustomSelect
              label="Claim Type"
              value={claimType}
              onChange={(v) => {
                setClaimType(v);
                setStepReady(false);
              }}
              options={[
                "Hospitalization",
                "Pre-Post Hospitalization",
                "Preventive Health Check-up",
              ]}
            />
            <CustomSelect
              label="Claim Cycle"
              value={form.claimCycle}
              onChange={(v) => {
                updateField("claimCycle", v);
                setStepReady(false);
              }}
              options={["Fresh Claim", "Reimbursement", "Follow-up / Continuation"]}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setStepReady(true)}
                disabled={!isCategoryComplete}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-normal text-[10px] transition-all ${
                  isCategoryComplete
                    ? "bg-slate-900 text-white shadow-xl active:scale-95"
                    : "bg-slate-100 text-slate-300"
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
                <div className="flex items-center mb-10 gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-black text-base shadow-lg shadow-blue-200">
                    02
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Hospital & Member Details
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Verify beneficiary and facility information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {claimType === "Pre-Post Hospitalization" && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Hospitalization Type
                        </label>
                        <div className="flex gap-3">
                          {["Pre", "Post"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateField("hospitalizationType", type)}
                              className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
                                form.hospitalizationType === type
                                  ? "bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                                  : "bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Reference Claim ID
                        </label>
                        <input
                          type="text"
                          className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 font-semibold text-slate-800 text-sm placeholder:text-slate-400 focus:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                          value={form.referenceId}
                          onChange={(e) => updateField("referenceId", e.target.value)}
                          placeholder="Original Claim Ref #"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Admission Date
                    </label>
                    <CustomDatePicker
                      value={form.admissionDate}
                      onChange={(val) => handleDateChange("admissionDate", val)}
                      max={todayString}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Discharge Date
                    </label>
                    <CustomDatePicker
                      value={form.dischargeDate}
                      onChange={(val) => handleDateChange("dischargeDate", val)}
                      max={todayString}
                      disabled={form.dayCare === "Yes"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 font-semibold text-slate-800 text-sm placeholder:text-slate-400 focus:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                      value={form.hospitalName}
                      onChange={(e) => updateField("hospitalName", e.target.value)}
                      placeholder="Enter hospital name..."
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Hospital Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 text-sm placeholder:text-slate-400 leading-relaxed resize-none focus:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                      value={form.hospitalAddress}
                      onChange={(e) => updateField("hospitalAddress", e.target.value)}
                      placeholder="Enter complete hospital address with city, state, and pincode..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Claimed Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white pl-8 pr-4 font-bold text-slate-900 text-sm placeholder:text-slate-400 focus:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                        value={form.claimedAmount}
                        onChange={(e) => updateField("claimedAmount", e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Diagnosis / Medical Condition <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 text-sm placeholder:text-slate-400 leading-relaxed resize-none focus:bg-blue-50/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                      value={form.diagnosis}
                      onChange={(e) => updateField("diagnosis", e.target.value)}
                      placeholder="Provide detailed diagnosis and medical condition information..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                      Day Care Procedure?
                    </label>
                    <div className="flex gap-3">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            updateField("dayCare", opt);
                            if (opt === "Yes" && form.admissionDate) {
                              setForm((prev) => ({
                                ...prev,
                                dayCare: opt,
                                dischargeDate: prev.admissionDate,
                              }));
                            }
                          }}
                          className={`flex-1 h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-sm ${
                            form.dayCare === opt
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-emerald-500 text-white shadow-md shadow-emerald-200 scale-105"
                              : "bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

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
                      I certify the information provided is true.
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
                      I agree to the terms.
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
