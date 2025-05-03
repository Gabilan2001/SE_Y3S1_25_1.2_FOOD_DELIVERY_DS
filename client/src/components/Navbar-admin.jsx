import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar-admin.css";

const NavbarAdmin = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <Link to="/admin" className="admin-logo">
          Admin Panel
        </Link>
      </div>
      
      <div className="admin-navbar-center">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-notifications">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </div>
        
        <div className="admin-profile">
          <span className="admin-avatar">👤</span>
          <span className="admin-name">Admin</span>
        </div>

        <button className="admin-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
