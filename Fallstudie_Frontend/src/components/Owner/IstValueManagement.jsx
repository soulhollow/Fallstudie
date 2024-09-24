import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ApiService from '../Service/ApiService';

const IstValueManagement = ({ budgetId }) => {
  const [istValues, setIstValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIstValue, setSelectedIstValue] = useState(null);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Fetch Ist-Werte beim Mounten
  useEffect(() => {
    fetchIstValues();
  }, []);

  const fetchIstValues = async () => {
    try {
      const data = await ApiService.getIstValues(budgetId);
      setIstValues(data);
    } catch (error) {
      console.error('Error fetching ist values:', error);
    }
  };

  const handleOpen = (istValue = null) => {
    setSelectedIstValue(istValue);
    setDate(istValue ? istValue.date : '');
    setAmount(istValue ? istValue.amount : '');
    setDescription(istValue ? istValue.description : '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIstValue(null);
    setDate('');
    setAmount('');
    setDescription('');
  };

  const handleSubmit = async () => {
    const istValueData = { date, amount, description };
    try {
      if (selectedIstValue) {
        // Ist-Wert aktualisieren
        await ApiService.updateIstValue(selectedIstValue.id, istValueData);
      } else {
        // Neuen Ist-Wert erstellen
        await ApiService.createIstValue(budgetId, istValueData);
      }
      fetchIstValues();
      handleClose();
    } catch (error) {
      console.error('Error saving ist value:', error);
    }
  };

  const handleDelete = async (istValueId) => {
    try {
      await ApiService.deleteIstValue(istValueId);
      fetchIstValues();
    } catch (error) {
      console.error('Error deleting ist value:', error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => handleOpen(null)} style={{ marginBottom: '1rem' }}>
        Neuer Ist-Wert
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Datum</TableCell>
            <TableCell>Betrag (€)</TableCell>
            <TableCell>Beschreibung</TableCell>
            <TableCell>Aktionen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {istValues.map((istValue) => (
            <TableRow key={istValue.id}>
              <TableCell>{istValue.date}</TableCell>
              <TableCell>{istValue.amount}</TableCell>
              <TableCell>{istValue.description}</TableCell>
              <TableCell>
                <Button color="primary" onClick={() => handleOpen(istValue)}>
                  Bearbeiten
                </Button>
                <Button color="secondary" onClick={() => handleDelete(istValue.id)}>
                  Löschen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog für das Erstellen/Bearbeiten eines Ist-Wertes */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedIstValue ? 'Ist-Wert bearbeiten' : 'Neuer Ist-Wert'}</DialogTitle>
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
            label="Betrag (€)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedIstValue ? 'Speichern' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IstValueManagement;
