import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/servicos" className="nav-link">Serviços</Link>
        <Link to="/reservas" className="nav-link">Reservas</Link>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="auth-button logout">
            Sair
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="auth-button login">
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}

export default Header; 