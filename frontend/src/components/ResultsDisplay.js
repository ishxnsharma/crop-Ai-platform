import React from 'react';
import { translations } from '../translations';

const ResultsDisplay = ({ result, language = 'en' }) => {
  if (!result || !result.data) return null;

  const { data, analysis } = result;
  const t = translations[language] || translations.en;

  return (
    <div className="results-display" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="result-card" style={{ background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f5f9 100%)', borderLeft: '4px solid #667eea', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#2d3748', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.resultsTitle}</h2>
        <div className="yield-value" style={{ fontSize: '3.5rem', fontWeight: 800, color: '#48bb78', marginBottom: '1rem', textShadow: '0 2px 4px rgba(72,187,120,0.2)' }}>
          {data.predictedYield.toFixed(2)} <span style={{ fontSize: '1.5rem', color: '#a0aec0', fontWeight: 500 }}>{t.resultsTons}</span>
        </div>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          {t.resultsFor} <strong style={{ color: '#4a5568', textTransform: 'capitalize' }}>{data.cropType}</strong> {t.resultsIn} <strong style={{ color: '#4a5568' }}>{data.region}</strong>
        </p>

        {data.confidence && (
          <div className="optimization-score" style={{ marginTop: '2rem', padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h4 style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#2d3748', fontSize: '1rem' }}>
              <span>{t.resultsConfidence}</span>
              <span style={{ color: data.confidence > 80 ? '#48bb78' : data.confidence > 60 ? '#ed8936' : '#f56565' }}>{data.confidence}%</span>
            </h4>
            <div className="score-bar" style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                className="score-fill"
                style={{
                  height: '100%',
                  width: `${data.confidence}%`,
                  background: data.confidence > 80 ? '#48bb78' : data.confidence > 60 ? '#ed8936' : '#f56565',
                  transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="recommendation-section" style={{ marginTop: '3rem' }}>
        <h2 style={{ color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>AI Analysis & Recommendations</h2>

        {analysis && (
          <div className="recommendation-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.resultsAnalysisTitle}
            </h3>
            <p style={{ color: '#4a5568', lineHeight: 1.7, fontSize: '1.05rem' }}>{analysis}</p>
          </div>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <div className="recommendation-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#48bb78', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.resultsStepsTitle}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.recommendations.map((item, index) => (
                <div key={index} className="recommendation-item" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
                  <p style={{ color: '#2d3748', lineHeight: 1.6, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
