import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- LAYOUT & PAGES ---
import Layout from "./components/layout/Layout";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";

// --- PLANS PAGES ---
// 1. Step 1: Member Selection (Now the main entry point for Plans)
import PlanDetails from "./components/pages/Plans/PlanDetails"; 

// 2. Step 2: Final Plan Selection (Tabs & Features)
import PlanPreExistingSelection from "./components/pages/Plans/PlanPreExistingSelection";

// 3. Advanced Customization Page
import CustomizeHealthPage from "./components/pages/Plans/CustomizeHealthPage"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        
        {/* MAIN LAYOUT ROUTES */}
        <Route path="/" element={ <Layout> <Home /> </Layout>}/>
        <Route path="/home" element={ <Layout> <Home /> </Layout>}/>
        
        {/* --- PLANS SECTION --- */}
        
        {/* CHANGED: Route '/plans' now goes directly to Member Selection (PlanDetails) */}
        <Route path="/plans" element={ <Layout> <PlanDetails /> </Layout> } />
        
        {/* Keep this route accessible if linked elsewhere */}
        <Route path="/plan-details" element={ <Layout> <PlanDetails /> </Layout> } />

        {/* Step 2: Final Plan Selection */}
        <Route path="/select-plan" element={ <Layout> <PlanPreExistingSelection /> </Layout> } />

        {/* Advanced Customization */}
        <Route path="/customize" element={ <Layout> <CustomizeHealthPage /> </Layout> } />

        {/* --- OTHER PAGES --- */}
        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
        <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App; 