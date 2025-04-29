import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.locationListeners = new Set();
        this.orderStatusListeners = new Set();
    }

    connect() {
        if (!this.socket) {
            this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:4001', {
                withCredentials: true
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            this.socket.on('locationUpdated', (data) => {
                this.locationListeners.forEach(listener => listener(data));
            });

            this.socket.on('orderStatusUpdated', (data) => {
                this.orderStatusListeners.forEach(listener => listener(data));
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Location updates
    emitLocationUpdate(deliveryPersonId, location) {
        if (this.socket) {
            this.socket.emit('locationUpdate', { deliveryPersonId, location });
        }
    }

    onLocationUpdate(listener) {
        this.locationListeners.add(listener);
        return () => this.locationListeners.delete(listener);
    }

    // Order status updates
    emitDeliveryStatusUpdate(orderId, status) {
        if (this.socket) {
            this.socket.emit('deliveryStatusUpdate', { orderId, status });
        }
    }

    onOrderStatusUpdate(listener) {
        this.orderStatusListeners.add(listener);
        return () => this.orderStatusListeners.delete(listener);
    }
}

export const socketService = new SocketService();
export default socketService; 