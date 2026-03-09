# 🌾 Agri-AI Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB (local or cloud)
- Git

---

## 🔧 Backend Setup

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend` folder by copying `.env.example`:
```bash
cp ../.env.example .env
```

Then edit `.env` and add your API keys:
```env
OPENAI_API_KEY=sk-xxx...
GEMINI_API_KEY=xxx...
NEWS_API_KEY=xxx...
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=mydatabase
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 4. Run Flask Backend
```bash
python app.py
```
The backend will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

---

## 📁 Project Structure
```
Agri-AI/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── uploads/            # User uploaded images
│   └── models/             # AI models
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── .env.example            # Environment variables template
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signup` | POST | Farmer registration |
| `/api/login` | POST | Farmer login |
| `/api/upload_image` | POST | Image upload & analysis |
| `/api/query` | POST | AI chatbot |
| `/api/weather` | GET | Live weather data |
| `/api/news` | GET | Agriculture news |
| `/api/market` | GET | Market prices |

---

## 🛠 Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React.js, Vite, CSS3 |
| **Backend** | Flask (Python) |
| **Database** | MongoDB |
| **AI/ML** | OpenAI, Gemini Vision |
| **APIs** | Open-Meteo Weather, NewsAPI |

---

## 📝 Getting API Keys

### OpenAI API
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into `.env`

### Google Gemini API
1. Go to https://ai.google.dev/
2. Get your API key
3. Copy and paste into `.env`

### NewsAPI
1. Go to https://newsapi.org/
2. Sign up and create API key
3. Copy and paste into `.env`

---

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)
```bash
# Ensure Procfile exists
web: python app.py
```

### Deploy Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

---

## ⚠️ Important Notes
- Never commit `.env` file to GitHub (it's in `.gitignore`)
- Always use `.env.example` as a template
- Keep API keys private and secure
- MongoDB must be running before starting the backend

---

## 🤝 Contributing
Feel free to fork, modify, and contribute to this project!

---

## 📧 Support
For issues or questions, please create a GitHub issue.
