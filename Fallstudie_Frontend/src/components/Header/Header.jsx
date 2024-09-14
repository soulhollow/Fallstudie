// Header.jsx
import React from 'react';
import './Header.css'; // Assuming the styles are in a separate CSS file

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h1>MyOrga</h1>
      </div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
