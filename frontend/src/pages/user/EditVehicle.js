import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/user/VehicleForm.css';

const EditVehicle = () => {
    const navigate = useNavigate();
    const { plate } = useParams();
    const [formData, setFormData] = useState({
        brand: '',
        model: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await fetch(`http://localhost:3000/vehicle/my-vehicles/${plate}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao carregar dados do veículo');
                }

                const data = await response.json();
                setFormData({
                    brand: data.vehicle.brand,
                    model: data.vehicle.model
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [plate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/vehicle/my-vehicles/${plate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar veículo');
            }

            navigate('/meus-veiculos');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;

    return (
        <div className="vehicle-form-container">
            <h1>Editar Veículo</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="vehicle-form">
                <div className="form-group">
                    <label>Matrícula:</label>
                    <input
                        type="text"
                        value={plate}
                        disabled
                        className="disabled-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Marca:</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="model">Modelo:</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/meus-veiculos')} className="cancel-btn">
                        Cancelar
                    </button>
                    <button type="submit" className="submit-btn">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVehicle; 