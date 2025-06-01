import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/user/VehicleForm.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        model: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');

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

    const handleSubmit = async (e) => {
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

            navigate('/meus-veiculos');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="vehicle-form-container">
            <h1>Adicionar Novo Veículo</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="vehicle-form">
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
                    <button type="button" onClick={() => navigate('/user/my-vehicles')} className="cancel-btn">
                        Cancelar
                    </button>
                    <button type="submit" className="submit-btn">
                        Adicionar Veículo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVehicle; 