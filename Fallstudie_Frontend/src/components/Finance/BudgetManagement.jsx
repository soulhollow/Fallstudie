import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { Modal, Box, Button, TextField, MenuItem } from '@mui/material';
import ApiService from '../Service/ApiService';

// Styles für das Modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [open, setOpen] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [owner, setOwner] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [availableBudget, setAvailableBudget] = useState('');

  // Fetch Budgets und Owners beim Mounten
  useEffect(() => {
    fetchBudgets();
    fetchOwners();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await ApiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchOwners = async () => {
    try {
      const data = await ApiService.getOwners();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const handleOpen = (budget = null) => {
    setSelectedBudget(budget);
    setBudgetName(budget ? budget.budgetName : '');
    setOwner(budget ? budget.owner : '');
    setStartDate(budget ? budget.startDate : '');
    setEndDate(budget ? budget.endDate : '');
    setTotalBudget(budget ? budget.totalBudget : '');
    setAvailableBudget(budget ? budget.availableBudget : '');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const budgetData = { budgetName, owner, startDate, endDate, totalBudget, availableBudget };
    try {
      if (selectedBudget) {
        // Budget aktualisieren
        await ApiService.updateBudget(selectedBudget.id, budgetData);
      } else {
        // Neues Budget erstellen
        await ApiService.createBudget(budgetData);
      }
      fetchBudgets();
      handleClose();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      await ApiService.deleteBudget(budgetId);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <div>
      <MaterialTable
        title="Budgetverwaltung"
        columns={[
          { title: 'Budgetname', field: 'budgetName' },
          { title: 'Owner', field: 'owner' },
          { title: 'Startdatum', field: 'startDate', type: 'date' },
          { title: 'Verfallsdatum', field: 'endDate', type: 'date' },
          { title: 'Gesamtbudget', field: 'totalBudget', type: 'numeric' },
          { title: 'Verfügbares Budget', field: 'availableBudget', type: 'numeric' },
        ]}
        data={budgets}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Budget bearbeiten',
            onClick: (event, rowData) => handleOpen(rowData),
          },
          {
            icon: 'delete',
            tooltip: 'Budget löschen',
            onClick: (event, rowData) => handleDelete(rowData.id),
          },
        ]}
        options={{
          filtering: true,
          paging: true,
        }}
        components={{
          Action: (props) => (
            <Button
              onClick={(event) => props.action.onClick(event, props.data)}
              color={props.action.icon === 'delete' ? 'secondary' : 'primary'}
            >
              {props.action.icon === 'delete' ? 'Löschen' : 'Bearbeiten'}
            </Button>
          ),
        }}
      />

      {/* Modal zum Erstellen/Bearbeiten eines Budgets */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2>{selectedBudget ? 'Budget bearbeiten' : 'Neues Budget erstellen'}</h2>
          <TextField
            fullWidth
            label="Budgetname"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Owner"
            select
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            margin="normal"
          >
            {owners.map((ownerOption) => (
              <MenuItem key={ownerOption.id} value={ownerOption.name}>
                {ownerOption.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Startdatum"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Verfallsdatum"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Gesamtbudget"
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Verfügbares Budget"
            type="number"
            value={availableBudget}
            onChange={(e) => setAvailableBudget(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            {selectedBudget ? 'Speichern' : 'Erstellen'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BudgetManagement;
