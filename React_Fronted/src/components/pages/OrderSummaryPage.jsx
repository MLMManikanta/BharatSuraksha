import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

/**
 * ORDER SUMMARY / REVIEW PAGE
 * ═════════════════════════════════════════════════════════════
 * 
 * Displays complete order summary including:
 * 1. Plan details and coverage
 * 2. Price breakdown with discount
 * 3. Amount to pay
 * 
 * ═════════════════════════════════════════════════════════════
 */

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state OR sessionStorage fallback
  const planData = useMemo(() => {
    // First try navigation state
    if (location.state && Object.keys(location.state).length > 0) {
      console.log('OrderSummaryPage: Using navigation state');
      return location.state;
    }
    // Fallback to orderData in sessionStorage
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
      console.log('OrderSummaryPage: Using orderData from sessionStorage');
      return JSON.parse(orderData);
    }
    // Fallback to planData in sessionStorage
    const stored = sessionStorage.getItem('planData');
    if (stored) {
      console.log('OrderSummaryPage: Using planData from sessionStorage');
      return JSON.parse(stored);
    }
    return {};
  }, [location.state]);

  // Get premium calculations from sessionStorage as additional backup
  const storedCalculations = useMemo(() => {
    const stored = sessionStorage.getItem('premiumCalculations');
    return stored ? JSON.parse(stored) : null;
  }, []);
  
  // Extract payment details (from BankInformationPage or sessionStorage)
  const paymentDetails = useMemo(() => {
    return planData.paymentDetails || storedCalculations || {};
  }, [planData.paymentDetails, storedCalculations]);
  
  // Helper function to safely extract string value from potentially object values
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      // Handle {label, value} objects from select fields
      return value.label || value.value || value.name || String(value);
    }
    return String(value);
  };

  // Plan information - ensure we get strings, not objects
  const planName = safeString(
    planData.planName || 
    planData.selectedPlan?.planName || 
    planData.selectedPlan?.name || 
    'Health Insurance Plan'
  );
  const coverageAmount = safeString(
    planData.coverage || 
    planData.selectedPlan?.coverage || 
    planData.sumInsured || 
    ''
  );
  
  // Payment frequency
  const paymentFrequency = planData.paymentFrequency || 'yearly';

  // DEBUG: Log all received data to console
  useEffect(() => {
    console.log('═══════════════════════════════════════════════════');
    console.log('OrderSummaryPage - RECEIVED DATA:');
    console.log('Full planData:', planData);
    console.log('paymentDetails:', paymentDetails);
    console.log('storedCalculations:', storedCalculations);
    console.log('paymentFrequency:', paymentFrequency);
    console.log('═══════════════════════════════════════════════════');
  }, [planData, paymentDetails, storedCalculations, paymentFrequency]);

  // Calculate all pricing based on available data
  const pricingData = useMemo(() => {
    // Try to get base premium from multiple sources (in order of priority)
    // Priority: totalPayable from PaymentSummary > finalAnnualPremium > other values
    const rawPremium = 
      paymentDetails.basePremium ||                // Pre-calculated basePremium from BankInformationPage
      paymentDetails.totalPayable ||               // Total from PaymentSummary (includes GST, tenure)
      paymentDetails.finalAnnualPremium ||         // Annual premium with GST
      storedCalculations?.totalPayable ||          // From sessionStorage
      storedCalculations?.finalAnnualPremium ||    // From sessionStorage
      planData.originalPremiumCalculations?.totalPayable ||  // Original PaymentSummary values
      planData.originalPremiumCalculations?.finalAnnualPremium ||
      planData.totalPremium || 
      planData.premium || 
      planData.finalPremium || 
      planData.price || 
      planData.selectedPlan?.premium ||
      planData.selectedPlan?.price ||
      0;
    
    console.log('pricingData calculation:');
    console.log('  rawPremium:', rawPremium);
    console.log('  paymentDetails.basePremium:', paymentDetails.basePremium);
    console.log('  paymentDetails.totalPayable:', paymentDetails.totalPayable);
    console.log('  storedCalculations?.totalPayable:', storedCalculations?.totalPayable);
    
    // Discount rates by frequency
    const discountRates = {
      monthly: 0,
      quarterly: 2,
      halfyearly: 5,
      yearly: 10
    };
    
    // Payments per year by frequency
    const paymentsConfig = {
      monthly: { count: 12, label: 'month', description: '12 monthly installments' },
      quarterly: { count: 4, label: 'quarter', description: '4 quarterly installments' },
      halfyearly: { count: 2, label: '6 months', description: '2 half-yearly installments' },
      yearly: { count: 1, label: 'year', description: 'Single annual payment' }
    };
    
    const freq = paymentFrequency.toLowerCase().replace(/[^a-z]/g, '');
    const config = paymentsConfig[freq] || paymentsConfig.yearly;
    const discountRate = discountRates[freq] || 0;
    
    // If paymentDetails has pre-calculated values from BankInformationPage, use them
    if (paymentDetails.perPaymentAmount && paymentDetails.perPaymentAmount > 0) {
      console.log('Using pre-calculated paymentDetails from BankInformationPage');
      return {
        basePremium: paymentDetails.basePremium || rawPremium,
        discountRate: paymentDetails.discountRate ?? discountRate,
        discountAmount: paymentDetails.discountAmount ?? 0,
        discountedTotal: paymentDetails.discountedTotal ?? rawPremium,
        perPaymentAmount: paymentDetails.perPaymentAmount,
        paymentsPerYear: paymentDetails.paymentsPerYear ?? config.count,
        paymentLabel: paymentDetails.paymentLabel || config.label,
        frequencyLabel: paymentDetails.frequencyLabel || freq.charAt(0).toUpperCase() + freq.slice(1),
        description: config.description,
        // Include GST info from original calculations
        gstAmount: paymentDetails.gstAmount || storedCalculations?.gstAmount || 0,
        netPremium: paymentDetails.netPremium || storedCalculations?.netPremium || rawPremium
      };
    }
    
    // Calculate from scratch if no paymentDetails
    console.log('Calculating pricing from scratch with rawPremium:', rawPremium);
    const discountAmount = Math.round(rawPremium * (discountRate / 100));
    const discountedTotal = rawPremium - discountAmount;
    const perPaymentAmount = Math.round(discountedTotal / config.count);
    
    return {
      basePremium: rawPremium,
      discountRate,
      discountAmount,
      discountedTotal,
      perPaymentAmount,
      paymentsPerYear: config.count,
      paymentLabel: config.label,
      frequencyLabel: freq.charAt(0).toUpperCase() + freq.slice(1),
      description: config.description,
      gstAmount: storedCalculations?.gstAmount || 0,
      netPremium: storedCalculations?.netPremium || rawPremium
    };
  }, [planData, paymentDetails, storedCalculations, paymentFrequency]);

  // Destructure for easier access and ensure string values
  const {
    basePremium,
    discountRate,
    discountAmount,
    discountedTotal,
    perPaymentAmount,
    paymentsPerYear
    // gstAmount and netPremium available in pricingData if needed
  } = pricingData;
  
  // Ensure paymentLabel and frequencyLabel are strings (not objects)
  const paymentLabel = safeString(pricingData.paymentLabel || 'year');
  const frequencyLabel = safeString(pricingData.frequencyLabel || 'Annual');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-purple-50 pb-20 font-sans">
      <CheckoutStepper currentStep={7} />

      {/* Hero Header */}
      <div className="relative bg-linear-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white pt-12 pb-28 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-300 rounded-full mix-blend-overlay blur-2xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2 animate-fade-in-up">
            <span className="text-2xl">🧾</span>
            <span className="text-sm font-medium">Step 7 of 8</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight animate-fade-in-up">
            Review Your Order
          </h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto font-light">
            Please verify all details before proceeding to payment
          </p>

          {/* Plan Badge */}
          {planName && (
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-2xl mt-4 animate-fade-in-up">
              <span className="text-2xl">🛡️</span>
              <div className="text-left">
                <p className="text-xs text-indigo-200">Selected Plan</p>
                <p className="font-bold text-lg">{planName}</p>
              </div>
              {coverageAmount && (
                <div className="ml-4 pl-4 border-l border-white/30">
                  <p className="text-xs text-indigo-200">Coverage</p>
                  <p className="font-bold">{coverageAmount}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 space-y-6 animate-slide-up">

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-indigo-100 p-2.5 rounded-xl text-2xl">
                💰
              </span>
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              
              {/* Plan Name */}
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800">{planName}</p>
                  {coverageAmount && (
                    <p className="text-sm text-gray-500">Coverage: {coverageAmount}</p>
                  )}
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                  {frequencyLabel} Plan
                </span>
              </div>

              {/* Base Premium */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Base Annual Premium</span>
                <span className="font-semibold text-gray-800 text-lg">
                  ₹{basePremium.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Discount (if applicable) */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center py-2 text-green-600 bg-green-50 -mx-2 px-4 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span>🏷️</span>
                    {frequencyLabel} Discount ({discountRate}%)
                  </span>
                  <span className="font-semibold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Discounted Annual Total */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Annual Premium (After Discount)</span>
                <span className="font-bold text-gray-800">₹{discountedTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Per Payment Amount (for installments) */}
              {paymentsPerYear > 1 && (
                <div className="flex justify-between items-center py-3 bg-indigo-50 -mx-2 px-4 rounded-lg">
                  <div>
                    <span className="text-indigo-800 font-medium">Per {paymentLabel.charAt(0).toUpperCase() + paymentLabel.slice(1)}</span>
                    <p className="text-xs text-indigo-600">{paymentsPerYear} payments total</p>
                  </div>
                  <span className="font-bold text-indigo-700 text-xl">₹{perPaymentAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* GST */}
              <div className="flex justify-between items-center py-2 text-gray-500 text-sm border-t border-dashed border-gray-300">
                <span>GST (Included)</span>
                <span>₹0</span>
              </div>
            </div>

            {/* Amount Due Today - Prominent Display */}
            <div className="mt-6 bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Amount Due Today</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {paymentsPerYear === 1 ? 'Full Annual Payment' : `First ${paymentLabel}ly installment`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-white">
                    ₹{perPaymentAmount.toLocaleString('en-IN')}
                  </p>
                  {paymentsPerYear > 1 && (
                    <p className="text-sm text-slate-400 mt-1">/ {paymentLabel}</p>
                  )}
                </div>
              </div>
              
              {discountAmount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-center gap-2">
                  <span>✅</span>
                  <span className="text-green-400 text-sm font-semibold">
                    You're saving ₹{discountAmount.toLocaleString('en-IN')} annually!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warning/Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800">Before you proceed</p>
            <p className="text-sm text-amber-700 mt-1">
              By clicking "Confirm & Pay", you agree to our Terms of Service and authorize the payment. 
              Your coverage will begin immediately after successful payment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => navigate('/bankinfo', { state: planData })}
            className="group flex items-center justify-center gap-3 py-5 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm hover:shadow-lg"
          >
            <span className="group-hover:-translate-x-1 transition-transform">⬅️</span>
            Go Back & Edit
          </button>

          <button
            onClick={() => {
              const paymentData = { 
                ...planData, 
                finalPayableAmount: perPaymentAmount,
                paymentDetails: {
                  ...planData.paymentDetails,
                  basePremium,
                  discountRate,
                  discountAmount,
                  discountedTotal,
                  perPaymentAmount,
                  paymentsPerYear,
                  paymentLabel,
                  frequencyLabel
                }
              };
              // Store in sessionStorage as backup
              sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
              navigate('/payment', { state: paymentData });
            }}
            className="group relative flex items-center justify-center gap-3 py-5 px-6 bg-linear-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-xl shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span>Confirm & Pay ₹{perPaymentAmount.toLocaleString('en-IN')}</span>
            <span className="group-hover:translate-x-1 transition-transform">➡️</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="text-center py-6 space-y-2">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span className="text-xs">SSL Secured</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span className="text-xs">IRDAI Approved</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 Bharat Suraksha Insurance. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Tailwind Custom Animation for Button Shimmer */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default OrderSummaryPage;