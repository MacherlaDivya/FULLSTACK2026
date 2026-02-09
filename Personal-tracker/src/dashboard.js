
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importing axios

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API when component mounts
  useEffect(() => {
    // Use axios to get data from backend
    axios.get('http://localhost:5000/api/dashboard')
      .then((response) => {
        setData(response.data); // Save the data in state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Income: {data.totalIncome}</p>
      <p>Total Expenses: {data.totalExpenses}</p>
      <p>Balance: {data.totalIncome - data.totalExpenses}</p>
    </div>
  );
};

export default Dashboard;