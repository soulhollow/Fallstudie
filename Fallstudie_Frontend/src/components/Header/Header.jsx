import React from 'react';
import './Header.css'; // Importiere die zugehörige CSS-Datei
import { useRole } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null); // Zurücksetzen der Rolle beim Logout
    navigate('/login'); // Navigation zur Login-Seite
  };

  return (
    <header className="app-header">
      <div className="toolbar">
        <div className="title">Dashboard ({role})</div>
        <button className="btn logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
