import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../common/LoadingSpinner';
import PaymentSummary from './paymentSummary';
import CheckoutStepper from "../../../layout/CheckoutStepper";

import BasicPlanReview from './BasicPlanReview';
import FamilyPlanReview from './FamilyPlanReview';
import SeniorPlanReview from './SeniorPlanReview';
import UniversalPlanReview from './UniversalPlanReview';

import CustomizeHealthPage from '../SubPlans/CustomizeHealthPage';
import CustomizeReviewHealthPage from './CustomizeReviewHealthPage'; 

const PlanReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [data, setData] = useState(() => {
    return location.state || null;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const isFromHome = data?.fromHome === true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [data, isFromHome]);

const handleLiveUpdate = (updatedFields) => {
  setData((prev) => ({
    ...prev,
    ...updatedFields,
    // Ensure nested objects are merged safely if passed partially
    features: updatedFields.features || prev.features,
    riders: updatedFields.riders || prev.riders, 
    sumInsured: updatedFields.sumInsured || prev.sumInsured
  }));
};

  const handleProceed = (customConfig) => {
    setData((prev) => ({
      ...prev,
      ...customConfig,
      isReviewingCustomPlan: true, 
      features: customConfig.features || prev.features || [],
      riders: customConfig.riders || prev.riders || [],
      selectedChronic: customConfig.selectedChronic || prev.selectedChronic || []
    }));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = () => {
    if (isFromHome) return;
    
    if (data.selectedPlan?.isCustom || String(data.selectedPlan?.name).toLowerCase().includes('vajra')) {
      setData(prev => ({ ...prev, isReviewingCustomPlan: false }));
    } else {
      navigate(-1);
    }
  };

  const handleConfirm = () => {
    if (isFromHome) return;
    navigate('/proposal-form', { state: data });
  };

  const renderReviewContent = () => {
    if (!data || !data.selectedPlan) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <p className="font-bold">No plan data available.</p>
          <button onClick={() => navigate('/select-plan')} className="mt-4 text-blue-500 underline">
            Go to Plan Selection
          </button>
        </div>
      );
    }

    const planName = String(data.selectedPlan.name || "").toLowerCase();
    const isVajra = data.selectedPlan.isCustom || planName.includes('vajra');

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
      // PASS onChange PROP HERE so sidebar updates live
      return (
        <CustomizeHealthPage 
          initialData={data} 
          onProceed={handleProceed} 
          onChange={handleLiveUpdate} 
        />
      );
    }

    if (planName.includes('neev')) return <BasicPlanReview data={data} />;
    if (planName.includes('parivar')) return <FamilyPlanReview data={data} />;
    if (planName.includes('varishtha')) return <SeniorPlanReview data={data} />;
    if (planName.includes('vishwa')) return <UniversalPlanReview data={data} />;

    return (
      <div className="p-10 text-center text-red-500">
        Unknown Plan Type: {data.selectedPlan.name}
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner message="Calculating Premiums..." />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <CheckoutStepper currentStep={3} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 mb-8">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          {data?.isReviewingCustomPlan ? "Review Your Plan" : "Customize & Review"}
        </h1>
        <p className="text-slate-500 mt-2">
          {data?.isReviewingCustomPlan 
            ? "Verify your coverage details before proceeding to KYC." 
            : "Tailor your coverage to your exact needs."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden min-h-[500px]">
          {renderReviewContent()}
        </div>

        <div className="lg:col-span-4 sticky top-24">
          <PaymentSummary data={data} />
        </div>
      </div>
    </div>
  );
};

export default PlanReviewPage;