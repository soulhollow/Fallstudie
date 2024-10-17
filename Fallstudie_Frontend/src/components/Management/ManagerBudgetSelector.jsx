import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import TimeTravelBudget from './TimeTravelBudget';
import './ManagerBudgetSelector.css';

const ManagerBudgetSelector = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [selectedBudgetName, setSelectedBudgetName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const user = await ApiService.getCurrentUser();
                setCurrentUser(user);
                const managerBudgets = await ApiService.getBudgetsByManager(user.id);
                setBudgets(managerBudgets);
            } catch (err) {
                setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
                console.error('Fehler:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBudgetSelect = (event) => {
        setSelectedBudgetName(event.target.value);
    };

    if (loading) {
        return <div>Lade Daten...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="manager-budget-selector">
            <h1>Willkommen, {currentUser?.name}</h1>

            {budgets.length > 0 ? (
                <div className="budget-selection">
                    <h2>Wählen Sie ein Budget aus:</h2>
                    <select onChange={handleBudgetSelect} value={selectedBudgetName}>
                        <option value="">-- Bitte wählen Sie ein Budget --</option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.name}>
                                {budget.name}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>Keine Budgets verfügbar.</p>
            )}

            {selectedBudgetName && (
                <TimeTravelBudget budgetName={selectedBudgetName} />
            )}
        </div>
    );
};

export default ManagerBudgetSelector;