import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { DummyDataProvider } from './context/DummyDataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DeliveryBoys from './pages/DeliveryBoys';
import DeliveryBoyForm from './pages/DeliveryBoyForm';
import Tracking from './pages/Tracking';
import DeliveryHistory from './pages/DeliveryHistory';
import Notifications from './components/Notifications';
import Orders from './pages/Orders';
import './styles/App.css';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DummyDataProvider>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link to="/" className="text-xl font-bold text-gray-800">
                      Delivery Management
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/dashboard"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/delivery-boys"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Delivery Boys
                    </Link>
                    <Link
                      to="/tracking"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Live Location
                    </Link>
                    <Link
                      to="/history"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      History
                    </Link>
                    <Link
                      to="/orders"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Orders
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <Notifications />
                </div>
              </div>
            </div>
          </nav>

          <main className="py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/delivery-boys" element={<DeliveryBoys />} />
              <Route path="/delivery-boys/new" element={<DeliveryBoyForm />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/tracking/:id" element={<Tracking />} />
              <Route path="/history" element={<DeliveryHistory />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
        </div>
      </DummyDataProvider>
    </QueryClientProvider>
  );
}

export default App; 