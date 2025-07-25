import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, Edit3, Trash2, Shirt } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAPI } from '../../data/mockDatabase';
import { Schedule } from '../../types';

export const ScheduleView: React.FC = () => {
  const { user } = useAuth();
  const [scheduleItems, setScheduleItems] = useState<Schedule[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    venue: '',
    dressCode: ''
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [scheduleData, eventData] = await Promise.all([
          mockAPI.getAllSchedules(),
          mockAPI.getEvent()
        ]);
        setScheduleItems(scheduleData);
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (item: Schedule) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      dateTime: new Date(item.dateTime).toISOString().slice(0, 16),
      venue: item.venue,
      dressCode: item.dressCode || ''
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      dateTime: '',
      venue: '',
      dressCode: ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const updatedItem = await mockAPI.updateSchedule(editingItem._id, {
          title: formData.title,
          dateTime: new Date(formData.dateTime),
          venue: formData.venue,
          dressCode: formData.dressCode || undefined
        });
        if (updatedItem) {
          setScheduleItems(prev => prev.map(item => 
            item._id === editingItem._id ? updatedItem : item
          ));
        }
      } else {
        const newItem = await mockAPI.createSchedule({
          title: formData.title,
          dateTime: new Date(formData.dateTime),
          venue: formData.venue,
          dressCode: formData.dressCode || undefined
        });
        setScheduleItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error saving schedule item:', error);
    }
    
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteSchedule(id);
      setScheduleItems(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event?.showSchedule && !user?.isAdmin) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Schedule Coming Soon</h2>
          <p className="text-gray-500">Stay tuned for event schedule updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
          {user?.isAdmin && (
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule Item</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {scheduleItems.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).map((item) => (
            <div key={item._id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>{formatDateTime(item.dateTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>{item.venue}</span>
                    </div>
                    {item.dressCode && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Shirt className="w-4 h-4 text-indigo-600" />
                        <span>Dress Code: {item.dressCode}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {user?.isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Schedule Item' : 'Add Schedule Item'}
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
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dress Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.dressCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, dressCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Formal, Casual, etc."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'}
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