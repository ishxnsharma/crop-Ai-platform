# Deployment Guide: Crop Yield AI Platform

This guide outlines the steps to deploy the AI-Powered Crop Yield Prediction Platform to production using modern cloud providers. The architecture consists of a React frontend, a Node.js/Express backend, a Neon Serverless PostgreSQL database, and Google's Gemini AI.

## Architecture Overview
- **Frontend**: React (Deployed on Vercel or Netlify)
- **Backend**: Node.js & Express (Deployed on Render or Railway)
- **Database**: Neon (Serverless PostgreSQL)
- **AI Engine**: Gemini API (Google AI Studio)

---

## 1. Prerequisites and API Keys

Before starting the deployment process, you need to gather three essential credentials:

### A. Neon Database URL
1. Go to [Neon.tech](https://neon.tech/) and sign up.
2. Create a new project and a new PostgreSQL database.
3. Once created, copy the **Connection String** from your dashboard. It should look like `postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require`. This is your `DATABASE_URL`.

### B. Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click "Create API Key" and generate a new key.
3. Copy this key. It is your `GEMINI_API_KEY`.

### C. OpenWeatherMap API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up for a free account.
2. Navigate to "My API Keys" and generate a key.
3. Copy this key. It is your `OPENWEATHER_API_KEY`.

---

## 2. Deploying the Node.js Backend (Render)

We recommend [Render.com](https://render.com) for hosting the Node.js Express server.

1. Push your entire codebase to a GitHub repository.
2. Log in to Render and click **New +** -> **Web Service**.
3. Connect your GitHub account and select your repository.
4. Configure the Web Service:
   - **Name**: `crop-yield-api` (or similar)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
5. Scroll down to **Environment Variables** and add the following keys you gathered in step 1:
   - `DATABASE_URL` (Your Neon connection string)
   - `GEMINI_API_KEY` (Your Google AI Studio key)
   - `OPENWEATHER_API_KEY` (Your OpenWeatherMap key)
   - `PORT`: `5000` (Optional, Render assigns one automatically)
6. Click **Create Web Service**. 
7. Render will build and deploy your API. Once finished, copy the provided `onrender.com` URL (e.g., `https://crop-yield-api.onrender.com`).

---

## 3. Database Migration (Post-Deployment)

Once your backend is deployed (or locally before deployment), you need to push the Prisma schema to your Neon database to create the `predictions` table.

If you have a local environment:
1. Ensure your local `server/.env` file contains the Neon `DATABASE_URL`.
2. Navigate to the `server/` directory in your terminal.
3. Run: `npx prisma db push`

*Note: Render does not run the `db push` command automatically on the free tier during build to prevent accidental data loss. You should push the schema using the command line.*

---

## 4. Deploying the React Frontend (Vercel)

We recommend [Vercel](https://vercel.com/) for hosting the React frontend.

Before deploying, you must ensure the frontend knows where the backend lives.

1. In your local codebase, update the frontend API calls. In files like `App.js`, `PredictionForm.js`, `WeatherWidget.js`, and `Dashboard.js`, change any absolute `http://localhost:5000...` references to use a relative path like `axios.get('/api/weather')`.
2. Open `frontend/package.json` and ensure the proxy is set (optional depending on config, but helpful locally).
   *For Vercel, the best practice is to configure rewrites or use absolute URLs in Axios.*

**Vercel Deployment Steps:**
1. Log in to Vercel and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure the Project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. **Environment Variables**:
   - If you opted to hardcode the backend URL or use React environment variables, add `REACT_APP_API_URL` and set it to your Render backend URL (e.g., `https://crop-yield-api.onrender.com`). *Ensure you rewrite the Axios calls in your frontend to use `process.env.REACT_APP_API_URL` if you take this approach.*
5. Click **Deploy**. Vercel will build your static assets and generate a live URL.

## 5. Verification

1. Go to your live Vercel frontend URL.
2. Select "Odisha" to trigger the automatic weather fetch to your Render backend (which securely contacts OpenWeatherMap).
3. Fill out the form and hit "Predict".
4. The frontend will contact your Render backend, which queries the Gemini API, saves to the Neon Database, and returns the result.
5. Check your Dashboard tab to verify the database historical fetch works.
