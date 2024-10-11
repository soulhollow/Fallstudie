import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService'; // Annahme: ApiService ist korrekt importiert
import './Budgetapprove.css'; // CSS für das Styling

const ApproveBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedNames, setSelectedNames] = useState(''); // Input für die Budget-Namen
  const [managerId, setManagerId] = useState(''); // Manager ID für die Genehmigung
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await ApiService.getAllBudgets();
        setBudgets(data);
      } catch (err) {
        setError('Fehler beim Laden der Budgets');
        console.error(err);
      }
    };

    fetchBudgets();
  }, []);

  // Funktion zum Genehmigen der Budgets nach Namen
  const handleApprove = async () => {
    setError(null);
    setSuccessMessage('');
    
    // Konvertiere die Namen zu einem Array von Strings (Trennung per Komma)
    const budgetNames = selectedNames.split(',').map(name => name.trim());

    // Genehmigungsanfragen für jedes Budget nach Namen
    try {
      for (let name of budgetNames) {
        const budget = await ApiService.getBudgetByName(name); // Holt das Budget anhand des Namens
        await ApiService.approveBudget(budget.id, managerId); // Genehmigt das Budget mit der ID
      }
      setSuccessMessage(`Die Budgets ${budgetNames.join(', ')} wurden erfolgreich genehmigt.`);
      setSelectedNames(''); // Leere das Eingabefeld nach Genehmigung
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
            <th>Zuständige Person</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map(budget => (
            <tr key={budget.id}>
              <td>{budget.name}</td>
              <td>{budget.responsiblePerson}</td> {/* Beispiel: responsiblePerson als Feld */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Eingabefelder für Budget Namen und Manager ID */}
      <div className="approve-section">
        <input
          type="text"
          className="input"
          placeholder="Budget-Namen"
          value={selectedNames}
          onChange={(e) => setSelectedNames(e.target.value)}
        />
        <input
          type="text"
          className="input"
          placeholder="Manager ID"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
        />
        <button className="btn" onClick={handleApprove}>Approve</button>
      </div>

      {/* Anzeige von Fehlern oder Erfolgsnachrichten */}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ApproveBudget;
