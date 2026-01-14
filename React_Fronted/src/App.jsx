import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";
import PlanDetails from "./components/pages/Plans/PlanDetails"; 

import PlanPreExistingSelection from "./components/pages/Plans/PlanPreExistingSelection";
import CustomizeHealthPage from "./components/pages/Plans/SubPlans/CustomizeHealthPage.jsx"; 
import PlanReviewPage from "./components/pages/Plans/PlanReviewPages/PlanReviewPage.jsx";
import KYCPage from "./components/pages/KYCPage";
import MedicalInformationPage from "./components/pages/MedicalInformationPage";
import BankInformationPage from "./components/pages/BankInformationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC & HOME ROUTES --- */}
        <Route path="/login" element={<Login />} />
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

        {/* Step 7: Bank Information */}
        <Route path="/bankinfo" element={ <Layout> <BankInformationPage /> </Layout> } />

        {/* --- ADDITIONAL PAGES --- */}
        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
        <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />

        {/* --- ERROR CATCHING --- */}
        {/* Redirects any invalid URL back to Home */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;