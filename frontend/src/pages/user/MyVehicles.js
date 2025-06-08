import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/user/MyVehicles.css';
import '../../styles/user/VehicleForm.css';

const MyVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        model: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

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

    const handleEdit = async (vehicle) => {
        setFormData({
            brand: vehicle.brand,
            model: vehicle.model
        });
        setEditingVehicle(vehicle);
    };

    const handleAdd = () => {
        setFormData({
            plate: '',
            brand: '',
            model: ''
        });
        setSelectedImage(null);
        setPreviewImage(null);
        setIsAddingVehicle(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('plate', formData.plate);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('model', formData.model);
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            const response = await fetch('http://localhost:3000/vehicle/my-vehicles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao adicionar veículo');
            }

            // Atualiza a lista de veículos
            fetchVehicles();
            
            // Fecha o modal
            setIsAddingVehicle(false);
            // Limpa o formulário
            setFormData({
                plate: '',
                brand: '',
                model: ''
            });
            setSelectedImage(null);
            setPreviewImage(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/vehicle/my-vehicles/${editingVehicle.plate}`, {
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

            // Atualiza a lista de veículos
            setVehicles(vehicles.map(v => 
                v.plate === editingVehicle.plate 
                    ? { ...v, ...formData }
                    : v
            ));

            // Fecha o modal
            setEditingVehicle(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return (
        <>
            <Header />
            <div className="loading">Carregando...</div>
        </>
    );

    if (error) return (
        <>
            <Header />
            <div className="error">{error}</div>
        </>
    );

    return (
        <div className="page-container">
            <Header />
            <div className="my-vehicles-container">
                <div className="vehicles-section">
                    <div className="my-vehicles-header">
                        <h1>Meus Veículos</h1>
                        <button onClick={handleAdd} className="add-vehicle-btn">
                            Adicionar Veículo
                        </button>
                    </div>

                    <div className="vehicles-grid">
                        {vehicles.length === 0 ? (
                            <p className="no-vehicles">Nenhum veículo cadastrado</p>
                        ) : (
                            vehicles.map((vehicle) => (
                                <div key={vehicle.plate} className="vehicle-card">
                                    <div className="vehicle-image">
                                        {vehicle.image ? (
                                            <img 
                                                src={`http://localhost:3000${vehicle.image}`} 
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                            />
                                        ) : (
                                            <div className="no-image">Sem imagem</div>
                                        )}
                                    </div>
                                    <div className="vehicle-info">
                                        <h3>{vehicle.brand} {vehicle.model}</h3>
                                        <p>Matrícula: {vehicle.plate}</p>
                                    </div>
                                    <div className="vehicle-actions">
                                        <button onClick={() => handleEdit(vehicle)} className="edit-btn">
                                            Editar
                                        </button>
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
            </div>

            {/* Modal de Edição */}
            {editingVehicle && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="modal-close" 
                            onClick={() => setEditingVehicle(null)}
                        >
                            ×
                        </button>
                        <h2>Editar Veículo</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmitEdit} className="vehicle-form">
                            <div className="form-group">
                                <label>Matrícula:</label>
                                <input
                                    type="text"
                                    value={editingVehicle.plate}
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
                                <button 
                                    type="button" 
                                    onClick={() => setEditingVehicle(null)} 
                                    className="cancel-btn"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-btn">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Adição */}
            {isAddingVehicle && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="modal-close" 
                            onClick={() => setIsAddingVehicle(false)}
                        >
                            ×
                        </button>
                        <h2>Adicionar Novo Veículo</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmitAdd} className="vehicle-form">
                            <div className="form-group">
                                <label htmlFor="plate">Matrícula:</label>
                                <input
                                    type="text"
                                    id="plate"
                                    name="plate"
                                    value={formData.plate}
                                    onChange={handleChange}
                                    required
                                    placeholder="XX-XX-XX"
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
                                    placeholder="Ex: Toyota"
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
                                    placeholder="Ex: Corolla"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Imagem do Veículo:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <div className="image-preview">
                                        <img src={previewImage} alt="Preview" style={{ maxWidth: '200px' }} />
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddingVehicle(false)} 
                                    className="cancel-btn"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-btn">
                                    Adicionar Veículo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyVehicles; 