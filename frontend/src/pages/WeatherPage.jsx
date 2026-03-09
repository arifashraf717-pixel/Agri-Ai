import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WeatherPage.css";

function WeatherPage() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [seasonalCrop, setSeasonalCrop] = useState("");
  const [language, setLanguage] = useState("en"); // en / ta

  // ✅ Fetch weather from backend
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
            );
            const data = await res.json();
            if (data.error) {
              setError(data.error);
            } else {
              setWeather({
                ...data,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
              });
              generateSuggestion(data);
              generateSeasonalCrop();
            }
          } catch (err) {
            setError("⚠️ Failed to fetch weather data.");
          }
        },
        async () => {
          const res = await fetch(
            `http://localhost:5000/api/weather?lat=19.076&lon=72.8777`
          );
          const data = await res.json();
          setWeather({ ...data, lat: 19.076, lon: 72.8777 });
          generateSuggestion(data);
          generateSeasonalCrop();
        }
      );
    }
  }, []);

  // ✅ Crop Suggestions
  const generateSuggestion = (data) => {
    if (!data) return;
    if (data.condition.toLowerCase().includes("rain")) {
      setSuggestion({
        en: "🌱 You can grow paddy, sugarcane, and leafy vegetables.",
        ta: "🌱 நீர் பாசனம் நேரமாக இருப்பதால் நெல், கரும்பு, கீரை போன்றவற்றை பயிரிடலாம்.",
      });
    } else if (data.temp > 32) {
      setSuggestion({
        en: "☀️ Suitable for millet, groundnut, and cotton.",
        ta: "☀️ சோளம், நிலக்கடலை, பருத்தி போன்ற பயிர்களுக்கு ஏற்ற காலநிலை.",
      });
    } else if (data.temp < 20) {
      setSuggestion({
        en: "❄️ Best for wheat, mustard, and potatoes.",
        ta: "❄️ கோதுமை, கடுகு, உருளைக்கிழங்கு போன்ற பயிர்களுக்கு சிறந்தது.",
      });
    } else {
      setSuggestion({
        en: "🌿 Most crops can be grown. Monitor soil moisture regularly.",
        ta: "🌿 பல்வேறு பயிர்களை பயிரிடலாம். மண் ஈரப்பதத்தை கவனமாக பராமரிக்கவும்.",
      });
    }
  };

  // ✅ Seasonal Recommendation
  const generateSeasonalCrop = () => {
    const month = new Date().getMonth() + 1;
    let crop = { en: "", ta: "" };

    if ([6, 7, 8, 9].includes(month)) {
      crop = {
        en: "🌧 Kharif Season: Rice, maize, bajra, pulses, groundnut.",
        ta: "🌧 கரீப் பருவம்: நெல், சோளம், கம்பு, பருப்பு, நிலக்கடலை.",
      };
    } else if ([10, 11, 12, 1].includes(month)) {
      crop = {
        en: "🍂 Rabi Season: Wheat, barley, peas, mustard, gram.",
        ta: "🍂 ரபி பருவம்: கோதுமை, வாரகு, பட்டாணி, கடுகு, கொண்டை கடலை.",
      };
    } else if ([2, 3, 4, 5].includes(month)) {
      crop = {
        en: "🌞 Zaid Season: Watermelon, cucumber, pumpkin, fodder crops.",
        ta: "🌞 ஜாய்த் பருவம்: தர்பூசணி, வெள்ளரி, பூசணி, மாட்டு தீவனப் பயிர்கள்.",
      };
    }

    setSeasonalCrop(crop);
  };

  return (
    <div className="weather-container">
      <div className="header">
        <h2 className="weather-title">
          {language === "en" ? "🌦 Live Weather Update" : "🌦 நேரடி காலநிலை புதுப்பிப்பு"}
        </h2>
        {/* Language Switch */}
        <div>
          <button
            className={`btn-lang ${language === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            className={`btn-lang ${language === "ta" ? "active" : ""}`}
            onClick={() => setLanguage("ta")}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {weather ? (
        <div className="weather-card">
          <h3 className="city-name">📍 {weather.city}</h3>
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
            className="weather-icon"
          />
          <p className="condition">{weather.condition}</p>

          {/* ✅ Info Boxes */}
          <div className="info-boxes">
            <div className="info-box">
              🌡️ <span>{weather.temp}°C</span>
              <p>{language === "en" ? "Temperature" : "வெப்பநிலை"}</p>
            </div>
            <div className="info-box">
              📍 <span>{weather.lat.toFixed(2)}</span>
              <p>{language === "en" ? "Latitude" : "அட்சரேகை"}</p>
            </div>
            <div className="info-box">
              📍 <span>{weather.lon.toFixed(2)}</span>
              <p>{language === "en" ? "Longitude" : "நெட்டரேகை"}</p>
            </div>
          </div>

          {/* ✅ Crop Suggestions */}
          <div className="suggestion-box">
            {language === "en" ? suggestion.en : suggestion.ta}
          </div>

          {/* ✅ Seasonal Recommendation */}
          <div className="season-box">
            {language === "en" ? seasonalCrop.en : seasonalCrop.ta}
          </div>
        </div>
      ) : (
        <p className="loading-text">
          {language === "en" ? "Loading weather..." : "காலநிலை ஏற்றப்படுகிறது..."}
        </p>
      )}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ⬅ {language === "en" ? "Back to Dashboard" : "டாஷ்போர்டுக்கு திரும்ப"}
      </button>
    </div>
  );
}

export default WeatherPage;
