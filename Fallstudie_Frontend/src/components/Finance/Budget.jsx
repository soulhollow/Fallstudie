import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';  // Stelle sicher, dass der Pfad korrekt ist
import './Budget.css';  // Optional: Dein CSS für das Styling

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ name: '', availableBudget: 0, ownerId: '', managerId: '', financeId: '' });
  const [editingBudget, setEditingBudget] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Lade alle Budgets
  const loadBudgets = async () => {
    try {
      const allBudgets = await ApiService.getAllBudgets();
      setBudgets(allBudgets);
    } catch (err) {
      setError('Fehler beim Laden der Budgets');
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // Budget erstellen
  const createBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.createBudget(newBudget);
      setSuccessMessage('Budget erfolgreich erstellt!');
      setNewBudget({ name: '', availableBudget: 0, ownerId: '', managerId: '', financeId: '' });
      loadBudgets(); // Neu laden der Budgetliste
    } catch (err) {
      setError('Fehler beim Erstellen des Budgets');
    }
  };

  // Budget aktualisieren
  const updateBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.updateBudget(editingBudget.id, editingBudget);
      setSuccessMessage('Budget erfolgreich aktualisiert!');
      setEditingBudget(null); // Zurücksetzen des Editiermodus
      loadBudgets(); // Neu laden der Budgetliste
    } catch (err) {
      setError('Fehler beim Aktualisieren des Budgets');
    }
  };

  // Budget suchen
  const searchBudget = async (e) => {
    e.preventDefault();
    try {
      const budget = await ApiService.getBudgetByName(searchName);
      setBudgets([budget]); // Zeigt nur das gefundene Budget an
    } catch (err) {
      setError('Fehler beim Suchen des Budgets');
    }
  };

  // Budget löschen
  const deleteBudget = async (id) => {
    if (window.confirm('Möchten Sie dieses Budget wirklich löschen?')) {
      try {
        await ApiService.updateBudget(id, { deleted: true }); // Beispiel für ein "Löschen" durch Setzen eines Flags
        setSuccessMessage('Budget erfolgreich gelöscht!');
        loadBudgets(); // Neu laden der Budgetliste
      } catch (err) {
        setError('Fehler beim Löschen des Budgets');
      }
    }
  };

  return (
    <div className="budget-container">
      <h2>Budget Verwaltung</h2>

      {/* Erfolgs- und Fehlermeldungen */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Budget suchen */}
      <div className="search-section">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Budget Name suchen"
        />
        <button onClick={searchBudget}>Suchen</button>
      </div>

      {/* Neues Budget erstellen */}
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
            Besitzer (ID):
            <input
              type="text"
              value={newBudget.ownerId}
              onChange={(e) => setNewBudget({ ...newBudget, ownerId: e.target.value })}
            />
          </label>
          <label>
            Manager (ID):
            <input
              type="text"
              value={newBudget.managerId}
              onChange={(e) => setNewBudget({ ...newBudget, managerId: e.target.value })}
            />
          </label>
          <label>
            Finanzverwalter (ID):
            <input
              type="text"
              value={newBudget.financeId}
              onChange={(e) => setNewBudget({ ...newBudget, financeId: e.target.value })}
            />
          </label>
          <button type="submit">Erstellen</button>
        </form>
      </div>

      {/* Budget aktualisieren */}
      {editingBudget && (
        <div className="budget-form">
          <h3>Budget bearbeiten</h3>
          <form onSubmit={updateBudget}>
            <label>
              Name:
              <input
                type="text"
                value={editingBudget.name}
                onChange={(e) => setEditingBudget({ ...editingBudget, name: e.target.value })}
                required
              />
            </label>
            <label>
              Verfügbares Budget:
              <input
                type="number"
                value={editingBudget.availableBudget}
                onChange={(e) => setEditingBudget({ ...editingBudget, availableBudget: e.target.value })}
                required
              />
            </label>
            <label>
              Besitzer (ID):
              <input
                type="text"
                value={editingBudget.ownerId}
                onChange={(e) => setEditingBudget({ ...editingBudget, ownerId: e.target.value })}
              />
            </label>
            <label>
              Manager (ID):
              <input
                type="text"
                value={editingBudget.managerId}
                onChange={(e) => setEditingBudget({ ...editingBudget, managerId: e.target.value })}
              />
            </label>
            <label>
              Finanzverwalter (ID):
              <input
                type="text"
                value={editingBudget.financeId}
                onChange={(e) => setEditingBudget({ ...editingBudget, financeId: e.target.value })}
              />
            </label>
            <button type="submit">Aktualisieren</button>
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
                <td>{budget.availableBudget}</td>
                <td>{budget.ownerId}</td>
                <td>{budget.managerId}</td>
                <td>{budget.financeId}</td>
               
                <td>
                  <button onClick={() => setEditingBudget(budget)}>Bearbeiten</button>
                  <button onClick={() => deleteBudget(budget.id)}>Löschen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budget;
