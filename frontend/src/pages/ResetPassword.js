import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/RecoverPassword.css';

function ResetPassword() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { resetToken } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Todos os campos são obrigatórios');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('As passwords não coincidem');
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError('A password deve ter pelo menos 6 caracteres');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        try {
            const response = await fetch(`http://localhost:3000/auth/reset/${resetToken}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password alterada com sucesso!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Erro ao redefinir a password');
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
                <h2>Redefinir Password</h2>
                <p className="recover-password-subtitle">Introduz a tua nova password</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="newPassword">Nova Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Nova Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Digita a password novamente"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <button type="submit" className="recover-password-button">
                        Redefinir Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword; 