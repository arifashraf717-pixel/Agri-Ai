import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Note: You might need to import a relevant icon package like react-icons or use simple emojis/Bootstrap icons
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // --- Hot Agri News (dynamic) ---
  const [hotNews, setHotNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState("");

  // Load user name for greeting
  useEffect(() => {
    try {
      const name = localStorage.getItem("userName") || "";
      setUserName(name);
    } catch {}
  }, []);

  // Removed scroll reveal animations

  useEffect(() => {
    // IMPORTANT: In a production app, the API key should be stored securely.
    const NEWS_API_KEY = "b0f312ae07974caba8f59a1e5f5d7681";
    const NEWS_API_URL = `https://newsapi.org/v2/everything?q=agriculture OR farming OR crops OR horticulture&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();

        if (data.status !== "ok") {
          throw new Error(data.message || "Failed to fetch news.");
        }

        const formattedNews = data.articles.slice(0, 5).map((article, index) => ({
          id: index + 1,
          title: article.title,
          date: new Date(article.publishedAt).toLocaleDateString(),
          url: article.url,
        }));

        setHotNews(formattedNews);
        setNewsError("");
      } catch (err) {
        setNewsError("⚠️ Failed to fetch agriculture news. API limit or network error.");
      } finally {
        setLoadingNews(false);
      }
    };

    // Fetch immediately
    fetchNews();

    // Refresh every hour (3600000 ms)
    const interval = setInterval(fetchNews, 3600000); 
    return () => clearInterval(interval); // Cleanup function for the interval
  }, []);

  // --- Profit Calculator ---
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profit, setProfit] = useState(null);

  const calculateProfit = () => {
    const inc = parseFloat(income);
    const exp = parseFloat(expenses);

    if (isNaN(inc) || isNaN(exp)) {
      setProfit("⚠️ Please enter valid numbers.");
      return;
    }
    if (inc < 0 || exp < 0) {
      setProfit("⚠️ Values cannot be negative.");
      return;
    }

    const result = inc - exp;
    // Format the output clearly
    setProfit(
      result >= 0
        ? `✅ Total Profit: ₹${result.toFixed(2)}`
        : `❌ Total Loss: ₹${Math.abs(result).toFixed(2)}`
    );
  };

  // --- Farmer Tasks & Vaccinations ---
  const [tasks, setTasks] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    // Load tasks and filter out completed ones
    const savedTasks = JSON.parse(localStorage.getItem("farmerTasks")) || [];
    setTasks(savedTasks.filter((t) => !t.done));

    // Load vaccinations and filter out completed ones
    const savedVaccinations = JSON.parse(localStorage.getItem("vaccinationRecords")) || [];
    setVaccinations(savedVaccinations.filter((v) => !v.done));
  }, []);

  const markTaskDone = (id) => {
    const all = JSON.parse(localStorage.getItem("farmerTasks")) || [];
    const updated = all.map((t) => (t.id === id ? { ...t, done: true } : t));
    localStorage.setItem("farmerTasks", JSON.stringify(updated));
    setTasks(updated.filter((t) => !t.done));
  };

  const markVaccinationDone = (id) => {
    const all = JSON.parse(localStorage.getItem("vaccinationRecords")) || [];
    const updated = all.map((v) => (v.id === id ? { ...v, done: true } : v));
    localStorage.setItem("vaccinationRecords", JSON.stringify(updated));
    setVaccinations(updated.filter((v) => !v.done));
  };

  // --- NEW AI Navigation Handler ---
  const goToSoilAdvisor = () => {
    // Navigate to the route where you place the SoilAdvisor component (e.g., /soil-advisor)
    navigate("/soil-advisor"); 
  };


  return (
    <div className="container my-5">
      <h2 className="text-center mb-2">{userName ? `👋 ${userName}, welcome to your dashboard` : '🌾 Farmer Dashboard'}</h2>
      <p className="text-center mb-4">Manage crops, tasks, vaccinations, market updates, and financial insights at one place.</p>

      {/* -------- 5 Info Cards (Updated Layout to accommodate 5 cards) -------- */}
      <div className="row g-4 text-center mb-5 row-cols-2 row-cols-md-3 row-cols-lg-5 align-items-stretch">
        
        {/* === NEW AI ADVISOR CARD === */}
        <div className="col d-flex">
          <div 
            className="info-card ai-advisor hover-move w-100 h-100" 
            onClick={goToSoilAdvisor}
          >
            <i className="bi bi-robot"></i>
            <h6>Smart Soil Advisor</h6>
          </div>
        </div>
        {/* =========================== */}

        <div className="col d-flex">
          <div className="info-card hover-move w-100 h-100" onClick={() => navigate("/schemes")}>
            <i className="bi bi-bank"></i>
            <h6>Govt Schemes</h6>
            <p>Explore subsidies, loans & support programs.</p>
          </div>
        </div>
        <div className="col d-flex">
          <div className="info-card hover-move w-100 h-100" onClick={() => navigate("/market")}>
            <i className="bi bi-currency-rupee"></i>
            <h6>Market Prices</h6>
            <p>Daily mandi rates near you.</p>
          </div>
        </div>
        <div className="col d-flex">
          <div className="info-card hover-move w-100 h-100" onClick={() => navigate("/weather")}>
            <i className="bi bi-cloud-sun"></i>
            <h6>Weather Alerts</h6>
            <p>AI-driven forecasts.</p>
          </div>
        </div>
        <div className="col d-flex">
          <div className="info-card hover-move w-100 h-100" onClick={() => navigate("/tips")}>
            <i className="bi bi-lightbulb"></i>
            <h6>Smart Tips</h6>
            <p>Low-cost, high-impact yield tricks.</p>
          </div>
        </div>
      </div>
      <hr/> 

      {/* ------------------------------------- */}
      {/* -------- My Tasks & Vaccinations -------- */}
      {/* ------------------------------------- */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3"> 
          <h4 className="mb-0">📝 My Tasks & Vaccinations</h4>
          {/* Action button to add new items -> Navigates to FarmManagementApp.jsx's route */}
          <button 
              className="btn btn-primary btn-sm" 
              onClick={() => navigate("/farm-management")} // <-- UPDATED NAVIGATION
              title="Add a new farming task or vaccination record"
          >
            + Add New
          </button>
        </div>
        
        <div className="row g-3">
          {tasks.length === 0 && vaccinations.length === 0 && (
            <p className="text-muted">No pending tasks or vaccinations 🎉</p>
          )}

          {/* Render pending tasks */}
          {tasks.map((task) => (
            <div key={task.id} className="col-md-6">
              <div className="news-card p-3 shadow-sm rounded">
                <h6>📌 {task.title}</h6>
                <p className="mb-1"><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                <p className="mb-2"><strong>Category:</strong> {task.category}</p>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markTaskDone(task.id)}
                >
                  ✅ Mark Done
                </button>
              </div>
            </div>
          ))}

          {/* Render pending vaccinations */}
          {vaccinations.map((v) => (
            <div key={v.id} className="col-md-6">
              <div className="news-card p-3 shadow-sm rounded">
                <h6>💉 {v.animal} - {v.vaccine}</h6>
                <p className="mb-1"><strong>Date:</strong> {v.date}</p>
                <p className="mb-2"><strong>Next Due:</strong> {v.nextDate || "Not Set"}</p>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => markVaccinationDone(v.id)}
                >
                  ✅ Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ------------------------------------- */}
      {/* -------- Trending Agri News -------- */}
      {/* ------------------------------------- */}
      <div className="mb-5">
        <h4 className="mb-3">🔥 Trending Agriculture News</h4>
        {loadingNews ? (
          <p className="text-center">Loading agriculture news...</p>
        ) : newsError ? (
          <p className="text-center text-danger">{newsError}</p>
        ) : (
          <div className="row g-3">
            {hotNews.map((news, index) => (
              <div key={news.id} className="col-md-6">
                <div className="news-card p-3 shadow-sm rounded d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-title-link">
                      <h6 className="mb-0">{news.title}</h6>
                    </a>
                    {/* Mark the top 3 news as "Trending" */}
                    {index < 3 && <span className="badge bg-success">Trending</span>} 
                  </div>
                  <small className="text-muted">{news.date}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------- */}
      {/* -------- Profit Calculator -------- */}
      {/* ------------------------------------- */}
      <div className="calculator-card p-4 shadow-sm rounded">
        <h4>💰 Profit Calculator</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Enter Income (₹)"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Enter Expenses (₹)"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-success mt-3" onClick={calculateProfit}>
          Calculate Profit/Loss
        </button>
        {profit && <p className="mt-3 fs-5" dangerouslySetInnerHTML={{ __html: profit }}></p>}
      </div>
    </div>
  );
}

export default Dashboard;