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
    recentActivity: [],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BACKEND_URI}/dashboard-stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="dashboard-container">

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-badge">
            <span className="hero-badge-dot"></span>
            AI Powered Academic Analysis
          </span>

          <h1 className="hero-title">
            AI-Powered<br />
            <span className="hero-title-accent">Lecture Analysis</span><br />
            Platform
          </h1>

          <p className="hero-description">
            Upload lecture recordings and compare them against reference PDFs
            using semantic similarity analysis.
          </p>

        </div>

        <div className="hero-illustration">
          <div className="teacher-card">
            <span className="teacher-emoji">👩‍🏫</span>
            <div className="teacher-card-ring teacher-card-ring--1"></div>
            <div className="teacher-card-ring teacher-card-ring--2"></div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon stat-icon--amber">
            <i className="bi bi-play-circle-fill"></i>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats?.lectures || 0}</span>
            <h3 className="stat-label">Uploaded Lectures</h3>
          </div>
          <div className="stat-glow stat-glow--amber"></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--red">
            <i className="bi bi-file-earmark-pdf-fill"></i>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats?.pdfs || 0}</span>
            <h3 className="stat-label">PDFs Uploaded</h3>
          </div>
          <div className="stat-glow stat-glow--red"></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <div className="stat-body">
            <span className="stat-value">{stats?.latestSimilarity? `${stats.latestSimilarity}%`: 'N/A'}</span>
            <h3 className="stat-label">Latest Similarity</h3>
          </div>
          <div className="stat-glow stat-glow--green"></div>
        </div>

      </section>

      {/* ── Chart ── */}
      <section className="chart-card">
        <div className="chart-card-header">
          <h2 className="chart-card-title">
            <span className="section-dot"></span>
            Similarity Trend
          </h2>
          <span className="chart-card-sub">Last 5 weeks</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="week"
              stroke="#484d5e"
              tick={{ fill: "#7e8494", fontSize: 12, fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#484d5e"
              tick={{ fill: "#7e8494", fontSize: 12, fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "#151821",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#f0ede8",
                fontSize: "13px",
                fontFamily: "DM Sans",
              }}
              cursor={{ stroke: "rgba(245,158,11,0.2)", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }}
              activeDot={{ fill: "#fbbf24", r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* ── Activity ── */}
      <section className="activity-card">
        <div className="activity-card-header">
          <h2 className="activity-card-title">
            <span className="section-dot"></span>
            Recent Activity
          </h2>
        </div>

        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          stats.recentActivity.map((item, index) => (
            <div key={index} className="activity-item">
              <span className="activity-item-dot"></span>
              <span className="activity-item-text">{item}</span>
            </div>
          ))
        ) : (
          <div className="activity-empty">
            <i className="bi bi-inbox activity-empty-icon"></i>
            <span>No recent uploads available</span>
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;
