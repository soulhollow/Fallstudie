import axios from 'axios';

class AdminApiService {
    constructor() {
        const token = localStorage.getItem('token');  // Hole den Token aus dem localStorage

        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api/admin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',  // Setze den Header, wenn ein Token vorhanden ist
            },
        });
    }

    // Benutzer erstellen
    createUser(user) {
        return this.apiClient.post('/users', user);
    }

    // Rolle zuweisen
    assignRole(userId, roleName) {
        return this.apiClient.post(`/users/${userId}/roles`, roleName);
    }

    // Weitere Admin APIs können hier hinzugefügt werden
}

const adminApiServiceInstance = new AdminApiService();
export default adminApiServiceInstance;
