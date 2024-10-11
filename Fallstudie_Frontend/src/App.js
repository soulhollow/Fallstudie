
import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import AdminPanel from './components/AdminPanel/UserManagement';
import Footer from './components/Footer/Footer';
import AuditLogTable from './components/AdminPanel/AuditLogTable';
import Budget from './components/Finance/Budget';
import Soll from './components/Finance/Soll';
import Login from './components/Login/LoginPage';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/adminuser" element={<AdminPanel />} />
                <Route path="/Audittable" element={<AuditLogTable />} />
                <Route path="/Budget" element={<Budget />} />
                <Route path="/soll" element={<Soll />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;