const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Auth endpoints
  async login(identifier: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  }

  async verifyOTP(userId: string, otp: string) {
    const response = await this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, otp }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // User endpoints
  async getAllUsers() {
    return this.request('/users');
  }

  async updateProfile(updates: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async toggleVerification(userId: string) {
    return this.request(`/users/${userId}/verify`, {
      method: 'PATCH',
    });
  }

  // Event endpoints
  async getEvent() {
    return this.request('/events');
  }

  async updateEvent(updates: any) {
    return this.request('/events', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Schedule endpoints
  async getAllSchedules() {
    return this.request('/schedule');
  }

  async createSchedule(scheduleData: any) {
    return this.request('/schedule', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(scheduleId: string, updates: any) {
    return this.request(`/schedule/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSchedule(scheduleId: string) {
    return this.request(`/schedule/${scheduleId}`, {
      method: 'DELETE',
    });
  }

  // Mini Events endpoints
  async getAllMiniEvents() {
    return this.request('/mini-events');
  }

  async createMiniEvent(eventData: any) {
    return this.request('/mini-events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateMiniEvent(eventId: string, updates: any) {
    return this.request(`/mini-events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMiniEvent(eventId: string) {
    return this.request(`/mini-events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Guest endpoints
  async getGuests() {
    return this.request('/guests');
  }

  async createGuest(guestData: any) {
    return this.request('/guests', {
      method: 'POST',
      body: JSON.stringify(guestData),
    });
  }

  async updateGuest(guestId: string, updates: any) {
    return this.request(`/guests/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGuest(guestId: string) {
    return this.request(`/guests/${guestId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();