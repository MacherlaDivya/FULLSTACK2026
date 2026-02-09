
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Enable CORS for communication with the frontend
app.use(cors());

// Sample data for total income and expenses
const dashboardData = {
  totalIncome: 5000,
  totalExpenses: 3000,
};

// API endpoint to fetch dashboard data
app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});