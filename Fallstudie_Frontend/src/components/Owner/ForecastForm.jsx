// src/pages/ForecastForm.jsx
import React, { useState } from 'react';
import './ForecastPage.css';

const ForecastForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [betrag, setBetrag] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name ist erforderlich.';
        if (!betrag) {
            newErrors.betrag = 'Betrag ist erforderlich.';
        } else if (isNaN(betrag) || Number(betrag) <= 0) {
            newErrors.betrag = 'Bitte einen gültigen Betrag eingeben.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAdd({ name, betrag: Number(betrag) });
            setName('');
            setBetrag('');
            setErrors({});
        }
    };

    return (
        <div className="forecast-form">
            <h2>Neuen Forecast hinzufügen</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div>
                    <label htmlFor="betrag">Betrag (€):</label>
                    <input
                        type="number"
                        id="betrag"
                        value={betrag}
                        onChange={(e) => setBetrag(e.target.value)}
                    />
                    {errors.betrag && <span className="error">{errors.betrag}</span>}
                </div>
                <button type="submit">Hinzufügen</button>
            </form>
        </div>
    );
};

export default ForecastForm;
