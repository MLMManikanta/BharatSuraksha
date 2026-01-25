import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../../utils/api';
import ClaimsTopLinks from '../../common/ClaimsTopLinks';
import CustomSelect from '../../common/CustomSelect';
import CustomDatePicker from '../../common/CustomDatePicker';

// Verified Member List
const DEPENDENT_DATA = [
  { id: "DEP001", name: "Arjun Gupta", label: "Arjun Gupta (Self)" },
  { id: "DEP002", name: "Bhavani Gupta", label: "Bhavani Gupta (Spouse)" },
  { id: "DEP003", name: "Maruthi Gupta", label: "Maruthi Gupta (Son)" },
  { id: "DEP004", name: "Harshi Gupta", label: "Harshi Gupta (Daughter)" },
  { id: "DEP005", name: "Eswar Gupta", label: "Eswar Gupta (Son)" },
];

const RaiseClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dependentId: urlDependentId } = useParams();
  const [searchParams] = useSearchParams();

  const claimTypes = useMemo(() => [
    'Hospitalization',
    'Pre-Post Hospitalization',
    'Preventive Health Check-up',
  ], []);

  const claimCycles = useMemo(() => [
    'Fresh Claim',
    'Reimbursement',
    'Follow-up / Continuation',
  ], []);

  const [claimType, setClaimType] = useState('');
  const [form, setForm] = useState({
    claimCycle: '',
    dependentId: urlDependentId || '',
    dependentName: '',
    dayCare: '',
    admissionDate: '',
    dischargeDate: '',
    mobile: '',
    hospitalAddress: '',
    diagnosis: '',
    claimedAmount: '',
    remarks: '',
    consentSummary: false,
    consentTerms: false,
    hospitalizationType: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stepReady, setStepReady] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editClaimId, setEditClaimId] = useState(null);
  const todayString = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Load Initial Data for Editing
  useEffect(() => {
    const editClaim = location.state?.claim;
    if (editClaim) {
      setEditClaimId(editClaim._id);
      setClaimType(editClaim.claimType || '');
      setForm(prev => ({ ...prev, ...editClaim }));
      setStepReady(true);
    }
  }, [location.state]);

  const validate = () => {
    const next = {};
    const admission = form.admissionDate ? new Date(form.admissionDate) : null;
    const discharge = form.dischargeDate ? new Date(form.dischargeDate) : null;

    if (!claimType) next.claimType = 'Required';
    if (!form.claimCycle) next.claimCycle = 'Required';
    if (!form.dependentId) next.dependentId = 'Required';
    if (!form.dayCare) next.dayCare = 'Required';
    if (!form.admissionDate) next.admissionDate = 'Required';
    if (!form.dischargeDate) next.dischargeDate = 'Required';
    if (admission && discharge && discharge < admission) next.dischargeDate = 'Invalid range';
    if (!form.hospitalAddress.trim()) next.hospitalAddress = 'Required';
    if (!form.diagnosis.trim()) next.diagnosis = 'Required';
    if (!form.claimedAmount || Number(form.claimedAmount) <= 0) next.claimedAmount = 'Required';
    if (!form.consentSummary || !form.consentTerms) next.consent = 'Consents required';
    
    return next;
  };

  const isFormComplete = () => Object.keys(validate()).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

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
    <div className="min-h-screen bg-slate-50 font-sans">
      <ClaimsTopLinks />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">➕ Raise New Claim</h1>
          <p className="mt-2 text-lg text-slate-600">Ensure all medical documents are ready before submission.</p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 p-1.5 border border-slate-200">
          <nav className="flex items-center gap-1">
            <Link to="/claims/my-claims" className="flex-1 px-6 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-center transition-all">
              🧾 My Claims
            </Link>
            <Link to="/claims/entitlement-dependents" className="flex-1 px-6 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-center transition-all">
              👪 Entitlement & Dependents
            </Link>
            <span className="flex-1 px-6 py-3.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-xl text-center shadow-sm ring-1 ring-blue-700/10">
              ➕ Raise New Claim
            </span>
          </nav>
        </div>

        {/* STEP 1: SELECT CLAIM TYPE */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-slate-200">
          <div className="flex items-center mb-8 gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">01</div>
            <h2 className="text-xl font-black text-slate-900">Claim Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <CustomSelect
                label="Claim Type"
                value={claimType}
                onChange={(v) => { setClaimType(v); setStepReady(false); updateField('hospitalizationType', ''); }}
                options={["", ...claimTypes].map(o => (o === "" ? { value: "", label: "Select category..." } : { value: o, label: o }))}
              />
            </div>

            <div className="space-y-2">
              <CustomSelect
                label="Claim Cycle"
                value={form.claimCycle}
                onChange={(v) => { updateField('claimCycle', v); setStepReady(false); }}
                options={[{ value: '', label: 'Select cycle...' }, ...claimCycles.map(c => ({ value: c, label: c }))]}
              />
            </div>

            {claimType === 'Pre-Post Hospitalization' ? (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Sub-Category</label>
                <div className="flex gap-2">
                  {['Pre', 'Post'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { updateField('hospitalizationType', opt); setStepReady(false); }}
                      className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${form.hospitalizationType === opt ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
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
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${claimType && form.claimCycle ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
                >
                  {stepReady ? 'Category Selected' : 'Proceed to Details'}
                </button>
              </div>
            )}

            {claimType === 'Pre-Post Hospitalization' && (
              <div className="lg:col-start-3 flex items-end">
                <button
                  type="button"
                  onClick={() => setStepReady(true)}
                  disabled={!claimType || !form.claimCycle || !form.hospitalizationType}
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${(claimType && form.claimCycle && form.hospitalizationType) ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-300'}`}
                >
                  {stepReady ? 'Category Selected' : 'Proceed to Details'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: FORM DETAILS */}
        <form onSubmit={handleSubmit} className={`space-y-8 transition-all duration-500 ${!stepReady ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          {submitError && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 font-bold text-sm">{submitError}</div>}

          <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
            <div className="flex items-center mb-8 gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">02</div>
              <h2 className="text-xl font-black text-slate-900">Member & Hospital Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-[15px] font-bold text-blue-800">
                <CustomSelect
                  label="Verified Member"
                  value={form.dependentId}
                  onChange={(v) => {
                    const sel = DEPENDENT_DATA.find(d => d.id === v);
                    updateField('dependentId', v);
                    updateField('dependentName', sel?.name || '');
                  }}
                  options={[{ value: '', label: 'Choose member...' }, ...DEPENDENT_DATA.map(d => ({ value: d.id, label: d.label }))]}
                />
              </div>

              <div className="space-y-2">
                <CustomDatePicker
                  label="Admission Date"
                  value={form.admissionDate}
                  onChange={(val) => updateField('admissionDate', val)}
                  max={todayString}
                />
              </div>

              <div className="space-y-2">
                <CustomDatePicker
                  label="Discharge Date"
                  value={form.dischargeDate}
                  onChange={(val) => updateField('dischargeDate', val)}
                  max={todayString}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[15px] font-bold text-blue-800">Hospital Name & Full Address</label>
                <textarea rows="3" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 border resize-none focus:ring-2 focus:ring-blue-500 outline-none" value={form.hospitalAddress} onChange={e => updateField('hospitalAddress', e.target.value)} placeholder="Enter details..." />
              </div>

              <div className="space-y-2">
                <label className="text-[15px] font-bold text-blue-800">Claimed Amount (INR)</label>
                <input type="number" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-900 border focus:ring-2 focus:ring-blue-500 outline-none" value={form.claimedAmount} onChange={e => updateField('claimedAmount', e.target.value)} placeholder="₹ 0.00" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[15px] font-bold text-blue-800">Is this one day care?</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('dayCare', opt)}
                      className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${form.dayCare === opt ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[15px] font-bold text-blue-800">Diagnosis</label>
                <textarea rows="3" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 border resize-none focus:ring-2 focus:ring-blue-500 outline-none" value={form.diagnosis} onChange={e => updateField('diagnosis', e.target.value)} placeholder="Provide primary diagnosis / ICD code if available" />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-6">Declarations</h3>
            <div className="space-y-4">
              {[
                { key: 'consentSummary', text: 'I certify that the discharge summary and medical reports provided are authentic.' },
                { key: 'consentTerms', text: 'I agree to the Bharat Suraksha Terms of Service and Privacy Policy.' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" checked={form[item.key]} onChange={e => updateField(item.key, e.target.checked)} />
                  <span className="text-sm font-semibold text-slate-600">{item.text}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
            <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-8 py-3 font-bold text-slate-400 hover:text-slate-600 tracking-widest text-xs transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={submitting || !isFormComplete()}
              className={`w-full sm:w-auto px-12 py-4 rounded-xl font-black tracking-widest text-xs transition-all shadow-xl ${isFormComplete() ? 'bg-blue-600 text-white shadow-blue-200 hover:scale-105' : 'bg-slate-100 text-slate-300 shadow-none'}`}
            >
              {submitting ? 'Submitting...' : 'Confirm & Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseClaim;