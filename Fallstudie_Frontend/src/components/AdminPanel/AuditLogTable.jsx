import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
} from '@mui/material';
import ApiService from '../Service/ApiService';

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filters, setFilters] = useState({
    date: '',
    user: '',
    action: '',
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    fetchAuditLogs();
    // Optionally, fetch available users and actions from the API if needed
  }, [page, rowsPerPage, filters]);

  const fetchAuditLogs = async () => {
    const params = {
      page: page + 1,
      pageSize: rowsPerPage,
      date: filters.date,
      user: filters.user,
      action: filters.action,
    };
    try {
      const data = await ApiService.getAuditLogs(params);
      setLogs(data.logs);
      setTotalLogs(data.total);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterReset = () => {
    setFilters({
      date: '',
      user: '',
      action: '',
    });
    setPage(0);
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <h2>Audit-Logs</h2>

      <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Datum"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Benutzer"
            name="user"
            value={filters.user}
            onChange={handleFilterChange}
          >
            <MenuItem value="">
              <em>Alle Benutzer</em>
            </MenuItem>
            {availableUsers.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Aktion"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
          >
            <MenuItem value="">
              <em>Alle Aktionen</em>
            </MenuItem>
            {availableActions.map((action) => (
              <MenuItem key={action} value={action}>
                {action}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={12}>
          <Button variant="contained" color="primary" onClick={fetchAuditLogs}>
            Anwenden
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleFilterReset}
            sx={{ marginLeft: '1rem' }}
          >
            Zurücksetzen
          </Button>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Datum</TableCell>
            <TableCell>Benutzer</TableCell>
            <TableCell>Aktion</TableCell>
            <TableCell>Beschreibung</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalLogs}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

export default AuditLogTable;
