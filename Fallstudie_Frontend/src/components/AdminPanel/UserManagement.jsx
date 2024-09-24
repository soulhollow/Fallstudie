
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

const roles = ['Admin', 'Owner', 'Finance'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  // Fetch Benutzer beim Mounten
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await ApiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setUsername(user ? user.username : '');
    setRole(user ? user.role : '');
    setPassword(''); // Passwort immer leer beim Bearbeiten
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const userData = { username, role, password };
    try {
      if (selectedUser) {
        // Benutzer aktualisieren
        await ApiService.updateUser(selectedUser.id, userData);
      } else {
        // Neuen Benutzer erstellen
        await ApiService.createUser(userData);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await ApiService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <MaterialTable
        title="Benutzerverwaltung"
        columns={[
          { title: 'Benutzername', field: 'username' },
          { title: 'Rolle', field: 'role' },
          { title: 'Erstellungsdatum', field: 'createdAt', type: 'date' },
        ]}
        data={users}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Benutzer bearbeiten',
            onClick: (event, rowData) => handleOpen(rowData),
          },
          {
            icon: 'delete',
            tooltip: 'Benutzer löschen',
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

      {/* Modal zum Erstellen/Bearbeiten eines Benutzers */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2>{selectedUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}</h2>
          <TextField
            fullWidth
            label="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Rolle"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            {roles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </TextField>
          {!selectedUser && (
            <TextField
              fullWidth
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            {selectedUser ? 'Speichern' : 'Erstellen'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UserManagement;
