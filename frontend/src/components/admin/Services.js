import React, { useState, useEffect } from 'react';
import { 
    FaSearch, 
    FaInfoCircle, 
    FaWrench, 
    FaTools,
    FaClock,
    FaEuroSign,
    FaImage,
    FaFileAlt,
    FaCheck,
    FaBan,
    FaPlus,
    FaEdit,
    FaTrashAlt
} from 'react-icons/fa';
import '../../styles/admin/Services.css';

const AVAILABLE_CATEGORIES = [
    'Mecânica Geral',
    'Mecânica Avançada',
    'Elétrica e Eletrónica',
    'Manutenção Rápida',
    'Rodas e Travões',
    'Limpeza e Estética',
    'Climatização e Conforto',
    'Chapa e Pintura',
    'Personalização',
    'Diagnóstico e Inspeção',
    'Outro'
];

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        category: [],
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
    const [itemsPerPage] = useState(9);
    const [timeError, setTimeError] = useState('');
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState(AVAILABLE_CATEGORIES);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0
    });

    // Regex para validação do tempo
    const timeRegex = /^(\d+d)?(?:-(\d+h))?(?:-(\d+m))?$|^(\d+h)?(?:-(\d+m))?$|^(\d+m)$/;

    const validateTime = (value) => {
        if (!value) return false;
        return timeRegex.test(value);
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/service', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setServices(data.message || []);
                // Atualizar a paginação local
                const total = data.message.length;
                setPagination(prev => ({
                    ...prev,
                    total,
                    totalPages: Math.ceil(total / itemsPerPage)
                }));
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Erro ao carregar serviços');
            console.error('Erro ao carregar serviços:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'estimatedTime') {
            // Remove espaços e converte para minúsculo
            const formattedValue = value.toLowerCase().replace(/\s+/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: files ? files[0] : value
            }));
        }
    };

    const handleTimeBlur = (e) => {
        const value = e.target.value;
        if (value && !validateTime(value)) {
            setTimeError('Formato inválido. Use: 1d-2h-30m, 2h-30m, ou 30m');
        } else {
            setTimeError('');
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            category: value
        }));
        
        if (!value.trim()) {
            // Se o campo estiver vazio, mostra todas as categorias
            setFilteredCategories(AVAILABLE_CATEGORIES);
        } else {
            // Filtra as categorias baseado no input
            const filtered = AVAILABLE_CATEGORIES.filter(cat => 
                cat.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
        setShowCategoryList(true);
    };

    const handleCategoryFocus = () => {
        // Sempre mostra todas as categorias ao focar
        setFilteredCategories(AVAILABLE_CATEGORIES);
        setShowCategoryList(true);
    };

    const handleCategorySelect = (category) => {
        if (!formData.category.includes(category)) {
            setFormData(prev => ({
                ...prev,
                category: [...prev.category, category]
            }));
        }
        setShowCategoryList(false);
    };

    const handleRemoveCategory = (categoryToRemove) => {
        setFormData(prev => ({
            ...prev,
            category: prev.category.filter(cat => cat !== categoryToRemove)
        }));
    };

    const handleCategoryBlur = () => {
        // Pequeno delay para permitir o clique na lista
        setTimeout(() => {
            setShowCategoryList(false);
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação adicional antes de enviar
        if (!validateTime(formData.estimatedTime)) {
            setTimeError('Formato inválido. Use: 1d-2h-30m, 2h-30m, ou 30m');
            return;
        }

        // Verificar se há pelo menos uma categoria
        if (!formData.category || formData.category.length === 0) {
            showNotification('Selecione pelo menos uma categoria', 'error');
            return;
        }

        const formDataToSend = new FormData();
        
        // Adicionar cada categoria como um item separado no array
        formData.category.forEach((cat, index) => {
            formDataToSend.append(`category[${index}]`, cat);
        });

        // Adicionar os outros campos
        Object.keys(formData).forEach(key => {
            if (key !== 'category' && formData[key] !== null) {
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
                showNotification(editingId ? 'Serviço atualizado com sucesso!' : 'Serviço adicionado com sucesso!', 'success');
            } else {
                setError(data.message);
                showNotification(data.message, 'error');
            }
        } catch (err) {
            const errorMsg = 'Erro ao salvar serviço';
            setError(errorMsg);
            showNotification(errorMsg, 'error');
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
                    showNotification('Serviço excluído com sucesso!', 'success');
                } else {
                    setError(data.message);
                    showNotification(data.message, 'error');
                }
            } catch (err) {
                const errorMsg = 'Erro ao excluir serviço';
                setError(errorMsg);
                showNotification(errorMsg, 'error');
            }
        }
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setFormData({
            category: Array.isArray(service.category) ? service.category : [service.category],
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
            category: [],
            name: '',
            price: '',
            description: '',
            estimatedTime: '',
            status: 'available',
            image: null
        });
        setEditingId(null);
        setTimeError('');
    };

    const showNotification = (message, type) => {
        // Implementar sistema de notificações aqui
        console.log(`${type}: ${message}`);
    };

    // Filtragem local dos serviços com verificação mais rigorosa
    const filteredServices = services.filter(service => {
        if (!service) return false;
        
        const searchTermLower = searchTerm.toLowerCase().trim();
        
        // Se não houver termo de pesquisa, retorna todos os serviços
        if (!searchTermLower) return true;
        
        // Verifica cada campo relevante
        const nameMatch = service.name?.toLowerCase().includes(searchTermLower);
        const skuMatch = service.sku?.toLowerCase().includes(searchTermLower);
        const descriptionMatch = service.description?.toLowerCase().includes(searchTermLower);
        const categoryMatches = Array.isArray(service.category) 
            ? service.category.some(cat => cat.toLowerCase().includes(searchTermLower))
            : service.category?.toLowerCase().includes(searchTermLower);
        const priceMatch = service.price?.toString().includes(searchTermLower);

        return nameMatch || skuMatch || descriptionMatch || categoryMatches || priceMatch;
    });

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando serviços...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchServices} className="retry-button">Tentar Novamente</button>
        </div>
    );

    return (
        <div className="service-container">
            <h2 className="service-title">
                <FaTools className="title-icon" /> 
                Gerenciar Serviços
            </h2>
            
            <div className="service-layout">
                <div className="service-form-section">
                    <h3>
                        {editingId ? (
                            <>
                                <FaEdit className="section-icon" /> 
                                Editar Serviço
                            </>
                        ) : (
                            <>
                                <FaPlus className="section-icon" /> 
                                Adicionar Novo Serviço
                            </>
                        )}
                    </h3>
                    <form onSubmit={handleSubmit} className="service-form">
                        <div className="form-group">
                            <label htmlFor="category">
                                <FaWrench className="input-icon" />
                                Categorias
                                <FaInfoCircle 
                                    className="info-icon" 
                                    title="Digite para adicionar múltiplas categorias"
                                />
                            </label>
                            <div className="category-input-container">
                                <div className="selected-categories">
                                    {formData.category.map((cat, index) => (
                                        <div key={index} className="category-tag">
                                            {cat}
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveCategory(cat)}
                                                className="remove-category"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    id="category"
                                    type="text"
                                    name="category"
                                    placeholder="Digite para adicionar uma categoria"
                                    value={formData.categoryInput || ''}
                                    onChange={handleCategoryChange}
                                    onFocus={handleCategoryFocus}
                                    onBlur={handleCategoryBlur}
                                    autoComplete="off"
                                />
                                {showCategoryList && filteredCategories.length > 0 && (
                                    <div className="category-list">
                                        {filteredCategories.map((cat, index) => (
                                            <div
                                                key={index}
                                                className="category-item"
                                                onClick={() => handleCategorySelect(cat)}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">
                                <FaTools className="input-icon" />
                                Nome do Serviço
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Ex: Troca de Óleo"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">
                                <FaEuroSign className="input-icon" />
                                Preço (€)
                            </label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                placeholder="Ex: 50"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estimatedTime">
                                <FaClock className="input-icon" />
                                Tempo Estimado
                                <FaInfoCircle 
                                    className="info-icon" 
                                    title="Formatos aceitos: 1d-2h-30m, 2h-30m, ou 30m"
                                />
                            </label>
                            <input
                                id="estimatedTime"
                                type="text"
                                name="estimatedTime"
                                placeholder="Ex: 1d-2h-30m"
                                value={formData.estimatedTime}
                                onChange={handleInputChange}
                                onBlur={handleTimeBlur}
                                required
                                className={timeError ? 'error' : ''}
                            />
                            {timeError && <div className="error-message">{timeError}</div>}
                            <div className="helper-text">
                                Formatos aceitos:
                                <ul>
                                    <li>1d-2h-30m (1 dia, 2 horas e 30 minutos)</li>
                                    <li>2h-30m (2 horas e 30 minutos)</li>
                                    <li>30m (30 minutos)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">
                                <FaCheck className="input-icon" />
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="available">
                                    <span>Ativo</span>
                                </option>
                                <option value="unavailable">
                                    <span>Inativo</span>
                                </option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">
                                <FaImage className="input-icon" />
                                Imagem
                            </label>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                onChange={handleInputChange}
                                accept="image/*"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="description">
                                <FaFileAlt className="input-icon" />
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Descreva os detalhes do serviço..."
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit">
                                {editingId ? (
                                    <>
                                        <FaEdit className="button-icon" />
                                        Atualizar Serviço
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="button-icon" />
                                        Adicionar Serviço
                                    </>
                                )}
                            </button>
                            {editingId && (
                                <button type="button" onClick={resetForm}>
                                    <FaBan className="button-icon" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="service-list-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, categoria, SKU, preço..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="services-list">
                        {currentServices.map(service => (
                            <div key={service._id} className="service-card">
                                {service.image && (
                                    <img src={`http://localhost:3000${service.image}`} alt={service.name} />
                                )}
                                <h3>{service.name}</h3>
                                <p>Categoria: {Array.isArray(service.category) ? 
                                    service.category.join(" • ") : 
                                    service.category}
                                </p>
                                <p>Preço: €{service.price}</p>
                                <p>Tempo Estimado: {service.estimatedTime}</p>
                                <p>Status: {service.status === 'available' ? 'Ativo' : 'Inativo'}</p>
                                <div className="service-actions">
                                    <button onClick={() => handleEdit(service)}>
                                        <FaEdit className="action-icon" /> Editar
                                    </button>
                                    <button onClick={() => handleDelete(service._id)}>
                                        <FaTrashAlt className="action-icon" /> Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;

