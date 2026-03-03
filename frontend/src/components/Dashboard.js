import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { translations } from '../translations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ language = 'en' }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('https://crop-ai-platform.onrender.com/api/history');
        // Sort history chronologically for the chart
        const sortedData = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setHistory(sortedData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <span className="loading-spinner"></span>
        <p style={{ marginTop: '1rem', color: '#718096' }}>{t.dashLoading}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: '#f7fafc', borderRadius: '12px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>{t.dashEmptyTitle}</h3>
        <p style={{ color: '#718096' }}>{t.dashEmptySub}</p>
      </div>
    );
  }

  // Prepare data for the chart
  // Group by crop type
  const cropTypes = [...new Set(history.map(item => item.cropType))];

  const barChartData = {
    labels: cropTypes,
    datasets: [
      {
        label: 'Average Predicted Yield (tons/ha)',
        data: cropTypes.map(crop => {
          const cropRecords = history.filter(h => h.cropType === crop);
          const avgYield = cropRecords.reduce((sum, record) => sum + record.predictedYield, 0) / cropRecords.length;
          return avgYield;
        }),
        backgroundColor: 'rgba(72, 187, 120, 0.6)',
        borderColor: 'rgb(72, 187, 120)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const lineChartData = {
    labels: history.slice(-10).map(item => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Recent Prediction Confidence (%)',
        data: history.slice(-10).map(item => item.confidence),
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.5)',
        tension: 0.3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="dashboard-container hide-scrollbar" style={{ animation: 'fadeIn 0.5s ease' }}>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.dashTotal}</h3>
          <p className="value" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{history.length}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.dashTop}</h3>
          <p className="value" style={{ fontSize: '2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
            {cropTypes.length > 0 ? cropTypes.sort((a, b) =>
              history.filter(v => v.cropType === a).length - history.filter(v => v.cropType === b).length
            ).pop() : 'N/A'}
          </p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.dashConf}</h3>
          <p className="value" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {Math.round(history.reduce((sum, curr) => sum + curr.confidence, 0) / history.length)}%
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem' }}>{t.dashChart1}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem' }}>{t.dashChart2}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="history-table-container" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem' }}>{t.dashHistoryTitle}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f7fafc', color: '#4a5568' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>{t.dashDate}</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>{t.dashCrop}</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>{t.dashRegion}</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #e2e8f0' }}>{t.dashYield}</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(-10).reverse().map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', color: '#718096' }}>{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}><span style={{ background: '#ebf4ff', color: '#4c51bf', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 600 }}>{record.cropType}</span></td>
                  <td style={{ padding: '0.75rem', color: '#4a5568' }}>{record.region}</td>
                  <td style={{ padding: '0.75rem' }}><strong style={{ color: '#48bb78' }}>{record.predictedYield.toFixed(2)}</strong> <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>t/ha</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
