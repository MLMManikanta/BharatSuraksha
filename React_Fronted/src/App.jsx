import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";
import PlanDetails from "./components/pages/Plans/PlanDetails"; 

// Import the 404 Page
import NotFoundPage from './NotFoundPage';

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
import MyClaims from "./components/pages/ClaimPages/MyClaims";
import EntitlementDependents from "./components/pages/ClaimPages/EntitlementDependents";
import RaiseClaim from "./components/pages/ClaimPages/RaiseClaim";
import ECard from "./components/pages/Utilities/ECard";
import HospitalList from "./components/pages/Utilities/HospitalList";
import JustificationLetter from "./components/pages/Utilities/JustificationLetter";
import ClaimInstructions from "./components/pages/Utilities/ClaimInstructions";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC & HOME ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={ <Layout> <Home /> </Layout>}/>
        <Route path="/home" element={ <Layout> <Home /> </Layout>}/>
        
        {/* --- INSURANCE PLANS FLOW --- */}
        
        {/* Step 1: Tell us who to cover */}
        <Route path="/plans" element={ <Layout> <PlanDetails /> </Layout> } />
        <Route path="/plan-details" element={ <Layout> <PlanDetails /> </Layout> } />

        {/* Step 2: Choose the Base Plan (Neev, Parivar, Varishtha, Vishwa, Vajra) */}
        <Route path="/select-plan" element={ <Layout> <PlanPreExistingSelection /> </Layout> } />

        {/* Step 3: Customize (The Vajra Builder interface) */}
        <Route path="/customize" element={ <Layout> <CustomizeHealthPage /> </Layout> } />

        {/* Step 4: Final Review (Summary and Payment Breakdown) */}
        <Route path="/plan-review" element={ <Layout> <PlanReviewPage /> </Layout> } />

        {/* Step 5: KYC (Know Your Customer) */}
        <Route path="/kyc" element={ <Layout> <KYCPage /> </Layout> } />

        {/* Step 6: Medical Information */}
        <Route path="/medical" element={ <Layout> <MedicalInformationPage /> </Layout> } />

        {/* Step 6: Pay & Bank Details (Merged) */}
        <Route path="/bankinfo" element={ <Layout> <BankInformationPage /> </Layout> } />

        <Route path="/payment-frequency" element={ <Layout> <PaymentFrequencyPage /> </Layout> } />

        {/* Step 7: Order Summary */}
        <Route path="/order-summary" element={ <Layout> <OrderSummaryPage /> </Layout> } />

        {/* Step 8: Payment */}
        <Route path="/payment" element={ <Layout> <PaymentPage /> </Layout> } />
        <Route path="/payment-success" element={ <Layout> <PaymentSuccessPage /> </Layout> } />

        {/* --- ADDITIONAL PAGES --- */}
        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
          <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />
          <Route path="/claims" element={<Navigate to="/claims/my-claims" replace />} />

        {/* --- CLAIMS PAGES --- */}
        <Route path="/claims/my-claims" element={
         /*  <ProtectedRoute> */
            <Layout> <MyClaims /> </Layout>
        /*   </ProtectedRoute> */
        } />
        <Route path="/claims/entitlement-dependents" element={
          /* <ProtectedRoute> */
            <Layout> <EntitlementDependents /> </Layout>
         /*  </ProtectedRoute> */
        } />
        <Route path="/claims/entitlement" element={<Navigate to="/claims/entitlement-dependents" replace />} />
        <Route path="/claims/raise-claim" element={
          /* <ProtectedRoute> */
            <Layout> <RaiseClaim /> </Layout>
          /* </ProtectedRoute> */
        } />
        <Route path="/claims/raise-claim/:dependentId" element={
          /* <ProtectedRoute> */
            <Layout> <RaiseClaim /> </Layout>
          /* </ProtectedRoute> */
        } />
        <Route path="/claims/raise-new" element={<Navigate to="/claims/raise-claim" replace />} />

        {/* --- UTILITIES --- */}
        <Route path="/utilities" element={<Navigate to="/utilities/e-card" replace />} />
        <Route path="/utilities/e-card" element={
          /* <ProtectedRoute> */
            <Layout> <ECard /> </Layout>
          /* </ProtectedRoute> */
        } />
        <Route path="/utilities/hospitals" element={
          /* <ProtectedRoute> */
            <Layout> <HospitalList /> </Layout>
          /* </ProtectedRoute> */
        } />
        <Route path="/utilities/justification-letter" element={
          /* <ProtectedRoute> */
            <Layout> <JustificationLetter /> </Layout>
          /* </ProtectedRoute> */
        } />
        <Route path="/utilities/claim-instructions" element={
         /*  <ProtectedRoute> */
            <Layout> <ClaimInstructions /> </Layout>
          /* </ProtectedRoute> */
        } />

        {/* --- ERROR CATCHING --- */}
        {/* Shows the custom 404 page for any undefined URL */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;