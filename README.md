# 🌾 Agri-AI – Intelligent Smart Farming Platform

![React](https://img.shields.io/badge/Frontend-React-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![AI](https://img.shields.io/badge/AI-Gemini%20Vision%20%7C%20OpenAI-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

Agri-AI is a **full-stack smart agriculture platform** that empowers farmers with **Artificial Intelligence and real-time data** to improve farming productivity and decision-making.

Built using **React.js, Flask, Gemini AI Vision and MongoDB**, the system provides crop detection, soil analysis, plant disease detection, AI chatbot assistance, live weather monitoring, agriculture news, market prices, and complete farm management.

---

# 🚀 Live Demo

Coming Soon

---

# 📸 Project Screenshots

Add screenshots of your project inside a folder called **screenshots**.

Example folder structure:

screenshots/dashboard.png
screenshots/crop-detection.png
screenshots/chatbot.png
screenshots/weather.png

Example display:

## Dashboard

![Dashboard](screenshots/dashboard.png)

## Crop Detection

![Crop Detection](screenshots/crop-detection.png)

## AI Chatbot

![Chatbot](screenshots/chatbot.png)

---

# 🔥 Key Features

## 🤖 AI Farmer Chatbot

* Ask farming questions in natural language
* Provides expert advice on crops, fertilizers, irrigation and livestock
* Built using powerful AI language models

---

## 🌱 Crop, Soil & Animal Detection

Upload images and get instant AI analysis.

Features:

* Crop type recognition
* Soil quality detection
* Animal identification
* Actionable farming recommendations

Powered by **Google Gemini Vision AI**

---

## 🦠 Plant Disease Detection

Detect plant diseases using image analysis.

System provides:

* Disease name
* Cause of infection
* Treatment suggestions
* Prevention strategies

---

## 🌦️ Live Weather Monitoring

Real-time weather information for farmers.

Includes:

* Temperature
* Humidity
* Wind speed
* Weather conditions

Helps farmers plan irrigation, harvesting and pesticide spraying.

Powered by **Open-Meteo Weather API**

---

## 📰 Agriculture News Feed

Displays latest agriculture updates including:

* Government schemes
* Farming innovations
* Agricultural research
* Policy announcements

Powered by **NewsAPI**

---

## 💹 Market Price Insights

Daily updated prices for:

* Dairy products
* Vegetables
* Fruits
* Seeds and fertilizers

Helps farmers choose the **best selling time for crops**.

---

## 🧾 Smart Farm Management System

Complete digital farm management.

Features include:

* Farmer signup & login
* Farm profile management
* Crop record tracking
* Expense tracking
* Production monitoring

All data stored securely using **MongoDB**.

---

# 🏗️ System Architecture

User (Farmer)
│
▼
React.js Frontend
│
▼
Flask REST API
│
┌────┴──────────────┐
▼                   ▼
MongoDB          AI Services
Database         (Gemini + OpenAI)
│
▼
External APIs
Weather API | News API

---

# 🛠 Technology Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | React.js                        |
| Backend  | Flask (Python)                  |
| AI       | Gemini Vision AI, OpenAI        |
| Database | MongoDB                         |
| APIs     | Open-Meteo Weather API, NewsAPI |
| Tools    | Git, GitHub, VS Code            |

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

git clone https://github.com/Midhun-Saravanan/Agri-Ai.git
cd Agri-Ai

---

## 2️⃣ Install Backend Dependencies

pip install flask flask-cors python-dotenv pymongo requests openai

---

## 3️⃣ Setup Environment Variables

Create a `.env` file inside backend folder.

OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
NEWS_API_KEY=your_newsapi_key

---

## 4️⃣ Start MongoDB

mongod

---

## 5️⃣ Run Flask Backend

python app.py

---

## 6️⃣ Run React Frontend

cd frontend
npm install
npm start

---

# 🔗 API Endpoints

| Endpoint          | Method | Description           |
| ----------------- | ------ | --------------------- |
| /api/signup       | POST   | Farmer registration   |
| /api/login        | POST   | Farmer login          |
| /api/upload_image | POST   | Crop / soil detection |
| /api/weather      | GET    | Fetch weather data    |
| /api/query        | POST   | AI chatbot query      |
| /api/news         | GET    | Agriculture news      |
| /api/market       | GET    | Market prices         |

---

# 🎯 Project Impact

Agri-AI helps farmers:

* Reduce crop losses
* Detect diseases early
* Improve crop yield
* Access real-time farming information
* Make data-driven agricultural decisions

The system moves agriculture towards **smart digital farming**.

---

# 🚀 Future Enhancements

Planned improvements:

* Multi-language support (Tamil, Hindi)
* Voice assistant for farmers
* IoT sensors for soil moisture monitoring
* AI crop yield prediction
* Farmer marketplace for direct selling
* Mobile app version

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Submit pull request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Midhun Saravanan**
B.Tech Information Technology
Full Stack & AI Developer
