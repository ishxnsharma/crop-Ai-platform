# 🌾 AI-Powered Crop Yield Prediction and Optimization Platform

## Government of Odisha - Agriculture Innovation Initiative

A scalable AI-based platform designed to help small-scale farmers increase productivity through data-driven insights for crop yield prediction and agricultural optimization.

## 🎯 Project Overview

This MVP platform uses artificial intelligence to:
- **Predict crop yields** based on weather, soil, and farming conditions
- **Provide actionable recommendations** for irrigation, fertilization, and pest control
- **Target 10-15% yield increase** through data-driven insights
- **Support multiple languages** including English, Odia (ଓଡ଼ିଆ), and Hindi

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8 or higher, with "Add Python to PATH" checked during installation
- Node.js 14 or higher (installs npm)

### One-Click Setup
After installing prerequisites, simply run:
```batch
setup.bat
```
This will automatically:
1. Install all Python dependencies
2. Train the ML model with sample data
3. Install all frontend dependencies

### Running the Application

**Option 1: Using Batch Scripts**
1. **Start Backend Server**: Double-click `start-backend.bat` (Runs on http://localhost:5000)
2. **Start Frontend**: Double-click `start-frontend.bat` in a new window (Runs on http://localhost:3000)

**Option 2: Manual Commands**
1. **Start Backend**:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
2. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm start
```

## 💻 Usage Guide

1. Open `http://localhost:3000` in your browser.
2. Select your location (district), crop type, and season.
3. Enter expected conditions: rainfall, temperature, humidity, soil pH, and NPK levels.
4. Click "🔮 Predict Yield" to view predicted yield and personalized recommendations for optimization.

Click "📊 Load Sample Data" in the UI to test with pre-configured scenarios like Rice (Good Conditions) or Cotton (Challenging Conditions).

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check API endpoint |
| `/api/predict` | POST | Predict crop yield based on input parameters |
| `/api/weather` | GET | Get current weather data (mock) |
| `/api/soil` | GET | Get soil health data (mock) |
| `/api/crops` | GET | Get supported crops and regions |
| `/api/statistics` | GET | Get agricultural statistics |
| `/api/historical` | GET | Get historical yield data |

## 🌱 Supported Crops

1. **Rice (ଧାନ)**: Optimized for Odisha's climate
2. **Wheat (ଗହମ)**: Rabi season crop predictions
3. **Maize (ମକା)**: Both Kharif and Rabi seasons
4. **Cotton (କପା)**: Fiber crop optimization
5. **Sugarcane (ଆଖୁ)**: Long-duration crop management
6. **Pulses (ଡାଲି)**
7. **Oilseeds (ତେଲବୀଜ)**
8. **Vegetables (ପନିପରିବା)**

## 📈 Model Performance

- **Algorithm**: Random Forest Regressor
- **Features**: 11 agricultural parameters
- **R² Score**: ~0.85 (on sample data)
- **Key Factors**: Temperature, Rainfall, NPK levels, Soil pH

## 🗂️ Project Structure

```
crop-yield-ai-platform/
├── backend/               # Flask API server
│   ├── app.py             # Main Flask application
│   ├── recommendation_engine.py
│   └── requirements.txt
├── frontend/              # React frontend application
│   ├── src/               # React components and styling
│   └── package.json
├── models/                # Machine learning models
│   └── train_model.py     # Training script
└── data/                  # Sample agricultural data
```

## 📱 Future Enhancements

- Mobile application (Android/iOS)
- Real-time weather API integration
- Market price predictions
- Crop disease detection using image recognition
- SMS/WhatsApp notifications

## 🤝 Contributing

This is a government initiative. For suggestions or improvements:
1. Contact the E&IT Department, Government of Odisha
2. Submit feedback through official channels

## 📜 License & Acknowledgments

- Developed for the Government of Odisha, Electronics & IT Department. © 2024
- Special thanks to Indian Council of Agricultural Research (ICAR) and local farming communities.

---
**Made with ❤️ for Indian Farmers** | **Empowering Farmers with Technology | ପ୍ରଯୁକ୍ତି ସହିତ କୃଷକମାନଙ୍କୁ ସଶକ୍ତ କରିବା**
