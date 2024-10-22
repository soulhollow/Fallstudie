import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService'; // Importiere deinen ApiService
import './UserManagement.css'; // Importiere eine optionale CSS-Datei für Styling
import { ROLES } from '../../constants/roles'; // Importiere die definierten Rollen

const UserManagement = () => {
  // States für die Verwaltung der Benutzer
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', password: '', roleID: '' });
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [allowedRoles, setAllowedRoles] = useState([]); // Neue State-Variable für erlaubte Rollen

  // Alle Benutzer abrufen, wenn die Komponente geladen wird
  useEffect(() => {
    loadUsers();
    fetchCurrentUser();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await ApiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      setError('Fehler beim Laden der Benutzer');
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await ApiService.getCurrentUser();
      setCurrentUser(user);
      determineAllowedRoles(user.roleID);
    } catch (error) {
      console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
      setError('Fehler beim Abrufen des aktuellen Benutzers');
    }
  };

  // Funktion zur Bestimmung der erlaubten Rollen basierend auf der Rolle des aktuellen Benutzers
  const determineAllowedRoles = (roleID) => {
    switch (roleID) {
      case 1: // Admin
        setAllowedRoles(ROLES); // Admin kann alle Rollen zuweisen
        break;
      case 2: // Manager
        setAllowedRoles(ROLES.filter(role => role.id > 1)); // Manager kann Rollen unterhalb von Admin zuweisen
        break;
      case 3: // Owner
      case 4: // Finance
        setAllowedRoles([]); // Owner und Finance können keine Rollen zuweisen
        break;
      default:
        setAllowedRoles([]);
    }
  };

  // Benutzer nach E-Mail suchen
  const searchUser = async (e) => {
    e.preventDefault();
    try {
      const user = await ApiService.getUserByEmail(searchTerm);
      setSelectedUser(user);
      setError('');
    } catch (error) {
      setError('Benutzer nicht gefunden');
      setSelectedUser(null);
    }
  };

  // Benutzer aktualisieren
  const updateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await ApiService.updateUser(selectedUser.id, selectedUser);
      setError('');
      loadUsers(); // Liste der Benutzer neu laden
      setSelectedUser(null); // Formular schließen
    } catch (error) {
      setError('Fehler beim Aktualisieren des Benutzers');
    }
  };

  // Neuen Benutzer erstellen
  const createUser = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createNewUser(newUser);
      setError('');
      setNewUser({ firstName: '', lastName: '', email: '', password: '', roleID: '' }); // Form zurücksetzen
      loadUsers(); // Liste der Benutzer neu laden
    } catch (error) {
      setError('Fehler beim Erstellen eines neuen Benutzers');
    }
  };

  // Formular für das Bearbeiten eines Benutzers anzeigen
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Formular für das Erstellen eines neuen Benutzers aktualisieren
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
      <div className="admin-panel">
        <h1>Benutzerverwaltung</h1>

        {/* Suchformular */}
        <form onSubmit={searchUser}>
          <input
              type="email"
              placeholder="Benutzer per E-Mail suchen"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
          />
          <button type="submit">Suchen</button>
        </form>

        {/* Fehlermeldung anzeigen */}
        {error && <p className="error-message">{error}</p>}

        {/* Benutzerinformationen bearbeiten */}
        {selectedUser && (
            <div className="user-edit-form">
              <h2>Benutzer bearbeiten</h2>
              <form onSubmit={updateUser}>
                <label>
                  Vorname:
                  <input
                      type="text"
                      name="firstName"
                      value={selectedUser.firstName || ''}
                      onChange={handleUserChange}
                      required
                  />
                </label>
                <label>
                  Nachname:
                  <input
                      type="text"
                      name="lastName"
                      value={selectedUser.lastName || ''}
                      onChange={handleUserChange}
                      required
                  />
                </label>
                <label>
                  E-Mail:
                  <input
                      type="email"
                      name="email"
                      value={selectedUser.email || ''}
                      onChange={handleUserChange}
                      required
                  />
                </label>
                <label>
                  Rolle:
                  {allowedRoles.length > 0 ? (
                      <select
                          name="roleID"
                          value={selectedUser.roleID}
                          onChange={handleUserChange}
                          required
                      >
                        <option value="">-- Rolle auswählen --</option>
                        {allowedRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                        ))}
                      </select>
                  ) : (
                      <input
                          type="number"
                          name="roleID"
                          value={selectedUser.roleID || ''}
                          onChange={handleUserChange}
                          required
                          placeholder="Rollen-ID eingeben"
                          disabled
                      />
                  )}
                </label>
                <label>
                  Passwort:
                  <input
                      type="password"
                      name="password"
                      placeholder="Neues Passwort (optional)"
                      onChange={handleUserChange}
                  />
                </label>
                <button type="submit">Aktualisieren</button>
                <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                >
                  Abbrechen
                </button>
              </form>
            </div>
        )}

        {/* Neuen Benutzer erstellen */}
        {allowedRoles.length > 0 && (
            <div className="new-user-form">
              <h2>Neuen Benutzer erstellen</h2>
              <form onSubmit={createUser}>
                <label>
                  Vorname:
                  <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleNewUserChange}
                      required
                  />
                </label>
                <label>
                  Nachname:
                  <input
                      type="text"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleNewUserChange}
                      required
                  />
                </label>
                <label>
                  E-Mail:
                  <input
                      type="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      required
                  />
                </label>
                <label>
                  Rolle:
                  {allowedRoles.length > 0 ? (
                      <select
                          name="roleID"
                          value={newUser.roleID}
                          onChange={handleNewUserChange}
                          required
                      >
                        <option value="">-- Rolle auswählen --</option>
                        {allowedRoles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                        ))}
                      </select>
                  ) : (
                      <input
                          type="number"
                          name="roleID"
                          value={newUser.roleID}
                          onChange={handleNewUserChange}
                          required
                          placeholder="Rollen-ID eingeben"
                          disabled
                      />
                  )}
                </label>
                <label>
                  Passwort:
                  <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                      required
                  />
                </label>
                <button type="submit">Benutzer erstellen</button>
              </form>
            </div>
        )}

        {/* Benutzerliste */}
        <h2>Benutzerliste</h2>
        <table>
          <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>E-Mail</th>
            <th>Rolle (ID)</th>
            <th>Aktionen</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.roleID}</td>
                <td>
                  <button onClick={() => setSelectedUser(user)}>Bearbeiten</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default UserManagement;
