import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRole } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole(null); // Zurücksetzen der Rolle beim Logout
    navigate('/login'); // Navigation zur Login-Seite
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard ({role})
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
