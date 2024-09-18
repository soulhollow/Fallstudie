import axios from 'axios';

class OwnerApiService {
    constructor() {
        const token = localStorage.getItem('token');  // Hole den Token aus dem localStorage

        this.apiClient = axios.create({
            baseURL: 'https://localhost:8443/api/owner',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',  // Setze den Header, wenn ein Token vorhanden ist
            },
        });
    }

    // Budgets abrufen
    getOwnBudgets() {
        return this.apiClient.get('/budgets')
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Fehler weiter werfen, wenn nötig
            });
    }

    // Ausgaben hinzufügen
    addExpense(expense) {
        return this.apiClient.post('/expenses', expense)
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Fehler weiter werfen, wenn nötig
            });
    }

    // Forecasts hinzufügen
    addForecast(forecast) {
        return this.apiClient.post('/forecasts', forecast)
            .then(response => response.data)
            .catch(error => {
                this.handleError(error);
                throw error;  // Fehler weiter werfen, wenn nötig
            });
    }

    // Forecasts für ein Budget abrufen
    getForecastsByBudget(budgetId) {
        return this.apiClient.get('/forecasts', { params: { budgetId } })
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

            if (status === 403) {
                // Zugriff verweigert
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

const ownerApiServiceInstance = new OwnerApiService();
export default ownerApiServiceInstance;
