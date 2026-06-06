
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Home.css";
const BACKEND_URI = process.env.REACT_APP_API_URL;
const data = [
  { week: "W1", score: 45 },
  { week: "W2", score: 58 },
  { week: "W3", score: 67 },
  { week: "W4", score: 72 },
  { week: "W5", score: 81 },
];

function Home() {
  const [stats, setStats] = useState({
  lectures: 0,
  pdfs: 0,
  users: 0,
  recentActivity: []
});

useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const res = await axios.get(
  `${BACKEND_URI}/dashboard-stats`
);  

    setStats(res.data);

  } catch (error) {
    console.error("Dashboard Error:", error);
  }
};
  return (
    <div className="dashboard-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            AI Powered Academic Analysis
          </span>

          <h1 className="hero-title">
            AI-Powered Lecture Analysis Platform
          </h1>

          <p className="hero-description">
            Upload lecture recordings and compare them against
            reference PDFs using semantic similarity analysis.
          </p>

          <Link to="/uploadvd" className="hero-button">
            Upload Lecture
          </Link>
        </div>

        <div className="hero-illustration">
          <div className="teacher-card">
            👩‍🏫
          </div>
        </div>
      </section>

      {/* Stats */}
      
      <section className="stats-grid">

  <div className="stat-card">
    <h3>Uploaded Lectures</h3>
    <span>--</span>
  </div>

  <div className="stat-card">
    <h3>PDFs Uploaded</h3>
    <span>--</span>
  </div>

  <div className="stat-card">
    <h3>Latest Similarity</h3>
    <span>--</span>
    
  </div>
  </section>

      

      {/* Activity */}
      <section className="activity-card">
  <h2>Recent Activity</h2>

  {stats.recentActivity && stats.recentActivity.length > 0 ? (
    stats.recentActivity.map((item, index) => (
      <div
        key={index}
        className="activity-item"
      >
        {item}
      </div>
    ))
  ) : (
    <div className="activity-item">
      No recent uploads available
    </div>
  )}
</section>

    </div>
  );
  
}

export default Home;

