import React from 'react';
import '../styles/ServiceModal.css';

function ServiceModal({ service, onClose, onSchedule }) {
  if (!service) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        <div className="modal-image">
          {service.image ? (
            <img src={`http://localhost:3000${service.image}`} alt={service.name} />
          ) : (
            <div className="modal-image-placeholder">
              <span>Imagem do Serviço</span>
            </div>
          )}
        </div>

        <div className="modal-info">
          <h2>{service.name}</h2>
          
          <div className="modal-categories">
            {Array.isArray(service.category) ? (
              service.category.map((cat, index) => (
                <span key={index} className="category-tag">
                  {cat}
                </span>
              ))
            ) : (
              <span className="category-tag">{service.category}</span>
            )}
          </div>

          <div className="service-description">
            <p>{service.description}</p>
          </div>

          <div className="service-modal-details">
            <div className="modal-detail-item">
              <i className="fas fa-tag"></i>
              <span>SKU: {service.sku}</span>
            </div>
            <div className="modal-detail-item">
              <i className="fas fa-clock"></i>
              <span>Tempo Estimado: {service.estimatedTime}</span>
            </div>
            <div className="modal-detail-item">
              <i className="fas fa-euro-sign"></i>
              <span>Preço: {formatPrice(service.price)}</span>
            </div>
            <div className="modal-detail-item">
              <i className="fas fa-info-circle"></i>
              <span>Status: {service.status === 'available' ? 'Disponível' : 'Indisponível'}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="schedule-button" 
              onClick={onSchedule}
              disabled={service.status === 'unavailable'}
            >
              {service.status === 'available' ? 'Agendar Serviço' : 'Serviço Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal; 