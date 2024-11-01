import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ApiService from '../../Service/ApiService';
import './CreateIst.css';
 
const CreateIst = () => {
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [istName, setIstName] = useState(null);
    const [istBetrag, setIstBetrag] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [sollOptions, setSollOptions] = useState([]);
    const [editingIst, setEditingIst] = useState(null); // Zum Speichern des bearbeitbaren Ist-Werts
 
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
 
    useEffect(() => {
        const namesSet = new Set();
        budgets.forEach(budget => {
            if (budget.sollEntries) {
                budget.sollEntries.forEach(entry => namesSet.add(entry.name));
            }
        });
        const options = Array.from(namesSet).map(name => ({ value: name, label: name }));
        setSollOptions(options);
    }, [budgets]);
 
    useEffect(() => {
        if (selectedBudget) {
            fetchSollNames(selectedBudget);
        } else {
            setSollOptions([]);
        }
    }, [selectedBudget]);
 
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
                const response = await ApiService.getBudgetsByOwner(currentUser.id);
                setBudgets(response || []);
                console.log('Budgets:', response);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Budgets:', error);
            setBudgets([]);
        }
    };
 
    const fetchSollNames = async (budgetId) => {
        try {
            const sollEntries = await ApiService.getSollByBudget(budgetId);
            const uniqueNames = [...new Set(sollEntries.map(entry => entry.name))];
            const options = uniqueNames.map(name => ({ value: name, label: name }));
            setSollOptions(options);
        } catch (error) {
            console.error('Fehler beim Abrufen der Soll-Einträge:', error);
            setSollOptions([]);
        }
    };
 
    const handleCreateIst = async (budgetId) => {
        if (!istName || !istName.value) {
            alert('Bitte einen Ist-Namen auswählen oder eingeben.');
            return;
        }
        if (!istBetrag || istBetrag <= 0) {
            alert('Bitte einen gültigen Betrag eingeben.');
            return;
        }
 
        try {
            const istDTO = {
                name: istName.value,
                betrag: parseFloat(istBetrag),
                budgetId: budgetId,
                userId: currentUser.id,
                timestamp: formatDate(new Date()),
            };
            await ApiService.createIst(istDTO);
            fetchBudgets();
            setSelectedBudget(null);
            setIstName(null);
            setIstBetrag('');
            setSollOptions([]);
        } catch (error) {
            console.error('Fehler beim Erstellen des Ist-Werts:', error);
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
 
    const handleEditIst = (entry) => {
        setEditingIst(entry); // Aktiviert den Bearbeitungsmodus für den ausgewählten Ist-Wert
        setIstBetrag(entry.istBetrag);
    };
 
    const handleUpdateIst = async () => {
        if (!istBetrag || istBetrag <= 0) {
            alert('Bitte einen gültigen Betrag eingeben.');
            return;
        }
 
        try {
            const istDetails = {
                name: editingIst.name,
                betrag: parseFloat(istBetrag),
                timestamp: formatDate(new Date()),
            };
            await ApiService.updateIst(editingIst.id, istDetails); // Ist-Wert aktualisieren
            setEditingIst(null); // Beendet den Bearbeitungsmodus
            setIstBetrag('');
            fetchBudgets(); // Budgets neu laden
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Ist-Werts:', error);
        }
    };
 
    const toggleBudgetDetails = async (budgetId) => {
        setBudgets(
            await Promise.all(
                budgets.map(async (budget) => {
                    if (budget.id === budgetId) {
                        const showDetails = !budget.showDetails;
                        let sollEntries = [];
                        let istEntries = [];
                        let combinedEntries = [];
                        if (showDetails) {
                            sollEntries = await ApiService.getSollByBudget(budgetId);
                            istEntries = await ApiService.getIstByBudget(budgetId);
                            const names = new Set([
                                ...sollEntries.map(entry => entry.name),
                                ...istEntries.map(entry => entry.name),
                            ]);
 
                            combinedEntries = Array.from(names).map(name => {
                                const soll = sollEntries.find(entry => entry.name === name);
                                const ist = istEntries.find(entry => entry.name === name);
                                return {
                                    id: ist ? ist.id : null, // Die ID des Ist-Werts für die Bearbeitung
                                    name,
                                    sollBetrag: soll ? soll.betrag : 0,
                                    istBetrag: ist ? ist.betrag : 0,
                                };
                            });
                        }
                        return { ...budget, showDetails, combinedEntries };
                    }
                    return budget;
                })
            )
        );
    };
 
    return (
        <div className="create-ist">
            <h2>Ist-Werte für Budgets erstellen</h2>
            <ul className="budget-list">
                {budgets && budgets.length > 0 ? (
                    budgets.map(budget => (
                        <React.Fragment key={budget.id}>
                            <li className="budget-item" onClick={() => toggleBudgetDetails(budget.id)}>
                                <span className="budget-name">{budget.name}</span>
                                <span className="budget-amount">
                                    Verfügbares Budget: {budget.availableBudget}
                                    <AvailableBudget budget={budget} />
                                </span>
                                <button className="create-ist-button" onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBudget(budget.id);
                                }}>
                                    Ist-Wert erstellen
                                </button>
                            </li>
                            {budget.showDetails && (
                                <div className="budget-details">
                                    <h4>Soll- und Ist-Werte:</h4>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Soll Betrag</th>
                                            <th>Ist Betrag</th>
                                            <th>Edit</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {budget.combinedEntries && budget.combinedEntries.length > 0 ? (
                                            budget.combinedEntries.sort((a, b) => a.name.localeCompare(b.name)).map(entry => (
                                                <tr key={entry.name}>
                                                    <td>{entry.name}</td>
                                                    <td>{entry.sollBetrag}</td>
                                                    <td>
                                                        {editingIst && editingIst.name === entry.name ? (
                                                            <input
                                                                type="number"
                                                                value={istBetrag}
                                                                onChange={(e) => setIstBetrag(e.target.value)}
                                                            />
                                                        ) : (
                                                            entry.istBetrag
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingIst && editingIst.name === entry.name ? (
                                                            <button onClick={handleUpdateIst}>Speichern</button>
                                                        ) : (
                                                            entry.istBetrag > 0 && (
                                                                <button
                                                                    onClick={() => handleEditIst(entry)}>Bearbeiten</button>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">Keine Soll- oder Ist-Werte vorhanden</td>
                                            </tr>
                                        )}
                                        </tbody>


                                    </table>
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <li>Keine Budgets verfügbar.</li>
                )}
            </ul>
            {selectedBudget && !editingIst && (
                <div className="create-ist-form">
                    <h3>Neuen Ist-Wert erstellen</h3>
                    <Select
                        value={istName}
                        onChange={setIstName}
                        options={sollOptions}
                        placeholder="Ist-Name"
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                marginBottom: '10px',
                            }),
                            placeholder: (provided) => ({
                                ...provided,
                                color: 'inherit', // This will make the placeholder color inherit from its parent
                            }),
                        }}
                    />
                    <input
                        type="number"
                        value={istBetrag}
                        onChange={(e) => setIstBetrag(e.target.value)}
                        placeholder="Betrag"
                        className="ist-input"
                    />
                    <button className="save-ist-button" onClick={() => handleCreateIst(selectedBudget)}>
                        Ist-Wert speichern
                    </button>
                </div>
            )}
        </div>
    );
};

const calculateAvailableBudget = async (budget) => {
    try {
        const istEntries = await ApiService.getIstByBudget(budget.id);
        const totalIst = istEntries.reduce((sum, ist) => sum + ist.betrag, 0);
        return budget.availableBudget - totalIst;
    } catch (error) {
        console.error('Fehler beim Abrufen der Ist-Einträge:', error);
        return budget.availableBudget;
    }
};

const AvailableBudget = ({budget}) => {
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

export default CreateIst;