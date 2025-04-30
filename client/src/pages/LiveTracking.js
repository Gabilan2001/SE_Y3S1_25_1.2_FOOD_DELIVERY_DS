import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const LiveTracking = () => {
  const [activeDeliveryPersons, setActiveDeliveryPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [center] = useState({
    // Center of Sri Lanka
    lat: 7.8731,
    lng: 80.7718
  });

  const mapContainerStyle = {
    width: '100%',
    height: '70vh'
  };

  const options = {
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoom: 8
  };

  // Fetch active delivery persons
  useEffect(() => {
    const fetchActiveDeliveryPersons = async () => {
      try {
        setError(null);
        setIsLoading(true);
        console.log('Fetching active delivery persons...'); // Debug log
        const response = await api.get('/api/delivery-boy/active');
        console.log('Response:', response.data); // Debug log
        setActiveDeliveryPersons(response.data);
      } catch (error) {
        console.error('Error details:', error); // Debug log
        const errorMessage = error.response?.data?.message || 'Failed to fetch active delivery persons';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveDeliveryPersons();
    
    // Set up polling for location updates every 30 seconds
    const interval = setInterval(fetchActiveDeliveryPersons, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = (person) => {
    setSelectedPerson(person);
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log('Map loaded successfully'); // Debug log
  };

  const handleMapError = (error) => {
    console.error('Google Maps loading error:', error);
    setError('Failed to load Google Maps. Please check your internet connection and try again.');
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: Google Maps API key is not configured. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Live Delivery Tracking</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Active Delivery Persons: {isLoading ? '...' : activeDeliveryPersons.length}
          </h2>
          {isLoading && (
            <span className="text-sm text-gray-500">Refreshing data...</span>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              Reload page
            </button>
          </div>
        )}

        {isLoading && !mapLoaded && (
          <div className="flex justify-center items-center h-[70vh] bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map and delivery locations...</p>
            </div>
          </div>
        )}

        <LoadScript 
          googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
          onLoad={handleMapLoad}
          onError={handleMapError}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            options={options}
          >
            {activeDeliveryPersons.map((person) => (
              <Marker
                key={person._id}
                position={{
                  lat: person.currentLocation?.latitude || 0,
                  lng: person.currentLocation?.longitude || 0
                }}
                onClick={() => handleMarkerClick(person)}
                icon={{
                  url: '/delivery-marker.png',
                  scaledSize: { width: 40, height: 40 }
                }}
              />
            ))}

            {selectedPerson && (
              <InfoWindow
                position={{
                  lat: selectedPerson.currentLocation?.latitude || 0,
                  lng: selectedPerson.currentLocation?.longitude || 0
                }}
                onCloseClick={() => setSelectedPerson(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{selectedPerson.name}</h3>
                  <p className="mb-1"><span className="font-semibold">Phone:</span> {selectedPerson.phone}</p>
                  <p className="mb-1"><span className="font-semibold">Area:</span> {selectedPerson.area}</p>
                  <p className="mb-1"><span className="font-semibold">Vehicle:</span> {selectedPerson.vehicleDetails.vehicleType}</p>
                  <p className="mb-1"><span className="font-semibold">Total Deliveries:</span> {selectedPerson.totalDeliveries}</p>
                  <p className="text-sm text-gray-500">
                    Last Updated: {new Date(selectedPerson.currentLocation.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Active Delivery Persons List</h3>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-100 p-4 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : activeDeliveryPersons.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No active delivery persons at the moment</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-blue-500 underline hover:no-underline"
              >
                Refresh page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeDeliveryPersons.map((person) => (
                <div
                  key={person._id}
                  className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleMarkerClick(person)}
                >
                  <h4 className="font-bold text-lg mb-2">{person.name}</h4>
                  <p className="mb-1">Area: {person.area}</p>
                  <p className="mb-1">Vehicle: {person.vehicleDetails.vehicleType}</p>
                  <p className="text-green-600">Status: Active</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Last Updated: {new Date(person.currentLocation.lastUpdated).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking; 