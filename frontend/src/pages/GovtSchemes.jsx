// GovtSchemes.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GovtSchemes.css";

function GovtSchemes() {
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  const schemes = [
    {
      id: 1,
      category: "Seeds",
      title: { en: "Subsidized Seed Distribution", ta: "உதவித்தொகை விதை விநியோகம்" },
      desc: {
        en: "Government provides quality seeds at 50% subsidy for farmers.",
        ta: "அரசு விவசாயிகளுக்கு 50% உதவித்தொகையுடன் தரமான விதைகள் வழங்குகிறது.",
      },
      eligibility: {
        en: "Small & marginal farmers with valid land records.",
        ta: "சிறு மற்றும் குறைந்த நிலம் கொண்ட விவசாயிகள் (சொத்து ஆவணங்களுடன்).",
      },
      requirements: {
        en: "Aadhaar card, land ownership proof.",
        ta: "ஆதார் அட்டை, நில உரிமை சான்று.",
      },
      link: "https://www.nabard.org/",
    },
    {
      id: 2,
      category: "Fertilizer",
      title: { en: "Fertilizer Subsidy", ta: "உர உதவித்தொகை" },
      desc: {
        en: "Chemical & organic fertilizers available at reduced rates.",
        ta: "வேதியியல் மற்றும் இயற்கை உரங்கள் குறைந்த விலையில் கிடைக்கின்றன.",
      },
      eligibility: {
        en: "All registered farmers in cooperative societies.",
        ta: "கூட்டுறவு சங்கங்களில் பதிவு செய்யப்பட்ட அனைத்து விவசாயிகளும்.",
      },
      requirements: {
        en: "Farmer ID card or Cooperative society membership.",
        ta: "விவசாயி அடையாள அட்டை அல்லது கூட்டுறவு சங்க உறுப்பினர் அட்டை.",
      },
      link: "https://farmer.gov.in/fertilizer",
    },
    {
      id: 3,
      category: "Irrigation",
      title: { en: "Pradhan Mantri Krishi Sinchai Yojana", ta: "பிரதான் மந்திரி கிருஷி சிந்தை யோஜனா" },
      desc: {
        en: "Financial aid for drip irrigation and water-saving technology.",
        ta: "டிரிப் பாசனம் மற்றும் நீர் சேமிப்பு தொழில்நுட்பத்திற்கான நிதியுதவி.",
      },
      eligibility: {
        en: "Farmers owning irrigable land, especially in drought areas.",
        ta: "பாசன நிலம் கொண்ட விவசாயிகள், குறிப்பாக வறட்சி பகுதிகளில்.",
      },
      requirements: {
        en: "Land record, Aadhaar, bank account.",
        ta: "நில ஆவணம், ஆதார், வங்கி கணக்கு.",
      },
      link: "https://pmksy.gov.in/",
    },
    {
      id: 4,
      category: "Loan",
      title: { en: "Kisan Credit Card (KCC)", ta: "கிசான் கிரெடிட் கார்டு (KCC)" },
      desc: {
        en: "Farmers get easy loans for crops and livestock at low interest.",
        ta: "விவசாயிகள் பயிர்கள் மற்றும் மாடுகளுக்கு குறைந்த வட்டி விகிதத்தில் எளிதாக கடன் பெறலாம்.",
      },
      eligibility: {
        en: "All farmers including tenant farmers and self-help groups.",
        ta: "அனைத்து விவசாயிகள், பங்குக் குத்தகை விவசாயிகள் மற்றும் சுயஉதவி குழுக்கள்.",
      },
      requirements: {
        en: "KYC documents, land/lease proof, Aadhaar, bank account.",
        ta: "அடையாள ஆவணங்கள், நிலம்/குத்தகை சான்று, ஆதார், வங்கி கணக்கு.",
      },
      link: "https://www.rbi.org.in/Scripts/BS_ViewKCC.aspx",
    },
    {
      id: 5,
      category: "Insurance",
      title: { en: "PM Fasal Bima Yojana", ta: "பிரதான் மந்திரி ஃபசல் பீமா யோஜனா" },
      desc: {
        en: "Crop insurance to protect against natural calamities.",
        ta: "இயற்கை பேரழிவுகளிலிருந்து பாதுகாப்பிற்கான பயிர் காப்பீடு.",
      },
      eligibility: {
        en: "All farmers growing notified crops in notified areas.",
        ta: "அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை பயிரிடும் அனைத்து விவசாயிகளும்.",
      },
      requirements: {
        en: "Crop sowing certificate, Aadhaar, bank details.",
        ta: "பயிர் விதைத்த சான்று, ஆதார், வங்கி விவரங்கள்.",
      },
      link: "https://pmfby.gov.in/",
    },
    {
      id: 6,
      category: "Seeds",
      title: { en: "National Seed Corporation Scheme", ta: "நேஷனல் சீட் கார்ப்பரேஷன் திட்டம்" },
      desc: {
        en: "Provides high-quality seeds to farmers across India.",
        ta: "இந்தியாவில் விவசாயிகளுக்கு உயர்தர விதைகள் வழங்குகிறது.",
      },
      eligibility: {
        en: "All registered farmers.",
        ta: "பதிவு செய்யப்பட்ட அனைத்து விவசாயிகளும்.",
      },
      requirements: {
        en: "Aadhaar, land record.",
        ta: "ஆதார், நில ஆவணம்.",
      },
      link: "https://nsclseed.com/",
    },
    {
      id: 7,
      category: "Fertilizer",
      title: { en: "Neem Coated Urea Scheme", ta: "நீம் பூச்சு உர திட்டம்" },
      desc: {
        en: "Reduces nitrogen loss and enhances soil fertility.",
        ta: "நைட்ரஜன் இழப்பை குறைத்து மண்ணின் பொருத்தத்தை மேம்படுத்துகிறது.",
      },
      eligibility: {
        en: "All farmers eligible for urea subsidy.",
        ta: "உர உதவித்தொகைக்கு தகுதியான அனைத்து விவசாயிகளும்.",
      },
      requirements: {
        en: "Farmer ID, Aadhaar.",
        ta: "விவசாயி அடையாள அட்டை, ஆதார்.",
      },
      link: "https://fert.nic.in/",
    },
    {
      id: 8,
      category: "Irrigation",
      title: { en: "Micro Irrigation Scheme", ta: "மைக்ரோ பாசன திட்டம்" },
      desc: {
        en: "Promotes water-efficient irrigation practices.",
        ta: "நீர் திறமையான பாசன முறைகளை ஊக்குவிக்கிறது.",
      },
      eligibility: {
        en: "All farmers with irrigable land.",
        ta: "பாசன நிலம் கொண்ட அனைத்து விவசாயிகளும்.",
      },
      requirements: {
        en: "Land record, Aadhaar.",
        ta: "நில ஆவணம், ஆதார்.",
      },
      link: "https://pmksy.gov.in/microirrigation",
    },
    {
      id: 9,
      category: "Loan",
      title: { en: "Interest Subsidy Scheme for Dairy Farmers", ta: "பால் விவசாயிகளுக்கான வட்டி உதவித்தொகை திட்டம்" },
      desc: {
        en: "Subsidy on loans for dairy development.",
        ta: "பால் வளர்ச்சிக்கான கடனில் உதவித்தொகை.",
      },
      eligibility: {
        en: "Registered dairy farmers.",
        ta: "பதிவு செய்யப்பட்ட பால் விவசாயிகள்.",
      },
      requirements: {
        en: "Farmer ID, bank account.",
        ta: "விவசாயி அடையாள அட்டை, வங்கி கணக்கு.",
      },
      link: "https://nddb.coop/",
    },
    {
      id: 10,
      category: "Insurance",
      title: { en: "Livestock Insurance Scheme", ta: "மாட்டுயிர் காப்பீட்டு திட்டம்" },
      desc: {
        en: "Protects farmers against death of cattle and livestock.",
        ta: "மாட்டுயிர் மற்றும் கால்நடைகளின் மரணத்திற்கு பாதுகாப்பு.",
      },
      eligibility: {
        en: "All farmers owning livestock.",
        ta: "மட்டும் கால்நடை வைத்திருக்கும் விவசாயிகள்.",
      },
      requirements: {
        en: "Livestock ownership proof, Aadhaar.",
        ta: "கால்நடை உரிமை சான்று, ஆதார்.",
      },
      link: "https://nddb.coop/",
    },
  ];

  const filteredSchemes =
    category === "all" ? schemes : schemes.filter((s) => s.category === category);

  return (
    <div className="container my-5">
      <button className="back-btn mb-3" onClick={() => navigate("/dashboard")}>
        ⬅ Back to Dashboard
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏛️ Govt Schemes</h2>

        <div>
          <button
            className={`btn btn-sm me-2 ${language === "en" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            className={`btn btn-sm ${language === "ta" ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setLanguage("ta")}
          >
            தமிழ்
          </button>
        </div>
      </div>

      <div className="mb-4">
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Seeds">Seeds</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Irrigation">Irrigation</option>
          <option value="Loan">Loan</option>
          <option value="Insurance">Insurance</option>
        </select>
      </div>

      <div className="row g-4">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="col-md-6">
            <div className="scheme-card p-4 shadow-sm">
              <h5 className="fw-bold">{scheme.title[language]}</h5>
              <p className="text-muted">{scheme.desc[language]}</p>
              <span className="badge bg-success mb-2">{scheme.category}</span>
              <div className="mt-3">
                <p>
                  <strong>👥 {language === "en" ? "Who can apply:" : "யார் விண்ணப்பிக்கலாம்:"}</strong>
                  <br /> {scheme.eligibility[language]}
                </p>
                <p>
                  <strong>📑 {language === "en" ? "Requirements:" : "தேவையான ஆவணங்கள்:"}</strong>
                  <br /> {scheme.requirements[language]}
                </p>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success mt-2"
                >
                  {language === "en" ? "Learn More" : "மேலும் படிக்க"}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GovtSchemes;
