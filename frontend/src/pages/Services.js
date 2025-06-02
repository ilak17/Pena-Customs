import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ServiceModal from '../components/ServiceModal';
import '../styles/Services.css';

function Services() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    itemsPerPage: 6
  });

  // Estados para filtros
  const [filters, setFilters] = useState({
    s: searchParams.get('s') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name',
    order: searchParams.get('order') || 'asc'
  });

  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [filters, pagination.currentPage]);

  const fetchServices = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      });

      const response = await fetch(`http://localhost:3000/service?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar serviços');
      }

      const data = await response.json();
      if (data.success) {
        setServices(data.message);
        setPagination(data.pagination);
        setSearchParams(queryParams);
      } else {
        throw new Error(data.message || 'Erro ao carregar serviços');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  // Função para formatar o preço em euros
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleServiceClick = async (sku) => {
    try {
      const response = await fetch(`http://localhost:3000/service/${sku}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes do serviço');
      }

      const data = await response.json();
      if (data.success) {
        setSelectedService(data.message);
      } else {
        throw new Error(data.message || 'Erro ao carregar detalhes do serviço');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScheduleService = () => {
    if (selectedService) {
      navigate(`/marcar-reserva?service=${selectedService.sku}`);
    }
  };

  if (loading) {
    return (
      <div className="services-page">
        <Header />
        <div className="services-hero">
          <h1>Carregando serviços...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <Header />
        <div className="services-hero">
          <h1>Erro</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <Header />
      
      <section className="services-hero">
        <h1>Nossos Serviços</h1>
        <p>Descubra nossa gama completa de serviços de personalização automóvel, onde cada detalhe é cuidadosamente pensado para superar suas expectativas.</p>
      </section>

      <div className="services-filters">
        <input
          type="text"
          name="s"
          placeholder="Pesquisar serviços..."
          value={filters.s}
          onChange={handleFilterChange}
        />
        
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Todas as Categorias</option>
          <option value="Mecânica Geral">Mecânica Geral</option>
          <option value="Mecânica Avançada">Mecânica Avançada</option>
          <option value="Elétrica e Eletrónica">Elétrica e Eletrónica</option>
          <option value="Manutenção Rápida">Manutenção Rápida</option>
          <option value="Rodas e Travões">Rodas e Travões</option>
          <option value="Limpeza e Estética">Limpeza e Estética</option>
          <option value="Climatização e Conforto">Climatização e Conforto</option>
          <option value="Chapa e Pintura">Chapa e Pintura</option>
          <option value="Personalização">Personalização</option>
          <option value="Diagnóstico e Inspeção">Diagnóstico e Inspeção</option>
          <option value="Outro">Outro</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Todos os Status</option>
          <option value="available">Disponível</option>
          <option value="unavailable">Indisponível</option>
        </select>

        <div className="price-filters">
          <input
            type="number"
            name="minPrice"
            placeholder="Preço Min"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Preço Max"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="name">Nome</option>
          <option value="price">Preço</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      <div className="services-list">
        {services.map((service) => (
          <div key={service._id} className="service-item">
            <div className="service-item-image">
              {service.image ? (
                <img src={`http://localhost:3000${service.image}`} alt={service.name} />
              ) : (
                <div className="service-image-placeholder">
                  <span>Imagem do Serviço</span>
                </div>
              )}
            </div>
            <div className="service-item-content">
              <h2>{service.name}</h2>
              <p>SKU: {service.sku}</p>
              <div className="service-details">
                <div className="service-info">
                  <i className="fas fa-clock"></i>
                  <span>Tempo Estimado: {service.estimatedTime}</span>
                </div>
                <div className="service-info">
                  <i className="fas fa-euro-sign"></i>
                  <span>Preço: {formatPrice(service.price)}</span>
                </div>
                <div className="service-info">
                  <i className="fas fa-info-circle"></i>
                  <span>Status: {service.status === 'available' ? 'Disponível' : 'Indisponível'}</span>
                </div>
              </div>
              <button 
                onClick={() => handleServiceClick(service.sku)} 
                className="service-item-button"
              >
                Saber Mais
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSchedule={handleScheduleService}
        />
      )}

      <div className="pagination">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          Anterior
        </button>
        
        <span>
          Página {pagination.currentPage} de {pagination.totalPages}
        </span>
        
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Services; 