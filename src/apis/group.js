import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/groups`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const GroupService = {
  // Create a new group
  createGroup: async (groupData) => {
    try {
      const response = await api.post('/create', groupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's groups
  getUserGroups: async () => {
    try {
      const response = await api.get('/user-groups');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get group details
  getGroupDetails: async (groupId) => {
    try {
      const response = await api.get(`/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update group details
  updateGroupDetails: async (groupId, updateData) => {
    try {
      const response = await api.put(`/${groupId}`, {
        ...updateData,
        // Ensure image field is included even if null
        image: updateData.image || null
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete group
  deleteGroup: async (groupId) => {
    try {
      const response = await api.delete(`/${groupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Group actions (add/remove members, leave group)
  groupActions: async (groupId, action, data = {}) => {
    try {
      const response = await api.post(`/${groupId}/actions`, {
        action,
        groupId,
        ...data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Task operations
  addTask: async (groupId, taskData) => {
    try {
      // Ensure date is properly formatted
      if (taskData.deadline) {
        // No need to format if it's already in ISO format from datetime-local
      }

      console.log('Sending task data:', JSON.stringify(taskData)); // Debug

      const response = await api.post(`/${groupId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Add task error:', error.response || error);
      throw error.response?.data || error.message;
    }
  },

  deleteTask: async (groupId, taskId) => {
    try {
      const response = await api.delete(`/${groupId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  taskActions: async (groupId, taskId, action, data = {}) => {
    try {
      // Make sure action is valid (complete, uncomplete, etc.)
      if (!['complete', 'uncomplete', 'assign'].includes(action)) {
        throw new Error('Invalid task action');
      }

      const response = await api.post(`/${groupId}/tasks/${taskId}/actions`, {
        action,
        ...data
      });

      return response.data;
    } catch (error) {
      console.error('Task action error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Poll operations
  addPoll: async (groupId, pollData) => {
    try {
      const response = await api.post(`/${groupId}/polls`, pollData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePoll: async (groupId, pollId) => {
    try {
      const response = await api.delete(`/${groupId}/polls/${pollId}`);
      return response.data;
    } catch (error) {
      console.error('Delete poll error:', error);
      throw error.response?.data || error.message;
    }
  },

  pollActions: async (groupId, pollId, action, data = {}) => {
    try {
      const response = await api.post(`/${groupId}/polls/${pollId}/actions`, {
        action,
        ...data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  votePoll: async (groupId, pollId, optionId) => {
    try {
      const response = await api.post(`/${groupId}/polls/${pollId}/vote`, { optionId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add this function to handle progress visibility toggling
  togglePrivacySettings: async (groupId) => {
    try {
      const response = await api.post(`/groups/${groupId}/toggle-privacy`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // ============== USER TASK LIST FUNCTIONS ==============
  
  // Get user's personal task list
  getUserTaskList: async () => {
    try {
      const response = await api.get('/user-task-list');
      return response.data;
    } catch (error) {
      console.error('Get user task list error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Add task to user's personal task list
  addToUserTaskList: async (taskData) => {
    try {
      const response = await api.post('/user-task-list', taskData);
      return response.data;
    } catch (error) {
      console.error('Add to user task list error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Remove task from user's personal task list
  removeFromUserTaskList: async (taskId) => {
    try {
      const response = await api.delete(`/user-task-list/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from user task list error:', error);
      throw error.response?.data || error.message;
    }
  },

  // ============== PROGRESS HISTORY FUNCTIONS ==============

  // Get user's progress history
  getProgressHistory: async (period = 'all', startDate = null, endDate = null, groupId = null) => {
    try {
      let url = `/progress/history?period=${period}`;
      if (period === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      if (groupId) {
        url += `&groupId=${groupId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get progress history error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get progress summary
  getProgressSummary: async (groupId = null) => {
    try {
      let url = '/progress/summary';
      if (groupId) {
        url += `?groupId=${groupId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get progress summary error:', error);
      throw error.response?.data || error.message;
    }
  },

  // ============== OWNERSHIP MANAGEMENT FUNCTIONS ==============

  // Add owner to group
  addOwner: async (groupId, memberId) => {
    try {
      const response = await api.post(`/${groupId}/owners`, { memberId });
      return response.data;
    } catch (error) {
      console.error('Add owner error:', error);
      throw error.response?.data || error.message;
    }
  },

  // Remove owner from group (demote to regular member)
  removeOwner: async (groupId, memberId) => {
    try {
      const response = await api.delete(`/${groupId}/owners`, { data: { memberId } });
      return response.data;
    } catch (error) {
      console.error('Remove owner error:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default GroupService;
