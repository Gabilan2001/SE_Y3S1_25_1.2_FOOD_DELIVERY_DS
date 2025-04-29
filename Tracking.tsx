import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchId, setSearchId] = useState('');

  const { data: trackingInfo, isLoading } = useQuery(
    ['tracking', searchId],
    async () => {
      if (!searchId) return null;
      const response = await axios.get(`/api/tracking/${searchId}`);
      return response.data;
    },
    {
      enabled: !!searchId,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchId(trackingId);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Order Tracking</h1>

      <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="tracking-id"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Tracking ID
            </label>
            <input
              type="text"
              id="tracking-id"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter your tracking ID"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
            >
              Track
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}

      {trackingInfo && !isLoading && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Tracking Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and status of your order
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {trackingInfo.orderId}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trackingInfo.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : trackingInfo.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {trackingInfo.status}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {trackingInfo.currentLocation}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Delivery Boy</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {trackingInfo.deliveryBoyName}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {trackingInfo.estimatedDelivery}
                </dd>
              </div>
            </dl>
          </div>

          {/* Tracking Timeline */}
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">
              Tracking History
            </h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {trackingInfo.history.map((event: any, index: number) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== trackingInfo.history.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              event.status === 'Delivered'
                                ? 'bg-green-500'
                                : event.status === 'In Progress'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-white"></span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">{event.description}</p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={event.timestamp}>
                              {new Date(event.timestamp).toLocaleString()}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!trackingInfo && !isLoading && searchId && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">No tracking information found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Please check your tracking ID and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking; 