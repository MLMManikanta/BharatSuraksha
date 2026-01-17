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
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: 'Savings',
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

    if (!selectedFrequency) errors.frequency = 'Please select payment frequency';
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

    // Proceed to order summary page
    navigate('/order-summary', {
      state: {
        ...planData,
        paymentFrequency: selectedFrequency,
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
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Payment & Banking Details</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Select your payment frequency and provide banking information for claim settlements.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* INFO BANNER */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800 font-medium">
            ℹ️ Your bank details are encrypted and secured. Choose longer payment terms for better discounts!
          </p>
        </div>

        {/* SECTION 1: PAYMENT FREQUENCY */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Payment Frequency
          </h2>

          {formErrors.frequency && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{formErrors.frequency}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'monthly', label: 'Monthly', icon: '📅', discount: '0%', badge: 'Most Flexible' },
              { id: 'quarterly', label: 'Quarterly', icon: '📊', discount: '2%', badge: 'Popular' },
              { id: 'halfyearly', label: 'Half-Yearly', icon: '📈', discount: '5%', badge: 'Save More' },
              { id: 'yearly', label: 'Yearly', icon: '💰', discount: '10%', badge: 'Best Value' }
            ].map((option) => (
              <label
                key={option.id}
                className={`relative cursor-pointer group ${
                  selectedFrequency === option.id
                    ? 'ring-4 ring-blue-500'
                    : 'hover:ring-2 hover:ring-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.id}
                  checked={selectedFrequency === option.id}
                  onChange={(e) => {
                    setSelectedFrequency(e.target.value);
                    setFormErrors(prev => ({ ...prev, frequency: '' }));
                  }}
                  className="sr-only"
                />
                
                <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                  selectedFrequency === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white group-hover:border-blue-300'
                }`}>
                  
                  {option.badge && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      {option.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{option.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{option.label}</h3>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Discount:</span>
                      <span className="text-lg font-bold text-blue-600">{option.discount} OFF</span>
                    </div>
                  </div>

                  {selectedFrequency === option.id && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 2: BANK ACCOUNT DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
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
