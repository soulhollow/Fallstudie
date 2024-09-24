import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Button, TextField, MenuItem, Grid, Typography } from '@mui/material';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ApiService from '../Service/ApiService';

// Registriere Chart.js Komponenten
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const BudgetComparison = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch Budgets beim ersten Rendern
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await ApiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchComparisonData = async () => {
    const filterParams = {
      budgetId: selectedBudget,
      startDate,
      endDate,
    };

    try {
      const data = await ApiService.getBudgetComparison(filterParams);
      setComparisonData(data);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    }
  };

  const chartData = comparisonData
    ? {
        labels: comparisonData.dates,
        datasets: [
          {
            label: 'Soll-Werte',
            data: comparisonData.sollValues,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
          {
            label: 'Ist-Werte',
            data: comparisonData.istValues,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
          {
            label: 'Forecast-Werte',
            data: comparisonData.forecastValues,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: true,
          },
        ],
      }
    : null;

  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Soll-Ist-Vergleich
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Budget auswählen"
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
          >
            {budgets.map((budget) => (
              <MenuItem key={budget.id} value={budget.id}>
                {budget.budgetName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Startdatum"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Enddatum"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={fetchComparisonData}
            sx={{ height: '100%' }}
          >
            Daten abrufen
          </Button>
        </Grid>
      </Grid>

      {comparisonData && (
        <Box sx={{ marginTop: '2rem' }}>
          <Line data={chartData} />
        </Box>
      )}
    </Box>
  );
};

export default BudgetComparison;
