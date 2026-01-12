import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";

// --- PLANS ---
// The Main Container (Tabs + Member Form)
import PlanDetails from "./components/pages/Plans/PlanDetails"; 
// The Advanced Calculator
import CustomizeHealthPage from "./components/pages/Plans/CustomizeHealthPage"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={ <Layout> <Home /> </Layout>}/>
        <Route path="/home" element={ <Layout> <Home /> </Layout>}/>
        
        {/* --- PLANS SECTION --- */}
        
        {/* Main Plans Page (Tabs + Form) */}
        <Route path="/plans" element={ <Layout> <PlanDetails /> </Layout> } />
        
        {/* Advanced Customization */}
        <Route path="/customize" element={ <Layout> <CustomizeHealthPage /> </Layout> } />

        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
        <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;