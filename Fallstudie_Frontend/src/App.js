import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Router, Route, Routes, Navigate
import LoginPage from './components/Login/LoginPage'; // Import the LoginPage component
import Footer from './components/Footer/Footer'; // Import Footer component
import Header from './components/Header/Header'; // Import Header component
import RegisterPage from './components/Register/Register'; // Import RegisterPage component
import BudgetApproval from './components/Finance/BudgetApproval'; // Finance component
import BudgetManagement from './components/Finance/BudgetManagement'; // Finance component
import BudgetComparison from './components/Owner/BudgetComparison'; // Owner component
import ForecastManagement from './components/Owner/ForecastManagement'; // Owner component
import IstValueManagement from './components/Owner/IstValueManagement'; // Owner component (removed trailing space)
import UserManagement from './components/AdminPanel/UserManagement'; // Admin component
import RuleManagement from './components/AdminPanel/RuleManagement'; // Admin component
import AuditLogTable from './components/AdminPanel/AuditLogTable'; // Admin component
import { useRole } from './hooks/useRole'; // Custom hook for role management
import { RoleProvider } from './context/RoleContext'; // Context Provider for role management

// Dummy AdminDashboard, OwnerDashboard, FinanceDashboard Components
const AdminDashboard = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <UserManagement />
    <RuleManagement />
    <AuditLogTable />
  </div>
);

const OwnerDashboard = () => (
  <div>
    <h2>Owner Dashboard</h2>
    <BudgetComparison />
    <ForecastManagement />
    <IstValueManagement />
  </div>
);

const FinanceDashboard = () => (
  <div>
    <h2>Finance Dashboard</h2>
    <BudgetApproval />
    <BudgetManagement />
  </div>
);

const Dashboard = () => {
  const { role } = useRole(); // Extract the role from the context or a hook

  return (
    <div>
      <Header />
      <div style={{ padding: '2rem' }}>
        {role === 'Admin' && <AdminDashboard />} {/* Admin dashboard when role is Admin */}
        {role === 'Owner' && <OwnerDashboard />} {/* Owner dashboard when role is Owner */}
        {role === 'Finance' && <FinanceDashboard />} {/* Finance dashboard when role is Finance */}
      </div>
      <Footer /> {/* Ensure Footer is present on all pages */}
    </div>
  );
  
};

const App = () => {
  return (
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} /> {/* Use LoginPage component */}
          <Route path="/register" element={<RegisterPage />} /> {/* Use RegisterPage component */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Render Dashboard based on role */}
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect all unknown routes to login */}
        </Routes>
      </Router>
    </RoleProvider>
  );
};

export default App;
