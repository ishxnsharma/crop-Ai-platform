import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ onSubmit, loading, selectedLanguage, currentRegion, onRegionChange }) => {
  const [formData, setFormData] = useState({
    crop_type: 'rice',
    region: currentRegion || 'Odisha',
    temperature: 28.5,
    rainfall: 1200,
    humidity: 75,
    soil_ph: 6.5,
    nitrogen: 120,
    phosphorus: 40,
    potassium: 30,
    pesticide_usage: 2.5,
    irrigation_hours: 8
  });

  const [fetchingWeather, setFetchingWeather] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region' && onRegionChange) {
      onRegionChange(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }));
  };

  const handleAutoFillWeather = async () => {
    setFetchingWeather(true);
    try {
      const response = await axios.get(`/api/weather?city=${formData.region}`);
      const data = response.data;
      setFormData(prev => ({
        ...prev,
        temperature: data.temperature,
        humidity: data.humidity,
        rainfall: data.rainfall > 0 ? data.rainfall * 10 : prev.rainfall // Rough estimation if rain exists
      }));
    } catch (error) {
      console.error('Error auto-filling weather:', error);
      alert('Could not fetch weather for this region.');
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Basic translation dictionary for mockup
  const texts = {
    en: { title: 'Crop Data Input', submit: 'Predict Yield', autofill: 'Auto-fill Weather' },
    or: { title: 'ଫସଲ ତଥ୍ୟ ଇନପୁଟ୍', submit: 'ଅମଳର ପୂର୍ବାନୁମାନ କରନ୍ତୁ', autofill: 'ପାଣିପାଗ ସ୍ୱୟଂଚାଳିତ ଭରଣ କରନ୍ତୁ' },
    hi: { title: 'फसल डेटा इनपुट', submit: 'उपज की भविष्यवाणी करें', autofill: 'मौसम स्वतः भरें' }
  };
  const t = texts[selectedLanguage] || texts.en;

  return (
    <div className="prediction-form" style={{ animation: 'fadeIn 0.5s ease', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{t.title}</h2>
        <button
          onClick={handleAutoFillWeather}
          disabled={fetchingWeather}
          style={{
            background: 'rgba(102, 126, 234, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.5)',
            color: '#a3bffa',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: fetchingWeather ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => !fetchingWeather && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)')}
          onMouseOut={(e) => !fetchingWeather && (e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)')}
        >
          {fetchingWeather ? <span className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span> : '🌤️'}
          {fetchingWeather ? 'Fetching...' : t.autofill}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="crop_type">Crop Type</label>
            <select
              id="crop_type"
              name="crop_type"
              value={formData.crop_type}
              onChange={handleChange}
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="rice">Rice (ଧାନ | चावल)</option>
              <option value="wheat">Wheat (ଗହମ | गेहूँ)</option>
              <option value="maize">Maize (ମକା | मक्का)</option>
              <option value="cotton">Cotton (କପା | कपास)</option>
              <option value="sugarcane">Sugarcane (ଆଖୁ | गन्ना)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temperature">Temperature (°C)</label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rainfall">Rainfall (mm)</label>
            <input
              type="number"
              id="rainfall"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="humidity">Humidity (%)</label>
            <input
              type="number"
              id="humidity"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="soil_ph">Soil pH</label>
            <input
              type="number"
              id="soil_ph"
              name="soil_ph"
              value={formData.soil_ph}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="14"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nitrogen">Nitrogen (kg/ha)</label>
            <input
              type="number"
              id="nitrogen"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phosphorus">Phosphorus (kg/ha)</label>
            <input
              type="number"
              id="phosphorus"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="potassium">Potassium (kg/ha)</label>
            <input
              type="number"
              id="potassium"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pesticide_usage">Pesticide Usage (kg/ha)</label>
            <input
              type="number"
              id="pesticide_usage"
              name="pesticide_usage"
              value={formData.pesticide_usage}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="irrigation_hours">Irrigation Hours/Day</label>
            <input
              type="number"
              id="irrigation_hours"
              name="irrigation_hours"
              value={formData.irrigation_hours}
              onChange={handleChange}
              step="0.1"
              required
              style={{ background: 'rgba(26, 32, 44, 0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(72,187,120,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 20px rgba(72,187,120,0.4)')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 15px rgba(72,187,120,0.3)')}
        >
          {loading ? (
            <>
              {t.submit}...
              <span className="loading-spinner" style={{ width: '18px', height: '18px', borderTopColor: 'white' }}></span>
            </>
          ) : (
            `✨ ${t.submit}`
          )}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;
