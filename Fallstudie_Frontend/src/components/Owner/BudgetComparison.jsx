import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ApiService from '../Service/ApiService';
import './BudgetComparison.css'; // Importiere die zugehörige CSS-Datei

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registriere Chart.js Komponenten
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const BudgetComparison = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Budgets beim ersten Rendern
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await ApiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchComparisonData = async () => {
    const filterParams = {
      budgetId: selectedBudget,
      startDate,
      endDate,
    };

    try {
      const data = await ApiService.getBudgetComparison(filterParams);
      setComparisonData(data);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
  };

  const chartData = comparisonData
    ? {
        labels: comparisonData.dates,
        datasets: [
          {
            label: 'Soll-Werte',
            data: comparisonData.sollValues,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
          {
            label: 'Ist-Werte',
            data: comparisonData.istValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: 'Forecast-Werte',
            data: comparisonData.forecastValues,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
          },
        ],
      }
    : null;

  return (
    <div className="budget-comparison-container">
      <h2 className="title">Soll-Ist-Vergleich</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="selectedBudget">Budget auswählen:</label>
          <select
            id="selectedBudget"
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="select-input"
          >
            <option value="">Wählen...</option>
            {budgets.map((budget) => (
              <option key={budget.id} value={budget.id}>
                {budget.budgetName}
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
            className="date-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Enddatum:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="form-group button-group">
          <button className="btn fetch-button" onClick={fetchComparisonData}>
            Daten abrufen
          </button>
        </div>
      </div>

      {comparisonData && (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default BudgetComparison;
