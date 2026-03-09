import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 🆕 Import useNavigate
// Import icons for a modern UI (install lucide-react: npm install lucide-react)
import { Sprout, CloudRain, Sun, Leaf, Loader, FlaskConical, AlertTriangle, Upload, ChevronLeft } from 'lucide-react'; // 🆕 Import ChevronLeft
import "./SoilAdvisor.css"; 

// --- CONFIGURATION AND API SETUP ---
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual key in a real app
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

// --- Structured Schema for the AI Output (Remains the same) ---
const SOIL_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    SoilType: { 
      type: "STRING", 
      description: "Identified soil type (e.g., Loam, Clay, Sandy, Silty, Peat) based on visual analysis." 
    },
    ExpectedWaterContent: { 
      type: "STRING", 
      description: "Estimated water retention and drainage characteristics (e.g., High retention, moderate drainage)." 
    },
    SuitableCrops: { 
      type: "ARRAY", 
      description: "List of 3-5 crops best suited for this soil, season, and temperature.",
      items: { type: "STRING" }
    },
    SeasonalConsiderations: { 
      type: "STRING", 
      description: "Advice based on the current season and temperature for the recommended crops." 
    },
    EstimatedYield: { 
      type: "STRING", 
      description: "A qualitative estimate of expected yield (e.g., Excellent, Good, Moderate, Low)." 
    }
  },
  required: ["SoilType", "ExpectedWaterContent", "SuitableCrops", "SeasonalConsiderations", "EstimatedYield"]
};

// --- Helper: Convert File to Base64 (Remains the same) ---
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

// --- Helper Component: Icon and Text Display (Remains the same) ---
const InfoCard = ({ icon: Icon, title, value, className = '' }) => (
  <div className={`info-card ${className}`}>
    <div className="icon-wrapper"><Icon size={24} /></div>
    <div className="text-content">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
    </div>
  </div>
);

// --- Main Soil Advisor Component ---
function SoilAdvisor() {
    const navigate = useNavigate(); // 🆕 Initialize the hook

  const [imageFile, setImageFile] = useState(null); 
  const [imageUrl, setImageUrl] = useState(null);   
  const [season, setSeason] = useState("Summer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Image Upload Handler (Remains the same) ---
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      if (imageUrl) URL.revokeObjectURL(imageUrl); 
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysis(null);
    } else {
      setError("Please select a valid image file (JPG, PNG) of your soil.");
      setImageFile(null);
      setImageUrl(null);
      setAnalysis(null);
    }
  };


  // --- Core AI Analysis Function (Remains the same) ---
  const getSoilAnalysis = useCallback(async () => {
    if (!imageFile) {
      return setError("Please upload an image of your soil before analysis.");
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64Data = await fileToBase64(imageFile); 
      const mimeType = imageFile.type;

      // System Instruction: Sets the context and role for the AI
      const systemInstruction = 
        "You are an expert agricultural scientist and agronomist. Your task is to analyze the soil image, combined with the farmer's current season. Visually determine the soil's composition (e.g., color, texture, moisture). Provide a highly accurate and practical advisory in the requested JSON format only. All fields must be populated. Infer typical temperature ranges based on the provided season for crop recommendation."; 
      
      // User Prompt
      const userPrompt = 
        `Analyze the soil image. The current farm condition is:
        1. Current Season: "${season}"
        
        Provide the SoilType, ExpectedWaterContent, a list of SuitableCrops, SeasonalConsiderations, and EstimatedYield based ONLY on the provided JSON schema.`;

      // Payload
      const payload = {
        contents: [{ 
          role: "user", 
          parts: [
            { text: userPrompt },
            { inlineData: { mimeType, data: base64Data } } 
          ] 
        }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: SOIL_RESPONSE_SCHEMA,
        },
      };

      // API Call
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonText) {
        throw new Error("Gemini returned an empty or unparsable response.");
      }

      const parsedAnalysis = JSON.parse(jsonText);
      setAnalysis(parsedAnalysis);

    } catch (e) {
      console.error("AI Analysis Error:", e);
      setError(`Analysis failed: ${e.message.includes("API") ? "Server or API Key error." : e.message}`);
    } finally {
      setLoading(false);
    }
  }, [imageFile, season]); 

  return (
    <div className="soil-advisor-container">
        {/* 🆕 Back to Dashboard Button */}
        <button
            className="btn-back-to-dashboard"
            onClick={() => navigate('/dashboard')} // Navigate to /dashboard route
            disabled={loading}
        >
            <ChevronLeft size={20} /> Back to Dashboard
        </button>
        {/* End Button */}
        
      <header>
        <FlaskConical size={32} />
        <h2>AI Soil & Crop Advisor</h2>
        <p>Upload a soil image for instant, visual-based agricultural insights.</p>
      </header>

      <div className="input-section">
        
        {/* Soil Image Upload Input */}
        <div className="input-group">
          <label htmlFor="image-upload"><Upload size={18} /> Upload Soil Image</label>
          <input
            type="file"
            id="image-upload"
            className="hidden-file-input" 
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          <label 
            htmlFor="image-upload" 
            className={`upload-area-label ${loading ? 'disabled-upload' : ''}`}
          >
            <Upload size={32} />
            <p>Click to upload a soil sample photo</p>
            <p className="text-sm">JPG or PNG (Clear, close-up photo preferred)</p>
          </label>
        </div>
        
        {/* Image Preview */}
        {imageUrl && (
          <div className="image-preview-soil">
            <img src={imageUrl} alt="Soil Preview" />
          </div>
        )}


        {/* Environmental Inputs - Now only contains Season */}
        <div className="env-inputs single-input"> 
          <div className="input-group">
            <label htmlFor="season"><CloudRain size={18} /> Current Season</label>
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              disabled={loading}
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn/Fall</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
        </div>
        
        {/* Analysis Button */}
        <button
          className="btn-analyze-soil"
          onClick={getSoilAnalysis}
          disabled={!imageFile || loading} 
        >
          {loading ? (
            <><Loader size={20} className="spinner" /> Analyzing Conditions...</>
          ) : (
            <><FlaskConical size={20} /> Analyze Soil & Get Plan</>
          )}
        </button>
      </div>

      {/* Status and Error Display */}
      {error && (
        <div className="status-message error">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Results Display */}
      {analysis && (
        <div className="results-section">
          <h3><Leaf size={24} /> Recommended Farm Plan</h3>
          
          <div className="analysis-grid">
            <InfoCard icon={FlaskConical} title="Identified Soil Type" value={analysis.SoilType} className="soil-type"/>
            <InfoCard icon={CloudRain} title="Expected Water Content" value={analysis.ExpectedWaterContent} className="water"/>
            <InfoCard icon={Sprout} title="Estimated Yield" value={analysis.EstimatedYield} className="yield"/>
          </div>

          <div className="crop-recommendations">
            <h4>Recommended Crops for Conditions:</h4>
            <ul>
              {analysis.SuitableCrops.map((crop, index) => (
                <li key={index}><Leaf size={16} /> {crop}</li>
              ))}
            </ul>
          </div>

          <div className="seasonal-advice">
            <h4>Seasonal Advice:</h4>
            <p>{analysis.SeasonalConsiderations}</p>
          </div>

          <div className="disclaimer">
            *This is an AI-generated recommendation. Always consult local agricultural experts before making major farming decisions.
          </div>
        </div>
      )}
    </div>
  );
}

export default SoilAdvisor;