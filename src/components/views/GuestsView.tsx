import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAPI } from '../../data/mockDatabase';
import { Guest } from '../../types';

export const GuestsView: React.FC = () => {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: ''
  });

  React.useEffect(() => {
    const loadGuests = async () => {
      if (!user) return;
      
      try {
        const guestsData = await mockAPI.getGuestsByUser(user._id);
        setGuests(guestsData);
      } catch (error) {
        console.error('Error loading guests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuests();
  }, [user]);

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      relation: guest.relation,
      phone: guest.phone || ''
    });
    setIsEditing(true);
  };

  const handleAdd = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      relation: '',
      phone: ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      if (editingGuest) {
        const updatedGuest = await mockAPI.updateGuest(editingGuest._id, {
          name: formData.name,
          relation: formData.relation,
          phone: formData.phone || undefined
        });
        if (updatedGuest) {
          setGuests(prev => prev.map(guest => 
            guest._id === editingGuest._id ? updatedGuest : guest
          ));
        }
      } else {
        const newGuest = await mockAPI.createGuest({
          userId: user._id,
          name: formData.name,
          relation: formData.relation,
          phone: formData.phone || undefined
        });
        setGuests(prev => [...prev, newGuest]);
      }
    } catch (error) {
      console.error('Error saving guest:', error);
    }
    
    setIsEditing(false);
    setEditingGuest(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteGuest(id);
      setGuests(prev => prev.filter(guest => guest._id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Guests</h1>
            <p className="text-gray-600">Manage your +1s and accompanying guests</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>

        {guests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guests added yet</h3>
            <p className="text-gray-500 mb-6">Add your accompanying guests to help us plan better</p>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Your First Guest
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {guests.map((guest) => (
              <div key={guest._id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{guest.name}</h3>
                      <p className="text-purple-600 font-medium">{guest.relation}</p>
                      {guest.phone && (
                        <div className="flex items-center space-x-2 mt-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{guest.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(guest)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(guest._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingGuest ? 'Edit Guest' : 'Add Guest'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
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
                  Relationship
                </label>
                <select
                  value={formData.relation}
                  onChange={(e) => setFormData(prev => ({ ...prev, relation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1234567890"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingGuest ? 'Update' : 'Add'}
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