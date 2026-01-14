import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planData = location.state || {};

  const txn = planData.paymentDetails?.transactionId || 'N/A';
  const method = planData.paymentDetails?.method || 'N/A';
  const paidAt = planData.paymentDetails?.paidAt || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={8} />

      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Payment Successful</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Your policy payment has been received.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-bold text-gray-800">{txn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Method</p>
              <p className="font-bold text-gray-800 capitalize">{method}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid At</p>
              <p className="font-bold text-gray-800">{new Date(paidAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button onClick={()=>navigate('/home')} className="w-full py-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-emerald-500/30">Go to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
