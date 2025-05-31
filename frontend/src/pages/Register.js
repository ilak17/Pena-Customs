import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
            setError('Todos os campos são obrigatórios');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('As passwords não coincidem');
            return false;
        }
        if (formData.password.length < 6) {
            setError('A password deve ter pelo menos 6 caracteres');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email inválido');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/registo-confirmado');
            } else {
                setError(data.message || 'Erro ao efetuar o registo');
            }
        } catch (err) {
            console.error('Erro ao ligar ao servidor:', err);
            setError('Erro ao ligar ao servidor');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="logo-section">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="register-logo" />
                </div>
                <h2>Criar Conta</h2>
                <p className="register-subtitle">Junta-te à Pena-Customs e transforma o teu veículo</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo:</label>
                        <input
                            type="text"
                            id="nome"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="O teu nome completo"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="O teu email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telemóvel:</label>
                        <input
                            type="tel"
                            id="telefone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="O teu número de telemóvel"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Digita a password novamente"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" className="register-button">
                        Criar Conta
                    </button>
                </form>
                
                <div className="login-section">
                    <p>Já tens uma conta?</p>
                    <Link to="/login" className="login-link">
                        Entra aqui
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register; 