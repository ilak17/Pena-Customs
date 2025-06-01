import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Logótipo Pena-Customs" className="logo" />
        </Link>
      </div>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Início</Link>
        <Link to="/servicos" className="nav-link">Serviços</Link>
        <Link to="/reservas" className="nav-link">Reservas</Link>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="profile-container">
            <button 
              className="profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <i className="fas fa-user"></i>
              O Meu Perfil
            </button>
            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/perfil" className="dropdown-item">
                  <i className="fas fa-user-circle"></i> Dados Pessoais
                </Link>
                <Link to="/veiculos" className="dropdown-item">
                  <i className="fas fa-car"></i> Os Meus Veículos
                </Link>
                <Link to="/minhas-reservas" className="dropdown-item">
                  <i className="fas fa-calendar-alt"></i> As Minhas Reservas
                </Link>
                <Link to="/favoritos" className="dropdown-item">
                  <i className="fas fa-heart"></i> Favoritos
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt"></i> Terminar Sessão
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="auth-button login">
            Iniciar Sessão
          </button>
        )}
      </div>
    </header>
  );
}

export default Header; 