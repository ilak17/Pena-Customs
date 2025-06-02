import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/user/CreateReserve.css';

function CreateReserve() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    serviceSKU: [],
    plate: '',
    dateTime: '',
    addComent: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchVehicles();
    fetchServices();
  }, [navigate]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:3000/vehicle/my-vehicles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar veículos');
      
      const data = await response.json();
      if (data.success) {
        setVehicles(Array.isArray(data.message) ? data.message : []);
      }
    } catch (err) {
      setError('Erro ao carregar veículos. Por favor, tente novamente.');
      console.error('Erro ao carregar veículos:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:3000/service', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar serviços');
      
      const data = await response.json();
      if (data.success) {
        setServices(Array.isArray(data.message) ? data.message : []);
      }
    } catch (err) {
      setError('Erro ao carregar serviços. Por favor, tente novamente.');
      console.error('Erro ao carregar serviços:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'serviceSKU') {
      // Converte o valor selecionado em um array com um único elemento
      setFormData(prev => ({
        ...prev,
        [name]: [value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar reserva');
      }

      if (data.success) {
        setSuccess('Reserva criada com sucesso!');
        setFormData({
          serviceSKU: [],
          plate: '',
          dateTime: '',
          addComent: ''
        });
        setTimeout(() => {
          navigate('/minhas-reservas');
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Erro ao criar reserva. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="create-reserve-container">
        <div className="create-reserve-content">
          <h1 className="create-reserve-title">Criar Nova Reserva</h1>
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="plate">Veículo</label>
              <select
                id="plate"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle.plate}>
                    {vehicle.plate} - {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="serviceSKU">Serviço</label>
              <select
                id="serviceSKU"
                name="serviceSKU"
                value={formData.serviceSKU[0] || ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service._id} value={service.sku}>
                    {service.name} - {service.price}€
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateTime">Data e Hora</label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="addComent">Comentários Adicionais</label>
              <textarea
                id="addComent"
                name="addComent"
                value={formData.addComent}
                onChange={handleChange}
                placeholder="Adicione informações relevantes para o serviço..."
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'A criar reserva...' : 'Criar Reserva'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReserve; 