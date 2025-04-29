import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Placeholder image URLs
const DELIVERY_HERO = 'https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg';
const DELIVERY_PERSON = 'https://img.freepik.com/free-photo/delivery-man-red-uniform-medical-mask-gloves-pointing-finger-up-looking-confident_141793-48954.jpg';
const SELECT_RESTAURANT = 'https://img.freepik.com/free-vector/food-delivery-service-abstract-concept-vector-illustration_335657-2208.jpg';
const SELECT_MENU = 'https://img.freepik.com/free-vector/mobile-phone-with-food-delivery-service-application-vector-illustration_1284-77918.jpg';
const WAIT_DELIVERY = 'https://img.freepik.com/free-vector/delivery-man-scooter-wearing-red-uniform_1303-16263.jpg';
const SUBSCRIPTION_GIRL = 'https://img.freepik.com/free-vector/girl-sitting-sofa-with-laptop-shopping-online_1150-34866.jpg';

const Home = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Fetch delivery statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['deliveryStats'],
    queryFn: async () => {
      const response = await axios.get('/deliveries/stats');
      return response.data;
    }
  });

  // Fetch active deliveries
  const { data: activeDeliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['activeDeliveries'],
    queryFn: async () => {
      const response = await axios.get('/deliveries/active');
      return response.data;
    }
  });

  // Fetch delivery persons
  const { data: deliveryPersons, isLoading: deliveryPersonsLoading } = useQuery({
    queryKey: ['activeDeliveryPersons'],
    queryFn: async () => {
      const response = await axios.get('/api/tracking/delivery-persons');
      return response.data;
    }
  });

  if (statsLoading || deliveriesLoading || deliveryPersonsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-rose-50 min-h-[600px]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                The Best Delivery<br />Management System
              </h1>
              <p className="text-lg text-gray-600">
                Efficient delivery tracking and management system for your business.
                Track your deliveries in real-time and manage your delivery fleet effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 w-full sm:w-64"
                >
                  <option value="">Select Location</option>
                  <option value="1">New York</option>
                  <option value="2">Los Angeles</option>
                  <option value="3">Chicago</option>
                </select>
                <Link
                  to="/tracking"
                  className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  LIVE TRACKING
                </Link>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <img src={DELIVERY_PERSON} alt="Delivery Person" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm text-gray-500">Active Deliveries</p>
                    <p className="text-xl font-semibold text-gray-800">{stats?.activeDeliveries || 0}</p>
                    <p className="text-sm text-orange-500">In your area</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src={DELIVERY_HERO} alt="Delivery Hero" className="w-full h-auto rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The app allows customers to place orders, which are assigned to delivery personnel. 
            Customers can track their order in real-time and receive a confirmation once it's delivered.
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-6 relative">
                <span className="text-6xl font-bold text-gray-200 absolute -top-4 left-0">01</span>
                <img src={SELECT_RESTAURANT} alt="Select Restaurant" className="w-full h-48 object-contain relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Restaurant</h3>
              <p className="text-gray-600">
              Browse through a list of available restaurants and explore their menus.
              Choose the one that offers your desired food or service, then place your order.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-6 relative">
                <span className="text-6xl font-bold text-gray-200 absolute -top-4 left-0">02</span>
                <img src={SELECT_MENU} alt="Select menu" className="w-full h-48 object-contain relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Menu</h3>
              <p className="text-gray-600">
              View a variety of items available on the restaurant's menu. 
              Select your preferred items and proceed to checkout for payment and order processing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-6 relative">
                <span className="text-6xl font-bold text-gray-200 absolute -top-4 left-0">03</span>
                <img src={WAIT_DELIVERY} alt="Wait for delivery" className="w-full h-48 object-contain relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Wait for Delivery</h3>
              <p className="text-gray-600">
              Once your order is placed, track its real-time status as it is prepared and dispatched. 
              Receive updates and notifications until your order is delivered to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Active Deliveries</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.activeDeliveries || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Completed Today</h3>
            <p className="text-3xl font-bold text-purple-600">{stats?.completedToday || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Delivery Persons</h3>
            <p className="text-3xl font-bold text-orange-600">{stats?.totalDeliveryPersons || 0}</p>
          </div>
        </div>
        
        {/* Active Deliveries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Active Deliveries</h2>
            <Link to="/orders" className="text-orange-500 hover:text-orange-600">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeDeliveries?.map((delivery) => (
                  <tr key={delivery._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        delivery.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                        delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <img src={DELIVERY_PERSON} alt={delivery.deliveryPerson} className="w-8 h-8 rounded-full mr-2 object-cover" />
                        {delivery.deliveryPerson}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.currentLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{delivery.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Delivery Persons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Delivery Persons</h2>
            <Link to="/delivery-boys" className="text-orange-500 hover:text-orange-600">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryPersons?.slice(0, 3).map((person) => (
              <div key={person._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`}
                      alt={person.name} 
                      className="w-16 h-16 rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.phone}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className={person.status === 'On Delivery' ? 'text-green-600' : 'text-gray-600'}>
                        {person.status}
                      </span>
                    </p>
                    <Link
                      to={`/tracking/${person._id}`}
                      className="inline-block mt-2 text-orange-500 hover:text-orange-600"
                    >
                      Track Location →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <img src={SUBSCRIPTION_GIRL} alt="Subscribe" className="w-full h-auto rounded-lg" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-800">
                Get the menu of your<br />favorite restaurants<br />every day
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    // Handle subscription
                    if (emailAddress) {
                      // Add subscription logic here
                      alert('Thank you for subscribing!');
                      setEmailAddress('');
                    }
                  }}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300 whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="Fast Delivery" className="w-8 h-8" />
                <span className="text-xl font-bold">QuickEat</span>
              </div>
              <p className="text-gray-400">
                Welcome to our online order website! Here, you can browse our wide selection of products and place orders from the comfort of your own home.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">MENU</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/restaurants" className="text-gray-400 hover:text-white">Restaurants</Link></li>
                <li><Link to="/contacts" className="text-gray-400 hover:text-white">Contacts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">CONTACTS</h3>
              <ul className="space-y-4">
                <li className="text-gray-400">1717 vithus SV, Colombo, CA 94103, SriLanka </li>
                <li className="text-gray-400">quickeat@mail.net</li>
                <li className="text-gray-400">+1 425 326 16 27</li>
              </ul>
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-white">
                  <span className="sr-only">Facebook</span>
                  {/* Add social icons here */}
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-white">
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-white">
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
