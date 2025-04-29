import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTimes, FaDownload, FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useDummyData } from '../context/DummyDataContext';
import { useNavigate } from 'react-router-dom';
import DeliveryBoyForm from './DeliveryBoyForm';  // Import the DeliveryBoyForm component

// Import images
import boy1 from '../assets/deliveryBoys/boy1.jpg';
import girl1 from '../assets/deliveryBoys/girl1.jpg';
import girl2 from '../assets/deliveryBoys/girl2.jpg';
import girl3 from '../assets/deliveryBoys/girl3.jpg';
import boy2 from '../assets/deliveryBoys/boy2.jpg';

const DeliveryBoys = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState(null);
  const { deliveryBoys: dummyDeliveryBoys } = useDummyData();

  const handleStatusUpdate = (id) => {
    try {
      const updatedDeliveryBoys = dummyDeliveryBoys.map(boy => {
        if (boy._id === id) {
          return {
            ...boy,
            status: boy.status === 'active' ? 'inactive' : 'active'
          };
        }
        return boy;
      });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (deliveryBoy) => {
    setEditingDeliveryBoy({ ...deliveryBoy });
  };

  const handleSaveEdit = () => {
    try {
      toast.success('Delivery boy details updated successfully');
      setEditingDeliveryBoy(null);
    } catch (error) {
      toast.error('Failed to update delivery boy details');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingDeliveryBoy(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownloadDetails = () => {
    const dataStr = JSON.stringify(dummyDeliveryBoys, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'delivery_boys_details.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDeliveryBoys = dummyDeliveryBoys?.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.vehicleDetails.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deliveryImages = [boy1, girl1, girl2, girl3, boy2];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Persons</h1>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => navigate('/delivery-boys/new')}
          >
            <FaPlus className="mr-2" /> New Delivery Person
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={handleDownloadDetails}
          >
            <FaDownload className="mr-2" /> Download Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {editingDeliveryBoy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Delivery Boy</h2>
              <button onClick={() => setEditingDeliveryBoy(null)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingDeliveryBoy.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editingDeliveryBoy.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingDeliveryBoy.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={editingDeliveryBoy.vehicleDetails.vehicleNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={editingDeliveryBoy.area}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeliveryBoys?.map((person, index) => (
          <div key={person._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={deliveryImages[index % deliveryImages.length]}
                alt={person.name}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                person.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>{person.status}</div>
              <button
                onClick={() => handleEdit(person)}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <FaEdit className="text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{person.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Vehicle: {person.vehicleDetails.vehicleNumber}</p>
                <p>Phone: {person.phone}</p>
                <p>Email: {person.email}</p>
                <p>Area: {person.area}</p>
                <p>Total Deliveries: {person.totalDeliveries}</p>
                <p>Rating: {person.rating} / 5</p>
                <p>Vehicle Type: {person.vehicleDetails.vehicleType}</p>
                <p>License Number: {person.vehicleDetails.licenseNumber}</p>
                <p>NIC: {person.nic}</p>
                <p>Age: {person.age}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleStatusUpdate(person._id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium ${
                    person.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {person.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoys;
