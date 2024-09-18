import axios from 'axios';

class FinanceApiService {
    constructor() {
        const token = localStorage.getItem('token');  // Hole den Token aus dem localStorage

        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api/finance',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',  // Setze den Header, wenn ein Token vorhanden ist
            },
        });
    }

    // Budget APIs
    createBudget(budget) {
        return this.apiClient.post('/budgets', budget);
    }

    approveBudget(id) {
        return this.apiClient.post(`/budgets/${id}/approve`);
    }

    getBudgetComparison() {
        return this.apiClient.get('/budgets/compare');
    }

    // Weitere Finance APIs können hier hinzugefügt werden
}

const financeApiServiceInstance = new FinanceApiService();
export default financeApiServiceInstance;
