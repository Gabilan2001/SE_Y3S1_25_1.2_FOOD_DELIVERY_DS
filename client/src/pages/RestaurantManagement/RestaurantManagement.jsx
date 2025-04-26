import React, { useState, useEffect } from "react";
import { API_ENDPOINTS, apiRequest } from "../../config/api";
import "../../styles/AdminDashboard.css";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'active'

  useEffect(() => {
    fetchRestaurants();
  }, [filter]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let endpoint;
      
      switch (filter) {
        case 'pending':
          endpoint = API_ENDPOINTS.pendingRestaurants;
          break;
        case 'active':
          endpoint = API_ENDPOINTS.activeRestaurants;
          break;
        default:
          endpoint = API_ENDPOINTS.restaurants;
      }

      const data = await apiRequest(endpoint, 'GET', null, token);
      setRestaurants(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(API_ENDPOINTS.approveRestaurant(restaurantId), 'PUT', null, token);
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (restaurantId) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(API_ENDPOINTS.rejectRestaurant(restaurantId), 'PUT', null, token);
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const token = localStorage.getItem('token');
        await apiRequest(API_ENDPOINTS.deleteRestaurant(restaurantId), 'DELETE', null, token);
        setRestaurants(restaurants.filter(restaurant => restaurant._id !== restaurantId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="management-section">
      <h2>Restaurant Management</h2>
      
      <div className="filter-section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Restaurants</option>
          <option value="pending">Pending Approval</option>
          <option value="active">Active Restaurants</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td>{restaurant._id}</td>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{restaurant.owner?.name || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${restaurant.status}`}>
                    {restaurant.status}
                  </span>
                </td>
                <td>
                  {restaurant.status === 'pending' && (
                    <>
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(restaurant._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(restaurant._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(restaurant._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantManagement;
