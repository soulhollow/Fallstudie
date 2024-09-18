// AdminPanel.jsx
import React, { useState } from 'react';
import './adminpanel.css';

const AdminPanel = () => {
  const [searchData, setSearchData] = useState({
    username: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchData);
    // Hier kann eine Suchfunktion implementiert werden
  };

  const handleChangeRole = () => {
    console.log('Change Role for:', searchData);
    // Hier kann eine Funktion zum Ändern der Rolle implementiert werden
  };

  const handleDeletePerson = () => {
    console.log('Delete Person:', searchData);
    // Hier kann eine Funktion zum Löschen der Person implementiert werden
  };

  const handleChangePassword = () => {
    console.log('Change Password for:', searchData);
    // Hier kann eine Funktion zum Ändern des Passworts implementiert werden
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="username">Benutzername:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={searchData.username}
            onChange={handleChange}
            placeholder="Gib einen Benutzernamen ein"
            required
          />
        </div>

       

        <button type="submit" className="search-button">Suchen</button>
      </form>

      <div className="admin-actions">
        <button onClick={handleChangeRole} className="action-button">Role ändern</button>
        <button onClick={handleDeletePerson} className="action-button delete-button">Person löschen</button>
        <button onClick={handleChangePassword} className="action-button">Passwort ändern</button>
      </div>
    </div>
  );
};

export default AdminPanel;
