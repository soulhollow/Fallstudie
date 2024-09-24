import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import './BudgetApproval.css'; // Importiere die zugehörige CSS-Datei

const BudgetApproval = () => {
  const [budgets, setBudgets] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch Budgets die auf Genehmigung warten
  useEffect(() => {
    fetchPendingBudgets();
  }, []);

  const fetchPendingBudgets = async () => {
    try {
      const data = await ApiService.getPendingBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching pending budgets:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Budgets.' });
    }
  };

  const handleApprove = async (budgetId) => {
    try {
      await ApiService.approveBudget(budgetId);
      setMessage({ type: 'success', text: 'Budget erfolgreich genehmigt!' });
      fetchPendingBudgets(); // Aktualisiere die Liste
    } catch (error) {
      console.error('Error approving budget:', error);
      setMessage({ type: 'error', text: 'Fehler beim Genehmigen des Budgets.' });
    }
  };

  const handleReject = async (budgetId) => {
    try {
      await ApiService.rejectBudget(budgetId);
      setMessage({ type: 'success', text: 'Budget erfolgreich abgelehnt!' });
      fetchPendingBudgets(); // Aktualisiere die Liste
    } catch (error) {
      console.error('Error rejecting budget:', error);
      setMessage({ type: 'error', text: 'Fehler beim Ablehnen des Budgets.' });
    }
  };

  return (
    <div className="budget-approval-container">
      <h2>Budget-Genehmigungen</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button className="close-button" onClick={() => setMessage({ type: '', text: '' })}>
            &times;
          </button>
        </div>
      )}

      <table className="budget-table">
        <thead>
          <tr>
            <th>Budgetname</th>
            <th>Antragsteller</th>
            <th>Gesamtbetrag</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.budgetName}</td>
              <td>{budget.applicant}</td>
              <td>{budget.totalAmount} €</td>
              <td>{budget.status === 'pending' ? 'Wartet auf Genehmigung' : budget.status}</td>
              <td>
                <button className="btn approve" onClick={() => handleApprove(budget.id)}>
                  Genehmigen
                </button>
                <button className="btn reject" onClick={() => handleReject(budget.id)}>
                  Ablehnen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetApproval;
