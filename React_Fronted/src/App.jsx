import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- LAYOUT & PAGES ---
import Layout from "./components/layout/Layout";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";

// --- PLANS PAGES ---
// 1. Step 1: Member Selection (Entry point)
import PlanDetails from "./components/pages/Plans/PlanDetails"; 

// 2. Step 2: Final Plan Selection (Base Plan)
import PlanPreExistingSelection from "./components/pages/Plans/PlanPreExistingSelection";

// 3. Step 3: Advanced Customization (Riders, Tenure, Sum Insured)
import CustomizeHealthPage from "./components/pages/Plans/CustomizeHealthPage"; 

// 4. Step 4: Plan Review (Covered/Not Covered & OPD)
import PlanReviewPage from "./components/pages/Plans/PlanReviewPage"; 

// --- FUTURE STEPS (Uncomment as you create these files) ---
// import KYCPage from "./components/pages/Plans/KYCPage";             // Step 5
// import MedicalHistory from "./components/pages/Plans/MedicalHistory"; // Step 6
// import BankDetails from "./components/pages/Plans/BankDetails";       // Step 7
// import PaymentPage from "./components/pages/Plans/PaymentPage";       // Step 8

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        
        {/* MAIN LAYOUT ROUTES */}
        <Route path="/" element={ <Layout> <Home /> </Layout>}/>
        <Route path="/home" element={ <Layout> <Home /> </Layout>}/>
        
        {/* --- PLANS FLOW --- */}
        
        {/* Step 1: Member Selection */}
        <Route path="/plans" element={ <Layout> <PlanDetails /> </Layout> } />
        <Route path="/plan-details" element={ <Layout> <PlanDetails /> </Layout> } />

        {/* Step 2: Base Plan Selection */}
        <Route path="/select-plan" element={ <Layout> <PlanPreExistingSelection /> </Layout> } />

        {/* Step 3: Customization (Riders & Logic) */}
        <Route path="/customize" element={ <Layout> <CustomizeHealthPage /> </Layout> } />

        {/* Step 4: Review Plan (Truth Table & OPD Toggle) */}
        <Route path="/plan-review" element={ <Layout> <PlanReviewPage /> </Layout> } />

        {/* --- FUTURE ROUTES (Placeholders) --- */}
        {/* <Route path="/kyc" element={ <Layout> <KYCPage /> </Layout> } /> */}
        {/* <Route path="/medical" element={ <Layout> <MedicalHistory /> </Layout> } /> */}
        {/* <Route path="/bank-details" element={ <Layout> <BankDetails /> </Layout> } /> */}
        {/* <Route path="/payment" element={ <Layout> <PaymentPage /> </Layout> } /> */}

        {/* --- OTHER PAGES --- */}
        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
        <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;