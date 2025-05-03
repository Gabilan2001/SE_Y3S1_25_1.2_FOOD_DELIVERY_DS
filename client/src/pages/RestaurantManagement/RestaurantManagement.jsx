import React, { useState, useEffect } from "react";
import {  API_BASE_URL,API_ENDPOINTS, apiRequest } from "../../config/api";
import "../../styles/AdminDashboard.css";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'active'

// Fetch restaurants from your friend's backend (port 8000) and store them in your own backend (port 3030)
// Fetch restaurants from your friend's backend (port 8000)
const fetchRestaurants = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('accesstoken');

    console.log("Fetching restaurants from friend's backend...");

    // Log the token to make sure it's being passed
    console.log("Token:", token);

    // Fetch the restaurants from your friend's backend (port 8000)
    const response = await apiRequest("http://localhost:8000/api/category/get", 'GET', null, token);

    // Log the response to check its structure
    console.log("Fetched restaurants from friend's backend:", response);

    // Check if the response.data is an array
    if (Array.isArray(response.data)) {
      // Process restaurants and map data
      const updatedRestaurants = response.data.map(restaurant => ({
        ...restaurant,
        status: restaurant.status || 'pending',  // Default status to 'pending' if not present
        _id: undefined,  // Remove _id to avoid duplication error
      }));

      console.log("Processed restaurants:", updatedRestaurants);

      // Store restaurants in your backend (port 3030)
      await storeRestaurantsInDB(updatedRestaurants);

      // Fetch the restaurants from your backend (port 3030) to display them
      const fetchedData = await apiRequest("http://localhost:3030/api/restaurant/restaurants", 'GET', null, token);

      console.log("Fetched restaurants from my backend:", fetchedData);

      // Update the UI with the fetched restaurants
      setRestaurants(fetchedData);

    } else {
      // Handle unexpected response format
      setError("Error: Invalid response format from backend.");
    }

  } catch (err) {
    setError("Error fetching restaurants: " + err.message);
    console.error("Error fetching restaurants:", err);
  } finally {
    setLoading(false); // Stop loading when done
  }
};

// Send the fetched restaurants to your backend to store them (port 3030)
const storeRestaurantsInDB = async (restaurants) => {
  try {
    const token = localStorage.getItem('accesstoken');
    
    // Add default values for missing fields and ensure _id is not included
    const updatedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      category: restaurant.category || 'Fast Food',  // Default to "Fast Food"
      address: restaurant.address || 'Kandy',  // Default to "Kandy"
      phone: restaurant.phone || '0779207875',  // Default to "0779207875"
      email: restaurant.email || `it${Math.random().toString(36).substr(2, 9)}@my.sliit.lk`,  // Generate unique email with random string
      owner: restaurant.owner || 'Rashad',  // Default to "Rashad"
    }));

    // Log the updated restaurants before sending
    console.log("Updated restaurants to be stored:", updatedRestaurants);

    // Check for existing restaurants by email to prevent duplication
    for (const restaurant of updatedRestaurants) {
      const existingRestaurant = await apiRequest(
        `${API_BASE_URL}/restaurant/restaurants?email=${restaurant.email}`,
        'GET', 
        null, 
        token
      );

      if (existingRestaurant && existingRestaurant.length > 0) {
        console.log(`Restaurant with email ${restaurant.email} already exists, skipping insert.`);
        continue; // Skip inserting this restaurant
      }

      // If not, insert the restaurant
      await apiRequest("http://localhost:3030/api/restaurant/store-restaurants", 'POST', { restaurants: [restaurant] }, token);
    }

  } catch (err) {
    console.error("Error storing restaurants:", err.message);
    setError("Error storing restaurants: " + err.message);
  }
};

// Run fetchRestaurants when the component mounts
useEffect(() => {
  fetchRestaurants();
}, []);

  // useEffect(() => {
  //   fetchRestaurants();
  // }, [filter]);

  // const fetchRestaurants = async () => {
  //   try {
  //     setLoading(true);

  //     // Log the token to make sure it's being retrieved correctly
  //     const token = localStorage.getItem('accesstoken');
  //     console.log("Token retrieved from localStorage in RestaurantManagement:", token);  // Log token to verify




  //     let endpoint;
      
  //     switch (filter) {
  //       case 'pending':
  //         endpoint = API_ENDPOINTS.pendingRestaurants;
  //         break;
  //       case 'active':
  //         endpoint = API_ENDPOINTS.activeRestaurants;
  //         break;
  //       default:
  //         endpoint = API_ENDPOINTS.restaurants;
  //     }

  //     // Log the API request details before making the request
  //     console.log("Making API request to:", endpoint);
  //     console.log("Authorization Header:", `Bearer ${token}`);  // Log Authorization header

  //     const data = await apiRequest(endpoint, 'GET', null, token);
  //     setRestaurants(data);
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };

  const handleApprove = async (restaurantId) => {
    try {
      const token = localStorage.getItem('accesstoken');
      await apiRequest(`${API_BASE_URL}/restaurant/restaurants/${restaurantId}/approve`, 'PUT', { status: 'approved' }, token);
      
      // After the approval, make sure to update the UI with the latest data
      const updatedRestaurants = restaurants.map(restaurant => 
        restaurant._id === restaurantId ? { ...restaurant, status: 'approved' } : restaurant
      );
  
      setRestaurants(updatedRestaurants);  // Manually update the state to reflect the approval
  
      fetchRestaurants();  // Optionally, re-fetch the restaurants to ensure all data is refreshed
  
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  
  const handleReject = async (restaurantId) => {
    try {
      const token = localStorage.getItem('accesstoken');
      console.log("Token for reject action:", token); // Log token before API request
  
      // Sending the 'status' as 'rejected' in the request body
      const response = await apiRequest(API_ENDPOINTS.rejectRestaurant(restaurantId), 'PUT', { status: 'rejected' }, token);
      fetchRestaurants(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleDelete = async (restaurantId) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const token = localStorage.getItem('accesstoken');
        console.log("Token for delete action:", token); // Log token before API request

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
