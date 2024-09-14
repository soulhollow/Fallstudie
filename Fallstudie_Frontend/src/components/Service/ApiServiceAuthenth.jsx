import axios from 'axios';

class AuthApiService {
    constructor() {
        const token = localStorage.getItem('token');  // Hole den Token aus dem localStorage

        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',  // Setze den Header, wenn ein Token vorhanden ist
            },
        });
    }

    // Login-Endpunkt
    login(loginRequest) {
        return this.apiClient.post('/login', loginRequest).then(response => {
            const token = response.data.token;  // Angenommen, der Token wird im Response zurückgegeben
            if (token) {
                localStorage.setItem('token', token);  // Speichere den Token im localStorage
            }
            return response;
        });
    }

    // Logout-Endpunkt
    logout() {
        return this.apiClient.post('/logout').then(response => {
            localStorage.removeItem('token');  // Entferne den Token beim Logout
            return response;
        });
    }
}

const authApiServiceInstance = new AuthApiService();
export default authApiServiceInstance;
