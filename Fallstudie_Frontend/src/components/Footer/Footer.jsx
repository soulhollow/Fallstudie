import React from 'react';
import './Footer.css';
import companyLogo from '../../assets/company-logo.png';

const Footer = () => {
  return (
      <footer className="footer">
        <div className="footer-content">
          {/* Unternehmenslogo und Name */}
          <div className="footer-section company-info">
            <img src={companyLogo} alt="Firmenlogo" className="company-logo" />
          </div>

          {/* Kontaktinformationen */}
          <div className="footer-section contact">
            <h4>Kontakt</h4>
            <p>Email: aps@firma.de</p>
            <p>Telefon: +49 123 456789</p>
          </div>

          {/* Rechtliche Hinweise oder Unternehmensrichtlinien */}
          <div className="footer-section legal">
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="/datenschutz">Datenschutz</a></li>
              <li><a href="/impressum">Impressum</a></li>
            </ul>
          </div>
        </div>

        {/* Untere Leiste mit Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} APS. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
  );
};

export default Footer;
