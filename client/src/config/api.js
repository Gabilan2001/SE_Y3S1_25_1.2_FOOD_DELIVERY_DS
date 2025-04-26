const API_BASE_URL = 'http://localhost:3030/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,

    // User endpoints
    users: `${API_BASE_URL}/users`,
    userById: (id) => `${API_BASE_URL}/users/${id}`,
    updateUser: (id) => `${API_BASE_URL}/users/${id}`,
    deleteUser: (id) => `${API_BASE_URL}/users/${id}`,

   // Restaurant endpoints (Updated paths)
restaurants: `${API_BASE_URL}/restaurant/restaurants`,  // Fixed path
restaurantById: (id) => `${API_BASE_URL}/restaurant/restaurants/${id}`,  // Fixed path
approveRestaurant: (id) => `${API_BASE_URL}/restaurant/restaurants/${id}/approve`,  // Fixed path
rejectRestaurant: (id) => `${API_BASE_URL}/restaurant/restaurants/${id}/reject`,  // Fixed path
pendingRestaurants: `${API_BASE_URL}/restaurant/restaurants/pending`,  // Fixed path
activeRestaurants: `${API_BASE_URL}/restaurant/restaurants/active`,  // Fixed path
updateRestaurant: (id) => `${API_BASE_URL}/restaurant/restaurants/${id}`,  // Fixed path
deleteRestaurant: (id) => `${API_BASE_URL}/restaurant/restaurants/${id}`,  // Fixed path

    // Order endpoints
    orders: `${API_BASE_URL}/orders`,
    orderById: (id) => `${API_BASE_URL}/orders/${id}`,
    updateOrderStatus: (id) => `${API_BASE_URL}/orders/${id}/status`,

    // Financial endpoints
    transactions: `${API_BASE_URL}/transactions`,
    transactionById: (id) => `${API_BASE_URL}/transactions/${id}`,
    dashboardStats: `${API_BASE_URL}/dashboard/stats`,
};

export const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(endpoint, config);
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server did not return JSON');
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 