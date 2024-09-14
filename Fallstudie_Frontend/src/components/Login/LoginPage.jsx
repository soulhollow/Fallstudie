import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Create an instance of useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this with actual login logic
    console.log('Email:', email);
    console.log('Password:', password);
    // Example navigation
    navigate('/home'); // Adjust according to your routing setup
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Willkommen</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
          <p></p>
          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
