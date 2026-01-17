import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';

const RaiseClaim = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const claimTypes = useMemo(() => [
    'Hospitalization',
    'Pre-Post Hospitalization',
    'Preventive Health Check-up',
    'Dental',
  ], []);

  const claimCycles = useMemo(() => [
    'Fresh Claim',
    'Reimbursement',
    'Follow-up / Continuation',
  ], []);

  const dependents = useMemo(() => [
    { id: 'DEP001', label: 'Priya Sharma (32)' },
    { id: 'DEP002', label: 'Aarav Sharma (7)' },
    { id: 'DEP003', label: 'Meera Sharma (58)' },
  ], []);

  const [claimType, setClaimType] = useState('');
  const [form, setForm] = useState({
    claimCycle: '',
    dependentId: '',
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
  const [draftSaved, setDraftSaved] = useState(false);
  const [stepReady, setStepReady] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!claimType) next.claimType = 'Select claim type to proceed';
    if (!form.claimCycle) next.claimCycle = 'Claim cycle is required';
    if (claimType === 'Pre-Post Hospitalization' && !form.hospitalizationType) next.hospitalizationType = 'Select type of hospitalization';
    if (!form.dependentId) next.dependentId = 'Select a dependent';
    if (!form.dayCare) next.dayCare = 'Please choose Yes or No';
    if (!form.admissionDate) next.admissionDate = 'Admission date is required';
    if (!form.dischargeDate) next.dischargeDate = 'Discharge date is required';
    if (!form.mobile || form.mobile.trim().length < 10) next.mobile = 'Enter a valid mobile number';
    if (!form.hospitalAddress.trim()) next.hospitalAddress = 'Hospital name & address is required';
    if (!form.diagnosis.trim()) next.diagnosis = 'Diagnosis is required';
    if (!form.claimedAmount || Number(form.claimedAmount) <= 0) next.claimedAmount = 'Enter a valid claimed amount';
    if (!form.consentSummary) next.consentSummary = 'Required';
    if (!form.consentTerms) next.consentTerms = 'Required';
    return next;
  };

  const isFormComplete = () => {
    const nextErrors = validate();
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setDraftSaved(false);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post(
        '/api/claims',
        {
          claimType,
          ...form,
        },
        { auth: true }
      );
      navigate('/claims/my-claims', { replace: true, state: { toast: 'Claim submitted successfully' } });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Utility bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-sm">
          <div className="font-medium text-gray-700">📝 Raise New Claim</div>
          <div className="text-gray-500">Complete steps and submit with required consents.</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">➕ Raise New Claim</h1>
          <p className="mt-2 text-gray-600">Submit your claim with mandatory medical, policy, and document details.</p>
        </div>

        {/* Sub-navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex border-b border-gray-200" aria-label="Claims Navigation">
            <Link
              to="/claims/my-claims"
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive('/claims/my-claims') ? 'text-blue-600 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300 border-transparent'}`}
            >
              🧾 My Claims
            </Link>
            <Link
              to="/claims/entitlement-dependents"
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive('/claims/entitlement-dependents') ? 'text-blue-600 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300 border-transparent'}`}
            >
              👪 Entitlement & Dependent Details
            </Link>
            <Link
              to="/claims/raise-claim"
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive('/claims/raise-claim') ? 'text-blue-600 border-blue-600' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300 border-transparent'}`}
              aria-current="page"
            >
              ➕ Raise New Claim
            </Link>
          </nav>
        </div>

        {/* Step 1: Claim Type */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase">Step 1</p>
              <h2 className="text-xl font-bold text-gray-900 mt-1">Select Claim Type</h2>
              <p className="text-sm text-gray-600 mt-1">Choose the claim type to unlock the details form.</p>
            </div>
            <div className="text-right text-sm text-gray-500">Required</div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={claimType}
                onChange={(e) => {
                  const val = e.target.value;
                  setClaimType(val);
                  setStepReady(false);
                  if (val !== 'Pre-Post Hospitalization') {
                    updateField('hospitalizationType', '');
                  }
                }}
              >
                <option value="">Select claim type</option>
                {claimTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.claimType && <p className="text-sm text-red-600 mt-1">{errors.claimType}</p>}
            </div>

            {claimType === 'Pre-Post Hospitalization' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">Type of Hospitalization</p>
                <div className="flex flex-wrap gap-3">
                  {["Pre Hospitalization", "Post Hospitalization"].map((opt) => (
                    <label key={opt} className={`px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                      form.hospitalizationType === opt
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                      <input
                        type="radio"
                        name="hospitalizationType"
                        value={opt}
                        className="sr-only"
                        onChange={() => updateField('hospitalizationType', opt)}
                        checked={form.hospitalizationType === opt}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.hospitalizationType && <p className="text-sm text-red-600">{errors.hospitalizationType}</p>}
              </div>
            )}

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setStepReady(Boolean(claimType))}
                disabled={!claimType}
                className={`w-full md:w-auto px-4 py-2 rounded-lg font-semibold ${
                  claimType ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Proceed
              </button>
              {!claimType && (
                <div className="mt-3 text-sm text-gray-500">Select a claim type to proceed.</div>
              )}
            </div>
          </div>

          {!claimType && (
            <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span aria-hidden>🕑</span>
                <span>Waiting for claim type selection.</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Claim Details Form */}
        <form onSubmit={handleSubmit} className={`bg-white rounded-lg shadow-sm p-6 space-y-8 ${!stepReady ? 'opacity-60 pointer-events-none' : ''}`} noValidate>
          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase">Step 2</p>
              <h2 className="text-xl font-bold text-gray-900 mt-1">Claim Details</h2>
              <p className="text-sm text-gray-600 mt-1">Fill all mandatory fields. Submit is enabled only when complete.</p>
            </div>
            {draftSaved && <div className="text-sm text-green-700 font-medium">Draft saved</div>}
          </div>

          {/* Basic Details */}
          <section className="space-y-4" aria-labelledby="basic-details">
            <div className="flex items-center justify-between">
              <h3 id="basic-details" className="text-lg font-semibold text-gray-900">Basic Details</h3>
              <span className="text-xs text-gray-500">All fields required</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Claim Cycle</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.claimCycle}
                  onChange={(e) => updateField('claimCycle', e.target.value)}
                >
                  <option value="">Select claim cycle</option>
                  {claimCycles.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.claimCycle && <p className="text-sm text-red-600 mt-1">{errors.claimCycle}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Dependent</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.dependentId}
                  onChange={(e) => updateField('dependentId', e.target.value)}
                >
                  <option value="">Select dependent</option>
                  {dependents.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
                {errors.dependentId && <p className="text-sm text-red-600 mt-1">{errors.dependentId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Is this one day care?</label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField('dayCare', v)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        form.dayCare === v
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {errors.dayCare && <p className="text-sm text-red-600 mt-1">{errors.dayCare}</p>}
              </div>
            </div>
          </section>

          {/* Hospitalization Details */}
          <section className="space-y-4" aria-labelledby="hosp-details">
            <div className="flex items-center justify-between">
              <h3 id="hosp-details" className="text-lg font-semibold text-gray-900">Hospitalization Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.admissionDate}
                  onChange={(e) => updateField('admissionDate', e.target.value)}
                />
                {errors.admissionDate && <p className="text-sm text-red-600 mt-1">{errors.admissionDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discharge Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.dischargeDate}
                  onChange={(e) => updateField('dischargeDate', e.target.value)}
                />
                {errors.dischargeDate && <p className="text-sm text-red-600 mt-1">{errors.dischargeDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.mobile}
                  onChange={(e) => updateField('mobile', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="10-digit mobile number"
                  maxLength={15}
                />
                {errors.mobile && <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section className="space-y-4" aria-labelledby="medical-info">
            <div className="flex items-center justify-between">
              <h3 id="medical-info" className="text-lg font-semibold text-gray-900">Medical Information</h3>
              <span className="text-xs text-gray-500">Max 500 chars each</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name & Address</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  maxLength={500}
                  value={form.hospitalAddress}
                  onChange={(e) => updateField('hospitalAddress', e.target.value)}
                  placeholder="Enter full hospital/clinic name and address"
                />
                {errors.hospitalAddress && <p className="text-sm text-red-600 mt-1">{errors.hospitalAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  maxLength={500}
                  value={form.diagnosis}
                  onChange={(e) => updateField('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis details"
                />
                {errors.diagnosis && <p className="text-sm text-red-600 mt-1">{errors.diagnosis}</p>}
              </div>
            </div>
          </section>

          {/* Financial Details */}
          <section className="space-y-4" aria-labelledby="financial-details">
            <h3 id="financial-details" className="text-lg font-semibold text-gray-900">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Claimed Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.claimedAmount}
                  onChange={(e) => updateField('claimedAmount', e.target.value)}
                  placeholder="0"
                />
                {errors.claimedAmount && <p className="text-sm text-red-600 mt-1">{errors.claimedAmount}</p>}
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="space-y-3" aria-labelledby="additional-info">
            <div className="flex items-center justify-between">
              <h3 id="additional-info" className="text-lg font-semibold text-gray-900">Additional Information</h3>
              <span className="text-xs text-gray-500">Max 500 chars</span>
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              maxLength={500}
              value={form.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              placeholder="Add any remarks (optional)"
            />
          </section>

          {/* Declarations */}
          <section className="space-y-3" aria-labelledby="declarations">
            <h3 id="declarations" className="text-lg font-semibold text-gray-900">Declarations & Consent</h3>
            <label className="flex items-start gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                checked={form.consentSummary}
                onChange={(e) => updateField('consentSummary', e.target.checked)}
              />
              <span>Original discharge summary is as per attached guidelines <a href="#" className="text-blue-600 underline">Read more</a></span>
            </label>
            {errors.consentSummary && <p className="text-sm text-red-600">{errors.consentSummary}</p>}

            <label className="flex items-start gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                checked={form.consentTerms}
                onChange={(e) => updateField('consentTerms', e.target.checked)}
              />
              <span>I agree with Terms & Conditions</span>
            </label>
            {errors.consentTerms && <p className="text-sm text-red-600">{errors.consentTerms}</p>}
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            {Object.keys(errors).length > 0 && (
              <div className="w-full sm:w-auto text-sm text-red-600 font-medium">All fields are required</div>
            )}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => navigate('/claims/my-claims')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                ← Cancel & Back to My Claims
              </button>
              <button
                type="submit"
                disabled={submitting || !isFormComplete()}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                  submitting || !isFormComplete()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseClaim;
