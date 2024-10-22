import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import './CreateSoll.css';
 
const CreateSoll = () => {
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [sollName, setSollName] = useState('');
    const [sollBetrag, setSollBetrag] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [editingSoll, setEditingSoll] = useState(null); // Neu: für die Bearbeitung
    const [errorMessage, setErrorMessage] = useState(''); // Neu: Fehlernachricht für doppelte Namen
 
    const formatDate = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
 
    useEffect(() => {
        fetchCurrentUser();
    }, []);
 
    useEffect(() => {
        if (currentUser) {
            fetchBudgets();
        }
    }, [currentUser]);
 
    const fetchCurrentUser = async () => {
        try {
            const user = await ApiService.getCurrentUser();
            setCurrentUser(user);
            console.log('Aktueller Benutzer:', user);
        } catch (error) {
            console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
        }
    };
 
    const fetchBudgets = async () => {
        try {
            if (currentUser) {
                const response = await ApiService.getBudgetsByFinance(currentUser.id);
                setBudgets(response || []);
                console.log('Budgets:', response);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Budgets:', error);
            setBudgets([]);
        }
    };
    
 
    // Neu: Überprüfen, ob der Soll-Name eindeutig ist
    const isSollNameUnique = (name) => {
        const currentBudget = budgets.find(budget => budget.id === selectedBudget);
        if (!currentBudget || !currentBudget.sollEntries) return true;
        return !currentBudget.sollEntries.some(soll => soll.name.toLowerCase() === name.toLowerCase());
    };
 
    const handleCreateSoll = async (budgetId) => {
        if (!isSollNameUnique(sollName)) {
            setErrorMessage(`Der Soll-Name "${sollName}" existiert bereits in diesem Budget.`);
            return;
        }
 
        try {
            const sollDTO = {
                name: sollName,
                betrag: parseFloat(sollBetrag),
                budgetId: budgetId,
                userId: currentUser.id,
                timestamp: formatDate(new Date()),
            };
            await ApiService.createSoll(sollDTO);
            fetchBudgets();
            setSelectedBudget(null);
            setSollName('');
            setSollBetrag('');
            setErrorMessage(''); // Fehlernachricht zurücksetzen
        } catch (error) {
            console.error('Fehler beim Erstellen des Soll-Werts:', error);
            if (error.response) {
                console.error('Antwort vom Server:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Keine Antwort erhalten:', error.request);
            } else {
                console.error('Fehler beim Aufsetzen der Anfrage:', error.message);
            }
        }
    };
 
    // Neu: Bearbeiten des Soll-Werts aktivieren
    const handleEditSoll = (soll) => {
        setEditingSoll(soll);
        setSollName(soll.name);
        setSollBetrag(soll.betrag);
    };
 
    // Neu: Bearbeiten eines Soll-Werts speichern
    const handleUpdateSoll = async () => {
        if (!isSollNameUnique(sollName) && editingSoll.name !== sollName) {
            setErrorMessage(`Der Soll-Wert "${sollName}" existiert bereits in diesem Budget.`);
            return;
        }
 
        try {
            const updatedSoll = {
                name: sollName,
                betrag: parseFloat(sollBetrag),
                budgetId: selectedBudget,
                userId: currentUser.id,
            };
            await ApiService.updateSoll(editingSoll.id, updatedSoll);
            fetchBudgets();
            setEditingSoll(null); // Bearbeitungsmodus beenden
            setSollName('');
            setSollBetrag('');
            setErrorMessage(''); // Fehlernachricht zurücksetzen
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Soll-Werts:', error);
        }
    };
 
    const toggleBudgetDetails = async (budgetId) => {
        const updatedBudgets = await Promise.all(budgets.map(async (budget) => {
            if (budget.id === budgetId) {
                const showDetails = !budget.showDetails;
                let sollEntries = [];
                if (showDetails) {
                    sollEntries = await ApiService.getSollByBudget(budgetId);
                }
                return { ...budget, showDetails, sollEntries };
            }
            return budget;
        }));
        setBudgets(updatedBudgets);
    };
 
    const currentBudget = budgets.find(budget => budget.id === selectedBudget) || {};
 
    return (
        <div className="finance-budget-list">
            <h2>Budgetliste für Finance</h2>
            <ul className="budget-list">
                {budgets && budgets.length > 0 ? (
                    budgets.map(budget => (
                        <React.Fragment key={budget.id}>
                            <li className="budget-item" onClick={() => toggleBudgetDetails(budget.id)}>
                                <span className="budget-name">{budget.name}</span>
                                <span className="budget-amount">
                                    Verfügbares Budget: {budget.availableBudget}
                                    <React.Suspense fallback={<span> (Lade...)</span>}>
                                        <AvailableBudget budget={budget} />
                                    </React.Suspense>
                                </span>
                                <button className="create-soll-button" onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBudget(budget.id);
                                }}>
                                    Soll-Wert erstellen
                                </button>
                            </li>
                            {budget.showDetails && (
                                <div className="budget-details">
                                    <h4>Soll-Werte:</h4>
                                    {budget.sollEntries && budget.sollEntries.length > 0 ? (
                                        budget.sollEntries.map(soll => (
                                            <div key={soll.id} className="soll-entry">
                                                {editingSoll && editingSoll.id === soll.id ? (
                                                    // Formular für Bearbeitung
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={sollName}
                                                            onChange={(e) => setSollName(e.target.value)}
                                                            placeholder="Soll-Name"
                                                            className="soll-input"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={sollBetrag}
                                                            onChange={(e) => setSollBetrag(e.target.value)}
                                                            placeholder="Betrag"
                                                            className="soll-input"
                                                        />
                                                        <button onClick={handleUpdateSoll}>Speichern</button>
                                                        <button onClick={() => setEditingSoll(null)}>Abbrechen</button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {soll.name} - {soll.betrag}
                                                        <button onClick={() => handleEditSoll(soll)}>Bearbeiten</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div>Keine Soll-Werte vorhanden.</div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <li>Keine Budgets verfügbar.</li>
                )}
            </ul>
            {selectedBudget && !editingSoll && (
                <div className="create-soll-form">
                    <h3>Neuen Soll-Wert erstellen für {currentBudget.name}</h3>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Neu: Fehlernachricht anzeigen */}
                    <input
                        type="text"
                        value={sollName}
                        onChange={(e) => setSollName(e.target.value)}
                        placeholder="Soll-Name"
                        className="soll-input"
                    />
                    <input
                        type="number"
                        value={sollBetrag}
                        onChange={(e) => setSollBetrag(e.target.value)}
                        placeholder="Betrag"
                        className="soll-input"
                    />
                    <button className="save-soll-button" onClick={() => handleCreateSoll(selectedBudget)}>
                        Soll-Wert speichern
                    </button>
                </div>
            )}
        </div>
    );
};
 
const AvailableBudget = ({ budget }) => {
    const [availableBudget, setAvailableBudget] = useState(null);
 
    useEffect(() => {
        const fetchAvailableBudget = async () => {
            const calculatedBudget = await calculateAvailableBudget(budget);
            setAvailableBudget(calculatedBudget);
        };
        fetchAvailableBudget();
    }, [budget]);
 
    return availableBudget !== null ? <span> ({availableBudget})</span> : null;
};
 
const calculateAvailableBudget = async (budget) => {
    try {
        const sollEntries = await ApiService.getSollByBudget(budget.id);
        const totalSoll = sollEntries.reduce((sum, soll) => sum + soll.betrag, 0);
        return budget.availableBudget - totalSoll;
    } catch (error) {
        console.error('Fehler beim Abrufen der Soll-Einträge:', error);
        return budget.availableBudget;
    }
};
 
export default CreateSoll;
 