import axios from 'axios';

class ApiService {
    constructor() {
        const token = localStorage.getItem('token');

        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });
    }

    // Beispiel für eine GET-Anfrage, die mit Ausnahmebehandlung arbeitet
    getData(endpoint) {
        return this.apiClient.get(endpoint)
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Falls gewünscht, den Fehler weiter werfen
            });
    }

    // Beispiel für eine POST-Anfrage mit Ausnahmebehandlung
    postData(endpoint, data) {
        return this.apiClient.post(endpoint, data)
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Fehler weiter werfen, wenn nötig
            });
    }

    // Fehlerbehandlung
    handleError(error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data;

            if (status === 404) {
                // EntityNotFoundException
                alert("Fehler: Die angeforderte Ressource wurde nicht gefunden. " + message);
            } else if (status === 403) {
                // AccessDeniedException
                alert("Fehler: Zugriff verweigert. " + message);
            } else {
                // Andere Fehler behandeln
                alert("Ein unbekannter Fehler ist aufgetreten: " + message);
            }
        } else {
            // Netzwerkfehler oder andere Probleme
            alert("Ein Netzwerkfehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
    }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
