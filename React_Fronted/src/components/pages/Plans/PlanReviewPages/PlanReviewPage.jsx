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
  
  // Initialize state. If location.state is missing, default to null.
  const [data, setData] = useState(location.state || null);

  /**
   * 1. handleProceed
   * Triggered when user clicks "Confirm Selection" in the Builder.
   * It merges the builder config (features, tenure, etc.) into the main data
   * and sets 'isReviewingCustomPlan' to true.
   */
  const handleProceed = (customConfig) => {
    console.log("Proceeding with config:", customConfig); // Debug log
    setData((prev) => ({
      ...prev,
      ...customConfig,
      isReviewingCustomPlan: true 
    }));
  };

  /**
   * 2. handleEdit
   * Triggered when user clicks "Modify Plan" in the Review screen.
   * Navigates back to the plan selection page with Vajra tab active.
   */
  const handleEdit = () => {
    // Extract parent data (counts, user) to pass back
    const { counts, user, ...customizationData } = data || {};
    
    navigate('/select-plan', { 
      state: { 
        counts, 
        user,
        activeTab: 'vajra',  // Keep Vajra tab active
        customizationData    // Preserve all customization settings
      } 
    });
  };

  /**
   * 3. handleConfirm
   * Triggered when user clicks "Confirm & Pay".
   * Navigates to the next step.
   */
  const handleConfirm = () => {
    navigate('/proposal-form', { state: data });
  };

  const renderReviewContent = () => {
    // Safety check for missing data
    if (!data || !data.selectedPlan) {
      return (
        <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl">
          <p className="text-slate-400 font-bold uppercase tracking-widest italic">
            No plan data found.
          </p>
        </div>
      );
    }

    // --- LOGIC: Check for Vajra/Custom Plan ---
    const isVajra = data.selectedPlan.isCustom || 
                    String(data.selectedPlan.name).toLowerCase().includes('vajra');

    if (isVajra) {
      // SCENARIO A: User has customized and is now Reviewing
      if (data.isReviewingCustomPlan) {
        return (
          <CustomizeReviewHealthPage 
            selectionData={data}       // <--- MUST MATCH PROP IN CHILD COMPONENT
            onEdit={handleEdit}        // Pass the edit handler
            onConfirm={handleConfirm}  // Pass the confirm handler
          />
        );
      }

      // SCENARIO B: User is still Building (Default)
      // We pass 'data' as initialData so settings persist if they go back
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
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <CheckoutStepper currentStep={3} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-10 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter text-center lg:text-left">
          {data?.isReviewingCustomPlan ? "Review Selection" : "Customize Plan"}
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-2 rounded-full mx-auto lg:mx-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          {renderReviewContent()}
        </div>

        <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700">
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;