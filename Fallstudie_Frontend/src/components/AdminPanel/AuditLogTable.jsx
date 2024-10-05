import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import './AuditLogTable.css'; // Importiere die zugehörige CSS-Datei

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    date: '',
    user: '',
    action: '',
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    fetchAuditLogs();
    // Optional: Verfügbare Benutzer und Aktionen laden
  }, [page, rowsPerPage, filters]);

  const fetchAuditLogs = async () => {
    const params = {
      page: page,
      pageSize: rowsPerPage,
      date: filters.date,
      user: filters.user,
      action: filters.action,
    };
    try {
      const data = await ApiService.getAuditLogs(params);
      setLogs(data.logs);
      setTotalLogs(data.total);
      // Optional: Setze verfügbare Benutzer und Aktionen, falls von API bereitgestellt
    } catch (error) {
      console.error('Fehler beim Abrufen der Audit-Logs:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterReset = () => {
    setFilters({
      date: '',
      user: '',
      action: '',
    });
    setPage(1);
  };

  const totalPages = Math.ceil(totalLogs / rowsPerPage);

  return (
    <div className="audit-log-container">
      <h2>Audit-Logs</h2>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="date">Datum:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="user">Benutzer:</label>
          <select
            id="user"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
          >
            <option value="">Alle Benutzer</option>
            {availableUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="action">Aktion:</label>
          <select
            id="action"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
          >
            <option value="">Alle Aktionen</option>
            {availableActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button className="btn btn-primary" onClick={fetchAuditLogs}>
            Anwenden
          </button>
          <button className="btn btn-secondary" onClick={handleFilterReset}>
            Zurücksetzen
          </button>
        </div>
      </div>

      <table className="audit-log-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Benutzer</th>
            <th>Aktion</th>
            <th>Beschreibung</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.date}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="rows-per-page">
          <label htmlFor="rowsPerPage">Zeilen pro Seite:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <div className="page-controls">
          <button
            className="btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Zurück
          </button>
          <span>
            Seite {page} von {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
