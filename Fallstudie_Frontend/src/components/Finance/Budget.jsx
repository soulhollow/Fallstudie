import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadBudgets();
    loadUsers();
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

  const createBudget = async (e) => {
    e.preventDefault();
    try {
      const ownerUser = await ApiService.getUserByEmail(newBudget.ownerEmail);
      const managerUser = await ApiService.getUserByEmail(newBudget.managerEmail);
      const financeUser = await ApiService.getUserByEmail(newBudget.financeEmail);
      console.log(ownerUser.id, managerUser.id, financeUser.id);

      if (!managerUser || managerUser.roleID !== 2) {
        setError('Der ausgewählte Manager hat nicht die erforderliche Rolle.');
        return;
      }

      const budgetToCreate = {
        ...newBudget,
        owner: ownerUser,
        manager: managerUser,
        finance: financeUser,
        timestamp: new Date().toISOString(),
        approved: false,
        id: 12212
      };

      const response = await ApiService.createBudget(budgetToCreate);
      setSuccessMessage('Budget erfolgreich erstellt!');
      setNewBudget({ name: '', availableBudget: 0, ownerEmail: '', managerEmail: '', financeEmail: '' });
      loadBudgets();
    } catch (err) {
      console.error('Fehler beim Erstellen des Budgets:', err);
      setError('Fehler beim Erstellen des Budgets: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateBudget = async (e) => {
    e.preventDefault();
    try {
      const ownerUser = await ApiService.getUserByEmail(editingBudget.ownerEmail);
      const managerUser = await ApiService.getUserByEmail(editingBudget.managerEmail);
      const financeUser = await ApiService.getUserByEmail(editingBudget.financeEmail);
      console.log(ownerUser.roleID, managerUser.roleID, financeUser.roleID);
      if (!managerUser || managerUser.roleID !== 2) {
        setError('Der ausgewählte Manager hat nicht die erforderliche Rolle.');
        return;
      }

      const budgetToUpdate = {
        ...editingBudget,
        owner: ownerUser,
        manager: managerUser,
        finance: financeUser
      };

      const response = await ApiService.updateBudget(editingBudget.id, budgetToUpdate);
      setSuccessMessage('Budget erfolgreich aktualisiert!');
      setEditingBudget(null);
      loadBudgets();
    } catch (err) {
      setError('Fehler beim Aktualisieren des Budgets: ' + (err.response?.data?.message || err.message));
    }
  };

  const searchBudget = async (e) => {
    e.preventDefault();
    try {
      const budget = await ApiService.getBudgetByName(searchName);
      setBudgets([budget]);
    } catch (err) {
      setError('Fehler beim Suchen des Budgets');
    }
  };

  const handleUserInputChange = (field, value) => {
    setNewBudget({ ...newBudget, [field]: value });
    const suggestions = users
        .filter(user => user.email.toLowerCase().includes(value.toLowerCase()))
        .map(user => user.email);
    setUserSuggestions({ ...userSuggestions, [field.replace('Email', '')]: suggestions });
  };

  const selectUserSuggestion = (field, email) => {
    setNewBudget({ ...newBudget, [field]: email });
    setUserSuggestions({ ...userSuggestions, [field.replace('Email', '')]: [] });
  };

  return (
      <div className="budget-container">
        <h2>Budget Verwaltung</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="search-section">
          <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Budget Name suchen"
          />
          <button onClick={searchBudget}>Suchen</button>
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
              Verfügbares Budget:
              <input
                  type="number"
                  value={newBudget.availableBudget}
                  onChange={(e) => setNewBudget({ ...newBudget, availableBudget: e.target.value })}
                  required
              />
            </label>
            <label>
              Besitzer (E-Mail):
              <input
                  type="email"
                  value={newBudget.ownerEmail}
                  onChange={(e) => handleUserInputChange('ownerEmail', e.target.value)}
                  required
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
            <button type="submit">Erstellen</button>
          </form>
        </div>

        {/* Budget-Liste */}
        <div className="budget-list">
          <h3>Budget Liste</h3>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Verfügbares Budget</th>
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
                  <td>{budget.availableBudget} €</td>
                  <td>{budget.owner.email}</td>
                  <td>{budget.manager.email}</td>
                  <td>{budget.finance.email}</td>
                  <td>
                    <button onClick={() => setEditingBudget(budget)}>Bearbeiten</button>
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