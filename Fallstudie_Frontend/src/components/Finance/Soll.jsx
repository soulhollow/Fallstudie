import React, { useEffect, useState } from 'react';
import ApiService from '../../Service/ApiService'; // Annahme: ApiService ist korrekt importiert
import './Soll.css'; // CSS Datei für das Styling
 
const SollIst = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [expandedBudgetId, setExpandedBudgetId] = useState(null); // Zustand für das erweiterte Budget
 
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        // Ruft alle Budgets ab
        const allBudgets = await ApiService.getAllBudgets();
 
        // Für jedes Budget die Ist- und Soll-Werte abfragen
        const budgetsWithValues = await Promise.all(
          allBudgets.map(async (budget) => {
            const istResponse = await ApiService.getIstByBudget(budget.id);
            const sollResponse = await ApiService.getSollByBudget(budget.id);
 
            return {
              ...budget,
              ist: istResponse, // Setze die gesamte Ist-Antwort
              soll: sollResponse, // Setze die gesamte Soll-Antwort
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
 
  const toggleExpand = (budgetId) => {
    setExpandedBudgetId(expandedBudgetId === budgetId ? null : budgetId);
  };
 
  // Funktion zur Summierung der Beträge
  const sumValues = (values) => values.reduce((acc, curr) => acc + curr.betrag, 0);
 
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
            <th>Budget Wert</th>
            <th>Zuständige Person</th>
            <th>Soll-Werte</th>
            <th>Ist-Werte</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => {
            const totalSoll = sumValues(budget.soll)  ;
            const totalIst = sumValues(budget.ist);
 
            // Vergleich, um zu sehen, ob Ist < Soll
            const isRed = totalIst > totalSoll; // Ist-Wert wird rot, wenn er größer als der Soll-Wert ist
            const isGreen = totalIst < totalSoll; // Ist-Wert wird grün, wenn er kleiner als der Soll-Wert ist
 
            return (
              <React.Fragment key={budget.id}>
                <tr onClick={() => toggleExpand(budget.id)} style={{ cursor: 'pointer' }}>
                  <td>{budget.name}</td>
                  <td>{budget.availableBudget} €</td>
                  <td>{budget.finance.firstName} {budget.finance.lastName}</td>
                  <td>{totalSoll} €</td>
                  <td className={isRed ? 'red' : isGreen ? 'grün' : ''}>
                    {totalIst} €
                  </td> {/* Anzeige des Ist-Wertes in Rot oder Grün, je nach Vergleich */}
                </tr>
                {expandedBudgetId === budget.id && (
                  <tr>
                    <td colSpan={4}>
                      <div className="details">
                        <h3>Details für {budget.name}</h3>
                        <h4>Soll-Daten:</h4>
                        <ul>
                          {budget.soll.map(s => (
                            <li key={s.id}>
                              {s.name}: {s.betrag} € (Zeitstempel: {s.timestamp})
                            </li>
                          ))}
                        </ul>
                        <h4>Ist-Daten:</h4>
                        <ul>
                          {budget.ist.map(i => (
                            <li key={i.id}>
                              {i.name}: {i.betrag} € (Zeitstempel: {i.timestamp})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
 
export default SollIst;