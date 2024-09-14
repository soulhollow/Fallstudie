import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Routes
import LoginPage from './components/Login/LoginPage'; // Import the LoginPage component
import Footer from './components/Footer/Footer'; // Import Footer component
import Header from './components/Header/Header'; // Import Header component

function App() {
  return (
    <Router>
      <Header /> {/* Include the Header component */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Define other routes here */}
        </Routes>
      </div>
      <Footer /> {/* Include the Footer component */}
    </Router>
  );
}

export default App;
