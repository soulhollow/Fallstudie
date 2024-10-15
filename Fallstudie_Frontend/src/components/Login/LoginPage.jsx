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
      // z.B. localStorage.setItem("token", data.token);

      // Weiterleitung zur Dashboard-Seite nach erfolgreichem Login
      navigate("/admin/usermangement");

    } catch (err) {
      // Fehlerbehandlung
      setError(err.response?.data?.message || 'An error occurred during login.');
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
            <div>
            </div>
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
