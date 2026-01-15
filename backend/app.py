from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from openai import OpenAI
from pymongo import MongoClient
import requests
from datetime import datetime

# ---------------- Configuration ----------------
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- Load Environment Variables ----------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
client_ai = OpenAI(api_key=OPENAI_API_KEY)

# ---------------- MongoDB Connection ----------------
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["mydatabase"]
users_collection = db["user"]

# ---------------- Allowed Values ----------------
ALLOWED_LOCATIONS = ["ERODE", "COIMBATORE", "TIRUPPUR", "SALEM", "Other"]
ALLOWED_FARM_TYPES = ["Dairy", "Crop Farming", "Mixed"]

# ---------------- Helper Functions ----------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------- Routes ----------------
@app.route('/')
def index():
    return jsonify({"status": "Backend running ✅"})

# ---------------- Image Upload ----------------
@app.route('/api/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'status': 'success', 'message': 'File uploaded successfully', 'filename': filename})
    except Exception as e:
        return jsonify({'error': f'File upload failed: {str(e)}'}), 500

# ---------------- Signup ----------------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    fullname = data.get("fullname", "").strip()
    phone = data.get("phone", "").strip()
    password = data.get("password", "").strip()
    location = data.get("location", "").strip()
    farm_type = data.get("farm_type", "").strip()

    if not all([fullname, phone, password, farm_type]):
        return jsonify({"error": "All fields except location are required"}), 400
    if location and location not in ALLOWED_LOCATIONS:
        return jsonify({"error": "Invalid location"}), 400
    if farm_type not in ALLOWED_FARM_TYPES:
        return jsonify({"error": "Invalid farm type"}), 400

    existing_user = users_collection.find_one({"phone": phone})
    if existing_user:
        return jsonify({"error": "Phone number already registered"}), 400

    users_collection.insert_one({
        "fullname": fullname,
        "phone": phone,
        "password": password,
        "location": location,
        "farm_type": farm_type
    })

    return jsonify({"status": "success"})

# ---------------- Login ----------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get("phone", "").strip()
    password = data.get("password", "").strip()

    user = users_collection.find_one({"phone": phone, "password": password})
    if user:
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        return jsonify({"status": "success", "user": user})
    return jsonify({"error": "Invalid phone number or password"}), 401

# ---------------- Weather API ----------------
@app.route('/api/weather', methods=['GET'])
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Latitude and Longitude required"}), 400
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        weather_code = data.get("current_weather", {}).get("weathercode")
        condition = "Clear" if weather_code == 0 else "Cloudy or Rain"
        icon = "01d" if weather_code == 0 else "04d"
        return jsonify({
            "city": f"Lat {lat}, Lon {lon}",
            "temp": data["current_weather"]["temperature"],
            "condition": condition,
            "icon": icon
        })
    except Exception as e:
        return jsonify({"error": f"Weather API request failed: {str(e)}"}), 500

# ---------------- AI Query ----------------
@app.route('/api/query', methods=['POST'])
def farmer_query():
    data = request.json
    user_query = data.get("query", "").strip()
    if not user_query:
        return jsonify({"error": "Query cannot be empty"}), 400
    try:
        response = client_ai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert agriculture assistant AI."},
                {"role": "user", "content": user_query}
            ],
            max_tokens=250
        )
        ai_answer = response.choices[0].message.content.strip()
        return jsonify({"answer": ai_answer})
    except Exception as e:
        return jsonify({"error": f"AI request failed: {str(e)}"}), 500

# ---------------- News ----------------
@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        # Changed 'category=science' to 'q=agriculture' for keyword search
        # You can also keep 'country=in' if you want Indian agriculture news
        # You might also consider 'category=business' or 'category=general'
        # in combination with 'q=agriculture' if 'science' isn't yielding enough.
        url = f"https://newsapi.org/v2/everything?q=agriculture&apiKey={NEWS_API_KEY}&language=en"
        # Using 'everything' endpoint for more comprehensive keyword search,
        # 'top-headlines' might be too restrictive if 'agriculture' isn't a top category.
        # Adding 'language=en' for English articles.

        res = requests.get(url)
        res.raise_for_status() # Raises an HTTPError for bad responses (4xx or 5xx)
        data = res.json()

        articles = []
        for a in data.get("articles", []):
            # Ensure title and URL exist before adding
            if a.get("title") and a.get("url"):
                articles.append({"title": a["title"], "url": a["url"]})
        
        return jsonify({"articles": articles})
    except requests.exceptions.RequestException as e:
        # Catch specific request exceptions for better error handling
        return jsonify({"error": f"News API request failed: {str(e)}"}), 500
    except Exception as e:
        # Catch any other unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# ---------------- Market ----------------
@app.route('/api/market', methods=['GET'])
def get_market():
    market = {
        "Dairy": [
            {"item": "Cow Milk", "price": 52, "yesterday": 51, "unit": "Litre", "location": "Tamil Nadu"},
            {"item": "Buffalo Milk", "price": 60, "yesterday": 59, "unit": "Litre", "location": "Haryana"},
            {"item": "Eggs", "price": 6, "yesterday": 6, "unit": "Piece", "location": "Andhra Pradesh"},
        ],
        "Seeds": [
            {"item": "Wheat", "price": 2400, "yesterday": 2380, "unit": "Quintal", "location": "Punjab"},
            {"item": "Rice", "price": 3200, "yesterday": 3210, "unit": "Quintal", "location": "West Bengal" if False else "Maharashtra"},
            {"item": "Cotton", "price": 6100, "yesterday": 6080, "unit": "Quintal", "location": "Gujarat" if False else "Karnataka"},
        ],
        "Vegetables": [
            {"item": "Tomato", "price": 28, "yesterday": 30, "unit": "Kg", "location": "Delhi"},
            {"item": "Potato", "price": 22, "yesterday": 22, "unit": "Kg", "location": "Uttar Pradesh"},
            {"item": "Onion", "price": 35, "yesterday": 34, "unit": "Kg", "location": "Maharashtra"},
        ],
        "Fruits": [
            {"item": "Banana", "price": 55, "yesterday": 54, "unit": "Dozen", "location": "Tamil Nadu"},
            {"item": "Mango", "price": 80, "yesterday": 85, "unit": "Kg", "location": "Kerala"},
            {"item": "Apple", "price": 150, "yesterday": 148, "unit": "Kg", "location": "Himachal Pradesh"},
        ],
    }
    return jsonify({"market": market, "as_of": datetime.utcnow().isoformat() + "Z"})

# ---------------- Run App ----------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
