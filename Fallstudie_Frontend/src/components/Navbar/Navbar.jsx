import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../Service/ApiService';

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
            }
        };

        fetchCurrentUser();
    }, []);

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
                        <Link to="/Management/Timetravel">Time Travel</Link>
                        <Link to="/Management/Forecast">Forecast</Link>
                        <Link to="/Management/Monitoring">Monitoring</Link>
                        <Link to="/Management/ManagerBudgetSelector">Budget Selector</Link>
                    </>
                );
            case 3: // Owner
                return (
                    <>
                        <Link to="/owner/kosten">Kosten</Link>
                        <Link to="/owner/sollIst">Soll/Ist</Link>
                    </>
                );
            case 4: // Finance
                return (
                    <>
                        <Link to="/finance/Budget">Budget</Link>
                        <Link to="/finance/sollIst">Soll/Ist</Link>
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
                <Link to="/"></Link>
            )}
        </nav>
    );
};

export default Navbar;