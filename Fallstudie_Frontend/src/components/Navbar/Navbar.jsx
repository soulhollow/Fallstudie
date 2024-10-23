import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../Service/ApiService';
import './Navbar.css'; // Optional: Falls Sie separate CSS für die Navbar haben

const Navbar = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await ApiService.getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
                // Optional: Navigieren Sie zur Login-Seite, wenn der Benutzer nicht authentifiziert ist
                navigate('/');
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    const handleLogout = () => {
        // Token aus dem Local Storage entfernen
        localStorage.removeItem('token');
        // Benutzer auf null setzen
        setCurrentUser(null);
        // Zur Login-Seite navigieren
        navigate('/');
    };

    const renderLinks = () => {
        if (!currentUser) return null;

        switch (currentUser.roleID) {
            case 1: // Admin
                return (
                    <>
                        <Link to="/admin/usermangement">User Management</Link>
                        <Link to="/admin/audittable">Audit</Link>
                    </>
                );
            case 2: // Manager
                return (
                    <>
                        <Link to="/Management/approve">Budget Approval</Link>
                        {/* Entfernen Sie den Link zu Timetravel, da er in App.js nicht definiert ist */}
                        {/* <Link to="/Management/Timetravel">Time Travel</Link> */}
                        <Link to="/Management/Forecast">Forecast</Link>
                        <Link to="/Management/Monitoring">Monitoring</Link>
                        <Link to="/Management/ManagerBudgetSelector">Budget Selector</Link>
                    </>
                );
            case 3: // Owner
                return (
                    <>
                        <Link to="/owner/sollIst">Soll/Ist</Link>
                        <Link to="/owner/Forecast">Forecast</Link>
                    </>
                );
            case 4: // Finance
                return (
                    <>
                        <Link to="/finance/Budget">Budget</Link>
                        <Link to="/finance/sollIst">Soll/Ist</Link>
                        <Link to="/finance/CreateSoll">Create Soll</Link>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <nav className="navbar">
            {renderLinks()}
            {currentUser ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <Link to="/"><button>Login</button></Link>
                )}
        </nav>
    );
};

export default Navbar;
