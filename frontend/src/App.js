import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PredictionForm from './components/PredictionForm';
import ResultsDisplay from './components/ResultsDisplay';
import Dashboard from './components/Dashboard';
import WeatherWidget from './components/WeatherWidget';
import { translations } from './translations';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currentRegion, setCurrentRegion] = useState('Odisha');

  const handlePrediction = async (formData) => {
    setLoading(true);
    try {
      const payload = { ...formData, language };
      const response = await axios.post('http://localhost:5000/api/predict', payload);
      setPredictionResult(response.data);
      setActiveTab('results');
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error making prediction. Please check your inputs or ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div className="logo-section" style={{ textAlign: 'left' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2.5rem' }}>🌾</span>
              <span>{t.appTitle}</span>
            </h1>
            <p style={{ fontSize: '1.1rem', marginTop: '0.2rem', color: '#4a5568' }}>{t.appSubtitle}</p>
          </div>

          <div className="language-selector" style={{ background: '#f7fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontWeight: 600, color: '#4a5568', cursor: 'pointer' }}
            >
              <option value="en">English (EN)</option>
              <option value="or">ଓଡ଼ିଆ (OR)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          {t.tabDashboard}
        </button>
        <button
          className={activeTab === 'predict' ? 'active' : ''}
          onClick={() => setActiveTab('predict')}
        >
          {t.tabPredict}
        </button>
        <button
          className={activeTab === 'results' ? 'active' : ''}
          onClick={() => setActiveTab('results')}
          disabled={!predictionResult}
        >
          {t.tabResults}
        </button>
      </nav>

      <div className="content-container">
        <div className="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard language={language} />
          )}

          {activeTab === 'predict' && (
            <PredictionForm
              onSubmit={handlePrediction}
              loading={loading}
              selectedLanguage={language}
              currentRegion={currentRegion}
              onRegionChange={setCurrentRegion}
            />
          )}

          {activeTab === 'results' && predictionResult && (
            <ResultsDisplay
              result={predictionResult}
              language={language}
            />
          )}
        </div>

        <div className="sidebar">
          <WeatherWidget city={currentRegion} language={language} />
        </div>
      </div>

      <footer className="App-footer">
        <p>{t.footerCopyright}</p>
        <p>{t.footerTagline}</p>
      </footer>
    </div>
  );
}

export default App;
