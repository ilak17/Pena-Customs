import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RecoverPassword.css';

function RecoverPassword() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3000/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phone }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Email enviado com sucesso! Por favor, verifica a tua caixa de entrada.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Erro ao solicitar recuperação de password');
            }
        } catch (err) {
            console.error('Erro ao ligar ao servidor:', err);
            setError('Erro ao ligar ao servidor');
        }
    };

    return (
        <div className="recover-password-container">
            <div className="recover-password-box">
                <div className="logo-section">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="recover-password-logo" />
                </div>
                <h2>Recuperar Password</h2>
                <p className="recover-password-subtitle">Introduz o teu email e telemóvel para receberes o link de recuperação</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="O teu email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telemóvel:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder="O teu número de telemóvel"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <button type="submit" className="recover-password-button">
                        Enviar Link de Recuperação
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RecoverPassword; 