import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const BACKEND_URI = process.env.REACT_APP_API_URL;

const SimilarityScore = () => {
  const [similarityScore, setSimilarityScore] = useState(0);
  const [actualScore, setActualScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatus = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Moderate Match";
    return "Low Match";
  };

  const getColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#ffc107";
    return "#ef4444";
  };

  useEffect(() => {
    const fetchSimilarityScore = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BACKEND_URI}/api/v1/similarity-score`
        );

        const score = response.data.similarity_score * 100;

        setActualScore(score);
        setLoading(false);

        let progress = 0;

        const interval = setInterval(() => {
          progress += 1;

          if (progress >= score) {
            progress = score;
            clearInterval(interval);
          }

          setSimilarityScore(progress);
        }, 20);

      } catch (error) {
        console.error(error);
        setError('Failed to fetch similarity score');
        setLoading(false);
      }
    };

    fetchSimilarityScore();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "100px",
          fontSize: "24px"
        }}
      >
        Analyzing Lecture...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "red",
          textAlign: "center",
          marginTop: "100px"
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#343a40",
        color: "white",
        padding: "40px"
      }}
    >
      <div className="container">

        {/* Hero Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px"
          }}
        >
          <h1
            style={{
              color: "#ffc107",
              fontWeight: "bold"
            }}
          >
            AI Similarity Analysis
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#d1d5db"
            }}
          >
            Semantic comparison between lecture recordings and reference PDFs.
          </p>
        </div>

        {/* Progress Circle */}
        <div
          style={{
            width: "280px",
            margin: "0 auto"
          }}
        >
          <CircularProgressbar
            value={similarityScore}
            text={`${similarityScore.toFixed(2)}%`}
            styles={buildStyles({
              textColor: "#ffffff",
              pathColor: getColor(actualScore),
              trailColor: "#495057",
              textSize: "10px"
            })}
          />
        </div>

        {/* Status */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px"
          }}
        >
          <h3
            style={{
              color: getColor(actualScore)
            }}
          >
            {getStatus(actualScore)}
          </h3>
        </div>

        {/* Analytics Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginTop: "50px",
            flexWrap: "wrap"
          }}
        >

          <div
            style={{
              background: "#212529",
              padding: "20px",
              borderRadius: "16px",
              minWidth: "220px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          >
            <h5>Match Score</h5>
            <h2 style={{ color: "#ffc107" }}>
              {actualScore.toFixed(2)}%
            </h2>
          </div>

          <div
            style={{
              background: "#212529",
              padding: "20px",
              borderRadius: "16px",
              minWidth: "220px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          >
            <h5>Status</h5>
            <h2 style={{ color: getColor(actualScore) }}>
              {getStatus(actualScore)}
            </h2>
          </div>

          <div
            style={{
              background: "#212529",
              padding: "20px",
              borderRadius: "16px",
              minWidth: "220px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}
          >
            <h5>AI Model</h5>
            <h2 style={{ color: "#ffc107" }}>
              Sentence-BERT
            </h2>
          </div>

        </div>

        {/* AI Insights */}
        <div
          style={{
            marginTop: "50px",
            background: "#212529",
            padding: "30px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}
        >
          <h3
            style={{
              color: "#ffc107",
              marginBottom: "20px"
            }}
          >
            AI Insights
          </h3>

          <p>
            The uploaded lecture was analyzed against the reference PDF using semantic similarity techniques.
          </p>

          <div
            style={{
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
              marginTop: "20px"
            }}
          >
            <div>
              <h5 style={{ color: "#22c55e" }}>
                Topics Covered
              </h5>

              <ul>
                <li>Core Concepts</li>
                <li>Fundamental Theory</li>
                <li>Lecture Objectives</li>
              </ul>
            </div>

            <div>
              <h5 style={{ color: "#ef4444" }}>
                Topics Missing
              </h5>

              <ul>
                <li>Advanced Examples</li>
                <li>Recent Applications</li>
                <li>Research Discussions</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h5 style={{ color: "#ffc107" }}>
              Recommendation
            </h5>

            <p>
              Review advanced topics and additional examples from the reference material to improve lecture alignment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimilarityScore;
