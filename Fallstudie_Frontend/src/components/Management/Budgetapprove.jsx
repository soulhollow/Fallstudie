import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import './Budgetapprove.css';
 
const ApproveBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedNames, setSelectedNames] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
 
  useEffect(() => {
    fetchBudgets();
  }, []);
 
  const fetchBudgets = async () => {
    try {
      const data = await ApiService.getAllBudgets();
      setBudgets(data);
    } catch (err) {
      setError('Fehler beim Laden der Budgets');
      console.error(err);
    }
  };
 
  const handleApprove = async () => {
    setError(null);
    setSuccessMessage('');
   
    const budgetNames = selectedNames.split(',').map(name => name.trim());
 
    try {
      for (let name of budgetNames) {
        const budget = await ApiService.getBudgetByName(name);
        await ApiService.approveBudget(budget.id);
      }
      setSuccessMessage(`Die Budgets ${budgetNames.join(', ')} wurden erfolgreich genehmigt.`);
      setSelectedNames('');
     
      // Budgets neu abrufen, um die neuesten Daten zu erhalten
      fetchBudgets();
    } catch (err) {
      setError('Fehler beim Genehmigen der Budgets');
      console.error(err);
    }
  };
 
  return (
    <div className="approve-budget-container">
      <h1>Budget Genehmigung</h1>
      <table>
        <thead>
          <tr>
            <th>Budget Name</th>
            <th>Status</th>
            <th>Finance</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(budget => (
            <tr key={budget.id}>
              <td>{budget.name}</td>
              <td>{budget.approved ? 'Approved' : 'Not Approved'}</td>
              {/* Hier sicherstellen, dass finance nicht null ist und die Felder firstName und lastName existieren */}
              <td>
                {budget.finance ? `${budget.finance.firstName} ${budget.finance.lastName}` : 'Unbekannt'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      <div className="approve-section">
        <input
          type="text"
          className="input"
          placeholder="Budget-Namen"
          value={selectedNames}
          onChange={(e) => setSelectedNames(e.target.value)}
        />
        <button className="btn" onClick={handleApprove}>Approve</button>
      </div>
 
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};
 
export default ApproveBudget;