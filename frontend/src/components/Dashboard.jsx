import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <p>Select a module to start:</p>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <Link to="/breed" className="btn btn-success w-100">Breed Recognition</Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/query" className="btn btn-success w-100">Farmer Query</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
