import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { FaMapMarkerAlt, FaPhoneAlt, FaMotorcycle, FaBox, FaClock, FaRoute, FaSearch, FaSpinner, FaBell, FaCog, FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import socketService from '../services/socketService';

const DELIVERY_IMAGES = {
  PERSON1: 'https://img.freepik.com/free-photo/delivery-man-red-uniform-medical-mask-gloves-pointing-finger-up-looking-confident_141793-48954.jpg',
  PERSON2: 'https://img.freepik.com/free-photo/young-delivery-man-wearing-red-polo-shirt-cap-standing-with-stack-pizza-boxes-looking-camera-smiling-confident-isolated-white-background_141793-45225.jpg',
};

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px'
};

const center = {
  lat: 19.0760,
  lng: 72.8777
};

// API functions
const fetchDeliveryPersons = async () => {
  const response = await axios.get('/api/tracking/delivery-persons');
  return response.data;
};

const fetchNotifications = async () => {
  const response = await axios.get('/api/tracking/notifications');
  return response.data;
};

const Tracking = () => {
  const { id } = useParams();
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const queryClient = useQueryClient();

  // Fetch delivery persons
  const { data: deliveryPersons, isLoading: isLoadingDeliveryPersons } = useQuery({
    queryKey: ['deliveryPersons'],
    queryFn: fetchDeliveryPersons,
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  // Fetch notifications
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Filter delivery persons based on search term
  const filteredDeliveryPersons = deliveryPersons?.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Connect to WebSocket when component mounts
  useEffect(() => {
    socketService.connect();

    // Listen for location updates
    const unsubscribeLocation = socketService.onLocationUpdate((data) => {
      queryClient.setQueryData(['deliveryPersons'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(person => 
          person._id === data.deliveryPersonId
            ? { ...person, currentLocation: data.location, status: data.status }
            : person
        );
      });
    });

    // Listen for order status updates
    const unsubscribeOrder = socketService.onOrderStatusUpdate((data) => {
      // Refresh notifications when order status changes
      queryClient.invalidateQueries(['notifications']);
    });

    return () => {
      unsubscribeLocation();
      unsubscribeOrder();
      socketService.disconnect();
    };
  }, [queryClient]);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const handleMapError = (error) => {
    setMapError(error);
    console.error('Error loading map:', error);
  };

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-100 rounded-lg">
        <p className="text-red-500 text-lg mb-2">Error loading map</p>
        <p className="text-gray-600">Please check your internet connection and try again</p>
      </div>
    );
  }

  if (isLoadingDeliveryPersons) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Live Location Tracking
            </h1>
            <p className="text-gray-500">Track your delivery team in real-time</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or vehicle number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <FaBell className="text-xl text-gray-600" />
                {notifications?.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifications</h3>
                  {isLoadingNotifications ? (
                    <div className="px-4 py-3 text-center">
                      <FaSpinner className="animate-spin text-orange-500 mx-auto" />
                    </div>
                  ) : notifications?.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(notification.time), 'MMM d, h:mm a')}
          </p>
        </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FaCog className="text-xl text-gray-600" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">Admin</span>
                <FaChevronDown className="text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <FaSignOutAlt className="text-gray-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Persons List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredDeliveryPersons?.map((person) => (
            <div
              key={person._id}
              className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedDeliveryPerson?._id === person._id ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedDeliveryPerson(person)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{person.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMotorcycle className="text-orange-500" />
                    {person.vehicleNumber}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      person.status === 'On Delivery'
                        ? 'bg-green-100 text-green-800'
                        : person.status === 'Offline'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {person.status}
                    </span>
                    {person.currentDelivery && (
                      <span className="text-sm text-gray-500">
                        ETA: {person.currentDelivery.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-10">
                <FaSpinner className="animate-spin text-4xl text-orange-500 mb-2" />
                <p className="text-gray-600">Loading map...</p>
          </div>
        )}
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              onLoad={handleMapLoad}
              onError={handleMapError}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedDeliveryPerson?.currentLocation || center}
                zoom={13}
              >
                {filteredDeliveryPersons?.map((person) => (
                  <React.Fragment key={person._id}>
                    <Marker
                      position={person.currentLocation}
                      onClick={() => setSelectedDeliveryPerson(person)}
                      icon={{
                        url: person.status === 'On Delivery'
                          ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                          : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      }}
                    />
                    {person.currentDelivery?.route && (
                      <Polyline
                        path={person.currentDelivery.route}
                        options={{
                          strokeColor: '#FF6B00',
                          strokeOpacity: 0.8,
                          strokeWeight: 3,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}

                {selectedDeliveryPerson && (
                  <InfoWindow
                    position={selectedDeliveryPerson.currentLocation}
                    onCloseClick={() => setSelectedDeliveryPerson(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">{selectedDeliveryPerson.name}</h3>
                      <p className="text-sm text-gray-600">{selectedDeliveryPerson.vehicleNumber}</p>
                      {selectedDeliveryPerson.currentDelivery && (
                        <p className="text-sm text-gray-600">
                          ETA: {selectedDeliveryPerson.currentDelivery.estimatedTime}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
      </div>

          {/* Selected Delivery Person Details */}
          {selectedDeliveryPerson && selectedDeliveryPerson.currentDelivery && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaBox className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{selectedDeliveryPerson.currentDelivery.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaClock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Time</p>
                      <p className="font-medium">{selectedDeliveryPerson.currentDelivery.estimatedTime}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaMapMarkerAlt className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium">{selectedDeliveryPerson.currentDelivery.customerAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FaRoute className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{selectedDeliveryPerson.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking; 