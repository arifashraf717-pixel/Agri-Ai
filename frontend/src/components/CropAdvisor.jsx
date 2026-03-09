import React, { useState, useCallback } from "react";
import "./CropAdvisor.css";

// --- GEMINI AI CONFIGURATION ---
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

const DISEASE_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    Type: { type: "STRING" },
    Species: { type: "STRING" },
    Disease: { type: "STRING" },
    Treatment: { type: "STRING" },
  },
  required: ["Type", "Species", "Disease", "Treatment"],
};

// --- Helper: Convert File to Base64 ---
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

// --- Icon Component ---
const Icon = ({ children }) => (
  <span style={{ display: "inline-flex", marginRight: "8px" }}>{children}</span>
);

function CropAdvisor() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [diseasePrediction, setDiseasePrediction] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // --- Image Upload ---
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      // Clean up previous object URL to free memory
      if (imageUrl) URL.revokeObjectURL(imageUrl); 
      setImageUrl(URL.createObjectURL(file));
      setImageError(null);
      setDiseasePrediction(null);
    } else {
      setImageError("Please select a valid image file (JPG, PNG).");
      setImageFile(null);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      setDiseasePrediction(null);
    }
  };

  // --- Disease Detection via Gemini ---
  const detectDisease = useCallback(async () => {
    if (!imageFile)
      return setImageError("Please upload an image before analysis.");

    setImageLoading(true);
    setImageError(null);
    setDiseasePrediction(null);

    try {
      const base64Data = await fileToBase64(imageFile);
      const mimeType = imageFile.type;

      const systemInstruction =
        "You are a highly skilled agricultural and veterinary vision AI. Analyze the provided image. Identify the species, detect disease if any, and provide treatment. Output JSON only.";
      const userPrompt =
        "Analyze this image and report Type, Species, Disease, and Treatment.";

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: userPrompt },
              { inlineData: { mimeType, data: base64Data } },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: DISEASE_RESPONSE_SCHEMA,
        },
      };

      let result;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (response.ok) {
            result = await response.json();
            break;
          } else throw new Error(`API returned status ${response.status}`);
        } catch (e) {
          if (attempt < 2)
            await new Promise((res) => setTimeout(res, 2 ** attempt * 1000));
          else throw e;
        }
      }

      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText)
        throw new Error("Gemini response was empty or malformed.");

      // Robustness Check: Ensure the parsed JSON contains all required fields
      const prediction = JSON.parse(jsonText);
      const requiredKeys = ["Type", "Species", "Disease", "Treatment"];
      const missingKey = requiredKeys.find(key => !prediction.hasOwnProperty(key));
      if (missingKey) {
        throw new Error(`AI returned JSON but is missing the required field: ${missingKey}`);
      }

      setDiseasePrediction(prediction);

    } catch (e) {
      console.error("AI Analysis Error:", e);
      setImageError(
        `AI analysis failed: ${
          e.message.includes("Failed to fetch")
            ? "Network error (check connection/API key)."
            : e.message
        }`
      );
    } finally {
      setImageLoading(false);
    }
  }, [imageFile, imageUrl]); // Added imageUrl to dependency array for cleanup

  // Clean up object URL on component unmount
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="crop-advisor-container">
      <header>
        <h2>🔬 Smart Disease Detector (AI Powered)</h2>
        <p>
          Upload an image of a plant or animal — Gemini AI will analyze it and
          detect diseases with treatment suggestions.
        </p>
      </header>

      <div className="feature-card">
        {/* Added Title for consistency */}
        <h3><Icon>📸</Icon> Upload for Analysis</h3> 
        
        <div className="image-upload-wrapper">
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={imageLoading} // Disable input while loading
          />
          <label 
            htmlFor="image-upload" 
            className={`image-upload-area ${imageLoading ? 'disabled-upload' : ''}`} // Style hint for disabled
          >
            <span className="image-upload-icon">⬆️</span>
            <p>Click to upload an image</p>
            <p className="text-sm">of a sick plant or animal</p>
          </label>

          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="preview" />
            </div>
          )}
          <button
            className="btn-analyze"
            onClick={detectDisease}
            disabled={!imageFile || imageLoading}
          >
            {imageLoading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {imageLoading && (
          <div className="status-message">⏳ Analyzing image...</div>
        )}
        {imageError && (
          <div className="status-message" style={{ color: "#f44336" }}>
            ❌ {imageError}
          </div>
        )}

        {diseasePrediction && (
          <div className="disease-results">
            <h4>
              <Icon>🏥</Icon> Health Analysis
            </h4>
            <div
              className={`disease-card ${
                diseasePrediction.Disease.toLowerCase() === "healthy" // Use toLowerCase for safer check
                  ? "healthy"
                  : "diseased"
              }`}
            >
              <h5>
                Asset: {diseasePrediction.Type} ({diseasePrediction.Species})
              </h5>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontWeight: "600",
                  color:
                    diseasePrediction.Disease.toLowerCase() === "healthy"
                      ? "#388e3c"
                      : "#d32f2f",
                }}
              >
                Disease Detected: {diseasePrediction.Disease}
              </p>
              <div className="treatment-section">
                <p>
                  <strong>Treatment/Cure:</strong>
                  <br />
                  {diseasePrediction.Treatment}
                </p>
              </div>
            </div>
            <p
              className="status-message"
              style={{ textAlign: "left", marginTop: "1rem" }}
            >
              *AI result; verify with expert.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropAdvisor;