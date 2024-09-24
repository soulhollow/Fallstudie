import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiService';
import './BudgetManagement.css'; // Importiere die zugehörige CSS-Datei

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [owner, setOwner] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [availableBudget, setAvailableBudget] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch Budgets und Owners beim Mounten
  useEffect(() => {
    fetchBudgets();
    fetchOwners();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await ApiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Budgets.' });
    }
  };

  const fetchOwners = async () => {
    try {
      const data = await ApiService.getOwners();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Owners.' });
    }
  };

  const openModal = (budget = null) => {
    setSelectedBudget(budget);
    setBudgetName(budget ? budget.budgetName : '');
    setOwner(budget ? budget.owner : '');
    setStartDate(budget ? budget.startDate : '');
    setEndDate(budget ? budget.endDate : '');
    setTotalBudget(budget ? budget.totalBudget : '');
    setAvailableBudget(budget ? budget.availableBudget : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBudget(null);
    setBudgetName('');
    setOwner('');
    setStartDate('');
    setEndDate('');
    setTotalBudget('');
    setAvailableBudget('');
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const budgetData = { budgetName, owner, startDate, endDate, totalBudget, availableBudget };
    try {
      if (selectedBudget) {
        // Budget aktualisieren
        await ApiService.updateBudget(selectedBudget.id, budgetData);
        setMessage({ type: 'success', text: 'Budget erfolgreich aktualisiert!' });
      } else {
        // Neues Budget erstellen
        await ApiService.createBudget(budgetData);
        setMessage({ type: 'success', text: 'Budget erfolgreich erstellt!' });
      }
      fetchBudgets();
      closeModal();
    } catch (error) {
      console.error('Error saving budget:', error);
      setMessage({ type: 'error', text: 'Fehler beim Speichern des Budgets.' });
    }
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie dieses Budget löschen möchten?')) return;
    try {
      await ApiService.deleteBudget(budgetId);
      setMessage({ type: 'success', text: 'Budget erfolgreich gelöscht!' });
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      setMessage({ type: 'error', text: 'Fehler beim Löschen des Budgets.' });
    }
  };

  return (
    <div className="budget-management-container">
      <h2>Budgetverwaltung</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button className="close-button" onClick={() => setMessage({ type: '', text: '' })}>
            &times;
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={() => openModal()}>
        Neues Budget erstellen
      </button>

      <table className="budget-table">
        <thead>
          <tr>
            <th>Budgetname</th>
            <th>Owner</th>
            <th>Startdatum</th>
            <th>Verfallsdatum</th>
            <th>Gesamtbudget</th>
            <th>Verfügbares Budget</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.budgetName}</td>
              <td>{budget.owner}</td>
              <td>{new Date(budget.startDate).toLocaleDateString()}</td>
              <td>{new Date(budget.endDate).toLocaleDateString()}</td>
              <td>{budget.totalBudget} €</td>
              <td>{budget.availableBudget} €</td>
              <td>
                <button className="btn btn-edit" onClick={() => openModal(budget)}>
                  Bearbeiten
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(budget.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal zum Erstellen/Bearbeiten eines Budgets */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedBudget ? 'Budget bearbeiten' : 'Neues Budget erstellen'}</h3>
            <div className="form-group">
              <label htmlFor="budgetName">Budgetname:</label>
              <input
                type="text"
                id="budgetName"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="owner">Owner:</label>
              <select
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
              >
                <option value="">Wählen...</option>
                {owners.map((ownerOption) => (
                  <option key={ownerOption.id} value={ownerOption.name}>
                    {ownerOption.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Startdatum:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Verfallsdatum:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="totalBudget">Gesamtbudget:</label>
              <input
                type="number"
                id="totalBudget"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="availableBudget">Verfügbares Budget:</label>
              <input
                type="number"
                id="availableBudget"
                value={availableBudget}
                onChange={(e) => setAvailableBudget(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {selectedBudget ? 'Speichern' : 'Erstellen'}
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManagement;
