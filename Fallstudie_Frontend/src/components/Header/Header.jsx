// src/components/Header/Header.js
import React, { useContext } from 'react';
import './Header.css';
import Navbar from '../Navbar/Navbar';
import companyLogo from "../../assets/company-logo.png";
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaSun, FaMoon } from 'react-icons/fa'; // Icons für den Button

const Header = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <header className={`header ${darkMode ? 'dark' : 'light'}`}>
            <img src={companyLogo} alt="Firmenlogo" className="company-logo" />
            <button onClick={toggleDarkMode} className="dark-mode-button">
                {darkMode ? <FaSun /> : <FaMoon />} {/* Ändert das Icon je nach Modus */}

            </button>
            <div className="spacer" />
            <Navbar />
        </header>
    );
};

export default Header;
