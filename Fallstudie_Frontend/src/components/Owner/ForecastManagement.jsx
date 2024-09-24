import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ApiService from '../Service/ApiService';

const ForecastManagement = ({ budgetId }) => {
  const [forecasts, setForecasts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  // Fetch Forecast-Werte beim Mounten
  useEffect(() => {
    fetchForecasts();
  }, []);

  const fetchForecasts = async () => {
    try {
      const data = await ApiService.getForecasts(budgetId);
      setForecasts(data);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
    }
  };

  const handleOpen = (forecast = null) => {
    setSelectedForecast(forecast);
    setDate(forecast ? forecast.date : '');
    setAmount(forecast ? forecast.amount : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedForecast(null);
    setDate('');
    setAmount('');
  };

  const handleSubmit = async () => {
    const forecastData = { date, amount };
    try {
      if (selectedForecast) {
        // Forecast-Wert aktualisieren
        await ApiService.updateForecast(selectedForecast.id, forecastData);
      } else {
        // Neuen Forecast-Wert erstellen
        await ApiService.createForecast(budgetId, forecastData);
      }
      fetchForecasts();
      handleClose();
    } catch (error) {
      console.error('Error saving forecast:', error);
    }
  };

  const handleDelete = async (forecastId) => {
    try {
      await ApiService.deleteForecast(forecastId);
      fetchForecasts();
    } catch (error) {
      console.error('Error deleting forecast:', error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => handleOpen(null)} style={{ marginBottom: '1rem' }}>
        Neuer Forecast-Wert
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Datum</TableCell>
            <TableCell>Forecast-Betrag (€)</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecasts.map((forecast) => (
            <TableRow key={forecast.id}>
              <TableCell>{forecast.date}</TableCell>
              <TableCell>{forecast.amount}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleOpen(forecast)}>
                  Bearbeiten
                </Button>
                <Button color="secondary" onClick={() => handleDelete(forecast.id)}>
                  Löschen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog für das Erstellen/Bearbeiten eines Forecast-Wertes */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedForecast ? 'Forecast-Wert bearbeiten' : 'Neuer Forecast-Wert'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Datum"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Forecast-Betrag (€)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedForecast ? 'Speichern' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForecastManagement;
