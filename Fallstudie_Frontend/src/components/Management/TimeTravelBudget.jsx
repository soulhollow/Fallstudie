import React, { useState, useEffect } from 'react';
import ApiService from '../../Service/ApiService';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import './TimeTravelBudget.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Chart.js Komponenten registrieren
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const TimeTravelBudget = ({ budgetName }) => {
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

                // Lade das Budget mit dem Namen
                const budgetResponse = await ApiService.getBudgetByName(budgetName);
                setBudget(budgetResponse);

                if (budgetResponse) {
                    const sollResponse = await ApiService.getSollByBudget(budgetResponse.id);
                    setSollData(sollResponse);

                    const istResponse = await ApiService.getIstByBudget(budgetResponse.id);
                    setIstData(istResponse);
                }

                setLoading(false);
            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
                setError('Fehler beim Laden der Budgetdaten. Bitte versuchen Sie es später erneut.');
                setLoading(false);
            }
        };

        if (budgetName) {
            fetchData();
        }
    }, [budgetName]);

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

    const prepareChartData = () => {
        // Kombiniere alle relevanten Zeitpunkte aus sollData und istData
        const allDates = [
            ...sollData.map(item => new Date(item.timestamp)),
            ...istData.map(item => new Date(item.timestamp))
        ];

        // Entferne Duplikate und sortiere die Daten
        const uniqueDates = Array.from(new Set(allDates.map(date => date.toISOString()))).map(iso => new Date(iso));
        uniqueDates.sort((a, b) => a - b);

        // Erstelle Labels im gewünschten Format
        const labels = uniqueDates.map(date => format(date, 'dd. MMM yyyy'));

        // Aggregiere die Beträge bis zu jedem Datum
        const cumulativeSoll = uniqueDates.map(date => {
            return sollData
                .filter(item => new Date(item.timestamp) <= date)
                .reduce((acc, curr) => acc + curr.betrag, 0);
        });

        const cumulativeIst = uniqueDates.map(date => {
            return istData
                .filter(item => new Date(item.timestamp) <= date)
                .reduce((acc, curr) => acc + curr.betrag, 0);
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Soll',
                    data: cumulativeSoll,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                },
                {
                    label: 'Ist',
                    data: cumulativeIst,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                },
            ],
        };
    };

    if (loading) {
        return <div>Lade Budgetdaten...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!budget) {
        return <div>Kein Budget gefunden.</div>;
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
                <p>Besitzer: {budget.owner.firstName} {budget.owner.lastName}</p>
                <p>Manager: {budget.manager.firstName} {budget.manager.lastName}</p>
                <p>Finanzverantwortlicher: {budget.finance.firstName} {budget.finance.lastName}</p>
                <p>Status: {budget.approved ? 'Genehmigt' : 'Nicht genehmigt'}</p>
            </div>

            {/* Diagramm hinzufügen */}
            <div className="budget-chart">
                <h3>Budgetverlauf</h3>
                <Line
                    data={prepareChartData()}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Budgetverlauf über die Zeit',
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Datum',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Betrag (€)',
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TimeTravelBudget;
