const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', service: 'Crop Yield API (Node.js/Gemini)' });
});

// Weather API Proxy
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon, city } = req.query;
        let url = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

        if (lat && lon) {
            url += `&lat=${lat}&lon=${lon}`;
        } else if (city) {
            url += `&q=${city}`;
        } else {
            return res.status(400).json({ error: 'Lat/lon or city is required' });
        }

        const response = await axios.get(url);
        const data = response.data;

        res.json({
            temperature: data.main.temp,
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0, // Fallback if no rain
            description: data.weather[0].description,
            location: data.name
        });
    } catch (error) {
        console.error('Weather API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Predict Yield using Gemini API
app.post('/api/predict', async (req, res) => {
    try {
        const {
            crop_type,
            region,
            temperature,
            rainfall,
            humidity,
            soil_ph,
            nitrogen,
            phosphorus,
            potassium,
            pesticide_usage,
            irrigation_hours,
            language = 'en'
        } = req.body;

        // Validate request
        if (!crop_type || !region || typeof temperature !== 'number') {
            return res.status(400).json({ error: 'Missing or invalid required fields.' });
        }

        const prompt = `
      You are an expert agricultural AI assistant. Predict the crop yield and provide specific recommendations based on the following data:
      
      Crop: ${crop_type}
      Region: ${region}, India
      Temperature: ${temperature}°C
      Rainfall: ${rainfall}mm
      Humidity: ${humidity}%
      Soil pH: ${soil_ph}
      Nitrogen: ${nitrogen} kg/ha
      Phosphorus: ${phosphorus} kg/ha
      Potassium: ${potassium} kg/ha
      Pesticide Usage: ${pesticide_usage} kg/ha
      Irrigation: ${irrigation_hours} hours/day
      
      Respond in the following language: ${language === 'hi' ? 'Hindi' : language === 'or' ? 'Odia' : 'English'}.
      
      Please analyze this data and return the result strictly as a valid JSON object matching this exact structure, with no markdown formatting or extra text:
      {
        "predicted_yield_tons_per_hectare": <number>,
        "confidence_score": <number between 0-100>,
        "analysis": "<string explaining the rationale briefly>",
        "recommendations": [
          "<string advice 1>",
          "<string advice 2>",
          "<string advice 3>"
        ]
      }
    `;

        // Call Gemini API
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const aiResponseText = result.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        let predictionResult;
        try {
            predictionResult = JSON.parse(aiResponseText);
        } catch (parseError) {
            console.error('Failed to parse Gemini output:', aiResponseText);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }

        // Save to PostgreSQL via Prisma
        const savedRecord = await prisma.prediction.create({
            data: {
                cropType: crop_type,
                region,
                temperature,
                rainfall,
                humidity,
                soilPh: soil_ph,
                nitrogen,
                phosphorus,
                potassium,
                predictedYield: predictionResult.predicted_yield_tons_per_hectare,
                confidence: predictionResult.confidence_score,
                recommendations: predictionResult.recommendations
            }
        });

        res.json({
            success: true,
            data: savedRecord,
            analysis: predictionResult.analysis
        });

    } catch (error) {
        console.error('Prediction API Error:', error);
        res.status(500).json({ error: 'Failed to generate prediction' });
    }
});

// Fetch History
app.get('/api/history', async (req, res) => {
    try {
        const history = await prisma.prediction.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(history);
    } catch (error) {
        console.error('History API Error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
