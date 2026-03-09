# 🌾 Agri-AI – Intelligent Smart Farming Platform

Agri-AI is a full-stack smart agriculture system that empowers farmers with Artificial Intelligence to make accurate, data-driven farming decisions. Built using **React.js**, **Flask**, **Gemini AI Vision**, and **MongoDB**, this platform integrates crop, soil, animal & disease detection, AI chatbot assistance, live weather updates, agriculture news, market price analysis and complete farm management — all in one powerful solution.

---

## 🔥 Key Features

### 🤖 AI Farmer Chatbot

* Ask farming questions in natural language
* Provides expert guidance on crops, soil health, fertilizers, irrigation & livestock
* Built using large language models

### 🌱 Crop, Soil & Animal Detection (Gemini Vision)

* Upload images to identify crop type, soil quality and animals
* Gemini AI Vision analyzes and gives actionable recommendations

### 🦠 Plant Disease Detection

* Detects multiple plant diseases using trained AI models
* Provides prevention & treatment steps instantly

### 🌦️ Live Weather Monitoring

* Real-time temperature and weather condition updates
* Helps farmers plan irrigation, harvesting & spraying

### 📰 Agriculture News Feed

* Displays latest agriculture-related news and schemes
* Keeps farmers informed about innovations and government programs

### 💹 Market Price Insights

* Daily updated prices for dairy, vegetables, fruits & seeds
* Helps farmers make better selling decisions

### 🧾 Smart Farm Management System

* Farmer signup & login
* Stores farm profile, crop records, expense tracking & production data
* MongoDB powered scalable database

---

## 🛠 Technology Stack

| Layer     | Technology                      |
| --------- | ------------------------------- |
| Frontend  | React.js                        |
| Backend   | Flask (Python)                  |
| AI Models | Gemini AI Vision, OpenAI        |
| Database  | MongoDB                         |
| APIs      | Open-Meteo Weather API, NewsAPI |
| Tools     | VS Code, GitHub                 |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Midhun-Saravanan/Agri-Ai.git
cd Agri-Ai
```

### 2️⃣ Install Backend Dependencies

```bash
pip install flask flask-cors python-dotenv pymongo requests openai
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
NEWS_API_KEY=your_newsapi_key
```

### 4️⃣ Start MongoDB

```bash
mongod
```

### 5️⃣ Run Flask Backend

```bash
python app.py
```

### 6️⃣ Run React Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔗 API Endpoints

| Endpoint            | Method | Description              |
| ------------------- | ------ | ------------------------ |
| `/api/signup`       | POST   | Farmer registration      |
| `/api/login`        | POST   | Farmer login             |
| `/api/upload_image` | POST   | Crop / soil image upload |
| `/api/weather`      | GET    | Fetch live weather       |
| `/api/query`        | POST   | AI chatbot               |
| `/api/news`         | GET    | Agriculture news         |
| `/api/market`       | GET    | Market prices            |

---

## 🎯 Project Impact

Agri-AI transforms traditional farming into **smart digital agriculture** by giving farmers real-time AI guidance, early disease detection and complete farm analytics — reducing crop loss and increasing productivity.

---

## 🚀 Future Enhancements

* Regional language voice assistant
* IoT sensor integration for live soil & crop health
* Fertilizer & irrigation optimization system
* Farmer-to-farmer digital marketplace
