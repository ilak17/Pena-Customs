import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/user/MyVehicles.css';

const MyVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch('http://localhost:3000/vehicle/my-vehicles', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Falha ao carregar veículos');
                }

                const data = await response.json();
                setVehicles(data.message);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleDelete = async (plate) => {
        if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                const response = await fetch(`http://localhost:3000/vehicle/my-vehicles/${plate}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Falha ao excluir veículo');
                }

                setVehicles(vehicles.filter(vehicle => vehicle.plate !== plate));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="my-vehicles-container">
            <div className="my-vehicles-header">
                <h1>Meus Veículos</h1>
                <Link to="/adicionar-veiculo" className="add-vehicle-btn">
                    Adicionar Veículo
                </Link>
            </div>

            <div className="vehicles-grid">
                {vehicles.length === 0 ? (
                    <p className="no-vehicles">Nenhum veículo cadastrado</p>
                ) : (
                    vehicles.map((vehicle) => (
                        <div key={vehicle.plate} className="vehicle-card">
                            <div className="vehicle-info">
                                <h3>{vehicle.brand} {vehicle.model}</h3>
                                <p>Matrícula: {vehicle.plate}</p>
                            </div>
                            <div className="vehicle-actions">
                                <Link to={`/editar-veiculo/${vehicle.plate}`} className="edit-btn">
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(vehicle.plate)}
                                    className="delete-btn"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyVehicles; 