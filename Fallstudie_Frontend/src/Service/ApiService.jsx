import axios from 'axios';

class ApiService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api', // Die API-Base-URL
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor zum Setzen des Authorization-Headers
        this.apiClient.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token'); // Token aus dem LocalStorage
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`; // Setze den Token im Header
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    // Authentifizierung (Login)
    async login(loginRequest) {
        const response = await this.apiClient.post('/auth/login', loginRequest);
        return response.data;
    }

    // Benutzer erstellen
    async createNewUser(userDTO) {
        const response = await this.apiClient.post('/admin/users', userDTO);
        return response.data;
    }

    // Alle Benutzer abrufen
    async getAllUsers() {
        const response = await this.apiClient.get('/admin/users');
        return response.data;
    }

    // Benutzer per ID abrufen
    async getUserById(id) {
        const response = await this.apiClient.get(`/admin/users/${id}`);
        return response.data;
    }

    // Benutzer aktualisieren
    async updateUser(id, userDTO) {
        const response = await this.apiClient.put(`/admin/users/${id}`, userDTO);
        return response.data;
    }

    // Aktuellen Benutzer per Token abrufen
    async getCurrentUser() {
        const response = await this.apiClient.get('/admin/users/current');
        return response.data;
    }

    // Benutzer per E-Mail abrufen
    async getUserByEmail(email) {
        const response = await this.apiClient.get(`/admin/users/email?email=${email}`);
        return response.data;
    }

    // Alle Audit-Logs abrufen
    async getAllAuditLogs() {
        const response = await this.apiClient.get('/audit');
        return response.data;
    }

    // Budgets abrufen (Finance)
    async getBudgetsByFinance(userId) {
        const response = await this.apiClient.get(`/budgets/finance/${userId}`);
        return response.data;
    }

    // Budget aktualisieren
    async updateBudget(id, budgetDetailsDTO) {
        const response = await this.apiClient.put(`/budgets/${id}`, budgetDetailsDTO);
        return response.data;
    }

    // Neues Budget erstellen
    async createBudget(budgetDetailsDTO) {
        const response = await this.apiClient.post('/budgets', budgetDetailsDTO);
        return response.data;
    }

    // Budgets abrufen (Manager)
    async getBudgetsByManager(managerId) {
        const response = await this.apiClient.get(`/budgets/manager/${managerId}`);
        return response.data;
    }

    // Budgets abrufen (Owner)
    async getBudgetsByOwner(ownerId) {
        const response = await this.apiClient.get(`/budgets/owner/${ownerId}`);
        return response.data;
    }

    // Budget per Name abrufen
    async getBudgetByName(name) {
        const response = await this.apiClient.get(`/budgets/name/${name}`);
        return response.data;
    }

    // Alle Budgets abrufen
    async getAllBudgets() {
        const response = await this.apiClient.get('/budgets');
        return response.data;
    }

    // Budget genehmigen
    async approveBudget(id, managerId) {
        const response = await this.apiClient.put(`/budgets/${id}/approve`, null, { params: { managerId } });
        return response.data;
    }

    // Ist-Daten erstellen
    async createIst(istDTO) {
        const response = await this.apiClient.post('/ist', istDTO);
        return response.data;
    }

    // Ist-Daten aktualisieren
    async updateIst(id, istDetails) {
        const response = await this.apiClient.put(`/ist/${id}`, istDetails);
        return response.data;
    }

    // Ist-Daten per Budget abrufen
    async getIstByBudget(budgetId) {
        const response = await this.apiClient.get(`/ist/budget/${budgetId}`);
        return response.data;
    }

    // Soll-Daten erstellen
    async createSoll(sollDTO) {
        const response = await this.apiClient.post('/soll', sollDTO);
        return response.data;
    }

    // Soll-Daten aktualisieren
    async updateSoll(id, sollDetails) {
        const response = await this.apiClient.put(`/soll/${id}`, sollDetails);
        return response.data;
    }

    // Soll-Daten per Budget abrufen
    async getSollByBudget(budgetId) {
        const response = await this.apiClient.get(`/soll/budget/${budgetId}`);
        return response.data;
    }
}

// Exportiere eine neue Instanz des ApiService
export default new ApiService();
