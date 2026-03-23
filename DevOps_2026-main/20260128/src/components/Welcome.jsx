import React from 'react';

// Functional Component Example - Welcome Component
// This component displays a welcome message and company intro
function Welcome() {
  const companyName = "TechLearn Startup";
  const tagline = "Your Gateway to Modern Web Development";

  return (
    <div className="welcome-section">
      <h1>Welcome to {companyName}</h1>
      <p className="tagline">{tagline}</p>
      <div className="welcome-message">
        <p>
          We're excited to have you here! Explore our carefully curated courses
          designed to help you master modern web development technologies.
        </p>
        <p>
          Whether you're a beginner or looking to advance your skills, we have
          something for everyone.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
