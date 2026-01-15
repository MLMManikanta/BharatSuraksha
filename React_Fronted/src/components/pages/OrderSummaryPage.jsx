import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import { 
  CreditCard, 
  Building2, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  CalendarClock
} from 'lucide-react'; // For icons
import CheckoutStepper from '../layout/CheckoutStepper';

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safe access to data with fallbacks
  const planData = location.state || {};
  const paymentFrequency = planData.paymentFrequency || 'Standard Plan';
  const bankName = planData.bankData?.bankName || 'Not provided';
  const accountHolder = planData.bankData?.accountHolderName || 'Not provided';
  // Mock price for visual completeness (replace with real data if available)
  const estimatedTotal = planData.price || "₹ 0.00"; 

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={7} />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-full mb-4 ring-1 ring-white/30"
          >
            <CheckCircle2 className="w-8 h-8 text-green-300" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Review Order
          </motion.h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto font-light">
            Please verify your payment and account details below before finalizing your subscription.
          </p>
        </div>
      </div>

      {/* Main Content Card Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-6"
      >
        
        {/* Summary Card */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <CalendarClock size={24} />
              </span>
              Subscription Details
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Payment Frequency Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Frequency</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{paymentFrequency}</span>
                    <CreditCard className="text-indigo-500" />
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Recurring billing cycle</div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors space-y-3">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Bank Information</span>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-xs">
                      <User size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Account Holder</p>
                      <p className="font-semibold text-gray-800">{accountHolder}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-200 pt-3">
                    <div className="p-2 bg-white rounded-full shadow-xs">
                      <Building2 size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Bank Name</p>
                      <p className="font-semibold text-gray-800">{bankName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total Section (Optional Visual) */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
              <div>
                <p className="text-gray-500 text-sm">Total due today</p>
                <p className="text-xs text-gray-400 italic">Includes applicable taxes</p>
              </div>
              <div className="text-3xl font-black text-indigo-700">{estimatedTotal}</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => navigate('/bankinfo', { state: planData })}
            className="group flex items-center justify-center gap-2 py-4 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <button
            onClick={() => navigate('/payment', { state: planData })}
            className="group relative flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold overflow-hidden shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span>Confirm & Pay</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Security Note */}
        <motion.p variants={itemVariants} className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          Payments are secure and encrypted.
        </motion.p>
      </motion.div>
      
      {/* Tailwind Custom Animation for Button Shimmer */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderSummaryPage;