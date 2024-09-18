import React, { useState } from 'react';
import './Finance.css';

const OwnerBudgetSearch = () => {
  const [owner, setOwner] = useState('');
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState('');

  const handleOwnerInputChange = (event) => {
    setOwner(event.target.value);
  };

  const handleBudgetInputChange = (event) => {
    setBudget(event.target.value);
  };

  const handleSearchOwner = () => {
    if (owner) {
      setResult(`Owner gefunden: ${owner}`);
    } else {
      setResult('Bitte einen Owner eingeben');
    }
  };

  const handleSearchBudgets = () => {
    if (budget) {
      setResult(`Budget gefunden: ${budget}`);
    } else {
      setResult('Bitte ein Budget eingeben');
    }
  };

  const handleShowComparison = () => {
    if (owner && budget) {
      setResult(`Soll/Ist-Vergleich für Owner: ${owner} und Budget: ${budget}`);
    } else {
      setResult('Bitte sowohl Owner als auch Budget eingeben');
    }
  };

  const handleAssign = () => {
    if (owner && budget) {
      setResult(`Owner: ${owner} wurde dem Budget: ${budget} zugeordnet.`);
    } else {
      setResult('Bitte sowohl Owner als auch Budget eingeben');
    }
  };

  return (
    <div className="search-container">
      <h2>Owner und Budget Management</h2>

      {/* Owner Suche */}
      <div className="search-section">
        <h3>Owner Suchen</h3>
        <input
          type="text"
          placeholder="Owner eingeben"
          value={owner}
          onChange={handleOwnerInputChange}
        />
        <button onClick={handleSearchOwner}>Suche Owner</button>
      </div>

      {/* Budget Suche */}
      <div className="search-section">
        <h3>Budget Suchen</h3>
        <input
          type="text"
          placeholder="Budget eingeben"
          value={budget}
          onChange={handleBudgetInputChange}
        />
        <button onClick={handleSearchBudgets}>Suche Budget</button>
      </div>

      {/* Soll/Ist Vergleich und Zuordnen */}
      <div className="action-buttons">
        <button onClick={handleShowComparison}>Soll/Ist Vergleich</button>
        <button onClick={handleAssign}>Zuordnen</button>
      </div>

      {/* Ergebnis */}
      {result && <div className="result">{result}</div>}
    </div>
  );
};

export default OwnerBudgetSearch;
