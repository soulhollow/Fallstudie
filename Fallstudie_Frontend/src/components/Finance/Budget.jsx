import React, { useState, useEffect, useRef } from 'react';
import ApiService from '../../Service/ApiService';
import './Budget.css';

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [newBudget, setNewBudget] = useState({
        name: '',
        availableBudget: 0,
        ownerEmail: '',
        managerEmail: '',
        financeEmail: ''
    });
    const [editingBudget, setEditingBudget] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState({ owner: [], manager: [], finance: [] });
    const [editUserSuggestions, setEditUserSuggestions] = useState({ owner: [], manager: [], finance: [] });

    const containerRef = useRef(null); // Ref für den Hauptcontainer

    // Rollenfilter definieren
    const ROLE_FILTERS = {
        ownerEmail: 3,    // Owner (roleID=3)
        managerEmail: 2,  // Manager (roleID=2)
        financeEmail: 4   // Finance (roleID=4)
    };

    useEffect(() => {
        loadBudgets();
        loadUsers();

        // Funktion zum Überprüfen von Klicks außerhalb des Containers
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Klick ist außerhalb des Containers
                setUserSuggestions({ owner: [], manager: [], finance: [] });
                setEditUserSuggestions({ owner: [], manager: [], finance: [] });
            }
        };

        // Event-Listener hinzufügen
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup-Funktion zum Entfernen des Event-Listeners
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadBudgets = async () => {
        try {
            const allBudgets = await ApiService.getAllBudgets();
            setBudgets(allBudgets);
        } catch (err) {
            setError('Fehler beim Laden der Budgets');
        }
    };

    const loadUsers = async () => {
        try {
            const allUsers = await ApiService.getAllUsers();
            setUsers(allUsers);
        } catch (err) {
            setError('Fehler beim Laden der Benutzer');
        }
    };

    const formatDate = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const createBudget = async (e) => {
        e.preventDefault();
        try {
            const ownerUser = await ApiService.getUserByEmail(newBudget.ownerEmail);
            const managerUser = await ApiService.getUserByEmail(newBudget.managerEmail);
            const financeUser = await ApiService.getUserByEmail(newBudget.financeEmail);

            if (!ownerUser || ownerUser.roleID !== 3) {
                setError('Der ausgewählte Besitzer hat nicht die erforderliche Rolle.');
                return;
            }

            if (!managerUser || managerUser.roleID !== 2) {
                setError('Der ausgewählte Manager hat nicht die erforderliche Rolle.');
                return;
            }

            if (!financeUser || financeUser.roleID !== 4) {
                setError('Der ausgewählte Finanzverwalter hat nicht die erforderliche Rolle.');
                return;
            }

            const budgetToCreate = {
                name: newBudget.name,
                availableBudget: parseFloat(newBudget.availableBudget),
                owner: ownerUser,
                manager: managerUser,
                finance: financeUser,
                timestamp: formatDate(new Date()),
                approved: false
            };

            const response = await ApiService.createBudget(budgetToCreate);
            setSuccessMessage('Budget erfolgreich erstellt!');
            setError('');
            setNewBudget({ name: '', availableBudget: 0, ownerEmail: '', managerEmail: '', financeEmail: '' });
            loadBudgets();
        } catch (err) {
            console.error('Fehler beim Erstellen des Budgets:', err);
            setError('Fehler beim Erstellen des Budgets: ' + (err.response?.data?.message || err.message));
            setSuccessMessage('');
        }
    };

    const updateBudget = async (e) => {
        e.preventDefault();
        try {
            const ownerUser = await ApiService.getUserByEmail(editingBudget.ownerEmail);
            const managerUser = await ApiService.getUserByEmail(editingBudget.managerEmail);
            const financeUser = await ApiService.getUserByEmail(editingBudget.financeEmail);

            if (!ownerUser || ownerUser.roleID !== 3) {
                setError('Der ausgewählte Besitzer hat nicht die erforderliche Rolle.');
                return;
            }

            if (!managerUser || managerUser.roleID !== 2) {
                setError('Der ausgewählte Manager hat nicht die erforderliche Rolle.');
                return;
            }

            if (!financeUser || financeUser.roleID !== 4) {
                setError('Der ausgewählte Finanzverwalter hat nicht die erforderliche Rolle.');
                return;
            }

            const budgetToUpdate = {
                id: editingBudget.id,
                name: editingBudget.name,
                availableBudget: parseFloat(editingBudget.availableBudget),
                owner: ownerUser,
                manager: managerUser,
                finance: financeUser,
                timestamp: editingBudget.timestamp || formatDate(new Date()),
                approved: editingBudget.approved || false,
            };

            await ApiService.updateBudget(editingBudget.id, budgetToUpdate);
            setSuccessMessage('Budget erfolgreich aktualisiert!');
            setError('');
            setEditingBudget(null);
            loadBudgets();
        } catch (err) {
            console.error('Fehler beim Aktualisieren des Budgets:', err.response?.data || err.message);
            setSuccessMessage('');
            setError('Fehler beim Aktualisieren des Budgets: ' + (err.response?.data?.message || err.message));
        }
    };

    const searchBudget = async (e) => {
        e.preventDefault();
        try {
            const budget = await ApiService.getBudgetByName(searchName);
            setBudgets([budget]);
            setError('');
        } catch (err) {
            setError('Budget nicht gefunden');
            setBudgets([]);
        }
    };

    // Funktion zum Filtern von Benutzern basierend auf dem Feld und der Rolle
    const filterUsers = (field, value) => {
        const requiredRoleID = ROLE_FILTERS[field];
        if (!requiredRoleID) return [];

        return users
            .filter(user =>
                user.email.toLowerCase().includes(value.toLowerCase()) &&
                user.roleID === requiredRoleID
            )
            .map(user => user.email);
    };

    const handleUserInputChange = (field, value) => {
        setNewBudget({ ...newBudget, [field]: value });
        const suggestions = filterUsers(field, value);
        setUserSuggestions({ ...userSuggestions, [field.replace('Email', '')]: suggestions });
    };

    const selectUserSuggestion = (field, email) => {
        setNewBudget({ ...newBudget, [field]: email });
        setUserSuggestions({ ...userSuggestions, [field.replace('Email', '')]: [] });
    };

    const handleEditInputChange = (field, value) => {
        setEditingBudget({ ...editingBudget, [field]: value });
    };

    const handleEditUserInputChange = (field, value) => {
        handleEditInputChange(field, value);
        const suggestions = filterUsers(field, value);
        setEditUserSuggestions({ ...editUserSuggestions, [field.replace('Email', '')]: suggestions });
    };

    const selectEditUserSuggestion = (field, email) => {
        handleEditInputChange(field, email);
        setEditUserSuggestions({ ...editUserSuggestions, [field.replace('Email', '')]: [] });
    };

    return (
        <div className="budget-container" ref={containerRef}>
            <h2>Budget Verwaltung</h2>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="search-section">
                <form onSubmit={searchBudget}>
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Budget Name suchen"
                    />
                    <button type="submit">Suchen</button>
                    <button type="button" onClick={loadBudgets}>Alle anzeigen</button>
                </form>
            </div>

            <div className="budget-form">
                <h3>Neues Budget erstellen</h3>
                <form onSubmit={createBudget}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newBudget.name}
                            onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Verfügbares Budget (€):
                        <input
                            type="number"
                            value={newBudget.availableBudget}
                            onChange={(e) => setNewBudget({ ...newBudget, availableBudget: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                        />
                    </label>
                    <label>
                        Besitzer (E-Mail):
                        <input
                            type="email"
                            value={newBudget.ownerEmail}
                            onChange={(e) => handleUserInputChange('ownerEmail', e.target.value)}
                            required
                            placeholder="owner@example.com"
                        />
                        {userSuggestions.owner.length > 0 && (
                            <ul className="suggestions">
                                {userSuggestions.owner.map((email) => (
                                    <li key={email} onClick={() => selectUserSuggestion('ownerEmail', email)}>
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </label>
                    <label>
                        Manager (E-Mail):
                        <input
                            type="email"
                            value={newBudget.managerEmail}
                            onChange={(e) => handleUserInputChange('managerEmail', e.target.value)}
                            required
                            placeholder="manager@example.com"
                        />
                        {userSuggestions.manager.length > 0 && (
                            <ul className="suggestions">
                                {userSuggestions.manager.map((email) => (
                                    <li key={email} onClick={() => selectUserSuggestion('managerEmail', email)}>
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </label>
                    <label>
                        Finanzverwalter (E-Mail):
                        <input
                            type="email"
                            value={newBudget.financeEmail}
                            onChange={(e) => handleUserInputChange('financeEmail', e.target.value)}
                            required
                            placeholder="finance@example.com"
                        />
                        {userSuggestions.finance.length > 0 && (
                            <ul className="suggestions">
                                {userSuggestions.finance.map((email) => (
                                    <li key={email} onClick={() => selectUserSuggestion('financeEmail', email)}>
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </label>
                    <button type="submit">Budget erstellen</button>
                </form>
            </div>

            {/* Bearbeitungsformular */}
            {editingBudget && (
                <div className="budget-form">
                    <h3>Budget bearbeiten</h3>
                    <form onSubmit={updateBudget}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editingBudget.name}
                                onChange={(e) => handleEditInputChange('name', e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Verfügbares Budget (€):
                            <input
                                type="number"
                                value={editingBudget.availableBudget}
                                onChange={(e) => handleEditInputChange('availableBudget', e.target.value)}
                                required
                                min="0"
                                step="0.01"
                            />
                        </label>
                        <label>
                            Besitzer (E-Mail):
                            <input
                                type="email"
                                value={editingBudget.ownerEmail}
                                onChange={(e) => handleEditUserInputChange('ownerEmail', e.target.value)}
                                required
                                placeholder="owner@example.com"
                            />
                            {editUserSuggestions.owner.length > 0 && (
                                <ul className="suggestions">
                                    {editUserSuggestions.owner.map((email) => (
                                        <li key={email} onClick={() => selectEditUserSuggestion('ownerEmail', email)}>
                                            {email}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </label>
                        <label>
                            Manager (E-Mail):
                            <input
                                type="email"
                                value={editingBudget.managerEmail}
                                onChange={(e) => handleEditUserInputChange('managerEmail', e.target.value)}
                                required
                                placeholder="manager@example.com"
                            />
                            {editUserSuggestions.manager.length > 0 && (
                                <ul className="suggestions">
                                    {editUserSuggestions.manager.map((email) => (
                                        <li key={email} onClick={() => selectEditUserSuggestion('managerEmail', email)}>
                                            {email}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </label>
                        <label>
                            Finanzverwalter (E-Mail):
                            <input
                                type="email"
                                value={editingBudget.financeEmail}
                                onChange={(e) => handleEditUserInputChange('financeEmail', e.target.value)}
                                required
                                placeholder="finance@example.com"
                            />
                            {editUserSuggestions.finance.length > 0 && (
                                <ul className="suggestions">
                                    {editUserSuggestions.finance.map((email) => (
                                        <li key={email} onClick={() => selectEditUserSuggestion('financeEmail', email)}>
                                            {email}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </label>
                        <button type="submit">Budget aktualisieren</button>
                        <button type="button" onClick={() => setEditingBudget(null)}>Abbrechen</button>
                    </form>
                </div>
            )}

            {/* Budget-Liste */}
            <div className="budget-list">
                <h3>Budget Liste</h3>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Verfügbares Budget (€)</th>
                        <th>Besitzer</th>
                        <th>Manager</th>
                        <th>Finanzverwalter</th>
                        <th>Aktionen</th>
                        <th>Approved</th>
                    </tr>
                    </thead>
                    <tbody>
                    {budgets.map((budget) => (
                        <tr key={budget.id}>
                            <td>{budget.id}</td>
                            <td>{budget.name}</td>
                            <td>{budget.availableBudget.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                            <td>{budget.owner.email}</td>
                            <td>{budget.manager.email}</td>
                            <td>{budget.finance.email}</td>
                            <td>
                                <button onClick={() => setEditingBudget({
                                    ...budget,
                                    ownerEmail: budget.owner.email,
                                    managerEmail: budget.manager.email,
                                    financeEmail: budget.finance.email,
                                })}>
                                    Bearbeiten
                                </button>
                            </td>
                            <td>{budget.approved ? 'Approved' : 'Not Approved'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Budget;
