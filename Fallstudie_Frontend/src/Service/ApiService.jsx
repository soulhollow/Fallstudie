import axios from 'axios';

class ApiService {
  static BASE_URL = 'https://api.example.com'; // Grund-URL deiner API

  // User Services
  static async getUsers() {
    try {
      const response = await axios.get(`${this.BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async createUser(user) {
    try {
      const response = await axios.post(`${this.BASE_URL}/users`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(userId, user) {
    try {
      const response = await axios.put(`${this.BASE_URL}/users/${userId}`, user);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Budget Services
  static async getBudgets() {
    try {
      const response = await axios.get(`${this.BASE_URL}/budgets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  static async createBudget(budget) {
    try {
      const response = await axios.post(`${this.BASE_URL}/budgets`, budget);
      return response.data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  static async updateBudget(budgetId, budget) {
    try {
      const response = await axios.put(`${this.BASE_URL}/budgets/${budgetId}`, budget);
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  static async deleteBudget(budgetId) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  static async getPendingBudgets() {
    try {
      const response = await axios.get(`${this.BASE_URL}/budgets?status=pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending budgets:', error);
      throw error;
    }
  }

  static async approveBudget(budgetId) {
    try {
      const response = await axios.put(`${this.BASE_URL}/budgets/${budgetId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving budget:', error);
      throw error;
    }
  }

  static async rejectBudget(budgetId) {
    try {
      const response = await axios.put(`${this.BASE_URL}/budgets/${budgetId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting budget:', error);
      throw error;
    }
  }

  // Owner Services
  static async getOwners() {
    try {
      const response = await axios.get(`${this.BASE_URL}/owners`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owners:', error);
      throw error;
    }
  }

  // Comparison Services
  static async getBudgetComparison(filterParams) {
    try {
      const response = await axios.get(`${this.BASE_URL}/budgets/comparison`, { params: filterParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching budget comparison:', error);
      throw error;
    }
  }

  // Ist Values Services
  static async getIstValues(budgetId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/ist-values?budgetId=${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ist values:', error);
      throw error;
    }
  }

  static async createIstValue(budgetId, istValue) {
    try {
      const response = await axios.post(`${this.BASE_URL}/ist-values`, { budgetId, ...istValue });
      return response.data;
    } catch (error) {
      console.error('Error creating ist value:', error);
      throw error;
    }
  }

  static async updateIstValue(istValueId, istValue) {
    try {
      const response = await axios.put(`${this.BASE_URL}/ist-values/${istValueId}`, istValue);
      return response.data;
    } catch (error) {
      console.error('Error updating ist value:', error);
      throw error;
    }
  }

  static async deleteIstValue(istValueId) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/ist-values/${istValueId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ist value:', error);
      throw error;
    }
  }

  // Forecast Services
  static async getForecasts(budgetId) {
    try {
      const response = await axios.get(`${this.BASE_URL}/forecasts?budgetId=${budgetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching forecasts:', error);
      throw error;
    }
  }

  static async createForecast(budgetId, forecast) {
    try {
      const response = await axios.post(`${this.BASE_URL}/forecasts`, { budgetId, ...forecast });
      return response.data;
    } catch (error) {
      console.error('Error creating forecast:', error);
      throw error;
    }
  }

  static async updateForecast(forecastId, forecast) {
    try {
      const response = await axios.put(`${this.BASE_URL}/forecasts/${forecastId}`, forecast);
      return response.data;
    } catch (error) {
      console.error('Error updating forecast:', error);
      throw error;
    }
  }

  static async deleteForecast(forecastId) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/forecasts/${forecastId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting forecast:', error);
      throw error;
    }
  }

  // Audit Log Services
  static async getAuditLogs(params = {}) {
    try {
      const response = await axios.get(`${this.BASE_URL}/audit-logs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }
}

export default ApiService;
