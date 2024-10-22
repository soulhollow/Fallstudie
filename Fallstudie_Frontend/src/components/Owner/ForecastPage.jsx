import React, { useEffect, useState } from 'react';
import ApiService from '../../Service/ApiService'; // Stellen Sie sicher, dass der Pfad korrekt ist
import ForecastForm from './ForecastForm';
import ForecastTable from './ForecastTable';
import LoadingIndicator from './LoadingIndicator';
import SollDTO from '../../DTO/sollDTO';
import './ForecastPage.css';

const ForecastPage = () => {
    const [forecasts, setForecasts] = useState([]);
    const [budgetDetails, setBudgetDetails] = useState(null);
    const [isForecast, setIsForecast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [selectedBudgetName, setSelectedBudgetName] = useState('');

    // Zusätzliche State-Variablen für die Bearbeitung
    const [editingForecast, setEditingForecast] = useState(null);
    const [forecastName, setForecastName] = useState('');
    const [forecastBetrag, setForecastBetrag] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserAndBudgets = async () => {
            try {
                setLoading(true);
                // Aktuellen Benutzer abrufen
                const user = await ApiService.getCurrentUser();
                setCurrentUser(user);

                // Budgets des Benutzers abrufen
                let userBudgets = await ApiService.getBudgetsByOwner(user.id);
                if (userBudgets.length === 0) {
                    setError('Keine Budgets gefunden.');
                }

                // Nur Budgets mit forecast = true speichern
                userBudgets = userBudgets.filter((budget) => budget.forecast === true);
                setBudgets(userBudgets);

                // Optional: Automatisch das erste Budget auswählen, falls vorhanden
                if (userBudgets.length > 0) {
                    setSelectedBudgetName(userBudgets[0].name);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Fehler beim Laden der Benutzer- oder Budgetdaten.');
                setLoading(false);
            }
        };

        fetchUserAndBudgets();
    }, []);

    useEffect(() => {
        const fetchBudgetDetails = async () => {
            if (!selectedBudgetName) {
                setBudgetDetails(null);
                setForecasts([]);
                setIsForecast(false);
                return;
            }

            try {
                setLoading(true);
                // Budgetdetails abrufen anhand des Namens
                const budget = await ApiService.getBudgetByName(selectedBudgetName);
                setBudgetDetails(budget);
                setIsForecast(budget.forecast || false);

                if (budget.forecast) {
                    const solls = await ApiService.getSollByBudget(budget.id);
                    setForecasts(solls);
                } else {
                    setForecasts([]);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Fehler beim Laden der Budgetdetails.');
                setLoading(false);
            }
        };

        fetchBudgetDetails();
    }, [selectedBudgetName]);

    const formatDate = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const handleAddForecast = async (data) => {
        if (!budgetDetails || !currentUser) {
            setError('Budget oder Benutzerinformationen fehlen.');
            return;
        }

        try {
            setLoading(true);
            const newSoll = new SollDTO(
                null, // ID wird vom Backend generiert
                data.name,
                data.betrag,
                formatDate(new Date()),
                budgetDetails.id,
                currentUser.id // Tatsächliche Benutzer-ID
            );
            const createdSoll = await ApiService.createSoll(newSoll);
            setForecasts([...forecasts, createdSoll]);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Fehler beim Hinzufügen des Forecasts.');
            setLoading(false);
        }
    };

    // Implementierung der Bearbeitungslogik
    const handleEditForecast = (forecast) => {
        setEditingForecast(forecast);
        setForecastName(forecast.name);
        setForecastBetrag(forecast.betrag);
        setErrorMessage('');
    };

    const handleUpdateForecast = async () => {
        if (!forecastName.trim()) {
            setErrorMessage('Name ist erforderlich.');
            return;
        }
        if (!forecastBetrag || isNaN(forecastBetrag) || Number(forecastBetrag) <= 0) {
            setErrorMessage('Bitte einen gültigen Betrag eingeben.');
            return;
        }

        // Optional: Überprüfen, ob der Forecast-Name eindeutig ist
        const isForecastNameUnique = (name) => {
            return !forecasts.some(
                (f) => f.name === name && f.id !== editingForecast.id
            );
        };

        if (!isForecastNameUnique(forecastName)) {
            setErrorMessage(`Der Forecast-Name "${forecastName}" existiert bereits in diesem Budget.`);
            return;
        }

        try {
            setLoading(true);
            const updatedForecast = {
                ...editingForecast,
                name: forecastName,
                betrag: parseFloat(forecastBetrag),
                timestamp: formatDate(new Date()),
                // budgetId und userId bleiben gleich
            };
            await ApiService.updateSoll(editingForecast.id, updatedForecast);
            // Aktualisierte Forecasts abrufen
            const solls = await ApiService.getSollByBudget(budgetDetails.id);
            setForecasts(solls);
            // Bearbeitungsmodus beenden
            setEditingForecast(null);
            setForecastName('');
            setForecastBetrag('');
            setErrorMessage('');
            setLoading(false);
        } catch (err) {
            console.error(err);
            setErrorMessage('Fehler beim Aktualisieren des Forecasts.');
            setLoading(false);
        }
    };

    const toggleForecastMode = async () => {
        if (!budgetDetails) return;

        try {
            setLoading(true);
            // Aktualisieren des Forecast-Modus
            const updatedBudget = { ...budgetDetails, forecast: !isForecast };
            await ApiService.updateBudget(updatedBudget.id, updatedBudget);
            setIsForecast(!isForecast);
            if (!isForecast) {
                const solls = await ApiService.getSollByBudget(budgetDetails.id);
                setForecasts(solls);
            } else {
                setForecasts([]);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Fehler beim Aktualisieren des Forecast-Modus.');
            setLoading(false);
        }
    };

    const handleBudgetChange = (e) => {
        setSelectedBudgetName(e.target.value);
        // Optionale: Sie können den Forecast-Modus hier nicht umschalten, da der ausgewählte Budget-Name geändert wird
        // toggleForecastMode();
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div className="forecast-page">
            <h1>Forecast-Verwaltung</h1>
            {error && <p className="error">{error}</p>}

            <div className="budget-selector">
                <label htmlFor="budgetSelect">Budget auswählen:</label>
                <select
                    id="budgetSelect"
                    value={selectedBudgetName}
                    onChange={handleBudgetChange}>
                    {budgets.map((budget) => (
                        <option key={budget.id} value={budget.name}>
                            {budget.name}
                        </option>
                    ))}
                </select>
            </div>

            {budgetDetails && (
                <>
                    {isForecast && <ForecastForm onAdd={handleAddForecast} />}
                    <ForecastTable forecasts={forecasts} onEdit={handleEditForecast} />
                </>
            )}

            {/* Bearbeitungsformular */}
            {editingForecast && (
                <div className="forecast-edit-form">
                    <h2>Forecast bearbeiten</h2>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateForecast(); }}>
                        <div>
                            <label htmlFor="forecastName">Name:</label>
                            <input
                                type="text"
                                id="forecastName"
                                value={forecastName}
                                onChange={(e) => setForecastName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="forecastBetrag">Betrag (€):</label>
                            <input
                                type="number"
                                id="forecastBetrag"
                                value={forecastBetrag}
                                onChange={(e) => setForecastBetrag(e.target.value)}
                            />
                        </div>
                        <button type="submit">Speichern</button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingForecast(null);
                                setForecastName('');
                                setForecastBetrag('');
                                setErrorMessage('');
                            }}
                        >
                            Abbrechen
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

};

export default ForecastPage;
