import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../common/LoadingSpinner';
import PaymentSummary from './paymentSummary';
import CheckoutStepper from "../../../layout/CheckoutStepper";

// --- SUB-PLAN REVIEWS ---
import BasicPlanReview from './BasicPlanReview';
import FamilyPlanReview from './FamilyPlanReview';
import SeniorPlanReview from './SeniorPlanReview';
import UniversalPlanReview from './UniversalPlanReview';

// --- CUSTOM BUILDER COMPONENTS ---
import CustomizeHealthPage from '../SubPlans/CustomizeHealthPage';
import CustomizeReviewHealthPage from './CustomizeReviewHealthPage'; 

const PlanReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize state from router location
  const [data, setData] = useState(location.state || null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if viewing from home (read-only mode)
  const isFromHome = data?.fromHome === true;

  // Fake loading effect for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 1. LIVE UPDATE HANDLER (Crucial for Builder Mode)
   * This function allows the child component (CustomizeHealthPage) to update
   * the parent state in real-time. This ensures the PaymentSummary sidebar
   * reflects changes (e.g., adding a rider) immediately.
   */
  const handleLiveUpdate = (updatedConfig) => {
    setData((prev) => ({
      ...prev,
      ...updatedConfig, // Merge new sliders, riders, features
      // Explicitly preserve critical parent data if not passed back
      selectedPlan: prev.selectedPlan,
      counts: prev.counts,
      user: prev.user
    }));
  };

  /**
   * 2. PROCEED HANDLER (Builder -> Review Custom)
   * Called when user clicks "Confirm Selection" inside the builder.
   */
  const handleProceed = (finalConfig) => {
    setData((prev) => ({
      ...prev,
      ...finalConfig,
      isReviewingCustomPlan: true // Flips the view to the Review Card
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 3. EDIT HANDLER (Review -> Edit)
   * Logic depends on plan type.
   */
  const handleEdit = () => {
    if (isFromHome) return;
    
    const planName = String(data.selectedPlan?.name || "").toLowerCase();
    const isVajra = data.selectedPlan?.isCustom || planName.includes('vajra');

    if (isVajra && data.isReviewingCustomPlan) {
      // If reviewing a custom plan, just flip back to builder mode on same page
      setData(prev => ({ ...prev, isReviewingCustomPlan: false }));
    } else {
      // If standard plan, go back to the Plan Selection grid
      navigate('/select-plan', { 
        state: { 
          counts: data.counts, 
          user: data.user,
          activeTab: planName.includes('parivar') ? 'parivar' : 
                     planName.includes('varishtha') ? 'varishtha' : 
                     planName.includes('vishwa') ? 'vishwa' : 'neev'
        } 
      });
    }
  };

  /**
   * 4. CONFIRM HANDLER (Proceed to KYC)
   */
  const handleConfirm = () => {
    if (isFromHome) return;
    navigate('/proposal-form', { state: data });
  };

  // --- CONTENT RENDERER ---
  const renderReviewContent = () => {
    // Safety Check
    if (!data || !data.selectedPlan) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-lg border border-slate-100">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="font-bold text-slate-500">No plan data available.</p>
          <button 
            onClick={() => navigate('/select-plan')} 
            className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-all"
          >
            Go to Plan Selection
          </button>
        </div>
      );
    }

    const planName = String(data.selectedPlan.name || "").toLowerCase();
    const isVajra = data.selectedPlan.isCustom || planName.includes('vajra');

    // SCENARIO A: Custom Plan (Builder Logic)
    if (isVajra) {
      if (data.isReviewingCustomPlan) {
        return (
          <CustomizeReviewHealthPage 
            selectionData={data} 
            onEdit={handleEdit} 
            onConfirm={handleConfirm} 
          />
        );
      }
      // SHOW BUILDER: Pass handleLiveUpdate to enable sidebar reactivity
      return (
        <CustomizeHealthPage 
          initialData={data} 
          onProceed={handleProceed} 
          onChange={handleLiveUpdate} 
        />
      );
    }

    // SCENARIO B: Standard Plans
    if (planName.includes('neev')) return <BasicPlanReview data={data} onChange={handleLiveUpdate} />;
    if (planName.includes('parivar')) return <FamilyPlanReview data={data} onChange={handleLiveUpdate} />;
    if (planName.includes('varishtha')) return <SeniorPlanReview data={data} onChange={handleLiveUpdate} />;
    if (planName.includes('vishwa')) return <UniversalPlanReview data={data} onChange={handleLiveUpdate} />;

    return (
      <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-3xl">
        Unknown Plan Type: {data.selectedPlan.name}
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner message="Calculating Premiums..." />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Sticky Stepper */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <CheckoutStepper currentStep={3} />
      </div>
      
      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 pt-10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter text-center lg:text-left">
          {data?.isReviewingCustomPlan || !String(data?.selectedPlan?.name || "").includes('Vajra') 
            ? "Review Your Plan" 
            : "Customize & Review"}
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-2 rounded-full mx-auto lg:mx-0"></div>
        <p className="text-slate-500 mt-3 font-medium text-center lg:text-left">
          {data?.isReviewingCustomPlan 
            ? "Verify your coverage details and riders before proceeding." 
            : "Tailor the coverage limits and add-ons to your exact needs."}
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Plan Content */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[500px] animate-in fade-in slide-in-from-left-4 duration-700">
          {renderReviewContent()}
        </div>

        {/* Right Column: Payment Summary (Sticky) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 animate-in fade-in slide-in-from-right-4 duration-700">
          {/* We pass the entire 'data' object. 
             Since handleLiveUpdate updates 'data' in real-time, 
             PaymentSummary will re-calculate automatically.
          */}
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;