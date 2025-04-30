import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ChartBarIcon,
  TruckIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Sample mock data for stats and deliveries
const mockStats = {
  totalOrders: 1234,
  activeDeliveries: 42,
  completedDeliveries: 892,
  totalDeliveryPersons: 25,
  totalSales: 25490,
  totalProfit: 8920,
  customerRate: 5.12
};

const mockActiveDeliveries = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    customerName: "John Smith",
    deliveryPerson: "Mike Johnson",
    status: "In Progress",
    estimatedTime: "15 mins",
    location: "123 Main St, New York"
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    customerName: "Sarah Wilson",
    deliveryPerson: "David Brown",
    status: "Picked Up",
    estimatedTime: "25 mins",
    location: "456 Oak Ave, Brooklyn"
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    customerName: "Emma Davis",
    deliveryPerson: "Chris Lee",
    status: "Assigned",
    estimatedTime: "30 mins",
    location: "789 Pine Rd, Queens"
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    customerName: "Michael Brown",
    deliveryPerson: "Lisa Chen",
    status: "Delivered",
    estimatedTime: "Completed",
    location: "321 Elm St, Manhattan"
  },
  {
    id: 5,
    orderNumber: "ORD-2024-005",
    customerName: "Jennifer White",
    deliveryPerson: "Mike Johnson",
    status: "In Progress",
    estimatedTime: "20 mins",
    location: "654 Maple Dr, Bronx"
  },
  {
    id: 6,
    orderNumber: "ORD-2024-006",
    customerName: "Robert Taylor",
    deliveryPerson: "David Brown",
    status: "Picked Up",
    estimatedTime: "35 mins",
    location: "987 Cedar Ln, Staten Island"
  }
];

const mockDeliveryPersons = [
  {
    id: 1,
    name: "Mike Johnson",
    status: "Active",
    deliveries: 156,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: 2,
    name: "David Brown",
    status: "Active",
    deliveries: 142,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 3,
    name: "Chris Lee",
    status: "Break",
    deliveries: 98,
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
  },
  {
    id: 4,
    name: "Lisa Chen",
    status: "Active",
    deliveries: 167,
    rating: 4.9,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  }
];

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['deliveryStats'],
    queryFn: () => new Promise(resolve => setTimeout(() => resolve(mockStats), 100))
  });

  const { data: activeDeliveries } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: () => new Promise(resolve => setTimeout(() => resolve(mockActiveDeliveries), 100))
  });

  const { data: deliveryPersons } = useQuery({
    queryKey: ['deliveryPersons'],
    queryFn: () => new Promise(resolve => setTimeout(() => resolve(mockDeliveryPersons), 100))
  });

  if (!stats || !activeDeliveries || !deliveryPersons) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="bg-white rounded-xl p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="bg-white rounded-xl p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-700">{stats?.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TruckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Active Deliveries</h3>
                <p className="text-2xl font-bold text-gray-700">{stats?.activeDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Completed</h3>
                <p className="text-2xl font-bold text-gray-700">{stats?.completedDeliveries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Persons</h3>
                <p className="text-2xl font-bold text-gray-700">{stats?.totalDeliveryPersons}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Deliveries Table */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Deliveries</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Person</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeDeliveries?.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.deliveryPerson}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          delivery.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'Picked Up' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.estimatedTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delivery Persons */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Persons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {deliveryPersons?.map((person) => (
                <div key={person.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <img
                          src={person.image || 'assets/deliveryBoys/default.jpg'}  // Path to the image
                          alt={person.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-500">{person.deliveries} deliveries</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        person.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {person.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(person.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{person.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
