import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiService';
import './IstValueManagement.css'; // Importiere die zugehörige CSS-Datei

const IstValueManagement = ({ budgetId }) => {
  const [istValues, setIstValues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIstValue, setSelectedIstValue] = useState(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Fetch Ist-Werte beim Mounten
  useEffect(() => {
    fetchIstValues();
  }, []);

  const fetchIstValues = async () => {
    try {
      const data = await ApiService.getIstValues(budgetId);
      setIstValues(data);
    } catch (error) {
      console.error('Error fetching ist values:', error);
    }
  };

  const openModal = (istValue = null) => {
    setSelectedIstValue(istValue);
    setDate(istValue ? istValue.date : '');
    setAmount(istValue ? istValue.amount : '');
    setDescription(istValue ? istValue.description : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIstValue(null);
    setDate('');
    setAmount('');
    setDescription('');
  };

  const handleSubmit = async () => {
    const istValueData = { date, amount, description };
    try {
      if (selectedIstValue) {
        // Ist-Wert aktualisieren
        await ApiService.updateIstValue(selectedIstValue.id, istValueData);
      } else {
        // Neuen Ist-Wert erstellen
        await ApiService.createIstValue(budgetId, istValueData);
      }
      fetchIstValues();
      closeModal();
    } catch (error) {
      console.error('Error saving ist value:', error);
    }
  };

  const handleDelete = async (istValueId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Ist-Wert löschen möchten?')) return;
    try {
      await ApiService.deleteIstValue(istValueId);
      fetchIstValues();
    } catch (error) {
      console.error('Error deleting ist value:', error);
    }
  };

  return (
    <div className="istvalue-management-container">
      <h2>Ist-Wert-Verwaltung</h2>

      <button className="btn btn-primary" onClick={() => openModal(null)}>
        Neuer Ist-Wert
      </button>

      <table className="istvalue-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Betrag (€)</th>
            <th>Beschreibung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {istValues.map((istValue) => (
            <tr key={istValue.id}>
              <td>{istValue.date}</td>
              <td>{istValue.amount}</td>
              <td>{istValue.description}</td>
              <td>
                <button className="btn btn-edit" onClick={() => openModal(istValue)}>
                  Bearbeiten
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(istValue.id)}>
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
            <h3>{selectedIstValue ? 'Ist-Wert bearbeiten' : 'Neuer Ist-Wert'}</h3>
            <div className="form-group">
              <label htmlFor="istValueDate">Datum:</label>
              <input
                type="date"
                id="istValueDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="istValueAmount">Betrag (€):</label>
              <input
                type="number"
                id="istValueAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="istValueDescription">Beschreibung:</label>
              <input
                type="text"
                id="istValueDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeModal}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {selectedIstValue ? 'Speichern' : 'Erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IstValueManagement;
