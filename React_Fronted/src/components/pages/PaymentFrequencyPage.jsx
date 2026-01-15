import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const PaymentFrequencyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [error, setError] = useState('');

  const frequencyOptions = [
    {
      id: 'monthly',
      label: 'Monthly',
      icon: '📅',
      description: 'Pay every month',
      discount: '0%',
      badge: 'Flexible'
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/bankinfo', {
      state: {
        ...planData,
        paymentFrequency: selectedFrequency,
        submittedAt: new Date().toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={6} />

      <div className="relative bg-gradient-to-br from-purple-700 via-indigo-600 to-indigo-800 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center text-4xl p-4 bg-white/20 backdrop-blur-md rounded-full mb-4 ring-1 ring-white/30 shadow-lg">
            💳
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Payment Frequency</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto font-light">
            Choose a schedule that fits your budget. Save more with annual plans.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">
        
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl shadow-sm flex gap-3 items-start">
          <span className="text-xl mt-0.5">💡</span>
          <p className="text-sm text-purple-800 font-medium leading-relaxed pt-1">
            Opting for Yearly or Half-Yearly payments reduces the risk of policy lapse and offers significant premium discounts.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-purple-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                🗓️
              </span>
              Select Frequency
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {frequencyOptions.map((option) => (
                <label
                  key={option.id}
                  className={`relative cursor-pointer group rounded-2xl border-2 transition-all duration-300 p-6 flex flex-col gap-4 ${
                    selectedFrequency === option.id
                      ? 'border-purple-500 bg-purple-50/50 shadow-md transform scale-[1.02]'
                      : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
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
                    className="hidden"
                  />
                  
                  {option.badge && (
                    <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        selectedFrequency === option.id 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {option.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className={`text-3xl p-3 rounded-xl transition-colors ${
                        selectedFrequency === option.id ? 'bg-white shadow-sm' : 'bg-gray-50'
                    }`}>
                        {option.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${selectedFrequency === option.id ? 'text-purple-900' : 'text-gray-800'}`}>
                          {option.label}
                      </h3>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Savings</span>
                    <span className={`text-sm font-black ${selectedFrequency === option.id ? 'text-purple-600' : 'text-gray-600'}`}>
                        {option.discount} OFF
                    </span>
                  </div>

                  {selectedFrequency === option.id && (
                    <div className="absolute top-4 right-4 text-purple-600 text-xl animate-fade-in-up">
                      ✅
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4">Benefits of Annual Pay</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
              <span className="text-xl">💵</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Max Savings</p>
                <p className="text-[10px] text-gray-500">Flat 10% discount</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Continuous Cover</p>
                <p className="text-[10px] text-gray-500">No monthly hassle</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-indigo-50">
              <span className="text-xl">🔒</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">Price Lock</p>
                <p className="text-[10px] text-gray-500">1 Year rate guarantee</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center justify-center gap-2 py-4 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm hover:shadow-md order-2 md:order-1"
          >
            ⬅️ Go Back
          </button>
          <button 
            onClick={handleSubmit} 
            className="group relative flex items-center justify-center gap-2 py-4 px-6 bg-purple-600 text-white rounded-xl font-bold overflow-hidden shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] order-1 md:order-2"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span>Continue to Banking</span>
            ➡️
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default PaymentFrequencyPage;