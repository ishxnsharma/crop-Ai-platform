import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { translations } from '../translations';

const WeatherWidget = ({ city = 'Bhubaneswar', language = 'en' }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language] || translations.en;

  useEffect(() => {
    if (city) {
      setLoading(true);
      fetchEnvironmentalData(city);
    }
  }, [city]);

  const fetchEnvironmentalData = async (cityName) => {
    try {
      const weatherRes = await axios.get(`https://crop-ai-platform.onrender.com/api/weather?city=${cityName}`);
      setWeatherData(weatherRes.data);
    } catch (error) {
      console.error('Error fetching environmental data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="loading-spinner" style={{ borderColor: '#667eea', borderTopColor: 'transparent' }}></div>
        <div className="loading" style={{ marginTop: '10px' }}>{t.weatherLoading}</div>
      </div>
    );
  }

  return (
    <>
      <div className="weather-widget" style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t.weatherTitle}</h3>
        {weatherData && (
          <>
            <p className="location" style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4a5568' }}>{weatherData.location}</p>
            <p style={{ textTransform: 'capitalize', color: '#718096', marginBottom: '1rem', fontStyle: 'italic' }}>{weatherData.description}</p>
            <div className="weather-info">
              <div className="weather-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#718096' }}>{t.weatherTemp}</span>
                <span style={{ fontWeight: 600, color: '#e53e3e' }}>{weatherData.temperature}°C</span>
              </div>
              <div className="weather-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#718096' }}>{t.weatherHumidity}</span>
                <span style={{ fontWeight: 600, color: '#3182ce' }}>{weatherData.humidity}%</span>
              </div>
              <div className="weather-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#718096' }}>{t.weatherRain}</span>
                <span style={{ fontWeight: 600, color: '#4c51bf' }}>{weatherData.rainfall} mm</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Removed Soil Data block to match the new API structure */}

      <div className="weather-widget" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3 style={{ color: 'white' }}>{t.weatherTipsTitle}</h3>
        <ul className="tips-list">
          {t.weatherTips.map((tip, idx) => <li key={idx}>{tip}</li>)}
        </ul>
      </div>

      <style jsx>{`
        .location {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .last-tested {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #718096;
          text-align: center;
        }

        .tips-list {
          list-style: none;
          padding: 0;
        }

        .tips-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .tips-list li:last-child {
          border-bottom: none;
        }

        .loading {
          text-align: center;
          padding: 1rem;
          color: #718096;
        }
      `}</style>
    </>
  );
};

export default WeatherWidget;
