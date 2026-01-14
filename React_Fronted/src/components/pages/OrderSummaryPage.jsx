import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  const paymentFrequency = planData.paymentFrequency || 'Not selected';
  const bankName = planData.bankData?.bankName || 'Not provided';
  const accountHolder = planData.bankData?.accountHolderName || 'Not provided';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={7} />

      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Order Summary</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Review your selections before proceeding to payment.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Frequency</h2>
          <p className="text-gray-700">{paymentFrequency}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h2>
          <p className="text-gray-700">Account Holder: {accountHolder}</p>
          <p className="text-gray-700">Bank Name: {bankName}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button
            onClick={() => navigate('/payment', { state: planData })}
            className="w-full py-5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-indigo-500/30"
          >
            Proceed to Payment →
          </button>
          <button
            onClick={() => navigate('/bankinfo', { state: planData })}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
