// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Form submission handler
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Predicting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(e.target);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    try {
        // Make API call
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Prediction failed');
        }
        
        const result = await response.json();
        displayResults(result);
        
        // Get optimization plan
        const optimizationResponse = await fetch(`${API_BASE_URL}/recommendations/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                current_yield: result.predicted_yield
            })
        });
        
        if (optimizationResponse.ok) {
            const optimizationPlan = await optimizationResponse.json();
            displayActionPlan(optimizationPlan);
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to get prediction. Please check if the server is running.');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Display prediction results
function displayResults(result) {
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Display yield value
    document.getElementById('yieldValue').textContent = result.predicted_yield;
    
    // Create yield message
    let message = '';
    if (result.predicted_yield > 40) {
        message = '🎉 Excellent yield expected! Your farm conditions are optimal.';
    } else if (result.predicted_yield > 30) {
        message = '👍 Good yield expected. Follow recommendations to improve further.';
    } else {
        message = '⚠️ Below average yield expected. Please follow our recommendations carefully.';
    }
    document.getElementById('yieldMessage').textContent = message;
    
    // Display recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    
    if (result.recommendations && result.recommendations.length > 0) {
        result.recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = `recommendation-item ${rec.priority.toLowerCase()}`;
            recItem.innerHTML = `
                <div class="recommendation-category">${rec.category}</div>
                <div class="recommendation-action">${rec.action}</div>
                <div class="recommendation-details">${rec.details}</div>
            `;
            recommendationsList.appendChild(recItem);
        });
    } else {
        recommendationsList.innerHTML = '<p>No specific recommendations at this time.</p>';
    }
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// Display action plan
function displayActionPlan(plan) {
    const actionPlanDiv = document.getElementById('actionPlan');
    actionPlanDiv.innerHTML = '';
    
    if (plan.steps && plan.steps.length > 0) {
        plan.steps.forEach(step => {
            const stepItem = document.createElement('div');
            stepItem.className = 'timeline-item';
            stepItem.innerHTML = `
                <div class="timeline-week">Week ${step.week}</div>
                <div class="timeline-action">${step.action}</div>
                <div class="timeline-details">${step.details}</div>
            `;
            actionPlanDiv.appendChild(stepItem);
        });
        
        // Add investment info
        if (plan.investment_required) {
            const investmentInfo = document.createElement('div');
            investmentInfo.style.marginTop = '20px';
            investmentInfo.innerHTML = `
                <h4>Investment Required:</h4>
                <p>💰 Low Budget: ${plan.investment_required.low}</p>
                <p>💵 Medium Budget: ${plan.investment_required.medium}</p>
                <p>💎 High Budget: ${plan.investment_required.high}</p>
            `;
            actionPlanDiv.appendChild(investmentInfo);
        }
    }
}

// Load sample data
async function loadSampleData() {
    try {
        const response = await fetch(`${API_BASE_URL}/sample-data`);
        const data = await response.json();
        
        // Show sample selection dialog
        const sampleNames = data.samples.map(s => s.name);
        const selected = prompt('Select sample data:\n' + sampleNames.map((n, i) => `${i+1}. ${n}`).join('\n'), '1');
        
        if (selected) {
            const index = parseInt(selected) - 1;
            if (index >= 0 && index < data.samples.length) {
                const sampleData = data.samples[index].data;
                
                // Fill form with sample data
                Object.keys(sampleData).forEach(key => {
                    const input = document.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = sampleData[key];
                    }
                });
                
                // Show notification
                showMessage('Sample data loaded successfully!', 'success');
            }
        }
    } catch (error) {
        console.error('Error loading sample data:', error);
        alert('Failed to load sample data');
    }
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    const form = document.getElementById('predictionForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check API health
    fetch(`${API_BASE_URL}/health`)
        .then(response => response.json())
        .then(data => {
            console.log('API Status:', data);
        })
        .catch(error => {
            console.error('API not available:', error);
            showMessage('⚠️ API server is not running. Please start the Flask server.', 'error');
        });
    
    // Load crop types dynamically
    fetch(`${API_BASE_URL}/crop-types`)
        .then(response => response.json())
        .then(data => {
            console.log('Available crop types:', data.crop_types);
        })
        .catch(error => {
            console.error('Failed to load crop types:', error);
        });
});
