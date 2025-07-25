import React, { useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Info, Gamepad2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockMiniEvents, mockEvent } from '../../data/mockData';
import { MiniEvent } from '../../types';

export const EventsView: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockMiniEvents);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MiniEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat: 0,
    long: 0,
    type: 'info' as 'info' | 'game',
    gameOptions: ''
  });
  const [participation, setParticipation] = useState<{[key: string]: { status: string, game?: string }}>({});

  const handleEdit = (event: MiniEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      lat: event.lat,
      long: event.long,
      type: event.type,
      gameOptions: event.gameOptions || ''
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      lat: 40.7128,
      long: -74.0060,
      type: 'info',
      gameOptions: ''
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: MiniEvent = {
      _id: editingEvent?._id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      lat: formData.lat,
      long: formData.long,
      type: formData.type,
      gameOptions: formData.type === 'game' ? formData.gameOptions : undefined
    };

    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event._id === editingEvent._id ? newEvent : event
      ));
    } else {
      setEvents(prev => [...prev, newEvent]);
    }
    
    setIsEditing(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event._id !== id));
  };

  const handleParticipation = (eventId: string, status: 'Interested' | 'Not Interested', game?: string) => {
    setParticipation(prev => ({
      ...prev,
      [eventId]: { status, game }
    }));
  };

  if (!mockEvent.showEvents && !user?.isAdmin) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Events Coming Soon</h2>
          <p className="text-gray-500">Stay tuned for exciting event activities!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mini Events & Activities</h1>
          {user?.isAdmin && (
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.type === 'game' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {event.type === 'game' ? (
                      <Gamepad2 className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{event.lat.toFixed(4)}, {event.long.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{event.description}</p>

              {event.type === 'game' && event.gameOptions && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Games:</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.gameOptions.split(',').map((game, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {game.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!user?.isAdmin && (
                <div className="space-y-3">
                  {!participation[event._id] ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleParticipation(event._id, 'Interested')}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Interested
                      </button>
                      <button
                        onClick={() => handleParticipation(event._id, 'Not Interested')}
                        className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        Not Interested
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Status: {participation[event._id].status}
                      </p>
                      {event.type === 'game' && participation[event._id].status === 'Interested' && event.gameOptions && (
                        <select
                          value={participation[event._id].game || ''}
                          onChange={(e) => handleParticipation(event._id, 'Interested', e.target.value)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="">Select a game</option>
                          {event.gameOptions.split(',').map((game, index) => (
                            <option key={index} value={game.trim()}>{game.trim()}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.long}
                    onChange={(e) => setFormData(prev => ({ ...prev, long: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'info' | 'game' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="info">Information</option>
                  <option value="game">Game</option>
                </select>
              </div>
              
              {formData.type === 'game' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game Options (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.gameOptions}
                    onChange={(e) => setFormData(prev => ({ ...prev, gameOptions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Trivia, Charades, Musical Chairs"
                  />
                </div>
              )}
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingEvent ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};