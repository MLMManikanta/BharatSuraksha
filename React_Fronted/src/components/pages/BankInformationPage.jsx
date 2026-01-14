import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

/**
 * BANK INFORMATION PAGE
 * ═════════════════════════════════════════════════════════════
 * 
 * Purpose: Collect banking details for:
 * 1. Pre-hospitalization claims
 * 2. Post-hospitalization claims
 * 3. Reimbursement claims
 * 
 * ═════════════════════════════════════════════════════════════
 */

const BankInformationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  // ═══ STATE MANAGEMENT ═══
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: 'Savings',
    preHospitalization: 'Bank Transfer',
    postHospitalization: 'Bank Transfer',
    reimbursement: 'Bank Transfer',
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});

  // ═══ HANDLER ═══
  const handleChange = (field, value) => {
    setBankData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ═══ VALIDATION ═══
  const validateForm = () => {
    const errors = {};

    if (!bankData.accountHolderName.trim()) errors.accountHolderName = 'Required';
    if (!bankData.accountNumber.trim()) errors.accountNumber = 'Required';
    if (!/^\d{9,18}$/.test(bankData.accountNumber)) errors.accountNumber = 'Invalid account number';
    if (!bankData.ifscCode.trim()) errors.ifscCode = 'Required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode)) errors.ifscCode = 'Invalid IFSC code';
    if (!bankData.bankName.trim()) errors.bankName = 'Required';
    if (!bankData.termsAccepted) errors.termsAccepted = 'Accept terms';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══ SUBMIT ═══
  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Proceed to payment page
    navigate('/payment', {
      state: {
        ...planData,
        bankData: {
          ...bankData,
          submittedAt: new Date().toISOString()
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={6} />

      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Payment Details</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Provide your banking information for claim settlements and reimbursements.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* INFO BANNER */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800 font-medium">
            ℹ️ Your bank details are encrypted and secured. They are used solely for claim settlements.
          </p>
        </div>

        {/* SECTION 1: BANK ACCOUNT DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Bank Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Holder Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.accountHolderName}
                onChange={(e) => handleChange('accountHolderName', e.target.value)}
                placeholder="Enter account holder name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.accountHolderName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.accountHolderName && <p className="text-red-600 text-xs mt-1">{formErrors.accountHolderName}</p>}
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Type <span className="text-red-600">*</span>
              </label>
              <select
                value={bankData.accountType}
                onChange={(e) => handleChange('accountType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Savings">Savings Account</option>
                <option value="Current">Current Account</option>
                <option value="Business">Business Account</option>
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                placeholder="Enter 9-18 digit account number"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.accountNumber
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.accountNumber && <p className="text-red-600 text-xs mt-1">{formErrors.accountNumber}</p>}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                IFSC Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                maxLength="11"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.ifscCode
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.ifscCode && <p className="text-red-600 text-xs mt-1">{formErrors.ifscCode}</p>}
            </div>

            {/* Bank Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="e.g., State Bank of India"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.bankName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.bankName && <p className="text-red-600 text-xs mt-1">{formErrors.bankName}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2: CLAIM PAYMENT MODE */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
            Claim Payment Mode
          </h2>

          <div className="space-y-6">
            {/* Pre-hospitalization Claims */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Pre-hospitalization Claims
              </label>
              <div className="flex gap-4">
                {['Bank Transfer', 'Cheque', 'Draft'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preHospitalization"
                      value={mode}
                      checked={bankData.preHospitalization === mode}
                      onChange={(e) => handleChange('preHospitalization', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Post-hospitalization Claims */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Post-hospitalization Claims
              </label>
              <div className="flex gap-4">
                {['Bank Transfer', 'Cheque', 'Draft'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="postHospitalization"
                      value={mode}
                      checked={bankData.postHospitalization === mode}
                      onChange={(e) => handleChange('postHospitalization', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reimbursement Claims */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Reimbursement Claims
              </label>
              <div className="flex gap-4">
                {['Bank Transfer', 'Cheque', 'Draft'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reimbursement"
                      value={mode}
                      checked={bankData.reimbursement === mode}
                      onChange={(e) => handleChange('reimbursement', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              ✓ We recommend Bank Transfer for faster claim settlements. Funds are typically transferred within 2-3 business days.
            </p>
          </div>
        </div>

        {/* SECTION 3: TERMS & CONDITIONS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
            Terms & Conditions
          </h2>

          <label className="flex items-start gap-3 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              checked={bankData.termsAccepted}
              onChange={(e) => handleChange('termsAccepted', e.target.checked)}
              className="w-4 h-4 mt-1"
            />
            <span className="text-sm text-blue-900">
              I confirm that the bank details provided are correct and accurate. I authorize Bharat Suraksha to use these details for claim settlements, reimbursements, and other policy-related transactions.
            </span>
          </label>
          {formErrors.termsAccepted && <p className="text-red-600 text-xs mt-2">{formErrors.termsAccepted}</p>}

          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
            <p className="text-xs text-amber-800 font-medium">
              ⚠️ Please ensure you provide your own bank account details. Claims will only be settled to the account provided here.
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full py-5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-blue-500/30"
          >
            Proceed to Payment →
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankInformationPage;
