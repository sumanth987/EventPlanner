import React, { useState } from 'react';
import { User, Mail, Phone, CheckCircle, XCircle, Clock, Shield, Users } from 'lucide-react';
import { mockAPI } from '../../data/mockDatabase';
import { User as UserType } from '../../types';

export const RSVPList: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await mockAPI.getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const toggleVerification = async (userId: string) => {
    try {
      const updatedUser = await mockAPI.toggleVerification(userId);
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, verified: updatedUser.verified } : user
        ));
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const getStatusIcon = (rsvp: string | null) => {
    switch (rsvp) {
      case 'Accept':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Reject':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusText = (rsvp: string | null) => {
    switch (rsvp) {
      case 'Accept':
        return 'Accepted';
      case 'Reject':
        return 'Declined';
      default:
        return 'Pending';
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
          <h1 className="text-2xl font-bold text-gray-900">RSVP Management</h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Accepted</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Declined</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    {user.isAdmin ? (
                      <Shield className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <User className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      {user.isAdmin && (
                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(user.rsvp)}
                    <span className="text-sm font-medium">{getStatusText(user.rsvp)}</span>
                  </div>
                  
                  <button
                    onClick={() => toggleVerification(user._id)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                      user.verified
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {user.verified ? 'Verified' : 'Unverified'}
                  </button>
                </div>
              </div>

              {user.rsvp === 'Accept' && (user.arrival || user.travelMode) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Travel Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    {user.arrival && (
                      <div>
                        <span className="block text-xs text-gray-500">Arrival</span>
                        <span>{new Date(user.arrival).toLocaleDateString()}</span>
                      </div>
                    )}
                    {user.departure && (
                      <div>
                        <span className="block text-xs text-gray-500">Departure</span>
                        <span>{new Date(user.departure).toLocaleDateString()}</span>
                      </div>
                    )}
                    {user.travelMode && (
                      <div>
                        <span className="block text-xs text-gray-500">Travel Mode</span>
                        <span>{user.travelMode}</span>
                      </div>
                    )}
                    {user.travelNo && (
                      <div>
                        <span className="block text-xs text-gray-500">Travel Number</span>
                        <span>{user.travelNo}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.rsvp === 'Accept').length}
              </p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.rsvp === 'Reject').length}
              </p>
              <p className="text-sm text-gray-600">Declined</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {users.filter(u => u.rsvp === null).length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};