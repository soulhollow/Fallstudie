import React, { useState } from "react";
import './Login.css'; // Importiere die zugehörige CSS-Datei
import ApiService from '../../Service/ApiService'; // Importiere deinen ApiService
import { useNavigate } from 'react-router-dom'; // Zum Weiterleiten nach Login

const Login = () => {
  // State für E-Mail, Passwort und Fehler
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // React Router hook for navigation

  // Funktion zum Handling des Submit-Events
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert, dass das Formular neu geladen wird
    setError(""); // Fehlernachricht zurücksetzen

    try {
      // Erstelle das Login-Request-Objekt
      const loginRequest = { email, password };

      // Aufruf der ApiService login-Methode
      const data = await ApiService.login(loginRequest);

      // Bei Erfolg, speichere Token und leite den Benutzer weiter
      console.log("Login erfolgreich:", data);
      localStorage.setItem("token", data.token);

      // Rufe die aktuellen Benutzerinformationen ab
      const currentUser = await ApiService.getCurrentUser();

      // Bestimme die Zielroute basierend auf der Rolle
      const targetRoute = getRouteByRole(currentUser.roleID);

      // Weiterleitung zur entsprechenden Seite
      navigate(targetRoute);

    } catch (err) {
      console.error(err);
      // Fehlerbehandlung: Zeige spezifische Fehlermeldungen an, falls verfügbar
      const errorMessage = err.response?.data?.message || 'Ein Fehler ist beim Login aufgetreten.';
      setError(errorMessage);
    }
  };

  // Funktion zur Zuordnung von Rollen zu Routen
  const getRouteByRole = (roleID) => {
    switch (roleID) {
      case 1: // Admin
        return "/admin/usermangement";
      case 2: // Manager
        return "/Management/approve";
      case 3: // Owner
        return "/owner/sollIst";
      case 4: // Finance
        return "/finance/Budget";
      default:
        return "/"; // Fallback zur Login-Seite
    }
  };

  return (
      <div className="login-container">
        <div className="form-wrapper">
          <h1>Willkommen bei APS</h1>
          <h2 className="title">Anmeldung</h2>
          <form onSubmit={handleSubmit}>
            <input
                type="email"
                className="input"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                className="input"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <div></div>
            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
