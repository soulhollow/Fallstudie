
import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import AdminPanel from './components/AdminPanel/UserManagement';
import Footer from './components/Footer/Footer';
import AuditLogTable from './components/AdminPanel/AuditLogTable';
import Budget from './components/Finance/Budget';
import SollIstFinance from './components/Finance/SollIstvergleich';
import Login from './components/Login/LoginPage';
import Approve from './components//Management/Budgetapprove';
import Kosten from './components/Owner/kosten'
import SollIstOwner from './components/Owner/sollist';
import ManagerBudgetSelector from "./components/Management/ManagerBudgetSelector";
import Forecast from "./components/Management/Forecast";
import Monitoring from "./components/Management/Monitoring";
import CreateSoll from "./components/Finance/CreateSoll";
import CreateIst from "./components/Owner/CreateIst";
import ForecastOwner from "./components/Owner/ForecastPage";
import './App.css';
import {isMonday} from "date-fns";

function App() {
    return (
        <Router>
            <Header />
            <Routes>

                <Route path="/admin/usermangement" element={<AdminPanel />} /> {/*Fertig*/}
                <Route path="/admin/audittable" element={<AuditLogTable />} /> {/*Fertig*/}
                <Route path="/finance/Budget" element={<Budget />} /> {/*Fertig*/}
                <Route path="/finance/sollIst" element={<SollIstFinance />} /> {/*Fertig*/}
                <Route path="/finance/CreateSoll" element={<CreateSoll />} />
                <Route path="/Management/approve" element={<Approve />} />
                <Route path="/Management/Forecast" element={<Forecast />} />
                <Route path="/Management/Monitoring" element={<Monitoring />} />
                <Route path="/Management/ManagerBudgetSelector" element={<ManagerBudgetSelector />} />
                <Route path="/owner/kosten" element={<Kosten />} />
                <Route path="/owner/sollIst" element={<SollIstOwner />} />
                <Route path="/owner/CreateIst" element={<CreateIst />} />
                <Route path="/owner/Forecast" element={<ForecastOwner />} />
                <Route path="*" element={<Login />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;