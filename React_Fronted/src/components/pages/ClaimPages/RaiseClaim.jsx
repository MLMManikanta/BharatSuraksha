import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/api";
import CustomDatePicker from "../../common/CustomDatePicker";
import ClaimsTopLinks from "../../common/ClaimsTopLinks";

// Standardized Member Data with corrected name
const DEPENDENT_DATA = [
  { id: "DEP001", name: "Arjun Gupta", label: "Arjun Gupta (Self)" },
  { id: "DEP002", name: "Bhavani Gupta", label: "Bhavani Gupta (Spouse)" },
  { id: "DEP003", name: "Maruthi Gupta", label: "Maruthi Gupta (Son)" },
  { id: "DEP004", name: "Harshi Gupta", label: "Harshi Gupta (Daughter)" },
  { id: "DEP005", name: "Eswar Gupta", label: "Eswar Gupta (Son)" },
];

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
    <div className="relative w-full space-y-2" ref={containerRef}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName || "w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-700 flex items-center justify-between hover:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"}
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

const RaiseClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dependentId: urlDependentId } = useParams();

  const [claimType, setClaimType] = useState('');
  const [form, setForm] = useState({
    claimCycle: '',
    dependentId: urlDependentId || '',
    dependentName: '',
    dayCare: '',
    admissionDate: '',
    dischargeDate: '',
    hospitalAddress: '',
    diagnosis: '',
    claimedAmount: '',
    consentSummary: false,
    consentTerms: false,
    hospitalizationType: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [stepReady, setStepReady] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editClaimId, setEditClaimId] = useState(null);
  const todayString = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const admission = form.admissionDate ? new Date(form.admissionDate) : null;
    const discharge = form.dischargeDate ? new Date(form.dischargeDate) : null;

    if (!claimType || !form.claimCycle || !form.dependentId || !form.dayCare) return false;
    if (!form.admissionDate || !form.dischargeDate || !form.hospitalAddress.trim()) return false;
    if (admission && discharge && discharge < admission) return false;
    if (!form.claimedAmount || Number(form.claimedAmount) <= 0) return false;
    if (!form.consentSummary || !form.consentTerms) return false;
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = editClaimId ? `/api/claims/${editClaimId}` : '/api/claims';
      const method = editClaimId ? 'patch' : 'post';
      await api[method](endpoint, { claimType, ...form }, { auth: true });
      navigate('/claims/my-claims', { state: { toast: 'Success' } });
    } catch (err) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <ClaimsTopLinks />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Raise New Claim</h1>
        </header>

        {/* Sliding Tab Navigation */}
        <div className="bg-slate-200/50 p-1.5 rounded-[2rem] mb-12 max-w-3xl mx-auto border border-slate-200 relative no-print">
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
                    isCurrent ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-white rounded-[1.5rem] shadow-sm shadow-blue-900/10"
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

        {/* STEP 1: CATEGORY */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 md:p-10 mb-8 border border-slate-100">
          <div className="flex items-center mb-8 gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200">01</div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Claim Category</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identify your request type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CustomSelect
              label="Claim Type"
              value={claimType}
              onChange={(v) => { setClaimType(v); setStepReady(false); updateField('hospitalizationType', ''); }}
              options={['Hospitalization', 'Pre-Post Hospitalization', 'Preventive Health Check-up']}
            />

            <CustomSelect
              label="Claim Cycle"
              value={form.claimCycle}
              onChange={(v) => { updateField('claimCycle', v); setStepReady(false); }}
              options={['Fresh Claim', 'Reimbursement', 'Follow-up / Continuation']}
            />

            {claimType === 'Pre-Post Hospitalization' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Category</label>
                <div className="flex gap-2">
                  {['Pre', 'Post'].map(opt => (
                    <button
                      key={opt} type="button"
                      onClick={() => { updateField('hospitalizationType', opt); setStepReady(false); }}
                      className={`flex-1 h-14 rounded-2xl border font-black text-[10px] uppercase tracking-normal transition-all ${form.hospitalizationType === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setStepReady(true)}
                  disabled={!claimType || !form.claimCycle}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-normal text-[10px] transition-all ${claimType && form.claimCycle ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 active:scale-95' : 'bg-slate-100 text-slate-300'}`}
                >
                  {stepReady ? '✓ Category Set' : 'Next Step'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* STEP 2: FORM DETAILS */}
        <AnimatePresence>
          {stepReady && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit} className="space-y-8"
            >
              <section className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 p-8 md:p-10 border border-slate-100">
                <div className="flex items-center mb-8 gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200">02</div>
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
                      const sel = DEPENDENT_DATA.find(d => d.id === v);
                      updateField('dependentId', v);
                      updateField('dependentName', sel?.name || '');
                    }}
                    options={DEPENDENT_DATA.map(d => ({ value: d.id, label: d.label }))}
                  />

                  <CustomDatePicker label="Admission Date" value={form.admissionDate} onChange={(val) => updateField('admissionDate', val)} max={todayString} />
                  <CustomDatePicker label="Discharge Date" value={form.dischargeDate} onChange={(val) => updateField('dischargeDate', val)} max={todayString} />

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital Address</label>
                    <textarea rows="3" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-700 border resize-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" value={form.hospitalAddress} onChange={e => updateField('hospitalAddress', e.target.value)} placeholder="Full facility name and street address..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requested Amount (INR)</label>
                    <input type="number" className="w-full h-14 rounded-2xl border-slate-200 bg-slate-50 px-5 font-black text-slate-900 border focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" value={form.claimedAmount} onChange={e => updateField('claimedAmount', e.target.value)} placeholder="₹ 0.00" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Day Care Procedure?</label>
                    <div className="flex gap-2">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt} type="button"
                          onClick={() => updateField('dayCare', opt)}
                          className={`flex-1 h-14 rounded-2xl border font-black text-[10px] uppercase tracking-normal transition-all ${form.dayCare === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Diagnosis</label>
                    <textarea rows="3" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-700 border resize-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" value={form.diagnosis} onChange={e => updateField('diagnosis', e.target.value)} placeholder="Provide diagnosis details..." />
                  </div>
                </div>
              </section>

              <div className="flex justify-center">
                <button type="submit" disabled={submitting || !validate()} className={`w-full sm:w-80 h-16 rounded-[2rem] font-black tracking-normal text-[11px] uppercase transition-all shadow-2xl ${validate() ? 'bg-blue-600 text-white shadow-blue-200 hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  {submitting ? 'Processing...' : 'Submit Claim Request'}
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