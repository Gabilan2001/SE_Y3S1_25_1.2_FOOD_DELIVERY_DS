import React, { useState, useEffect } from 'react';
import { dummyDeliveries } from '../data/dummyData';  // Make sure the path is correct

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Uncomment to use the real API call
        // const response = await axios.get('http://localhost:5000/api/orders');
        // setOrders(response.data);
        
        // Use dummy data for testing
        setOrders(dummyDeliveries); 
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <div className="mb-2 flex justify-between items-center">
              <span className="font-semibold text-lg">Order #{order.orderId}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Customer:</span> {order.customerName}
            </div>
            <div className="mb-2">
              <span className="font-medium">Assigned Delivery Boy:</span> {order.assignedTo ? `Delivery Boy #${order.assignedTo}` : 'Not Assigned'}
            </div>
            <div className="mb-2">
              <span className="font-medium">Estimated Time:</span> {order.expectedDeliveryTime || 'N/A'}
            </div>
            <div className="mb-2">
              <span className="font-medium">Instructions:</span> {order.instructions || 'None'}
            </div>
            <div className="mb-2">
              <span className="font-medium">Items:</span>
              <ul className="list-disc ml-6">
                {order.items && order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>{item.name} x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => window.location.href = `/tracking/${order.assignedTo}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Track
              </button>
              <button
                onClick={() => window.location.href = `/orders/${order._id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
