import React from 'react';
import { useLocation } from 'react-router-dom';
import PaymentSummary from './paymentSummary';
import CheckoutStepper from "../../../layout/CheckoutStepper";
// --- SUB-PLAN IMPORTS ---
import BasicPlanReview from './BasicPlanReview';
import FamilyPlanReview from './FamilyPlanReview';
import SeniorPlanReview from './SeniorPlanReview';
import UniversalPlanReview from './UniversalPlanReview';
import CustomizeHealthPage from './CustomizeHealthPage';

const PlanReviewPage = () => {
  const location = useLocation();
  const data = location.state;

  /**
   * Dynamically renders the specific plan details on the left side.
   * Based on the selected plan name or custom status.
   */
  const renderReviewContent = () => {
    if (!data || !data.selectedPlan) {
      return (
        <div className="p-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest">No plan data found.</p>
        </div>
      );
    }

    const planName = data.selectedPlan.name?.toLowerCase() || '';

    // Check for custom Vajra builder first
    if (data.selectedPlan.isCustom) {
      return <CustomizeHealthPage data={data} />;
    }

    // Map plan names to their specific review components
    if (planName.includes('neev')) return <BasicPlanReview data={data} />;
    if (planName.includes('parivar')) return <FamilyPlanReview data={data} />;
    if (planName.includes('varishtha')) return <SeniorPlanReview data={data} />;
    if (planName.includes('vishwa')) return <UniversalPlanReview data={data} />;

    return <div className="p-10">Unknown Plan Selection.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. PERSISTENT STEPPER (Visible at top) */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <CheckoutStepper currentStep={3} />
      </div>
      
      {/* 2. PERSISTENT HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-10 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          Review Your Selection
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mt-2 rounded-full"></div>
      </div>

      {/* 3. CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN: Dynamic Review Details Card */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          {renderReviewContent()}
        </div>

        {/* RIGHT COLUMN: Persistent Sidebar (Payment Summary) */}
        <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-700">
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;