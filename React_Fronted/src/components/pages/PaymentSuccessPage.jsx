import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planData = location.state || {};

  // Extract Data
  const txn = planData.paymentDetails?.transactionId || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const method = planData.paymentDetails?.method || 'Card';
  const paidAt = planData.paymentDetails?.paidAt ? new Date(planData.paymentDetails.paidAt).toLocaleString() : new Date().toLocaleString();
  const amount = planData.finalPayableAmount || planData.price || 0;
  const planName = planData.selectedPlan?.name || "Health Insurance Policy";

  const generatePolicyNumber = (name) => {
    const year = new Date().getFullYear();
    const planCode = String(name || "GEN")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 5);
    const random = Math.random().toString(10).slice(2, 6);
    return `BS-${planCode || "GEN"}-${year}-${random}`;
  };

  const policyNumber = useMemo(() => {
    return (
      planData.policyNumber ||
      localStorage.getItem("latestPolicyNumber") ||
      generatePolicyNumber(planName)
    );
  }, [planData.policyNumber, planName]);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setShowConfetti(true);
    if (policyNumber) {
      localStorage.setItem("latestPolicyNumber", policyNumber);
    }
  }, [policyNumber]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={8} />

      {/* Hero Header - Success State */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white pt-16 pb-32 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-300 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-2xl mx-auto text-center space-y-6 animate-scale-in">
          <div className="inline-flex items-center justify-center p-6 bg-white/20 backdrop-blur-md rounded-full ring-4 ring-white/30 shadow-2xl mb-2">
            <svg className="w-16 h-16 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-sm">
              Payment Successful!
            </h1>
            <p className="text-emerald-100 text-lg font-medium">
              Your policy for <span className="text-white font-bold">{planName}</span> has been issued.
            </p>
          </div>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10 space-y-8 animate-slide-up">
        
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Receipt Top Edge */}
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
          
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-4xl font-black text-emerald-700">₹{amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide border border-emerald-100">
                  Paid via {method}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Transaction ID</p>
                <p className="text-base font-bold text-gray-800 font-mono">{txn}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date & Time</p>
                <p className="text-base font-bold text-gray-800">{paidAt}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Plan Type</p>
                <p className="text-base font-bold text-gray-800">{planName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Policy Number</p>
                <p className="text-base font-bold text-gray-800 font-mono">{policyNumber}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Policy Status</p>
                <p className="text-base font-bold text-green-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Active & Issued
                </p>
              </div>
            </div>

            {/* Dotted Separator */}
            <div className="my-8 border-t-2 border-dashed border-gray-200 relative">
              <div className="absolute -left-12 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
              <div className="absolute -right-12 -top-3 w-6 h-6 bg-gray-50 rounded-full"></div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="text-sm font-bold text-gray-800">Check your email</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We have sent the policy document and payment receipt to your registered email address.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button 
            className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
            onClick={() => window.print()}
          >
            🖨️ Download Receipt
          </button>

          <button
            onClick={() => navigate('/register', { state: { policyNumber } })}
            className="flex-1 py-4 px-6 bg-white border border-emerald-200 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
          >
            Create Account
          </button>
          
          <button 
            onClick={() => navigate('/home')} 
            className="flex-[2] py-4 px-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
          >
            Return to Home 🏠
          </button>
        </div>

      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;