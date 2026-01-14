import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const PaymentPage = () => {
  const location = useLocation();
  const planData = location.state || {};
  const navigate = useNavigate();

  const [method, setMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Method-specific fields
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankCode, setBankCode] = useState('');

  const validate = () => {
    const e = {};
    if (!method) e.method = 'Please select a payment method';
    if (method === 'upi') {
      if (!upiId.trim()) e.upiId = 'UPI ID required';
      else if (!/^[-.\w]{3,}@[a-z]{3,}$/i.test(upiId)) e.upiId = 'Invalid UPI ID (e.g., name@upi)';
    }
    if (method === 'card') {
      if (!cardName.trim()) e.cardName = 'Name on card required';
      if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) e.cardNumber = 'Enter 16-digit card number';
      if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry)) e.cardExpiry = 'Use MM/YY format';
      if (!/^\d{3}$/.test(cardCvv)) e.cardCvv = 'Enter 3-digit CVV';
    }
    if (method === 'netbanking') {
      if (!bankCode) e.bankCode = 'Please select a bank';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setProcessing(true);
    // simulate gateway processing
    setTimeout(() => {
      const txnId = 'TXN-' + Math.random().toString(36).slice(2, 10).toUpperCase();
      const paymentDetails = {
        method,
        upiId: method === 'upi' ? upiId : undefined,
        cardLast4: method === 'card' ? cardNumber.slice(-4) : undefined,
        bankCode: method === 'netbanking' ? bankCode : undefined,
        transactionId: txnId,
        paidAt: new Date().toISOString(),
      };
      setProcessing(false);
      navigate('/payment-success', { state: { ...planData, paymentDetails } });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={8} />

      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Payment</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Complete your payment to finalize the policy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Method</h2>
          {errors.method && <p className="text-red-600 text-sm mb-3">{errors.method}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{id:'upi',label:'UPI',icon:'💠'}, {id:'card',label:'Debit/Credit Card',icon:'💳'}, {id:'netbanking',label:'NetBanking',icon:'🏦'}].map(opt => (
              <label key={opt.id} className={`relative cursor-pointer group ${method===opt.id?'ring-4 ring-emerald-500':'hover:ring-2 hover:ring-emerald-300'}`}>
                <input type="radio" name="method" value={opt.id} checked={method===opt.id} onChange={(e)=>{setMethod(e.target.value); setErrors(prev=>({...prev, method:''}));}} className="sr-only" />
                <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${method===opt.id?'border-emerald-500 bg-emerald-50':'border-gray-200 bg-white group-hover:border-emerald-300'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-bold text-gray-800">{opt.label}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Method Details */}
        {method === 'upi' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">UPI Payment</h3>
            <label className="block text-sm font-bold text-gray-700 mb-2">UPI ID</label>
            <input value={upiId} onChange={(e)=>setUpiId(e.target.value)} placeholder="e.g., username@upi" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.upiId?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`} />
            {errors.upiId && <p className="text-red-600 text-xs mt-1">{errors.upiId}</p>}
          </div>
        )}

        {method === 'card' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Card Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name on Card</label>
                <input value={cardName} onChange={(e)=>setCardName(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.cardName?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`} />
                {errors.cardName && <p className="text-red-600 text-xs mt-1">{errors.cardName}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                <input value={cardNumber} onChange={(e)=>setCardNumber(e.target.value.replace(/[^\d]/g,''))} maxLength={16} placeholder="1234123412341234" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.cardNumber?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`} />
                {errors.cardNumber && <p className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry (MM/YY)</label>
                <input value={cardExpiry} onChange={(e)=>setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.cardExpiry?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`} />
                {errors.cardExpiry && <p className="text-red-600 text-xs mt-1">{errors.cardExpiry}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                <input value={cardCvv} onChange={(e)=>setCardCvv(e.target.value.replace(/[^\d]/g,''))} maxLength={3} placeholder="123" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.cardCvv?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`} />
                {errors.cardCvv && <p className="text-red-600 text-xs mt-1">{errors.cardCvv}</p>}
              </div>
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">NetBanking</h3>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Bank</label>
            <select value={bankCode} onChange={(e)=>setBankCode(e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.bankCode?'border-red-500 focus:ring-red-500':'border-gray-300 focus:ring-emerald-500'}`}>
              <option value="">Choose a bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
            </select>
            {errors.bankCode && <p className="text-red-600 text-xs mt-1">{errors.bankCode}</p>}
          </div>
        )}

        {/* Pay Button */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button onClick={handlePay} disabled={processing} className={`w-full py-5 ${processing?'bg-emerald-400':'bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'} text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-emerald-500/30`}>
            {processing ? 'Processing…' : 'Pay Securely →'}
          </button>
          <p className="text-center text-xs text-gray-500">For demo only: no real charges applied.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
