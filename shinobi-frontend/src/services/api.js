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

  // Upload file (multipart/form-data)
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      method: 'POST',
      headers: {},
      body: formData,
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
      console.error(`API upload failed: ${endpoint}`, error);
      throw error;
    }
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
  async reorderClasses(classesWithOrders) {
    const response = await this.post('/classes/reorder', { classes: classesWithOrders });
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

  // Reset schedule to provided state
  async resetSchedule(weeklySchedule) {
    const response = await this.post('/schedule/reset', { weeklySchedule });
    return response.data;
  }
}

// Coaches API
export class CoachesAPI extends ApiService {
  async getCoaches() {
    const response = await this.get('/coaches');
    return response.data;
  }

  async getAdminCoaches() {
    const response = await this.get('/coaches/admin');
    return response.data;
  }

  async createCoach(coachData) {
    const response = await this.post('/coaches', coachData);
    return response.data;
  }

  async updateCoach(coachId, coachData) {
    const response = await this.put(`/coaches/${coachId}`, coachData);
    return response.data;
  }

  async deleteCoach(coachId) {
    return this.delete(`/coaches/${coachId}`);
  }

  async reorderCoaches(coachIds) {
    const response = await this.put('/coaches/reorder', { coachIds });
    return response.data;
  }

  // Upload coach image
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.uploadFile('/coaches/upload', formData);
  }
}

// Gallery API
export class GalleryAPI extends ApiService {
  // Get all gallery images (public)
  async getGalleryImages(category = null, tags = null, limit = 50) {
    let endpoint = '/gallery';
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (tags) params.append('tags', tags);
    if (limit) params.append('limit', limit);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await this.get(endpoint);
    return response.data || [];
  }

  // Get all gallery images for admin (including inactive)
  async getAdminGalleryImages() {
    const response = await this.get('/gallery/admin');
    return response.data || [];
  }

  // Get available categories
  async getCategories() {
    const response = await this.get('/gallery/categories');
    return response.data || [];
  }

  // Create gallery image
  async createImage(imageData) {
    const response = await this.post('/gallery', imageData);
    return response.data;
  }

  // Update gallery image
  async updateImage(imageId, imageData) {
    const response = await this.put(`/gallery/${imageId}`, imageData);
    return response.data;
  }

  // Delete gallery image
  async deleteImage(imageId) {
    return this.delete(`/gallery/${imageId}`);
  }

  // Reorder gallery images
  async reorderImages(imageIds) {
    console.log('API: Reordering images with IDs:', imageIds);
    const response = await this.put('/gallery/reorder', { imageIds });
    console.log('API: Reorder response:', response);
    return response.data;
  }

  // Upload gallery image
  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.uploadFile('/gallery/upload', formData);
  }
}

// Contact API
export class ContactAPI extends ApiService {
  // Get contact information (public)
  async getContact() {
    const response = await this.get('/contact');
    return response.data;
  }

  // Get contact information for admin (including metadata)
  async getAdminContact() {
    const response = await this.get('/contact/admin');
    return response.data;
  }

  // Update contact information
  async updateContact(contactData) {
    const response = await this.put('/contact', contactData);
    return response.data;
  }


}

// Create singleton instances
export const authAPI = new AuthAPI();
export const classesAPI = new ClassesAPI();
export const scheduleAPI = new ScheduleAPI();
export const coachesAPI = new CoachesAPI();
export const galleryAPI = new GalleryAPI();
export const contactAPI = new ContactAPI();

// Default export
export default ApiService;
