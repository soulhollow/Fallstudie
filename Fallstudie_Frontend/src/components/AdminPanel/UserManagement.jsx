import React, { useState, useEffect } from 'react';
import ApiService from '../Service/ApiService';
import './UserManagement.css'; // Importiere die zugehörige CSS-Datei

const roles = ['Admin', 'Owner', 'Finance'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  // Benutzer beim Mounten laden
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await ApiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
    }
  };

  const openModal = (user = null) => {
    setSelectedUser(user);
    setUsername(user ? user.username : '');
    setRole(user ? user.role : '');
    setPassword('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUsername('');
    setRole('');
    setPassword('');
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const userData = { username, role, password };
    try {
      if (selectedUser) {
        // Benutzer aktualisieren
        await ApiService.updateUser(selectedUser.id, userData);
      } else {
        // Neuen Benutzer erstellen
        await ApiService.createUser(userData);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Fehler beim Speichern des Benutzers:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) return;
    try {
      await ApiService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
    }
  };

  return (
    <div className="user-management-container">
      <h2>Benutzerverwaltung</h2>
      <button className="btn btn-primary" onClick={() => openModal()}>
        Neuen Benutzer erstellen
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>Benutzername</th>
            <th>Rolle</th>
            <th>Erstellungsdatum</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-edit" onClick={() => openModal(user)}>
                  Bearbeiten
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal zum Erstellen/Bearbeiten eines Benutzers */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}</h3>
            <div className="form-group">
              <label htmlFor="username">Benutzername:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Rolle:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Wählen...</option>
                {roles.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption}
                  </option>
                ))}
              </select>
            </div>
            {!selectedUser && (
              <div className="form-group">
                <label htmlFor="password">Passwort:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleSubmit}>
                {selectedUser ? 'Speichern' : 'Erstellen'}
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
