import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: -1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

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
        body: JSON.stringify({ username, password }),
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
    <Container>
      <FormWrapper>
        <Title>Anmeldung</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login</Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default Login;
