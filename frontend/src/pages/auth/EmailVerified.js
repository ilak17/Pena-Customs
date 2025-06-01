import React from 'react';
import { Link } from "react-router-dom";
import '../../styles/auth/RegisterConfirmation.css'; // Import the CSS file for styling

export default function EmailVerified() {
    return (
        <div className="confirmation-container">
            <div className="confirmation-box">
                <div className="logo-section">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="confirmation-logo" />
                </div>
                
                <div className="confirmation-content">
                    <h2>Email Verificado com Sucesso</h2>
                    <div className="email-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="main-message">
                        O teu endereço de email foi verificado com sucesso.
                    </p>
                    <p className="sub-message">
                        Já podes iniciar sessão na tua conta e começar a usar todos os recursos disponíveis.
                    </p>
                    <p className="note">
                        Obrigado por te juntares à Pena-Customs!
                    </p>
                </div>

                <div className="action-buttons">
                    <Link to="/login" className="login-link">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}