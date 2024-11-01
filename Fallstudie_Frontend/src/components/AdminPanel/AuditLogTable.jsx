import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';  // Stelle sicher, dass der Pfad korrekt ist
import './AuditLogTable.css';  // Optional: Dein CSS für das Styling

const AuditLogTable = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuditLogsAndUsers = async () => {
      try {
        // Schritt 1: Audit-Logs abrufen
        const logs = await ApiService.getAllAuditLogs();

        // Schritt 2: Audit-Logs nach Timestamp absteigend sortieren
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Schritt 3: Einzigartige Benutzer-IDs extrahieren
        const userIds = [...new Set(logs.map(log => log.userId))];

        // Schritt 4: Benutzerdetails abrufen
        const allUsers = await ApiService.getAllUsers();

        // Schritt 5: Benutzer-ID zu Benutzer-Daten mapen
        const usersMap = {};
        allUsers.forEach(user => {
          if (userIds.includes(user.id)) {  // Nur relevante Benutzer speichern
            usersMap[user.id] = user;
          }
        });

        // Schritt 6: State aktualisieren
        setAuditLogs(logs);
        setUsers(usersMap);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Audit-Logs oder Benutzerdaten');
        setLoading(false);
      }
    };

    fetchAuditLogsAndUsers();
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
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
          </tr>
          </thead>
          <tbody>
          {auditLogs.map((log) => {
            const user = users[log.userId];
            return (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>
                    {user ? `${user.firstName} ${user.lastName}` : 'Unbekannter Benutzer'}
                  </td>
                  <td>{log.action}</td>
                  <td>{log.entity}</td>
                </tr>
            );
          })}
          </tbody>
        </table>
      </div>
  );
};

export default AuditLogTable;
