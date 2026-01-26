import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUT & WRAPPERS ---
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PurchaseProtectedRoute from "./components/common/PurchaseProtectedRoute";

// --- PUBLIC PAGES ---
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";
import NotFoundPage from './NotFoundPage';

// --- INSURANCE PLANS FLOW ---
import PlanDetails from "./components/pages/Plans/PlanDetails"; 
import PlanPreExistingSelection from "./components/pages/Plans/PlanPreExistingSelection";
import CustomizeHealthPage from "./components/pages/Plans/SubPlans/CustomizeHealthPage.jsx"; 
import PlanReviewPage from "./components/pages/Plans/PlanReviewPages/PlanReviewPage.jsx";
import KYCPage from "./components/pages/KYCPage";
import MedicalInformationPage from "./components/pages/MedicalInformationPage";
import BankInformationPage from "./components/pages/BankInformationPage";
import PaymentFrequencyPage from "./components/pages/PaymentFrequencyPage";
import OrderSummaryPage from "./components/pages/OrderSummaryPage";
import PaymentPage from "./components/pages/PaymentPage";
import PaymentSuccessPage from "./components/pages/PaymentSuccessPage";

// --- CLAIM CONTROL SECTION ---
import MyClaims from "./components/pages/ClaimPages/MyClaims";
import EntitlementDependents from "./components/pages/ClaimPages/EntitlementDependents";
import RaiseClaim from "./components/pages/ClaimPages/RaiseClaim";
import ViewClaim from "./components/pages/ClaimPages/ViewClaim";

// --- UTILITIES (Sub-features of Claim Control) ---
import ECard from "./components/pages/Utilities/ECard";
import HospitalList from "./components/pages/Utilities/HospitalList";
import JustificationLetter from "./components/pages/Utilities/JustificationLetter";
import ClaimInstructions from "./components/pages/Utilities/ClaimInstructions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- AUTHENTICATION --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- GENERAL PAGES --- */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><Aboutus /></Layout>} />
        <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
        
        {/* --- PURCHASE FLOW: Step-by-Step --- */}
        <Route path="/plans" element={<Layout><PlanDetails /></Layout>} />
        <Route path="/plan-details" element={<Layout><PlanDetails /></Layout>} />

        <Route path="/select-plan" element={
          <PurchaseProtectedRoute><Layout><PlanPreExistingSelection /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/customize" element={
          <PurchaseProtectedRoute><Layout><CustomizeHealthPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/plan-review" element={
          <PurchaseProtectedRoute><Layout><PlanReviewPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/kyc" element={
          <PurchaseProtectedRoute><Layout><KYCPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/medical" element={
          <PurchaseProtectedRoute><Layout><MedicalInformationPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/bankinfo" element={
          <PurchaseProtectedRoute><Layout><BankInformationPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/payment-frequency" element={
          <PurchaseProtectedRoute><Layout><PaymentFrequencyPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/order-summary" element={
          <PurchaseProtectedRoute><Layout><OrderSummaryPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/payment" element={
          <PurchaseProtectedRoute><Layout><PaymentPage /></Layout></PurchaseProtectedRoute>
        } />
        <Route path="/payment-success" element={<Layout><PaymentSuccessPage /></Layout>} />

        {/* --- CLAIM CONTROL & MANAGEMENT --- */}
        <Route path="/claims" element={<ProtectedRoute><Navigate to="/claims/my-claims" replace /></ProtectedRoute>} />
        <Route path="/claims/my-claims" element={<ProtectedRoute><Layout><MyClaims /></Layout></ProtectedRoute>} />
        <Route path="/claims/entitlement-dependents" element={<ProtectedRoute><Layout><EntitlementDependents /></Layout></ProtectedRoute>} />
        <Route path="/claims/entitlement" element={<ProtectedRoute><Navigate to="/claims/entitlement-dependents" replace /></ProtectedRoute>} />
        <Route path="/claims/view/:id" element={<ProtectedRoute><Layout><ViewClaim /></Layout></ProtectedRoute>} />

        {/* Dynamic Claim Raising */}
        <Route path="/claims/raise-claim" element={<ProtectedRoute><Layout><RaiseClaim /></Layout></ProtectedRoute>} />
        <Route path="/claims/raise-claim/:dependentId" element={<ProtectedRoute><Layout><RaiseClaim /></Layout></ProtectedRoute>} />
        <Route path="/claims/raise-new" element={<ProtectedRoute><Navigate to="/claims/raise-claim" replace /></ProtectedRoute>} />
        <Route path="/claims/view/:id" element={<ProtectedRoute><Layout><ViewClaim /></Layout></ProtectedRoute>} />

        {/* --- UTILITY TOOLS --- 
            These are grouped here because they are logically part of the 
            "Claim Control" user experience.
        */}
        <Route path="/utilities" element={<Navigate to="/utilities/e-card" replace />} />
        <Route path="/utilities/e-card" element={<Layout><ECard /></Layout>} />
        <Route path="/utilities/hospitals" element={<Layout><HospitalList /></Layout>} />
        <Route path="/utilities/justification-letter" element={<Layout><JustificationLetter /></Layout>} />
        <Route path="/utilities/claim-instructions" element={<Layout><ClaimInstructions /></Layout>} />

        {/* --- 404 ERROR CATCH --- */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;