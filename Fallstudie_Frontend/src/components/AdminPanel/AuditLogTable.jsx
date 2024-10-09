import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';  // Stelle sicher, dass der Pfad korrekt ist
import './AuditLogTable.css';  // Optional: Dein CSS für das Styling

const AuditLogTable = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lädt die Audit-Logs von der API
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const logs = await ApiService.getAllAuditLogs();
        setAuditLogs(logs);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Audit-Logs');
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="audit-log-table-container">
      <h2>Audit Logs</h2>
      <table className="audit-log-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{log.entity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
