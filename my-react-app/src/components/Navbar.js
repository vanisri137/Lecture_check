
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <nav
      style={{
        background: "#212529",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 25px",
      }}
    >
      <div
        className="d-flex align-items-center"
      >
        

        {/* Right Side */}
        {isLoggedIn && (
          <div
            className="d-flex align-items-center"
    style={{
      marginLeft: "auto",
      gap: "20px"}}
          >
            {/* Date */}
            <div
              style={{
                color: "#adb5bd",
                marginRight: "20px",
              }}
            >
              <i className="bi bi-calendar-event me-2"></i>
              {today}
            </div>

            {/* User */}
            <div
              className="d-flex align-items-center"
              style={{
                marginRight: "20px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#ffc107",
                  color: "#212529",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                <i className="bi bi-person-fill"></i>
              </div>

              
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="btn"
              style={{
                background: "#ffc107",
                color: "#212529",
                border: "none",
                borderRadius: "10px",
                padding: "8px 18px",
                fontWeight: "600",
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
