import React, { useState } from 'react';
import { CheckCircle, XCircle, Calendar, MapPin, Users, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockEvent } from '../../data/mockData';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { BottomSheet } from '../common/BottomSheet';

export const GuestHome: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [formData, setFormData] = useState({
    arrival: '',
    departure: '',
    travelMode: '',
    travelNo: ''
  });

  const handleRSVP = (response: 'Accept' | 'Reject') => {
    updateUser({ rsvp: response });
    if (response === 'Accept') {
      setShowRSVPForm(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      arrival: new Date(formData.arrival),
      departure: new Date(formData.departure),
      travelMode: formData.travelMode,
      travelNo: formData.travelNo
    });
    setShowRSVPForm(false);
    setShowBottomSheet(false);
  };

  const noteTypeIcons = {
    'Invitation': CheckCircle,
    'Welcome': CheckCircle,
    'Thank You': CheckCircle
  };

  const NoteIcon = noteTypeIcons[mockEvent.noteType];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-6 md:p-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-4">
          <NoteIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{mockEvent.noteType}</h1>
        </div>
        <p className="text-indigo-100 leading-relaxed text-lg">
          {mockEvent.noteContent}
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{mockEvent.eventTitle}</h2>
        <p className="text-gray-600 mb-6">{mockEvent.eventDescription}</p>
        
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <span>{mockEvent.venue}</span>
        </div>
      </div>

      {/* RSVP Section */}
      {user?.rsvp === null && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-bounce-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Please confirm your attendance</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleRSVP('Accept')}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-all transform hover:scale-105 active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleRSVP('Reject')}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all transform hover:scale-105 active:scale-95"
            >
              <XCircle className="w-5 h-5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      )}

      {/* RSVP Form */}
      {showRSVPForm && (
        <>
          {/* Desktop Form */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Details</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Form content remains the same */}
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
                    required
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
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Mode
                  </label>
                  <select
                    value={formData.travelMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, travelMode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
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
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Travel Details
              </button>
            </form>
          </div>

          {/* Mobile FAB */}
          <FloatingActionButton 
            onClick={() => setShowBottomSheet(true)}
            className="md:hidden"
          />

          {/* Mobile Bottom Sheet */}
          <BottomSheet
            isOpen={showBottomSheet}
            onClose={() => setShowBottomSheet(false)}
            title="Travel Details"
          >
            <div className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Same form content as desktop */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={formData.arrival}
                      onChange={(e) => setFormData(prev => ({ ...prev, arrival: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
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
                      required
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
                      required
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
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all transform active:scale-95"
                >
                  Save Travel Details
                </button>
              </form>
            </div>
          </BottomSheet>
        </>
      )}

      {/* RSVP Status */}
      {user?.rsvp && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            {user.rsvp === 'Accept' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              RSVP Status: {user.rsvp}ed
            </h3>
          </div>
          
          {user.rsvp === 'Accept' && user.arrival && (
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Arrival: {new Date(user.arrival).toLocaleDateString()}</span>
              </div>
              {user.departure && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Departure: {new Date(user.departure).toLocaleDateString()}</span>
                </div>
              )}
              {user.travelMode && (
                <div className="flex items-center space-x-2">
                  <Plane className="w-4 h-4 text-indigo-600" />
                  <span>Travel: {user.travelMode} {user.travelNo}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};