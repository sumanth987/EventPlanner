import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Plane, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    arrival: user?.arrival ? new Date(user.arrival).toISOString().slice(0, 10) : '',
    departure: user?.departure ? new Date(user.departure).toISOString().slice(0, 10) : '',
    travelMode: user?.travelMode || '',
    travelNo: user?.travelNo || ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      arrival: formData.arrival ? new Date(formData.arrival) : undefined,
      departure: formData.departure ? new Date(formData.departure) : undefined,
      travelMode: formData.travelMode || undefined,
      travelNo: formData.travelNo || undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      arrival: user?.arrival ? new Date(user.arrival).toISOString().slice(0, 10) : '',
      departure: user?.departure ? new Date(user.departure).toISOString().slice(0, 10) : '',
      travelMode: user?.travelMode || '',
      travelNo: user?.travelNo || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.isAdmin ? 'Administrator' : 'Guest'}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {user.verified ? 'Verified' : 'Unverified'}
              </span>
              {user.rsvp && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.rsvp === 'Accept' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  RSVP: {user.rsvp}ed
                </span>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Travel Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    value={formData.arrival}
                    onChange={(e) => setFormData(prev => ({ ...prev, arrival: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.departure}
                    onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Mode
                  </label>
                  <select
                    value={formData.travelMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelMode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select travel mode</option>
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Number
                  </label>
                  <input
                    type="text"
                    value={formData.travelNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelNo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Flight number, train number, etc."
                  />
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Basic Information Display */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Information Display */}
            {(user.arrival || user.travelMode) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {user.arrival && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Arrival</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.arrival).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.departure && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.departure).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {user.travelMode && (
                    <div className="flex items-center space-x-3">
                      <Plane className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Travel Mode</p>
                        <p className="font-medium text-gray-900">{user.travelMode}</p>
                      </div>
                    </div>
                  )}
                  {user.travelNo && (
                    <div className="flex items-center space-x-3">
                      <Plane className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Travel Number</p>
                        <p className="font-medium text-gray-900">{user.travelNo}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};