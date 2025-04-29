import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { FaCalendar, FaRoute, FaClock, FaStar, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Mock delivery history data
const mockDeliveryHistory = [
  {
    _id: 1,
    orderId: "ORD-2024-001",
    startTime: "2024-03-15T10:30:00",
    status: "Completed",
    distance: 5.2,
    duration: 25,
    rating: 5,
    destination: {
      address: "123 Main St, Downtown, City"
    }
  },
  {
    _id: 2,
    orderId: "ORD-2024-002",
    startTime: "2024-03-14T15:45:00",
    status: "Cancelled",
    distance: 3.8,
    duration: 0,
    destination: {
      address: "456 Oak Avenue, Suburb, City"
    }
  },
  {
    _id: 3,
    orderId: "ORD-2024-003",
    startTime: "2024-03-14T12:15:00",
    status: "Completed",
    distance: 7.1,
    duration: 35,
    rating: 4,
    destination: {
      address: "789 Pine Road, District, City"
    }
  },
  {
    _id: 4,
    orderId: "ORD-2024-004",
    startTime: "2024-03-13T18:20:00",
    status: "Failed",
    distance: 4.5,
    duration: 45,
    destination: {
      address: "321 Elm Street, Area, City"
    }
  },
  {
    _id: 5,
    orderId: "ORD-2024-005",
    startTime: "2024-03-13T09:00:00",
    status: "Completed",
    distance: 6.3,
    duration: 30,
    rating: 5,
    destination: {
      address: "654 Maple Lane, Zone, City"
    }
  }
];

const DeliveryHistory = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const navigate = useNavigate();

  // Use mock data instead of API call
  const { data: deliveryHistory } = useQuery({
    queryKey: ['deliveryHistory', dateRange],
    queryFn: () => Promise.resolve(mockDeliveryHistory)
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Failed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaCheck className="w-4 h-4" />;
      case 'Cancelled':
        return <FaTimes className="w-4 h-4" />;
      case 'Failed':
        return <FaExclamationTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Delivery History</h1>
          <button
            onClick={() => navigate('/orders')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            New Order
          </button>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-gray-400" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-8">
          {deliveryHistory?.map((delivery) => (
            <div key={delivery._id} className="relative pl-8 border-l-2 border-gray-200">
              {/* Timeline Dot */}
              <div className="absolute -left-2 w-4 h-4 rounded-full bg-orange-500"></div>
              
              <div className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Order #{delivery.orderId}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(delivery.startTime), 'PPp')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(delivery.status)}`}>
                    {getStatusIcon(delivery.status)}
                    {delivery.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <FaRoute className="text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Distance</p>
                      <p className="font-medium">{delivery.distance.toFixed(2)} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaClock className="text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{Math.round(delivery.duration)} mins</p>
                    </div>
                  </div>

                  {delivery.rating && (
                    <div className="flex items-center gap-3">
                      <FaStar className="text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{delivery.rating}</p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-4 h-4 ${i < delivery.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <div className="text-gray-400 mt-1">📍</div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="text-gray-700">{delivery.destination.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory; 