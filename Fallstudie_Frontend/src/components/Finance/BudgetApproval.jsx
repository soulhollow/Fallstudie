import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import ApiService from '../Service/ApiService';

const BudgetApproval = () => {
  const [budgets, setBudgets] = useState([]);

  // Fetch Budgets die auf Genehmigung warten
  useEffect(() => {
    fetchPendingBudgets();
  }, []);

  const fetchPendingBudgets = async () => {
    try {
      const data = await ApiService.getPendingBudgets();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching pending budgets:', error);
      message.error('Fehler beim Laden der Budgets.');
    }
  };

  const handleApprove = async (budgetId) => {
    try {
      await ApiService.approveBudget(budgetId);
      message.success('Budget erfolgreich genehmigt!');
      fetchPendingBudgets(); // Aktualisiere die Liste
    } catch (error) {
      console.error('Error approving budget:', error);
      message.error('Fehler beim Genehmigen des Budgets.');
    }
  };

  const handleReject = async (budgetId) => {
    try {
      await ApiService.rejectBudget(budgetId);
      message.success('Budget erfolgreich abgelehnt!');
      fetchPendingBudgets(); // Aktualisiere die Liste
    } catch (error) {
      console.error('Error rejecting budget:', error);
      message.error('Fehler beim Ablehnen des Budgets.');
    }
  };

  const columns = [
    {
      title: 'Budgetname',
      dataIndex: 'budgetName',
      key: 'budgetName',
    },
    {
      title: 'Antragsteller',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: 'Gesamtbetrag',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => `${text} €`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 'pending' ? 'Wartet auf Genehmigung' : status),
    },
    {
      title: 'Aktionen',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleApprove(record.id)}>
            Genehmigen
          </Button>
          <Button type="danger" onClick={() => handleReject(record.id)}>
            Ablehnen
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Budget-Genehmigungen</h2>
      <Table columns={columns} dataSource={budgets} rowKey="id" />
    </div>
  );
};

export default BudgetApproval;
