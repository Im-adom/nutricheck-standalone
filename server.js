const express = require('express');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // fallback to .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import API handlers
const analyzeHandler = require('./api/analyze.js');
const searchHandler = require('./api/search.js');

// Routes
app.post('/api/analyze', (req, res) => analyzeHandler(req, res));
app.get('/api/search', (req, res) => searchHandler(req, res));

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ NutriCheck server running at http://localhost:${PORT}`);
  console.log(`📱 Open your browser and go to http://localhost:${PORT}`);
  console.log(`\n⚙️  Make sure GROQ_API_KEY is set in your .env file\n`);
});
