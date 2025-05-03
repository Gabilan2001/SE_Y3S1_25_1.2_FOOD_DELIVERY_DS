import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import NavbarAdmin from "../../components/Navbar-admin";
import SidebarAdmin from "../../components/Sidebar-admin";
import UserManagement from "../UserManagement/UserManagement";
import RestaurantManagement from "../RestaurantManagement/RestaurantManagement";
import FinancialTransactions from "../FinancialTransactions/FinancialTransactions";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <NavbarAdmin />
      <div className="admin-dashboard-container">
        <SidebarAdmin />
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div className="stat-card">
          <h3>Active Restaurants</h3>
          <p>89</p>
        </div>
        <div className="stat-card">
          <h3>Today's Orders</h3>
          <p>156</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>$12,345</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
