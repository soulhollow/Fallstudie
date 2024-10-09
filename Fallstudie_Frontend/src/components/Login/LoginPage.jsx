import React, { useState } from "react";
import './Login.css'; // Importiere die zugehörige CSS-Datei
import ApiService from '../../Service/ApiService';

const Login = () => {
  // State für Benutzernamen, Passwort und Fehler
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Funktion zum Handling des Submit-Events
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // API-Aufruf zur Verifizierung der Anmeldedaten
    try {
      const response = await fetch("https://api.example.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Anmeldung fehlgeschlagen");
      }

      // Bei Erfolg, speichere Token oder leite den Benutzer weiter
      console.log("Login erfolgreich:", data);
      // z.B. localStorage.setItem("token", data.token);
      // Weiterleitung zu einer anderen Seite
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2 className="title">Anmeldung</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="E-mail"
            value={mail}
            onChange={(e) => setUsername(e.target.value)}
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
