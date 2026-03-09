import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Welcome to AgriAI - Your Farmer Assistant</h1>
      <p className="lead text-center mt-3">
        AI-powered tools to help you manage livestock, crops, and queries easily.
      </p>
      <div className="mt-4 text-center">
        <Link to="/dashboard" className="btn btn-success btn-lg">Go to Dashboard</Link>
      </div>
    </div>
  );
}

export default Homepage;
