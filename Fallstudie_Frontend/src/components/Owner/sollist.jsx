import React, { useEffect, useState } from 'react';
import ApiService from '../../Service/ApiService'; // Assuming ApiService is correctly imported
import './sollist.css'; // Ensure this matches your actual CSS file name
 
const OwnerBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [expandedBudgetId, setExpandedBudgetId] = useState(null); // State for the expanded budget
  const [ownerId, setOwnerId] = useState(null); // State to hold owner ID
  const [ownerfname, setOwnerfName] = useState(null);
  const [ownernname, setOwnernName] = useState(null); // State to hold owner ID
 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await ApiService.getCurrentUser(); // Fetch the current user
        setOwnerId(user.id); // Set the owner ID from the current user
        setOwnerfName(user.firstName);
        setOwnernName(user.lastName);
      } catch (err) {
        setError('Fehler beim Abrufen des aktuellen Benutzers');
        console.error(err);
      }
    };
 
    fetchCurrentUser();
  }, []); // Only run once on mount
 
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!ownerId) {
        return; // Exit if ownerId is null
      }
      try {
        // Fetch budgets by owner ID
        const ownerBudgets = await ApiService.getBudgetsByOwner(ownerId);
        console.log(ownerId); // Logging the ownerId
        // For each budget, fetch Ist and Soll values
        const budgetsWithValues = await Promise.all(
          ownerBudgets.map(async (budget) => {
            const istResponse = await ApiService.getIstByBudget(budget.id);
            const sollResponse = await ApiService.getSollByBudget(budget.id);
 
            return {
              ...budget,
              ist: istResponse, // Set the entire Ist response
              soll: sollResponse, // Set the entire Soll response
            };
          })
        );
 
        // Set the budgets with Ist and Soll values in state
        setBudgets(budgetsWithValues);
      } catch (err) {
        setError('Fehler beim Laden der Budgets');
        console.error(err);
      }
    };
 
    fetchBudgets();
  }, [ownerId]); // Run when ownerId changes
 
  const toggleExpand = (budgetId) => {
    setExpandedBudgetId(expandedBudgetId === budgetId ? null : budgetId);
  };
 
  // Function to sum the amounts
  const sumValues = (values) => values.reduce((acc, curr) => acc + curr.betrag, 0);
 
  if (error) {
    return <p>{error}</p>;
  }
 
  return (
    <div className="budget-list">
      <h1>Budgetübersicht für  {ownerfname} {ownernname} </h1>
      <table>
        <thead>
          <tr>
            <th>Budget Name</th>
            <th>Budgetwert</th>
            <th>Soll-Werte</th>
            <th>Ist-Werte</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => {
            const totalSoll = sumValues(budget.soll);
            const totalIst = sumValues(budget.ist);
 
            // Comparison to see if Ist < Soll
            const isRed = totalIst > totalSoll; // Ist value turns red if greater than Soll value
            const isGreen = totalIst < totalSoll; // Ist value turns green if less than Soll value
 
            return (
              <React.Fragment key={budget.id}>
                <tr onClick={() => toggleExpand(budget.id)} style={{ cursor: 'pointer' }}>
                  <td>{budget.name}</td>
                  <td>{budget.availableBudget} €</td>
                  <td>{totalSoll} €</td>
                  <td className={isRed ? 'red' : isGreen ? 'grün' : ''}>
                    {totalIst} €
                  </td> {/* Display Ist value in red or green depending on comparison */}
                </tr>
                {expandedBudgetId === budget.id && (
                  <tr>
                    <td colSpan={3}>
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
 
export default OwnerBudgets;