import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';
 
function Sidebar() {
  const [active, setActive] = useState(1);
 
  return (
    <div className="custom-sidebar">
 
      {/* ── Logo ── */}
      <div className="sidebar-top">
        <div className="logo-section">
          <div className="logo-box">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <div className="logo-text-wrap">
            <h3 className="logo-title">LectureCheck</h3>
            <span className="logo-subtitle">AI Academic Platform</span>
          </div>
        </div>
 
        <div className="sidebar-divider"></div>
 
        {/* ── Menu ── */}
        <ul className="sidebar-menu">
 
          <li
            className={active === 1 ? "menu-item active-item" : "menu-item"}
            onClick={() => setActive(1)}
          >
            <NavLink to="/" className="menu-link">
              <span className="menu-icon-wrap">
                <i className="bi bi-speedometer2"></i>
              </span>
              <span className="menu-label">Dashboard</span>
            </NavLink>
          </li>
 
          <li
            className={active === 2 ? "menu-item active-item" : "menu-item"}
            onClick={() => setActive(2)}
          >
            <NavLink to="/uploadvd" className="menu-link">
              <span className="menu-icon-wrap">
                <i className="bi bi-cloud-upload-fill"></i>
              </span>
              <span className="menu-label">Upload Lecture</span>
            </NavLink>
          </li>
 
          <li
            className={active === 3 ? "menu-item active-item" : "menu-item"}
            onClick={() => setActive(3)}
          >
            <NavLink to="/upload" className="menu-link">
              <span className="menu-icon-wrap">
                <i className="bi bi-file-earmark-pdf-fill"></i>
              </span>
              <span className="menu-label">Reference PDFs</span>
            </NavLink>
          </li>
 
          <li
            className={active === 4 ? "menu-item active-item" : "menu-item"}
            onClick={() => setActive(4)}
          >
            <NavLink to="/similarity-score" className="menu-link">
              <span className="menu-icon-wrap">
                <i className="bi bi-bar-chart-fill"></i>
              </span>
              <span className="menu-label">AI Reports</span>
            </NavLink>
          </li>
 
        </ul>
      </div>
 
      {/* ── User Section ── */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider"></div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Instructor</span>
            <span className="sidebar-user-role">Admin</span>
          </div>
        </div>
      </div>
 
    </div>
  );
}
 
export default Sidebar;
