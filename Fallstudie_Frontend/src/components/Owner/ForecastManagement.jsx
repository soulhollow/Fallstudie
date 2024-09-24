import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiService';
import './ForecastManagement.css'; // Importiere die zugehörige CSS-Datei

const ForecastManagement = ({ budgetId }) => {
  const [forecasts, setForecasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  // Fetch Forecast-Werte beim Mounten
  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    try {
      const data = await ApiService.getForecasts(budgetId);
      setForecasts(data);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    }
  };

  const openModal = (forecast = null) => {
    setSelectedForecast(forecast);
    setDate(forecast ? forecast.date : '');
    setAmount(forecast ? forecast.amount : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedForecast(null);
    setDate('');
    setAmount('');
  };

  const handleSubmit = async () => {
    const forecastData = { date, amount };
    try {
      if (selectedForecast) {
        // Forecast-Wert aktualisieren
        await ApiService.updateForecast(selectedForecast.id, forecastData);
      } else {
        // Neuen Forecast-Wert erstellen
        await ApiService.createForecast(budgetId, forecastData);
      }
      fetchForecasts();
      closeModal();
    } catch (error) {
      console.error('Error saving forecast:', error);
    }
  };

  const handleDelete = async (forecastId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Forecast-Wert löschen möchten?')) return;
    try {
      await ApiService.deleteForecast(forecastId);
      fetchForecasts();
    } catch (error) {
      console.error('Error deleting forecast:', error);
    }
  };

  return (
    <div className="forecast-management-container">
      <h2>Forecast-Verwaltung</h2>

      <button className="btn btn-primary" onClick={() => openModal(null)}>
        Neuer Forecast-Wert
      </button>

      <table className="forecast-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Forecast-Betrag (€)</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast) => (
            <tr key={forecast.id}>
              <td>{forecast.date}</td>
              <td>{forecast.amount}</td>
              <td>
                <button className="btn btn-edit" onClick={() => openModal(forecast)}>
                  Bearbeiten
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(forecast.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal für Erstellen/Bearbeiten */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedForecast ? 'Forecast-Wert bearbeiten' : 'Neuer Forecast-Wert'}</h3>
            <div className="form-group">
              <label htmlFor="forecastDate">Datum:</label>
              <input
                type="date"
                id="forecastDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="forecastAmount">Forecast-Betrag (€):</label>
              <input
                type="number"
                id="forecastAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeModal}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {selectedForecast ? 'Speichern' : 'Erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastManagement;
