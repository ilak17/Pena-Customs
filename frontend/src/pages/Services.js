import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Services.css';

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:3000/service', {
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
      } else {
        throw new Error(data.message || 'Erro ao carregar serviços');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o preço em euros
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
              <p>{service.description}</p>
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
                  <span>Status: {service.status}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/servicos/${service.sku}`)} 
                className="service-item-button"
              >
                Saber Mais
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services; 