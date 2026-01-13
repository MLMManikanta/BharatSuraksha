import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentSummary from './paymentSummary';
import CheckoutStepper from "../../../layout/CheckoutStepper";

// --- SUB-PLAN IMPORTS ---
import BasicPlanReview from './BasicPlanReview';
import FamilyPlanReview from './FamilyPlanReview';
import SeniorPlanReview from './SeniorPlanReview';
import UniversalPlanReview from './UniversalPlanReview';

// --- CUSTOM BUILDER & REVIEW IMPORTS ---
import CustomizeHealthPage from '../SubPlans/CustomizeHealthPage';
import CustomizeReviewHealthPage from './CustomizeReviewHealthPage'; 

const PlanReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Initialize local state with data passed via navigation (location.state)
  const [data, setData] = useState(location.state);

  /**
   * handleProceed
   * Captures data from the CustomizeHealthPage (Vajra Builder) and merges it
   * into the main data object, then flips the review flag.
   */
  const handleProceed = (customConfig) => {
    setData((prev) => ({
      ...prev,           // Keep base data (selected members, full name, etc.)
      ...customConfig,   // Add builder selections (SI, Tenure, Chronic Care)
      isReviewingCustomPlan: true 
    }));
  };

  const renderReviewContent = () => {
    // Safety check: Prevents "No Plan Data Found" if location state is missing
    if (!data || !data.selectedPlan) {
      return (
        <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic">
            No plan data found.
          </p>
        </div>
      );
    }

    // --- CRITICAL LOGIC FIX: VAJRA / CUSTOM MUST BE FIRST ---
    // This prevents standard name checks (like Vishwa) from overriding the custom builder
    const isVajra = data.selectedPlan.isCustom || 
                    String(data.selectedPlan.name).toLowerCase().includes('vajra');

    if (isVajra) {
      // IF THE USER CLICKED CONFIRM IN BUILDER: Show High-Fidelity Review Card
      if (data.isReviewingCustomPlan) {
        return (
          <CustomizeReviewHealthPage 
            selectionData={data} 
            onEdit={() => setData({ ...data, isReviewingCustomPlan: false })} 
            onConfirm={() => navigate('/proposal-form', { state: data })}
          />
        );
      }
      // DEFAULT: Show the Builder
      return <CustomizeHealthPage initialData={data} onProceed={handleProceed} />;
    }

    // --- STANDARD PLAN MAPPINGS ---
    const planName = String(data.selectedPlan.name || "").toLowerCase();
    
    if (planName.includes('neev')) return <BasicPlanReview data={data} />;
    if (planName.includes('parivar')) return <FamilyPlanReview data={data} />;
    if (planName.includes('varishtha')) return <SeniorPlanReview data={data} />;
    if (planName.includes('vishwa')) return <UniversalPlanReview data={data} />;

    return (
      <div className="p-10 text-center uppercase font-bold text-red-500">
        Unknown Plan Selection: {data.selectedPlan.name}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. PROGRESS STEPPER */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <CheckoutStepper currentStep={3} />
      </div>
      
      {/* 2. DYNAMIC HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-10 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter text-center lg:text-left">
          {data?.isReviewingCustomPlan ? "Review Selection" : "Customize Plan"}
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-2 rounded-full mx-auto lg:mx-0"></div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN: Builder or Review Card */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          {renderReviewContent()}
        </div>

        {/* RIGHT COLUMN: Sidebar (Payment Summary) */}
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700">
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;