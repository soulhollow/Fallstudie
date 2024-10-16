import React from 'react';
import './Header.css';
import Navbar from '../Navbar/Navbar';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">MyWebApp</div>
            <Navbar />
        </header>
    );
};

export default Header;