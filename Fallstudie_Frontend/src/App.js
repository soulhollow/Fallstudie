import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Routes
import LoginPage from './components/Login/LoginPage'; // Import the LoginPage component
import Footer from './components/Footer/Footer'; // Import Footer component
import Header from './components/Header/Header'; // Import Header component
import RegisterPage from './components/register/register';
import AdminPanel from './components/AdminPanel/adminpanel';
import Finance from './components/Finance/Finance';

function App() {
  return (
    <Router>
      <Header /> {/* Include the Header component */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path ="/register" element ={<RegisterPage/>}/>
          <Route path ="/adminpanel" element ={<AdminPanel/>}/>
          <Route path ="/finance" element ={<Finance/>}/>
        </Routes>
      </div>
      <Footer /> {/* Include the Footer component */}
    </Router>
  );
}

export default App;
