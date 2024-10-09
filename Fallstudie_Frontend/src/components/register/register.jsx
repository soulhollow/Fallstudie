// RegistrationPage.jsx
import React, { useState } from 'react';
import './register.css';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
   
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Überprüfe, ob die Passwörter übereinstimmen
    if (formData.password !== formData.confirmPassword) {
      setError('Passwort stimmt nicht überein');
      return;
    }

    // Wenn alles passt, kannst du die Form-Daten senden
    console.log('Daten wurden übermittelt', formData);
    setError(''); // Fehler zurücksetzen, falls alles passt
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
