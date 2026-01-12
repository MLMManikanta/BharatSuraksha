import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from "../../../layout/CheckoutStepper"; 
import BasicPlanReview from "./BasicPlanReview";
import FamilyPlanReview from "./FamilyPlanReview"; 
import SeniorPlanReview from "./SeniorPlanReview"; 
import UniversalPlanReview from "./UniversalPlanReview"; 

import VajraPlanReview from "./CustomizeHealthPage";

const PlanReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const planData = location.state || {};

  useEffect(() => {
    if (!planData.selectedPlan) {
      navigate('/plans');
    }
  }, [planData, navigate]);

  // Premium Logic
  const basePremium = planData.basePremium || 0;
  const gst = Math.round(basePremium * 0.18);
  const totalAmount = basePremium + gst;
  const planName = planData.selectedPlan?.name || "";

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <CheckoutStepper currentStep={3} />

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">Review Your Selection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Plan Specific Component */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Dynamically display your individual files based on plan name */}
                {planName.includes('Neev') && <BasicPlanReview data={planData} />}
                {planName.includes('Parivar') && <FamilyPlanReview data={planData} />}
                {planName.includes('Varishtha') && <SeniorPlanReview data={planData} />}
                {planName.includes('Vishwa') && <UniversalPlanReview data={planData} />}
                {planName.includes('Vajra') && <VajraPlanReview data={planData} />}
            </div>
          </div>

          {/* RIGHT: Basic Summary & Payment (Common for all) */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 sticky top-10 text-white shadow-2xl">
              <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-6 text-center">Payment Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Selected Plan</span>
                  <span className="font-bold">{planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Base Premium</span>
                  <span>₹{basePremium.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-px bg-slate-800 my-4"></div>
                <div className="text-center">
                  <p className="text-4xl font-black tracking-tighter text-white">₹{totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Total Annual Premium</p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/proposal-form', { state: planData })}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
              >
                Proceed to KYC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;