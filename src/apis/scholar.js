import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/scholars`; // Old scholars collection endpoint (for backward compatibility)
const AUTH_API_URL = `${API_BASE_URL}/auth`; // New endpoint for user-based scholars

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ScholarService = {
  // Get all scholars (users with role 'scholar')
  getScholars: async () => {
    try {
      // Fetch scholars from the new user-based endpoint
      const response = await authApi.get('/scholars');
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholars fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching scholars:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch scholars'
      };
    }
  },
  
  // Get scholar count
  getScholarCount: async () => {
    try {
      const response = await authApi.get('/scholars');
      return response.data.data?.length || 0;
    } catch (error) {
      console.error('Error fetching scholar count:', error);
      return 0;
    }
  },

  // Legacy methods for backward compatibility with old ScholarSession collection
  // Get a scholar by ID (old ScholarSession)
  getScholarById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to fetch scholar'
      };
    }
  },
  // Create a new scholar (old ScholarSession - for admin panel)
  createScholar: async (scholarData) => {
    try {
      const response = await api.post('/', scholarData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar created successfully'
      };
    } catch (error) {
      console.error('Error creating scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to create scholar'
      };
    }
  },
  // Update a scholar (old ScholarSession - for admin panel)
  updateScholar: async (id, scholarData) => {
    try {
      const response = await api.put(`/${id}`, scholarData);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message || 'Scholar updated successfully'
      };
    } catch (error) {
      console.error('Error updating scholar:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Failed to update scholar'
      };
    }
  },
  // Delete a scholar (old ScholarSession - for admin panel)
  deleteScholar: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return {
        success: response.data.success,
        message: response.data.message || 'Scholar deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting scholar:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete scholar'
      };
    }
  }
};

export default ScholarService;
