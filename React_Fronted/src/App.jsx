import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Aboutus from "./components/pages/Aboutus";
import ContactUs from "./components/pages/ContactUs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={ <Layout>  <Home />  </Layout>}/>
        <Route path="/" element={ <Layout>  <Home />  </Layout>}/>
        <Route path="/about" element={ <Layout> <Aboutus /> </Layout> } />
        <Route path="/contact" element={ <Layout> <ContactUs /> </Layout> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
