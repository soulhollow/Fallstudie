import React from 'react';
import './Header.css';
import Navbar from '../Navbar/Navbar';
import companyLogo from "../../assets/company-logo.png";

const Header = () => {
    return (
        <header className="header">
            <img src={companyLogo} alt="Firmenlogo" className="company-logo"/>
            <Navbar/>
        </header>
    );
};

export default Header;