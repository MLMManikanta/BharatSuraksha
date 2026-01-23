import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';
import { submitBankDetails } from '../../utils/api';

/**
 * PAYMENT & BANKING DETAILS PAGE
 * ═════════════════════════════════════════════════════════════
 * 
 * Purpose: 
 * 1. Select payment frequency with discount calculations
 * 2. Collect banking details for claim settlements
 * 
 * ═════════════════════════════════════════════════════════════
 */

const BankInformationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get planData from navigation state or sessionStorage fallback
  const planData = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }
    // Fallback to sessionStorage
    const stored = sessionStorage.getItem('planData');
    return stored ? JSON.parse(stored) : {};
  }, [location.state]);

  // Get premium calculations from sessionStorage if not in planData
  const storedCalculations = useMemo(() => {
    const stored = sessionStorage.getItem('premiumCalculations');
    return stored ? JSON.parse(stored) : null;
  }, []);

  // ═══ STATE MANAGEMENT ═══
  const [selectedFrequency, setSelectedFrequency] = useState('yearly');
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'Savings',
    termsAccepted: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Get base premium from planData - prioritize the calculated totalPayable from PaymentSummary
  // Also check sessionStorage for backup
  const basePremium = useMemo(() => {
    return (
      planData.paymentDetails?.totalPayable ||       // From PaymentSummary calculations (state)
      planData.paymentDetails?.finalAnnualPremium || // Annual premium with GST (state)
      storedCalculations?.totalPayable ||            // From sessionStorage backup
      storedCalculations?.finalAnnualPremium ||      // From sessionStorage backup
      planData.paymentDetails?.netPremium ||         // Net premium before GST
      storedCalculations?.netPremium ||              // From sessionStorage backup
      planData.totalPremium || 
      planData.premium || 
      0
    );
  }, [planData, storedCalculations]);

  const planName = planData.planName || planData.selectedPlan?.planName || 'Health Insurance Plan';
  const coverageAmount = planData.coverage || planData.selectedPlan?.coverage || '';

  // Calculate pricing for each frequency option
  const frequencyOptions = useMemo(() => {
    const options = [
      { 
        id: 'monthly', 
        label: 'Monthly', 
        icon: '📅', 
        discountRate: 0, 
        badge: null,
        tagline: 'Most Flexible',
        description: 'Pay in 12 easy installments',
        paymentsPerYear: 12,
        paymentLabel: 'month'
      },
      { 
        id: 'quarterly', 
        label: 'Quarterly', 
        icon: '📊', 
        discountRate: 2, 
        badge: 'Popular',
        tagline: 'Save 2%',
        description: 'Pay every 3 months',
        paymentsPerYear: 4,
        paymentLabel: 'quarter'
      },
      { 
        id: 'halfyearly', 
        label: 'Half-Yearly', 
        icon: '📈', 
        discountRate: 5, 
        badge: 'Save More',
        tagline: 'Save 5%',
        description: 'Pay every 6 months',
        paymentsPerYear: 2,
        paymentLabel: '6 months'
      },
      { 
        id: 'yearly', 
        label: 'Annual', 
        icon: '💰', 
        discountRate: 10, 
        badge: 'Best Value',
        tagline: 'Save 10%',
        description: 'One-time annual payment',
        paymentsPerYear: 1,
        paymentLabel: 'year'
      }
    ];

    return options.map(option => {
      const discountAmount = Math.round(basePremium * (option.discountRate / 100));
      const discountedTotal = basePremium - discountAmount;
      const perPayment = Math.round(discountedTotal / option.paymentsPerYear);
      
      return {
        ...option,
        discountAmount,
        discountedTotal,
        perPayment,
        originalPerPayment: Math.round(basePremium / option.paymentsPerYear)
      };
    });
  }, [basePremium]);

  // Get selected frequency details
  const selectedOption = useMemo(() => {
    return frequencyOptions.find(o => o.id === selectedFrequency) || frequencyOptions[3];
  }, [frequencyOptions, selectedFrequency]);

  // ═══ HANDLER ═══
  const handleChange = (field, value) => {
    // Handle IFSC code auto-formatting (uppercase)
    if (field === 'ifscCode') {
      value = value.toUpperCase();
    }
    
    setBankData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // ═══ VALIDATION ═══
  const validateForm = () => {
    const errors = {};

    if (!selectedFrequency) errors.frequency = 'Please select payment frequency';
    if (!bankData.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required';
    if (!bankData.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    else if (!/^\d{9,18}$/.test(bankData.accountNumber)) errors.accountNumber = 'Enter valid 9-18 digit account number';
    if (bankData.accountNumber !== bankData.confirmAccountNumber) errors.confirmAccountNumber = 'Account numbers do not match';
    if (!bankData.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode)) errors.ifscCode = 'Invalid IFSC format (e.g., SBIN0001234)';
    if (!bankData.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!bankData.termsAccepted) errors.termsAccepted = 'Please accept the terms and conditions';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══ SUBMIT ═══
  const handleSubmit = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Include payment calculations in the submission
    const bankSubmitData = {
      paymentFrequency: selectedFrequency,
      // Payment calculations
      basePremium: basePremium,
      discountRate: selectedOption.discountRate,
      discountAmount: selectedOption.discountAmount,
      discountedTotal: selectedOption.discountedTotal,
      perPaymentAmount: selectedOption.perPayment,
      paymentsPerYear: selectedOption.paymentsPerYear,
      // Bank details
      accountHolderName: bankData.accountHolderName,
      accountNumber: bankData.accountNumber,
      ifscCode: bankData.ifscCode,
      bankName: bankData.bankName,
      branchName: bankData.branchName,
      accountType: bankData.accountType,
      termsAccepted: bankData.termsAccepted,
      // References
      kycId: planData.kycId || null,
      medicalInfoId: planData.medicalInfoId || null,
      planData: planData,
      submittedAt: new Date().toISOString()
    };

    try {
      // Get userId from localStorage if available (optional for new users)
      const userId = localStorage.getItem('userId');

      // Submit Bank Details to backend
      const response = await submitBankDetails({
        ...bankSubmitData,
        ...(userId && { userId })
      });

      if (response.success) {
        // Build complete order data
        const orderData = {
          ...planData,
          // Payment frequency and calculations
          paymentFrequency: selectedFrequency,
          paymentDetails: {
            // Preserve original calculations from PaymentSummary
            ...planData.paymentDetails,
            ...storedCalculations, // Include sessionStorage backup
            // Add/override with frequency-based calculations
            basePremium: basePremium,
            discountRate: selectedOption.discountRate,
            discountAmount: selectedOption.discountAmount,
            discountedTotal: selectedOption.discountedTotal,
            perPaymentAmount: selectedOption.perPayment,
            paymentsPerYear: selectedOption.paymentsPerYear,
            paymentLabel: selectedOption.paymentLabel,
            frequencyLabel: selectedOption.label
          },
          // Also store the original PaymentSummary calculations separately for reference
          originalPremiumCalculations: planData.paymentDetails || storedCalculations,
          // Bank details
          bankData: {
            accountHolderName: bankData.accountHolderName,
            bankName: bankData.bankName,
            accountType: bankData.accountType,
            lastFourDigits: bankData.accountNumber.slice(-4),
            submittedAt: new Date().toISOString()
          },
          bankDetailsId: response.data?.bankDetailsId
        };

        // Store in sessionStorage as backup
        sessionStorage.setItem('orderData', JSON.stringify(orderData));
        
        // Proceed to order summary page with complete payment details
        navigate('/order-summary', { state: orderData });
      } else {
        setSubmitError(response.message || 'Failed to submit bank details. Please try again.');
      }
    } catch (error) {
      console.error('Bank details submission error:', error);
      setSubmitError(
        error.data?.message || 
        error.message || 
        'An error occurred while submitting bank details. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <CheckoutStepper currentStep={6} />

      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pt-10 pb-28 px-4 rounded-b-[3rem] shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">💳</span>
            <span className="text-sm font-medium">Step 6 of 8</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Payment & Banking Details</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Choose your preferred payment schedule and provide banking details for seamless claim settlements
          </p>

          {/* Plan Summary Badge */}
          {planName && (
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl mt-4">
              <span className="text-xl">🛡️</span>
              <div className="text-left">
                <p className="text-xs text-blue-200">Selected Plan</p>
                <p className="font-bold">{planName} {coverageAmount && `• ${coverageAmount}`}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        
        {/* PREMIUM BREAKDOWN CARD - Floating Card */}
        {basePremium > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left - Base Premium */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Base Annual Premium</p>
                  <p className="text-3xl font-black text-gray-900">₹{basePremium.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">Before discount</p>
                </div>
              </div>

              {/* Right - Selected Frequency Summary */}
              {selectedOption && (
                <div className="flex items-center gap-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="text-center">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Your Payment</p>
                    <p className="text-3xl font-black text-green-700">₹{selectedOption.perPayment.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-green-600">per {selectedOption.paymentLabel}</p>
                  </div>
                  {selectedOption.discountRate > 0 && (
                    <div className="pl-4 border-l border-green-300">
                      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {selectedOption.discountRate}% OFF
                      </div>
                      <p className="text-sm text-green-700 font-bold mt-1">
                        Save ₹{selectedOption.discountAmount.toLocaleString('en-IN')}/yr
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 1: PAYMENT FREQUENCY */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Choose Payment Frequency</h2>
              <p className="text-sm text-gray-500">Pay less with longer terms • Higher discount for annual payment</p>
            </div>
          </div>

          {formErrors.frequency && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{formErrors.frequency}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {frequencyOptions.map((option) => (
              <label
                key={option.id}
                className={`relative cursor-pointer group transition-all duration-300 ${
                  selectedFrequency === option.id
                    ? 'scale-[1.02]'
                    : 'hover:scale-[1.01]'
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
                
                <div className={`p-6 rounded-2xl border-2 transition-all duration-300 h-full ${
                  selectedFrequency === option.id
                    ? 'border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                }`}>
                  
                  {/* Badge */}
                  {option.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg ${
                      option.id === 'yearly' ? 'bg-linear-to-r from-green-500 to-emerald-600' : 
                      option.id === 'halfyearly' ? 'bg-linear-to-r from-blue-500 to-indigo-600' :
                      option.id === 'quarterly' ? 'bg-linear-to-r from-purple-500 to-purple-600' :
                      'bg-gray-500'
                    }`}>
                      {option.badge}
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedFrequency === option.id && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4 mt-2">
                    <span className="text-4xl">{option.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>

                  {/* Price Details */}
                  {basePremium > 0 && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {/* Per Payment Amount */}
                      <div className="flex items-end justify-between">
                        <span className="text-sm text-gray-600">Pay every {option.paymentLabel}:</span>
                        <div className="text-right">
                          {option.discountRate > 0 && (
                            <span className="text-sm text-gray-400 line-through block">
                              ₹{option.originalPerPayment.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-2xl font-black text-gray-900">
                            ₹{option.perPayment.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Payments Info */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{option.paymentsPerYear} payment{option.paymentsPerYear > 1 ? 's' : ''}/year</span>
                        <span className="text-gray-600">
                          = ₹{option.discountedTotal.toLocaleString('en-IN')}/year
                        </span>
                      </div>

                      {/* Discount Badge */}
                      {option.discountRate > 0 ? (
                        <div className="bg-linear-to-r from-green-100 to-emerald-100 -mx-2 px-4 py-3 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎉</span>
                              <span className="font-semibold text-green-800">You Save</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-green-600">
                                ₹{option.discountAmount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm text-green-600 ml-1">
                                ({option.discountRate}% off)
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-100 -mx-2 px-4 py-3 rounded-xl">
                          <div className="flex items-center justify-between text-gray-600">
                            <span className="text-sm">Maximum flexibility</span>
                            <span className="text-sm font-medium">No discount</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Selected Frequency Detail Summary */}
          {selectedFrequency && basePremium > 0 && (
            <div className="mt-8 p-6 bg-linear-to-r from-indigo-600 via-blue-600 to-blue-700 rounded-2xl text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">{selectedOption.icon}</span>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm">Payment Schedule</p>
                    <p className="text-xl font-bold">{selectedOption.label} Payment</p>
                    <p className="text-sm text-blue-200">{selectedOption.paymentsPerYear} payment{selectedOption.paymentsPerYear > 1 ? 's' : ''} of ₹{selectedOption.perPayment.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center md:text-right">
                    <p className="text-blue-200 text-xs uppercase tracking-wider">Total Annual</p>
                    <p className="text-2xl font-black">₹{selectedOption.discountedTotal.toLocaleString('en-IN')}</p>
                  </div>
                  {selectedOption.discountRate > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
                      <p className="text-xs text-blue-200">Savings</p>
                      <p className="text-lg font-bold text-green-300">₹{selectedOption.discountAmount.toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: BANK ACCOUNT DETAILS */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
              2
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bank Account Details</h2>
              <p className="text-sm text-gray-500">For claim settlements and reimbursements</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-semibold text-green-800">Your data is secure</p>
              <p className="text-xs text-green-600">Bank details are encrypted using 256-bit SSL encryption</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Holder Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Holder Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.accountHolderName}
                onChange={(e) => handleChange('accountHolderName', e.target.value)}
                placeholder="Enter name as per bank records"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  formErrors.accountHolderName
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {formErrors.accountHolderName && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>{formErrors.accountHolderName}
                </p>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Type <span className="text-red-600">*</span>
              </label>
              <select
                value={bankData.accountType}
                onChange={(e) => handleChange('accountType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="Savings">💰 Savings Account</option>
                <option value="Current">🏢 Current Account</option>
                <option value="Business">📊 Business Account</option>
              </select>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="e.g., State Bank of India"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  formErrors.bankName
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {formErrors.bankName && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>{formErrors.bankName}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 9-18 digit account number"
                maxLength="18"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  formErrors.accountNumber
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {formErrors.accountNumber && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>{formErrors.accountNumber}
                </p>
              )}
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.confirmAccountNumber}
                onChange={(e) => handleChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="Re-enter account number"
                maxLength="18"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                  formErrors.confirmAccountNumber
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : bankData.confirmAccountNumber && bankData.confirmAccountNumber === bankData.accountNumber
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {formErrors.confirmAccountNumber && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>{formErrors.confirmAccountNumber}
                </p>
              )}
              {bankData.confirmAccountNumber && bankData.confirmAccountNumber === bankData.accountNumber && !formErrors.confirmAccountNumber && (
                <p className="text-green-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>✓</span> Account numbers match
                </p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                IFSC Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value)}
                placeholder="e.g., SBIN0001234"
                maxLength="11"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all uppercase ${
                  formErrors.ifscCode
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
              />
              {formErrors.ifscCode && (
                <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>{formErrors.ifscCode}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">Format: 4 letters + 0 + 6 alphanumeric</p>
            </div>

            {/* Branch Name (Optional) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Branch Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={bankData.branchName}
                onChange={(e) => handleChange('branchName', e.target.value)}
                placeholder="e.g., MG Road Branch"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TERMS & CONDITIONS */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
              3
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Terms & Authorization</h2>
              <p className="text-sm text-gray-500">Review and accept before proceeding</p>
            </div>
          </div>

          <label className={`flex items-start gap-4 cursor-pointer p-5 rounded-2xl border-2 transition-all ${
            bankData.termsAccepted
              ? 'bg-green-50 border-green-300'
              : formErrors.termsAccepted
              ? 'bg-red-50 border-red-300'
              : 'bg-blue-50 border-blue-200 hover:border-blue-400'
          }`}>
            <input
              type="checkbox"
              checked={bankData.termsAccepted}
              onChange={(e) => {
                handleChange('termsAccepted', e.target.checked);
                if (formErrors.termsAccepted) {
                  setFormErrors(prev => ({ ...prev, termsAccepted: null }));
                }
              }}
              className="w-5 h-5 mt-0.5 rounded accent-blue-600"
            />
            <div>
              <p className={`text-sm font-medium ${bankData.termsAccepted ? 'text-green-800' : 'text-blue-900'}`}>
                I confirm that the bank details provided are correct and accurate.
              </p>
              <p className={`text-xs mt-1 ${bankData.termsAccepted ? 'text-green-600' : 'text-blue-700'}`}>
                I authorize Bharat Suraksha to use these details for claim settlements, reimbursements, and other policy-related transactions.
              </p>
            </div>
          </label>
          {formErrors.termsAccepted && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>{formErrors.termsAccepted}
            </p>
          )}

          <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Important Notice</p>
              <p className="text-xs text-amber-700 mt-1">
                Please ensure you provide your own bank account details. Claims will only be settled to the account provided here. 
                Any changes to bank details after policy issuance will require identity verification.
              </p>
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY CARD */}
      {/*   {selectedFrequency && basePremium > 0 && (
          <div className="bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl shadow-2xl p-8 mb-6 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Payment Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-gray-300">Base Annual Premium</span>
                <span className="font-semibold">₹{basePremium.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-gray-300">Payment Frequency</span>
                <span className="font-semibold">{selectedOption.label}</span>
              </div>

              {selectedOption.discountRate > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-gray-300">Discount ({selectedOption.discountRate}%)</span>
                  <span className="font-semibold text-green-400">- ₹{selectedOption.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-gray-300">Total Annual Amount</span>
                <span className="font-bold text-lg">₹{selectedOption.discountedTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-4 p-5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-200 text-sm">Amount to Pay Now</p>
                    <p className="text-xs text-blue-300 mt-1">{selectedOption.paymentsPerYear === 1 ? 'Annual payment' : `First ${selectedOption.paymentLabel}ly payment`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black">₹{selectedOption.perPayment.toLocaleString('en-IN')}</p>
                    {selectedOption.paymentsPerYear > 1 && (
                      <p className="text-xs text-blue-200">× {selectedOption.paymentsPerYear} payments</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
 */}
        {/* ACTION BUTTONS */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          {submitError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-red-800 font-semibold">Submission Failed</p>
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 bg-linear-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:via-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg tracking-wide transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <span>Proceed to Order Summary</span>
                <span className="text-xl">→</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankInformationPage;
