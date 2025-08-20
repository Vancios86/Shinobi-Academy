// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get authentication token
  getAuthToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();

      // Handle authentication errors
      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Authentication failed. Please login again.');
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Authentication API
export class AuthAPI extends ApiService {
  // Login
  async login(username, password) {
    const response = await this.post('/auth/login', { username, password });
    
    if (response.success && response.token) {
      this.setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  // Logout
  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    return this.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Get stored user data
  getStoredUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

// Classes API
export class ClassesAPI extends ApiService {
  // Get all classes (public)
  async getClasses() {
    const response = await this.get('/classes');
    return response.data || [];
  }

  // Get all classes for admin
  async getAdminClasses() {
    const response = await this.get('/classes/admin');
    return response.data || [];
  }

  // Get single class
  async getClass(id) {
    const response = await this.get(`/classes/${id}`);
    return response.data;
  }

  // Create class
  async createClass(classData) {
    const response = await this.post('/classes', classData);
    return response.data;
  }

  // Update class
  async updateClass(id, classData) {
    const response = await this.put(`/classes/${id}`, classData);
    return response.data;
  }

  // Delete class
  async deleteClass(id) {
    return this.delete(`/classes/${id}`);
  }

  // Reorder classes
  async reorderClasses(classIds) {
    const response = await this.post('/classes/reorder', { classIds });
    return response.data || [];
  }
}

// Schedule API
export class ScheduleAPI extends ApiService {
  // Get schedule (public)
  async getSchedule() {
    const response = await this.get('/schedule');
    return response.data;
  }

  // Get full schedule for admin
  async getAdminSchedule() {
    const response = await this.get('/schedule/admin');
    return response.data;
  }

  // Get classes for specific day
  async getDaySchedule(day) {
    const response = await this.get(`/schedule/day/${day}`);
    return response.data || [];
  }

  // Add class to schedule
  async addClassToSchedule(day, classData) {
    const response = await this.post('/schedule/class', { day, ...classData });
    return response.data;
  }

  // Update class in schedule
  async updateClassInSchedule(day, entryId, classData) {
    const response = await this.put(`/schedule/class/${day}/${entryId}`, classData);
    return response.data;
  }

  // Remove class from schedule
  async removeClassFromSchedule(day, entryId) {
    return this.delete(`/schedule/class/${day}/${entryId}`);
  }

  // Update schedule settings
  async updateScheduleSettings(settings) {
    const response = await this.put('/schedule/settings', settings);
    return response.data;
  }
}

// Create singleton instances
export const authAPI = new AuthAPI();
export const classesAPI = new ClassesAPI();
export const scheduleAPI = new ScheduleAPI();

// Default export
export default ApiService;
