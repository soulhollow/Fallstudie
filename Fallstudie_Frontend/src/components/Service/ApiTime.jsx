import axios from 'axios';

class TimeTravelApiService {
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

    // Revisionen für ein Budget abrufen
    getBudgetRevisions(budgetId) {
        return this.apiClient.get(`/budgets/${budgetId}/revisions`)
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Fehler weiter werfen, wenn nötig
            });
    }

    // Budget zu einer bestimmten Revision abrufen
    getBudgetAtRevision(budgetId, revisionId) {
        return this.apiClient.get(`/budgets/${budgetId}/revisions/${revisionId}`)
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
                // Ressource nicht gefunden
                alert("Fehler: Die angeforderte Revision oder Budget wurde nicht gefunden. " + message);
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

const timeTravelApiServiceInstance = new TimeTravelApiService();
export default timeTravelApiServiceInstance;
