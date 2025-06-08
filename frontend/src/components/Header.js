import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
        setShowDropdown(false);
      } else {
        console.error('Erro ao efetuar logout');
      }
    } catch (error) {
      console.error('Erro ao efetuar logout:', error);
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo-container">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Logótipo Pena-Customs" className="logo" />
        </Link>
      </div>
      <nav className="nav-menu">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Início
        </Link>
        <Link to="/servicos" className={`nav-link ${location.pathname === '/servicos' ? 'active' : ''}`}>
          Serviços
        </Link>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="profile-container" onMouseLeave={() => setShowDropdown(false)}>
            <button 
              className="profile-button"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <i className="fas fa-user"></i>
              O Meu Perfil
            </button>
            {showDropdown && (
              <div className="profile-dropdown">
                <Link to="/perfil" className="dropdown-item">
                  <i className="fas fa-user-circle"></i> Dados Pessoais
                </Link>
                <Link to="/meus-veiculos" className="dropdown-item">
                  <i className="fas fa-car"></i> Os Meus Veículos
                </Link>
                <Link to="/minhas-reservas" className="dropdown-item">
                  <i className="fas fa-calendar-alt"></i> As Minhas Reservas
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