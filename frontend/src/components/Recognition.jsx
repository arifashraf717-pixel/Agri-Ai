import React, { useState, useCallback } from 'react';
import { Upload, Loader, Zap, CheckCircle, XCircle } from 'lucide-react';
import './recognisation.css'; // Import external CSS

// --- CONFIGURATION AND API SETUP ---
const API_KEY = "AIzaSyDVAj1dSRDAwjkryEkczLk9ruyyShJIWZg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// Structured schema
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    "Type": { "type": "STRING" },
    "Species": { "type": "STRING" },
    "DetailName": { "type": "STRING" },
    "DetailValue": { "type": "STRING" },
    "StatusName": { "type": "STRING" },
    "StatusValue": { "type": "STRING" },
    "Confidence": { "type": "NUMBER" }
  },
  required: ["Type","Species","DetailName","DetailValue","StatusName","StatusValue","Confidence"]
};

// Convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Prediction Card Component
const PredictionCard = ({ label, value }) => (
  <div className="prediction-card">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

// Loader Component
const LoaderSpinner = () => (
  <div className="loader-spinner">
    <Loader className="loader-icon" />
    <p>Analyzing image with Gemini...</p>
    <p className="loader-subtext">This may take a moment to generate a structured result.</p>
  </div>
);

// Main App
const App = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file (JPG, PNG).");
        setImageFile(null);
        setImageUrl(null);
        setPrediction(null);
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      setPrediction(null);
    }
  };

  // API call
  const generatePrediction = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image before predicting.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const base64Data = await fileToBase64(imageFile);
      const mimeType = imageFile.type;

      const systemInstruction = "You are a specialized agricultural vision AI. Analyze the provided image of a crop or an animal. Identify the species, its detailed classification (variety or breed), and its current status (growth stage or age/gender). Provide the output in the requested JSON structure only. Confidence must be between 0.70 and 1.00.";
      const userPrompt = "Analyze this image and identify the agricultural asset (Crop or Animal). Provide the Species, its specific detail (Variety for Crop, Breed for Animal), and its current state (Growth Stage for Crop, Age/Gender for Animal).";

      const payload = {
        contents: [{role: "user", parts:[{text:userPrompt}, {inlineData:{mimeType, data:base64Data}}]}],
        systemInstruction: {parts:[{text: systemInstruction}]},
        generationConfig: {responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA}
      };

      let response;
      let result;
      for (let attempt=0; attempt<3; attempt++) {
        try {
          response = await fetch(API_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
          if (response.ok) { result = await response.json(); break; }
          else { throw new Error(`API returned status ${response.status}`); }
        } catch(e) {
          if (attempt<2) await new Promise(res => setTimeout(res, 2**attempt*1000));
          else throw e;
        }
      }

      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) throw new Error("Gemini response was empty or malformed.");

      const parsedPrediction = JSON.parse(jsonText);
      parsedPrediction.Confidence = `${(parsedPrediction.Confidence*100).toFixed(0)}%`;
      setPrediction(parsedPrediction);

    } catch(e) {
      console.error("Prediction Error:", e);
      setError("Failed to get prediction from AI. Please try a different image or check your API key/network.");
    } finally { setLoading(false); }

  }, [imageFile]);

  return (
    <div className="app-container">
      <div className="main-card">
        {/* Header */}
        <div className="header-section">
          <Zap className="icon-lg" />
          <h1 className="title">AgriVision AI Predictor</h1>
        </div>

        <div className="content-grid">
          {/* Left Panel */}
          <div className="left-panel">
            <h2 className="section-title">1. Upload Image</h2>
            <div className="upload-area">
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange}/>
              <label htmlFor="file-upload" className="upload-label">
                <Upload className="upload-icon"/>
                <p className="upload-text">Click to upload an image</p>
                <p className="upload-subtext">of a crop or farm animal (JPG, PNG)</p>
              </label>
            </div>

            {imageUrl && <div className="image-preview"><img src={imageUrl} alt="preview" className="preview-image"/></div>}

            <button onClick={generatePrediction} disabled={!imageFile || loading} className={`glassy-btn ${!imageFile || loading?'disabled':''}`}>
              {loading ? <Loader className="loader-icon"/> : <Zap className="loader-icon"/>}
              <span>{loading?'Analyzing...':'Analyze Image with Gemini AI'}</span>
            </button>

            {error && <div className="error-msg"><XCircle className="error-icon"/><span>{error}</span></div>}
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <h2 className="section-title">2. Prediction Result</h2>
            {loading && <LoaderSpinner/>}
            {prediction && (
              <div className="result-card">
                <div className={`result-card-header ${prediction.Type==='Crop'?'crop':'animal'}`}>
                  <CheckCircle className="result-icon"/>
                  <h3 className="result-title">{prediction.Type} Prediction</h3>
                </div>
                <div className="result-content">
                  <PredictionCard label="Type" value={prediction.Type}/>
                  <PredictionCard label="Species" value={prediction.Species}/>
                  <PredictionCard label={prediction.DetailName||'Detail'} value={prediction.DetailValue}/>
                  <PredictionCard label={prediction.StatusName||'Status'} value={prediction.StatusValue}/>
                  <PredictionCard label="Confidence" value={prediction.Confidence}/>
                </div>
                <p className="result-footer">This result is generated by the Gemini AI model based on visual analysis. Always verify results with a human expert.</p>
              </div>
            )}

            {!loading && !prediction && !imageUrl && (
              <div className="empty-prompt">
                <Zap className="empty-icon"/>
                <p>Upload an image and press "Analyze" to see your AI prediction here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
