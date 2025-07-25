import React, { useState } from 'react';
import { MapPin, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockEvent, mockMiniEvents } from '../../data/mockData';

export const LocationView: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState({
    venue: mockEvent.venue,
    lat: mockEvent.lat,
    long: mockEvent.long
  });

  const handleSave = () => {
    console.log('Saving location:', eventData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEventData({
      venue: mockEvent.venue,
      lat: mockEvent.lat,
      long: mockEvent.long
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Locations</h1>
          {user?.isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Main Venue</span>
            </button>
          )}
          {user?.isAdmin && isEditing && (
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

        {/* Main Venue */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Main Venue</h2>
              <p className="text-indigo-100">Primary event location</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-100 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={eventData.venue}
                  onChange={(e) => setEventData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-indigo-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={eventData.lat}
                    onChange={(e) => setEventData(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-indigo-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={eventData.long}
                    onChange={(e) => setEventData(prev => ({ ...prev, long: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-indigo-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-semibold">{eventData.venue}</p>
              <p className="text-indigo-100">
                Coordinates: {eventData.lat.toFixed(4)}, {eventData.long.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-6">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive Map</p>
            <p className="text-sm text-gray-500">
              Main venue at {eventData.lat.toFixed(4)}, {eventData.long.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Additional Locations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMiniEvents.map((event) => (
              <div key={event._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">
                      {event.lat.toFixed(4)}, {event.long.toFixed(4)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};