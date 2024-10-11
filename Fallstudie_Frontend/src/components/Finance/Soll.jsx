import React, { useEffect, useState } from 'react';
import ApiService from '../../Service/ApiService'; // Annahme: ApiService ist korrekt importiert
import './Soll.css'; // CSS Datei für das Styling

const SollIst = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        // Ruft alle Budgets ab
        const allBudgets = await ApiService.getAllBudgets();

        // Für jedes Budget die Ist- und Soll-Werte abfragen
        const budgetsWithValues = await Promise.all(
          allBudgets.map(async (budget) => {
            const ist = await ApiService.getIstByBudget(budget.id);
            const soll = await ApiService.getSollByBudget(budget.id);

            return {
              ...budget,
              ist,
              soll,
            };
          })
        );

        // Setze die Budgets mit Ist- und Soll-Werten in den State
        setBudgets(budgetsWithValues);
      } catch (err) {
        setError('Fehler beim Laden der Budgets');
        console.error(err);
      }
    };

    fetchBudgets();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="budget-list">
      <h1>Budgetübersicht</h1>
      <table>
        <thead>
          <tr>
            <th>Budget Name</th>
            <th>Zuständige Person</th>
            <th>Soll</th>
            <th>Ist</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.name}</td>
              <td>{budget.responsiblePerson}</td> {/* Annahme: responsiblePerson ist im Budget vorhanden */}
              <td>{budget.soll}</td>
              <td
                className={budget.ist > budget.soll ? 'red-text' : ''} // Ist wird rot, wenn es größer als Soll ist
              >
                {budget.ist}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SollIst;
