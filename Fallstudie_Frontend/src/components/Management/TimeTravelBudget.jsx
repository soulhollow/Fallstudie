import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService'; // Annahme: ApiService ist korrekt importiert
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './TimeTravelBudget.css';

const TimeTravelBudget = ({ budgetId }) => {
    const [budget, setBudget] = useState(null);
    const [sollData, setSollData] = useState([]);
    const [istData, setIstData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lade das Budget direkt mit der ID
                const budgetResponse = await ApiService.getBudgetById(budgetId);
                setBudget(budgetResponse);

                const sollResponse = await ApiService.getSollByBudget(budgetId);
                setSollData(sollResponse);

                const istResponse = await ApiService.getIstByBudget(budgetId);
                setIstData(istResponse);

                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
                setError('Fehler beim Laden der Budgetdaten. Bitte versuchen Sie es später erneut.');
                setLoading(false);
            }
        };

        if (budgetId) {
            fetchData();
        }
    }, [budgetId]);

    const handleDateChange = (event) => {
        setCurrentDate(new Date(event.target.value));
    };

    const getCurrentBudgetState = () => {
        if (!budget || !sollData.length || !istData.length) return null;

        const currentSoll = sollData
            .filter(soll => new Date(soll.timestamp) <= currentDate)
            .reduce((acc, curr) => acc + curr.betrag, 0);

        const currentIst = istData
            .filter(ist => new Date(ist.timestamp) <= currentDate)
            .reduce((acc, curr) => acc + curr.betrag, 0);

        return {
            soll: currentSoll,
            ist: currentIst,
            differenz: currentSoll - currentIst
        };
    };

    const currentState = getCurrentBudgetState();

    if (loading) {
        return <div>Lade Budgetdaten...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!budget) {
        return <div>Kein Budget ausgewählt.</div>;
    }

    return (
        <div className="time-travel-budget">
            <h2>Zeitreise für Budget: {budget.name}</h2>

            <div className="date-selector">
                <label htmlFor="date-input">Datum auswählen: </label>
                <input
                    type="date"
                    id="date-input"
                    value={format(currentDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    max={format(new Date(), 'yyyy-MM-dd')}
                />
            </div>

            {currentState && (
                <div className="budget-state">
                    <h3>Budgetstatus am {format(currentDate, 'dd. MMMM yyyy', { locale: de })}</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Typ</th>
                            <th>Betrag</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Soll</td>
                            <td>{currentState.soll.toFixed(2)} €</td>
                        </tr>
                        <tr>
                            <td>Ist</td>
                            <td>{currentState.ist.toFixed(2)} €</td>
                        </tr>
                        <tr>
                            <td>Differenz</td>
                            <td className={currentState.differenz >= 0 ? 'positive' : 'negative'}>
                                {currentState.differenz.toFixed(2)} €
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <div className="budget-details">
                <h3>Budgetdetails</h3>
                <p>Verfügbares Budget: {budget.availableBudget} €</p>
                <p>Besitzer: {budget.owner}</p>
                <p>Manager: {budget.manager}</p>
                <p>Finanzverantwortlicher: {budget.finance}</p>
                <p>Status: {budget.approved ? 'Genehmigt' : 'Nicht genehmigt'}</p>
            </div>
        </div>
    );
};

export default TimeTravelBudget;