import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth/RegisterConfirmation.css';

function RegisterConfirmation() {
    return (
        <div className="confirmation-container">
            <div className="confirmation-box">
                <div className="logo-section">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="confirmation-logo" />
                </div>
                
                <div className="confirmation-content">
                    <h2>Verifique seu Email</h2>
                    <div className="email-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <p className="main-message">
                        Foi enviado um email de confirmação para o seu endereço de email.
                    </p>
                    <p className="sub-message">
                        Por favor, verifique a sua caixa de entrada e clique no link de verificação para ativar sua conta.
                    </p>
                    <p className="note">
                        Não se esqueça de verificar também a sua pasta de spam.
                    </p>
                </div>

                <div className="action-buttons">
                    <Link to="/login" className="login-link">
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterConfirmation; 