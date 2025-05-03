import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar-admin.css";

const SidebarAdmin = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/user-management", label: "User Management", icon: "👥" },
    { path: "/admin/restaurant-management", label: "Restaurant Management", icon: "🍽️" },
    { path: "/admin/financial-transactions", label: "Financial Transactions", icon: "💰" },
  ];

  return (
    <div className="sidebar-admin">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path} className="sidebar-link">
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin; 