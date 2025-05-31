import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message || 'Erro ao fazer login');
            }
        } catch (err) {
            console.error('Erro ao conectar com o servidor:', err);
            setError('Erro ao conectar com o servidor');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo-section">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="login-logo" />
                </div>
                <h2>Bem-vindo de volta</h2>
                <p className="login-subtitle">Entre com suas credenciais para acessar sua conta</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Seu email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Sua senha"
                        />
                        <div className="forgot-password">
                            <Link to="/recuperar-password" className="forgot-password-link">
                                Esqueceu-se da password?
                            </Link>
                        </div>
                    </div>

                    

                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>

                <div className="register-section">
                    <p>Ainda não possui uma conta?</p>
                    <Link to="/registar" className="register-link">
                        Registe-se aqui
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login; 