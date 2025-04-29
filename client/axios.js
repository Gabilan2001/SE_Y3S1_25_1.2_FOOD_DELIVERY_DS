import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for handling errors
instance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance; 