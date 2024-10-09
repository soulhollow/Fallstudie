import React from 'react';
import './App.css'; // Die CSS-Datei

const Header = ({ role }) => {
  // Funktion, um Links basierend auf der Rolle zu rendern
  const renderLinks = () => {
    switch (role) {
      case 'owner':
        return (
          <>
            <a href="/status">Status</a>
            <a href="/kosten">Kosten</a>
            <a href="/forecast">Forecast</a>
            <a href="/soll-ist">Soll/Ist</a>
          </>
        );
      case 'admin':
        return (
          <>
            <a href="/user-management">User Management</a>
            <a href="/audit">Audit</a>
            <a href="/logout">Logout</a>
          </>
        );
      case 'finance':
        return (
          <>
            <a href="/budget-management">Budgetmanagement</a>
            <a href="/soll-ist">Soll/Ist</a>
            <a href="/logout">Logout</a>
          </>
        );
      case 'management':
        return (
          <>
            <a href="/monitoring">Monitoring</a>
            <a href="/time-travel">Time Travel</a>
            <a href="/budget-approval">Budget Approval</a>
            <a href="/forecast-anzeigen">Forecast anzeigen</a>
            <a href="/logout">Logout</a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="header">
      <div className="logo">MyWebApp</div>
      <nav className="nav-links">
        {renderLinks()}
      </nav>
    </header>
  );
};

export default Header;
