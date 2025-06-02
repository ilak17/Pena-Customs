import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/user/MyReserves.css';

function MyReserves() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reserves, setReserves] = useState([]);
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
    sortBy: searchParams.get('sortBy') || 'startTime',
    order: searchParams.get('order') || 'asc',
    page: Number(searchParams.get('page')) || 1
  });

  useEffect(() => {
    fetchReserves();
  }, [filters]);

  const fetchReserves = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: filters.page,
        limit: pagination.itemsPerPage
      });

      const response = await fetch(`http://localhost:3000/reserve/my-reserves?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar reservas');
      }

      const data = await response.json();
      if (data.success) {
        setReserves(data.message);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Erro ao carregar reservas');
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
      [name]: value,
      page: 1 // Reset para primeira página ao filtrar
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Função para formatar a data
  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter a cor do status
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffd700',
      confirmed: '#32cd32',
      running: '#1e90ff',
      waiting: '#ff8c00',
      completed: '#008000',
      cancelled: '#ff0000'
    };
    return colors[status] || '#000000';
  };

  // Função para traduzir o status
  const translateStatus = (status) => {
    const translations = {
      pending: 'Pendente',
      confirmed: 'Confirmada',
      running: 'Em Execução',
      waiting: 'Em Espera',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return translations[status] || status;
  };

  if (loading) {
    return (
      <div className="my-reserves-page">
        <Header />
        <div className="my-reserves-hero">
          <h1>Carregando reservas...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-reserves-page">
        <Header />
        <div className="my-reserves-hero">
          <h1>Erro</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reserves-page">
      <Header />
      
      <section className="my-reserves-hero">
        <h1>Minhas Reservas</h1>
        <p>Acompanhe todas as suas reservas e o status de cada uma delas.</p>
      </section>

      <div className="my-reserves-filters">
        <input
          type="text"
          name="s"
          placeholder="Pesquisar por matrícula, SKU ou status..."
          value={filters.s}
          onChange={handleFilterChange}
        />
        
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="startTime">Data de Início</option>
          <option value="endTime">Data de Fim</option>
          <option value="status">Status</option>
          <option value="sku">SKU</option>
        </select>

        <select name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>
      </div>

      <div className="my-reserves-list">
        {reserves.length === 0 ? (
          <div className="no-reserves">
            <p>Nenhuma reserva encontrada.</p>
          </div>
        ) : (
          <>
            {reserves.map((reserve) => (
              <div key={reserve.sku} className="reserve-card">
                <div className="reserve-header">
                  <h3>Reserva #{reserve.sku}</h3>
                  <span 
                    className="reserve-status"
                    style={{ backgroundColor: getStatusColor(reserve.status) }}
                  >
                    {translateStatus(reserve.status)}
                  </span>
                </div>
                
                <div className="reserve-details">
                  <div className="reserve-info">
                    <p><strong>Veículo:</strong> {reserve.vehicleID.plate}</p>
                    <p><strong>Serviços:</strong></p>
                    <ul>
                      {reserve.serviceID.map(service => (
                        <li key={service._id}>{service.name}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="reserve-times">
                    <p><strong>Início:</strong> {formatDate(reserve.startTime)}</p>
                    <p><strong>Fim:</strong> {formatDate(reserve.endTime)}</p>
                  </div>

                  {reserve.addComents && (
                    <div className="reserve-comments">
                      <p><strong>Comentários:</strong></p>
                      <p>{reserve.addComents}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="pagination-button"
                >
                    Anterior
                </button>
                    
                <span className="pagination-info">
                    Página {filters.page} de {pagination.totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="pagination-button"
                >
                    Próxima
                </button>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
}

export default MyReserves; 