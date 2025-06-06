import React, { useState, useEffect } from 'react';
import '../../styles/admin/Services.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        price: '',
        description: '',
        estimatedTime: '',
        status: 'available',
        image: null
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/service?page=${currentPage}&s=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setServices(data.message);
                setTotalPages(data.pagination.totalPages);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [currentPage, searchTerm]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const url = editingId 
                ? `http://localhost:3000/service/${editingId}`
                : 'http://localhost:3000/service';
            
            const method = editingId ? 'PUT' : 'POST';
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                fetchServices();
                resetForm();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Erro ao salvar serviço');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/service/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                const data = await response.json();
                
                if (data.success) {
                    fetchServices();
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Erro ao excluir serviço');
            }
        }
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setFormData({
            category: service.category,
            name: service.name,
            price: service.price,
            description: service.description,
            estimatedTime: service.estimatedTime,
            status: service.status,
            image: null
        });
    };

    const resetForm = () => {
        setFormData({
            category: '',
            name: '',
            price: '',
            description: '',
            estimatedTime: '',
            status: 'available',
            image: null
        });
        setEditingId(null);
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="service-container">
            <h2>Gerenciar Serviços</h2>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Pesquisar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="category"
                        placeholder="Categoria"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome do Serviço"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="price"
                        placeholder="Preço"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="description"
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="estimatedTime"
                        placeholder="Tempo Estimado"
                        value={formData.estimatedTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="available">Ativo</option>
                        <option value="unavailable">Inativo</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        name="image"
                        onChange={handleInputChange}
                        accept="image/*"
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'} Serviço</button>
                    {editingId && (
                        <button type="button" onClick={resetForm}>Cancelar</button>
                    )}
                </div>
            </form>

            <div className="services-list">
                {services.map(service => (
                    <div key={service._id} className="service-card">
                        {service.image && (
                            <img src={`http://localhost:3000${service.image}`} alt={service.name} />
                        )}
                        <h3>{service.name}</h3>
                        <p>Categoria: {service.category}</p>
                        <p>Preço: €{service.price}</p>
                        <p>Tempo Estimado: {service.estimatedTime}</p>
                        <p>Status: {service.status === 'available' ? 'Ativo' : 'Inativo'}</p>
                        <div className="service-actions">
                            <button onClick={() => handleEdit(service)}>Editar</button>
                            <button onClick={() => handleDelete(service._id)}>Excluir</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default Services;

