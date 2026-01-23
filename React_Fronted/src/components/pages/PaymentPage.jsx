import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get planData from navigation state OR sessionStorage fallback
  const planData = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }
    // Fallback to paymentData in sessionStorage
    const paymentData = sessionStorage.getItem('paymentData');
    if (paymentData) {
      return JSON.parse(paymentData);
    }
    // Fallback to orderData
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
      return JSON.parse(orderData);
    }
    return {};
  }, [location.state]);

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
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
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
      // Persist latest plan name and transaction id so downstream pages can read them
      try {
        const latestPlan = planData.planName || planData.selectedPlan?.name || planData.plan || '';
        if (latestPlan) localStorage.setItem('latestPlanName', latestPlan);
        localStorage.setItem('latestTransactionId', txnId);
      } catch (e) {
        console.warn('Failed to persist latest plan/txn to localStorage', e);
      }

      console.log('Navigating to /payment-success with planData:', planData, 'paymentDetails:', paymentDetails);
      navigate('/payment-success', { state: { ...planData, paymentDetails } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={8} />

      {/* Header */}
      <div className="relative bg-linear-to-br from-emerald-600 via-teal-500 to-emerald-700 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">💸</span>
            <span className="text-sm font-medium">Step 8 of 8</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Secure Payment</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto font-light">
            Complete your transaction securely to activate your policy instantly.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">
        
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm flex gap-3 items-start">
          <span className="text-xl mt-0.5">🔒</span>
          <p className="text-sm text-emerald-800 font-medium leading-relaxed pt-1">
            All transactions are encrypted with 256-bit SSL security. Your financial data is never stored on our servers.
          </p>
        </div>

        {/* Method Selection */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-linear-to-r from-emerald-400 to-teal-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                💳
              </span>
              Payment Method
            </h2>
            
            {errors.method && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{errors.method}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'upi', label: 'UPI', icon: '💠', desc: 'GPay, PhonePe, BHIM' },
                { id: 'card', label: 'Card', icon: '💳', desc: 'Debit / Credit Card' },
                { id: 'netbanking', label: 'NetBanking', icon: '🏦', desc: 'All Major Banks' }
              ].map(opt => (
                <label key={opt.id} className={`relative cursor-pointer group rounded-2xl border-2 transition-all duration-200 p-5 flex flex-col gap-3 ${
                  method === opt.id 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md transform scale-[1.02]' 
                    : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
                }`}>
                  <input 
                    type="radio" 
                    name="method" 
                    value={opt.id} 
                    checked={method === opt.id} 
                    onChange={(e) => { setMethod(e.target.value); setErrors(prev => ({ ...prev, method: '' })); }} 
                    className="hidden" 
                  />
                  
                  <div className={`text-3xl p-3 rounded-xl w-fit transition-colors ${method === opt.id ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                    {opt.icon}
                  </div>
                  
                  <div>
                    <span className={`block font-bold text-lg ${method === opt.id ? 'text-emerald-900' : 'text-gray-800'}`}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{opt.desc}</span>
                  </div>

                  {method === opt.id && (
                    <div className="absolute top-4 right-4 text-emerald-600 text-xl animate-fade-in-up">
                      ✅
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Forms based on Method */}
        <div className="animate-fade-in-up">
          {method === 'upi' && (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>💠</span> Enter UPI Details
              </h3>
              <InputField 
                label="UPI ID / VPA" 
                value={upiId} 
                onChange={setUpiId} 
                placeholder="username@upi" 
                error={errors.upiId} 
              />
              <p className="text-xs text-gray-500 mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                👉 Open your UPI app to approve the request after clicking Pay.
              </p>
            </div>
          )}

          {method === 'card' && (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>💳</span> Enter Card Details
              </h3>
              <div className="space-y-5">
                <InputField 
                  label="Name on Card" 
                  value={cardName} 
                  onChange={setCardName} 
                  placeholder="JOHN DOE" 
                  error={errors.cardName} 
                />
                
                <div className="relative">
                   <InputField 
                     label="Card Number" 
                     value={cardNumber} 
                     onChange={(val) => setCardNumber(val.replace(/\D/g, '').slice(0, 16))} 
                     placeholder="0000 0000 0000 0000" 
                     maxLength={16} 
                     error={errors.cardNumber} 
                   />
                   <div className="absolute top-9 right-4 text-xl opacity-50">💳</div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <InputField 
                    label="Expiry (MM/YY)" 
                    value={cardExpiry} 
                    onChange={setCardExpiry} 
                    placeholder="MM/YY" 
                    maxLength={5} 
                    error={errors.cardExpiry} 
                  />
                  <div className="relative">
                    <InputField 
                      label="CVV" 
                      type="password" 
                      value={cardCvv} 
                      onChange={(val) => setCardCvv(val.replace(/\D/g, '').slice(0, 3))} 
                      placeholder="123" 
                      maxLength={3} 
                      error={errors.cardCvv} 
                    />
                    <div className="absolute top-9 right-4 text-xs font-bold text-gray-400">3 DIGITS</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>🏦</span> Select Bank
              </h3>
              <SelectField 
                label="Bank Name" 
                value={bankCode} 
                onChange={setBankCode} 
                error={errors.bankCode} 
                options={[
                  { value: 'SBI', label: 'State Bank of India' },
                  { value: 'HDFC', label: 'HDFC Bank' },
                  { value: 'ICICI', label: 'ICICI Bank' },
                  { value: 'AXIS', label: 'Axis Bank' },
                  { value: 'KOTAK', label: 'Kotak Mahindra Bank' }
                ]} 
              />
            </div>
          )}
        </div>

        {/* Pay Button */}
        <div className="max-w-2xl mx-auto mb-10 pt-4">
          <button 
            onClick={handlePay} 
            disabled={processing} 
            className={`group w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl transition-all relative overflow-hidden ${
              processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {!processing && (
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}
            
            <span className="relative flex items-center justify-center gap-3">
              {processing ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  Processing...
                </>
              ) : (
                <>Pay Securely <span className="group-hover:translate-x-1 transition-transform">→</span></>
              )}
            </span>
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wide">
            Test Mode Active • No Real Money Will Be Deducted
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

// --- Reusable UI Components ---

const InputField = ({ label, type = "text", value, onChange, error, placeholder, maxLength }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-gray-800 placeholder-gray-300 ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
    />
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, error, options }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-gray-800 appearance-none ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">▼</div>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">{error}</p>}
  </div>
);

export default PaymentPage;