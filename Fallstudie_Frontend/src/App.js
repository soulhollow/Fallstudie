
import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import AdminPanel from './components/AdminPanel/UserManagement';
import Footer from './components/Footer/Footer';
import AuditLogTable from './components/AdminPanel/AuditLogTable';
import Budget from './components/Finance/Budget';
import SollIstFinance from './components/Finance/Soll';
import Login from './components/Login/LoginPage';
import Approve from './components//Management/Budgetapprove';
import Kosten from './components/Owner/kosten'
import SollIstOwner from './components/Owner/sollist';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin/usermangement" element={<AdminPanel />} />
                <Route path="/admin/audittable" element={<AuditLogTable />} />
                <Route path="/finance/Budget" element={<Budget />} />
                <Route path="/finance/sollIst" element={<SollIstFinance />} />
                <Route path="/Management/approve" element={<Approve />} />
                <Route path="/owner/kosten" element={<Kosten />} />
                <Route path="/owner/sollIst" element={<SollIstOwner />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;