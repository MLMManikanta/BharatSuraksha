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
// Use ../ to move up from PlanReviewPages to Plans folder, then into SubPlans
import CustomizeHealthPage from '../SubPlans/CustomizeHealthPage';
import CustomizeReviewHealthPage from './CustomizeReviewHealthPage'; 

const PlanReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize local state with data passed via navigation
  const [data, setData] = useState(location.state);

  /**
   * Renders the left-side content based on plan type and selection status.
   */
  const renderReviewContent = () => {
    // If navigation state is missing entirely, show this error
    if (!data || !data.selectedPlan) {
      return (
        <div className="p-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic">
            No plan data found.
          </p>
        </div>
      );
    }

    // 1. LOGIC FOR VAJRA (CUSTOM) PLAN
    if (data.selectedPlan.isCustom) {
      // IF CUSTOMIZING IS COMPLETE: Show the Review Summary Card
      if (data.isReviewingCustomPlan) {
        return (
          <CustomizeReviewHealthPage 
            selectionData={data} 
            onEdit={() => setData({ ...data, isReviewingCustomPlan: false })} 
            onConfirm={() => navigate('/checkout', { state: data })}
          />
        );
      }

      // DEFAULT: Show the Builder (CustomizeHealthPage)
      return (
        <CustomizeHealthPage 
          initialData={data} 
          onProceed={(customConfig) => setData({ 
            ...data, 
            ...customConfig, 
            isReviewingCustomPlan: true 
          })} 
        />
      );
    }

    // 2. STANDARD PLAN MAPPINGS
    const planName = data.selectedPlan.name?.toLowerCase() || '';
    
    if (planName.includes('neev')) return <BasicPlanReview data={data} />;
    if (planName.includes('parivar')) return <FamilyPlanReview data={data} />;
    if (planName.includes('varishtha')) return <SeniorPlanReview data={data} />;
    if (planName.includes('vishwa')) return <UniversalPlanReview data={data} />;

    return <div className="p-10 text-center font-bold text-red-500 uppercase">Unknown Plan Selection.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. PROGRESS STEPPER */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <CheckoutStepper currentStep={3} />
      </div>
      
      {/* 2. DYNAMIC HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-10 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          {data?.isReviewingCustomPlan ? "Review Selection" : "Customize Plan"}
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-2 rounded-full"></div>
      </div>

      {/* 3. MAIN CONTENT GRID (3-Column Layout) */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN: Builder or Review Card (Spans 2/3) */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          {renderReviewContent()}
        </div>

        {/* RIGHT COLUMN: Sidebar (Spans 1/3) */}
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700">
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;