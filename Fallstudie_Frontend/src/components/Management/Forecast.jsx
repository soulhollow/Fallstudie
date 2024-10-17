import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './Forecast.css';

const Forecast = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [forecastBudgets, setForecastBudgets] = useState([]);
    const [expandedBudget, setExpandedBudget] = useState(null);
    const [istData, setIstData] = useState([]);
    const [sollData, setSollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const user = await ApiService.getCurrentUser();
                setCurrentUser(user);
                    const allBudgets = await ApiService.getBudgetsByManager(user.id);
                    const forecastBudgets = allBudgets.filter(budget => budget.forecast);
                    setForecastBudgets(forecastBudgets);

            } catch (err) {
                setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
                console.error('Fehler:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBudgetClick = async (budget) => {
        if (expandedBudget === budget.id) {
            setExpandedBudget(null);
            setIstData([]);
            setSollData([]);
        } else {
            setExpandedBudget(budget.id);
            try {
                const [istResponse, sollResponse] = await Promise.all([
                    ApiService.getIstByBudget(budget.id),
                    ApiService.getSollByBudget(budget.id)
                ]);
                setIstData(istResponse);
                setSollData(sollResponse);
            } catch (err) {
                console.error('Fehler beim Laden der Ist- und Soll-Daten:', err);
            }
        }
    };

    const renderIstSollTable = () => {
        const allNames = [...new Set([...istData.map(i => i.name), ...sollData.map(s => s.name)])];

        return (
            <table className="ist-soll-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Ist-Betrag</th>
                    <th>Soll-Betrag</th>
                    <th>Differenz</th>
                </tr>
                </thead>
                <tbody>
                {allNames.map(name => {
                    const istItem = istData.find(i => i.name === name) || { betrag: 0 };
                    const sollItem = sollData.find(s => s.name === name) || { betrag: 0 };
                    const differenz = istItem.betrag - sollItem.betrag;

                    return (
                        <tr key={name}>
                            <td>{name}</td>
                            <td>{istItem.betrag.toFixed(2)} €</td>
                            <td>{sollItem.betrag.toFixed(2)} €</td>
                            <td className={differenz >= 0 ? 'positive' : 'negative'}>
                                {differenz.toFixed(2)} €
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    };

    if (loading) {
        return <div>Lade Forecast-Budgets...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="manager-forecast-budgets">
            <h1>Forecast-Budgets für {currentUser?.name}</h1>

            {forecastBudgets.length > 0 ? (
                <div>
                    {forecastBudgets.map((budget) => (
                        <div key={budget.id} className="budget-item">
                            <div className="budget-header" onClick={() => handleBudgetClick(budget)}>
                                <h2>{budget.name}</h2>
                                <p>Verfügbares Budget: {budget.availableBudget} €</p>
                                <p>Besitzer: {budget.owner.firstName} {budget.owner.lastName}</p>
                                <p>Finanzverantwortlicher: {budget.finance.firstName} {budget.finance.lastName}</p>
                                <p>Erstellungsdatum: {format(new Date(budget.timestamp), 'dd.MM.yyyy', { locale: de })}</p>
                                <p>Status: {budget.approved ? 'Genehmigt' : 'Nicht genehmigt'}</p>
                            </div>
                            {expandedBudget === budget.id && (
                                <div className="budget-details">
                                    <h3>Ist- und Soll-Werte</h3>
                                    {renderIstSollTable()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Keine Forecast-Budgets verfügbar.</p>
            )}
        </div>
    );
};

export default Forecast;