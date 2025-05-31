import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterConfirmation from './pages/RegisterConfirmation';
import EmailVerified from './pages/EmailVerified';
import RecoverPassword from './pages/RecoverPassword';
import ResetPassword from './pages/ResetPassword';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registar" element={<Register />} />
          <Route path="/registo-confirmado" element={<RegisterConfirmation />} />
          <Route path="/email-verificado" element={<EmailVerified />} />
          <Route path="/recuperar-password" element={<RecoverPassword />} />
          <Route path="/alterar-password/:resetToken" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
