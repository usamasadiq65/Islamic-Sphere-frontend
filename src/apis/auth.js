import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/auth`;

console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const AuthService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if token is valid
  checkToken: async () => {
    try {
      const response = await api.get('/check-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      // Create form data to properly handle image
      const response = await api.put('/profile', {
        ...profileData,
        // Ensure image is explicitly set to null if deleted
        image: profileData.image || null
      });

      // Update local storage only if we get valid user data back
      if (response.data?.data?.user) {
        // Update the stored user data
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      // Improved error handling
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error('Failed to update profile');
    }
  },



  // Forgot password - request reset code
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password with code and new password
  resetPassword: async ({ resetCode, password, confirmPassword }) => {
    try {
      const response = await api.post('/reset-password', {
        resetCode,
        password,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear any stored reset emails
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('userEmail');
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  },

  // Get current user data
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Verify Email
  verifyEmail: async ({ email, verificationCode }) => {
    try {
      const response = await api.post('/verify-email', {
        email,
        verificationCode
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend verification code
  resendVerificationCode: async (email) => {
    try {
      const response = await api.post('/resend-verification-code', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change Password
  changePassword: async ({ currentPassword, newPassword, confirmNewPassword }) => {
    try {
      const response = await api.post('/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add Secondary Email
  addSecondaryEmail: async (email) => {
    try {
      const response = await api.post('/secondary-email', { email });
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Secondary Email
  verifySecondaryEmail: async ({ email, verificationCode }) => {
    try {
      const response = await api.post('/secondary-email/verify', {
        email,
        verificationCode
      });
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove Secondary Email
  removeSecondaryEmail: async (email) => {
    try {
      const response = await api.delete('/secondary-email', { data: { email } });
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend Secondary Email Verification Code
  resendSecondaryEmailCode: async (email) => {
    try {
      const response = await api.post('/secondary-email/resend-code', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send Phone Verification Code
  sendPhoneVerificationCode: async (phone, countryCode) => {
    try {
      const response = await api.post('/phone/send-code', { phone, countryCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Phone Number
  verifyPhoneNumber: async (verificationCode) => {
    try {
      const response = await api.post('/phone/verify', { verificationCode });
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove Phone Number
  removePhoneNumber: async () => {
    try {
      const response = await api.delete('/phone');
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default AuthService;
