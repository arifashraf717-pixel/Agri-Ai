import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MarketPage.css"; // Import custom styles

function MarketPage() {
  const navigate = useNavigate();

  // Language state
  const [language, setLanguage] = useState("English");
  const [marketData, setMarketData] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

  // Translations
  const labels = {
    English: {
      today: "Today",
      yesterday: "Yesterday",
      unit: "Unit",
      location: "Location",
      back: "Back to Dashboard",
      title: "🌾 Market Prices",
      categories: {
        Dairy: "Dairy",
        Seeds: "Seeds",
        Vegetables: "Vegetables",
        Fruits: "Fruits",
      },
      items: {
        "Cow Milk": "Cow Milk",
        "Buffalo Milk": "Buffalo Milk",
        Eggs: "Eggs",
        Wheat: "Wheat",
        Rice: "Rice",
        Cotton: "Cotton",
        Tomato: "Tomato",
        Potato: "Potato",
        Onion: "Onion",
        Banana: "Banana",
        Mango: "Mango",
        Apple: "Apple",
      },
      locations: {
        "Tamil Nadu": "Tamil Nadu",
        Haryana: "Haryana",
        "Andhra Pradesh": "Andhra Pradesh",
        Delhi: "Delhi",
        Punjab: "Punjab",
        Maharashtra: "Maharashtra",
        Karnataka: "Karnataka",
        "Uttar Pradesh": "Uttar Pradesh",
        Kerala: "Kerala",
        "Himachal Pradesh": "Himachal Pradesh",
      },
    },
    Tamil: {
      today: "இன்று",
      yesterday: "நேற்று",
      unit: "அலகு",
      location: "இடம்",
      back: "டாஷ்போர்டுக்கு திரும்ப",
      title: "🌾 சந்தை விலை",
      categories: {
        Dairy: "பால்வளம்",
        Seeds: "விதைகள்",
        Vegetables: "காய்கறிகள்",
        Fruits: "பழங்கள்",
      },
      items: {
        "Cow Milk": "பசு பால்",
        "Buffalo Milk": "எருமை பால்",
        Eggs: "முட்டை",
        Wheat: "கோதுமை",
        Rice: "அரிசி",
        Cotton: "பருத்தி",
        Tomato: "தக்காளி",
        Potato: "உருளைக்கிழங்கு",
        Onion: "வெங்காயம்",
        Banana: "வாழை",
        Mango: "மாம்பழம்",
        Apple: "ஆப்பிள்",
      },
      locations: {
        "Tamil Nadu": "தமிழ்நாடு",
        Haryana: "ஹரியானா",
        "Andhra Pradesh": "ஆந்திரப் பிரதேசம்",
        Delhi: "டெல்லி",
        Punjab: "பஞ்சாப்",
        Maharashtra: "மகாராஷ்டிரா",
        Karnataka: "கர்நாடகா",
        "Uttar Pradesh": "உத்தரப் பிரதேசம்",
        Kerala: "கேரளா",
        "Himachal Pradesh": "ஹிமாச்சலப் பிரதேசம்",
      },
    },
  };

  // Fetch market data
  useEffect(() => {
    let isMounted = true;
    let timer;
    let visibilityHandler;

    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch(`${API_BASE}/api/market`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        setMarketData(data.market || {});
        setLastUpdated(data.as_of || "");
        setLoading(false);
        try {
          localStorage.setItem(
            "market_cache",
            JSON.stringify({ market: data.market || {}, as_of: data.as_of || "" })
          );
        } catch (_) {}
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load market data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
    timer = setInterval(fetchData, 30000); // refresh every 30s
    visibilityHandler = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
        timer = null;
      } else {
        fetchData();
        if (!timer) timer = setInterval(fetchData, 30000);
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
      if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("market_cache");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.market) {
          setMarketData(parsed.market);
          setLastUpdated(parsed.as_of || "");
          setLoading(false);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    let timeoutId;
    let intervalId;
    const schedule = () => {
      const now = new Date();
      const next = new Date(now);
      next.setDate(now.getDate() + 1);
      next.setHours(0, 0, 10, 0);
      const ms = next.getTime() - now.getTime();
      timeoutId = setTimeout(() => {
        try {
          fetch(`${API_BASE}/api/market`).then(async (r) => {
            if (!r.ok) return;
            const d = await r.json();
            setMarketData(d.market || {});
            setLastUpdated(d.as_of || "");
            try {
              localStorage.setItem(
                "market_cache",
                JSON.stringify({ market: d.market || {}, as_of: d.as_of || "" })
              );
            } catch (_) {}
          });
        } catch (_) {}
        intervalId = setInterval(() => {
          try {
            fetch(`${API_BASE}/api/market`).then(async (r) => {
              if (!r.ok) return;
              const d = await r.json();
              setMarketData(d.market || {});
              setLastUpdated(d.as_of || "");
              try {
                localStorage.setItem(
                  "market_cache",
                  JSON.stringify({ market: d.market || {}, as_of: d.as_of || "" })
                );
              } catch (_) {}
            });
          } catch (_) {}
        }, 24 * 60 * 60 * 1000);
      }, ms);
    };
    schedule();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [API_BASE]);

  const getTrend = (today, yesterday) => {
    if (today > yesterday) return <span className="trend-up">⬆️</span>;
    if (today < yesterday) return <span className="trend-down">⬇️</span>;
    return <span className="trend-same">➡️</span>;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-success fw-bold">
        {labels[language].title}
      </h2>

      {/* Status bar */}
      <div className="text-center mb-3 small text-muted">
        {loading && <span>Loading latest prices…</span>}
        {!loading && !error && lastUpdated && <span>Last updated: {new Date(lastUpdated).toLocaleString()}</span>}
        {error && <span className="text-danger">{error}</span>}
      </div>

      {/* Language Switch */}
      <div className="text-center mb-3">
        <button
          className={`btn me-2 ${language === "English" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setLanguage("English")}
        >
          English
        </button>
        <button
          className={`btn ${language === "Tamil" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setLanguage("Tamil")}
        >
          தமிழ்
        </button>
      </div>

      <div className="row g-4">
        {Object.keys(marketData || {}).map((category, i) => (
          <div key={i} className="col-12">
            <div className="info-card">
              <h4 className="text-success mb-3">{labels[language].categories[category]}</h4>
              <div className="row g-3">
                {(marketData[category] || []).map((m, j) => (
                  <div key={j} className="col-12 col-md-4">
                    <div className="market-card">
                      <h5>
                        {labels[language].items[m.item]} {getTrend(m.price, m.yesterday)}
                      </h5>
                      <p>
                        <b>{labels[language].today}:</b> ₹{m.price} <br />
                        <b>{labels[language].yesterday}:</b> ₹{m.yesterday} <br />
                        <b>{labels[language].unit}:</b> {m.unit} <br />
                        <b>{labels[language].location}:</b> {labels[language].locations[m.location]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-success px-4 py-2"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ {labels[language].back}
        </button>
      </div>
    </div>
  );
}

export default MarketPage;
