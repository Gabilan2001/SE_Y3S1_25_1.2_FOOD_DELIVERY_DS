import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaMotorcycle, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen for delivery status updates
    socket.on('deliveryStatusUpdated', ({ deliveryPersonId, status, currentDelivery }) => {
      addNotification({
        type: 'status',
        icon: <FaMotorcycle className="text-orange-500" />,
        message: `Delivery person #${deliveryPersonId} is now ${status}`,
        details: currentDelivery ? `Delivering to: ${currentDelivery.destination.address}` : null
      });
    });

    // Listen for location updates
    socket.on('locationUpdated', ({ deliveryPersonId }) => {
      addNotification({
        type: 'location',
        icon: <FaMapMarkerAlt className="text-blue-500" />,
        message: `Location updated for delivery person #${deliveryPersonId}`,
        timestamp: new Date()
      });
    });

    // Listen for delivery completions
    socket.on('deliveryCompleted', ({ deliveryPersonId, orderId }) => {
      addNotification({
        type: 'completion',
        icon: <FaCheck className="text-green-500" />,
        message: `Order #${orderId} has been delivered`,
        details: `Completed by delivery person #${deliveryPersonId}`,
        timestamp: new Date()
      });
    });

    // Listen for new ratings
    socket.on('ratingAdded', ({ deliveryPersonId, averageRating }) => {
      addNotification({
        type: 'rating',
        icon: <FaStar className="text-yellow-400" />,
        message: `New rating received for delivery person #${deliveryPersonId}`,
        details: `Current average rating: ${averageRating.toFixed(1)}`,
        timestamp: new Date()
      });
    });

    return () => {
      socket.off('deliveryStatusUpdated');
      socket.off('locationUpdated');
      socket.off('deliveryCompleted');
      socket.off('ratingAdded');
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }, ...prev].slice(0, 50)); // Keep only last 50 notifications
    setUnreadCount(prev => prev + 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.read ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      {notification.details && (
                        <p className="text-sm text-gray-500 mt-1">{notification.details}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 