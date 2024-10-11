import React, { useState, useEffect } from 'react';
import './kosten.css';

const Ist = ({ apiService, ownerId }) => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [istValue, setIstValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Budgets vom Owner laden
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const budgetsData = await apiService.getBudgetsByOwner(ownerId);
        setBudgets(budgetsData);
      } catch (err) {
        setError('Fehler beim Laden der Budgets');
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [ownerId, apiService]);

  // Ist-Daten für ausgewähltes Budget laden
  const loadIstData = async (budgetId) => {
    setLoading(true);
    try {
      const istData = await apiService.getIstByBudget(budgetId);
      setSelectedBudget(budgetId);
      setIstValue(istData.istWert || '');
    } catch (err) {
      setError('Fehler beim Laden der Ist-Daten');
    } finally {
      setLoading(false);
    }
  };

  // Ist-Wert aktualisieren
  const updateIstValue = async () => {
    if (!selectedBudget) {
      setError('Kein Budget ausgewählt');
      return;
    }

    setLoading(true);
    try {
      await apiService.updateIst(selectedBudget, { istWert: istValue });
      alert('Ist-Wert erfolgreich aktualisiert!');
    } catch (err) {
      setError('Fehler beim Aktualisieren des Ist-Werts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ist-container">
      <h1 className="ist-title">Ist-Daten aktualisieren</h1>

      {loading && <p className="ist-loading">Lade...</p>}
      {error && <p className="ist-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="budget" className="form-label">Budget auswählen:</label>
        <select
          id="budget"
          className="form-select"
          value={selectedBudget || ''}
          onChange={(e) => loadIstData(e.target.value)}
        >
          <option value="">-- Budget auswählen --</option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBudget && (
        <div className="form-group">
          <label htmlFor="istValue" className="form-label">Ist-Wert:</label>
          <input
            id="istValue"
            type="number"
            className="form-input"
            value={istValue}
            onChange={(e) => setIstValue(e.target.value)}
          />
          <button className="form-button" onClick={updateIstValue}>
            Ist-Wert aktualisieren
          </button>
        </div>
      )}
    </div>
  );
};

export default Ist;
