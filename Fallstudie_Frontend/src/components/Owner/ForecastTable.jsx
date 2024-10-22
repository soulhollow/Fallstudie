// src/components/ForecastTable.jsx
import React from 'react';
import './ForecastPage.css';

const ForecastTable = ({ forecasts, onEdit }) => {
    if (forecasts.length === 0) {
        return <p>Keine Forecasts vorhanden.</p>;
    }
    const formatDate = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };


    return (
        <div className="forecast-table">
            <h2>Bestehende Forecasts</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Betrag (€)</th>
                    <th>Datum</th>
                    <th>Aktionen</th>
                </tr>
                </thead>
                <tbody>
                {forecasts.map((forecast) => (
                    <tr key={forecast.id}>
                        <td>{forecast.name}</td>
                        <td>
                            {forecast.betrag.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </td>
                        <td>{formatDate(new Date(forecast.timestamp))}</td>
                        <td>
                            <button onClick={() => onEdit(forecast)}>Bearbeiten</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ForecastTable;