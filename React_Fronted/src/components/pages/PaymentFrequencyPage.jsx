import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

/**
 * PAYMENT FREQUENCY PAGE
 * ═════════════════════════════════════════════════════════════
 * 
 * Purpose: Allow users to select their preferred payment frequency
 * Options: Monthly, Quarterly, Half-Yearly, Yearly
 * 
 * ═════════════════════════════════════════════════════════════
 */

const PaymentFrequencyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [error, setError] = useState('');

  // Payment frequency options with benefits
  const frequencyOptions = [
    {
      id: 'monthly',
      label: 'Monthly',
      icon: '📅',
      description: 'Pay every month',
      discount: '0%',
      badge: 'Most Flexible'
    },
    {
      id: 'quarterly',
      label: 'Quarterly',
      icon: '📊',
      description: 'Pay every 3 months',
      discount: '2%',
      badge: 'Popular'
    },
    {
      id: 'halfyearly',
      label: 'Half-Yearly',
      icon: '📈',
      description: 'Pay every 6 months',
      discount: '5%',
      badge: 'Save More'
    },
    {
      id: 'yearly',
      label: 'Yearly',
      icon: '💰',
      description: 'Pay once a year',
      discount: '10%',
      badge: 'Best Value'
    }
  ];

  const handleSubmit = () => {
    if (!selectedFrequency) {
      setError('Please select a payment frequency');
      return;
    }

    // Proceed to bank info page
    navigate('/bankinfo', {
      state: {
        ...planData,
        paymentFrequency: selectedFrequency,
        submittedAt: new Date().toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={6} />

      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Choose Payment Frequency</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Select how often you'd like to pay your premium. Save more with longer payment terms!
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        
        {/* INFO BANNER */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg mb-8">
          <p className="text-sm text-purple-800 font-medium">
            💡 Longer payment terms offer better discounts on your premium amount.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* PAYMENT FREQUENCY OPTIONS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Frequency</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frequencyOptions.map((option) => (
              <label
                key={option.id}
                className={`relative cursor-pointer group ${
                  selectedFrequency === option.id
                    ? 'ring-4 ring-purple-500'
                    : 'hover:ring-2 hover:ring-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.id}
                  checked={selectedFrequency === option.id}
                  onChange={(e) => {
                    setSelectedFrequency(e.target.value);
                    setError('');
                  }}
                  className="sr-only"
                />
                
                <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedFrequency === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white group-hover:border-purple-300'
                }`}>
                  
                  {/* Badge */}
                  {option.badge && (
                    <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {option.badge}
                    </div>
                  )}

                  {/* Icon & Label */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{option.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Discount:</span>
                      <span className="text-lg font-bold text-purple-600">{option.discount} OFF</span>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedFrequency === option.id && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
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

        {/* BENEFITS SECTION */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose Longer Payment Terms?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-bold text-gray-800">Save Money</p>
                <p className="text-sm text-gray-600">Get up to 10% discount on yearly payments</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-bold text-gray-800">Less Hassle</p>
                <p className="text-sm text-gray-600">Fewer payment reminders and transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="font-bold text-gray-800">No Price Increases</p>
                <p className="text-sm text-gray-600">Lock in your premium for the entire term</p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button 
            onClick={handleSubmit} 
            className="w-full py-5 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-purple-500/30"
          >
            Continue to Banking Details →
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

export default PaymentFrequencyPage;
