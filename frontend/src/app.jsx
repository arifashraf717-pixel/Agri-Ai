import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// ✅ Common Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FarmerQueries from "./components/FarmerQueries";
import CropRecognition from "./components/Recognition";

// ✅ Combined Tasks + Tracker
import FarmManagementApp from "./components/FarmManagementApp";

// ✅ Dashboard + Subpages
import Dashboard from "./pages/Dashboard";
import GovtSchemes from "./pages/GovtSchemes";
import MarketPage from "./pages/MarketPage";
import WeatherPage from "./pages/WeatherPage";
import TipsPage from "./pages/TipsPage";

// ✅ Crop Advisor
import CropAdvisor from "./components/CropAdvisor";

// 🆕 NEW: Import the Soil Advisor Component
import SoilAdvisor from "./components/SoilAdvisor"; // Assuming you place SoilAdvisor.jsx in the 'components' folder

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill">
          <Routes>
            {/* 🌐 Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 📌 Farmer Tools */}
            <Route path="/farmer-queries" element={<FarmerQueries />} />
            <Route path="/crop-recognition" element={<CropRecognition />} />
            <Route path="/farm-management" element={<FarmManagementApp />} />
            {/* Keeping the existing crop-advisor path */}
            <Route path="/crop-advisor" element={<CropAdvisor />} /> 
            
            {/* 🆕 NEW ROUTE: Soil Advisor for personalized crop recommendations */}
            <Route path="/soil-advisor" element={<SoilAdvisor />} /> 

            {/* 📊 Dashboard & Subpages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schemes" element={<GovtSchemes />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/tips" element={<TipsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;