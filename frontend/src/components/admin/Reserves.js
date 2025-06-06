import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import '../../styles/admin/Reserves.css';

function Reserves() {
    const [reserves, setReserves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchReserves();
    }, []);

    const fetchReserves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/admin/reserves', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar reservas');
            }

            const data = await response.json();
            console.log('Dados recebidos:', data);

            if (data.success) {
                const reservesData = Array.isArray(data.message) ? data.message : 
                                   Array.isArray(data.reserves) ? data.reserves : [];
                
                console.log('Reservas processadas:', reservesData);
                setReserves(reservesData);
            } else {
                throw new Error(data.message || 'Erro ao carregar reservas');
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro completo:', err);
            setError(err.message || 'Erro ao carregar reservas');
            setLoading(false);
        }
    };

    const handleStatusChange = async (reserveId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/admin/update-reserve/${reserveId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar estado da reserva');
            }

            const data = await response.json();
            if (data.success) {
                setReserves(reserves.map(reserve => 
                    reserve._id === reserveId ? { ...reserve, status: newStatus } : reserve
                ));
            } else {
                throw new Error(data.message || 'Erro ao atualizar estado da reserva');
            }
        } catch (err) {
            setError(err.message || 'Erro ao atualizar estado da reserva');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FaCheck className="status-icon completed" />;
            case 'cancelled':
                return <FaTimes className="status-icon cancelled" />;
            case 'pending':
                return <FaClock className="status-icon pending" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredReserves = reserves.filter(reserve => {
        if (!reserve) return false;
        
        const matchesSearch = (
            (reserve.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reserve.services || []).some(service => 
                (service.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        
        return filterStatus === 'all' 
            ? matchesSearch 
            : matchesSearch && reserve.status === filterStatus;
    });

    if (loading) return <div className="loading">A carregar reservas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="reserves-container">
            <div className="reserves-header">
                <h2>Gestão de Reservas</h2>
                <div className="filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Procurar por cliente ou serviço..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">Todos os Estados</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>
            </div>

            <div className="reserves-table-container">
                <table className="reserves-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Serviços</th>
                            <th>Data Início</th>
                            <th>Data Fim</th>
                            <th>Estado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReserves.map(reserve => (
                            <tr key={reserve._id}>
                                <td>{reserve.client?.name || 'N/A'}</td>
                                <td>{reserve.services?.map(service => service.name).join(', ') || 'N/A'}</td>
                                <td>{formatDate(reserve.startTime)}</td>
                                <td>{formatDate(reserve.endTime)}</td>
                                <td>
                                    <div className="status-cell">
                                        {getStatusIcon(reserve.status)}
                                        <span className={`status-text ${reserve.status}`}>
                                            {reserve.status === 'pending' ? 'Pendente' :
                                             reserve.status === 'completed' ? 'Concluída' :
                                             'Cancelada'}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {reserve.status === 'pending' && (
                                            <>
                                                <button
                                                    className="complete-button"
                                                    onClick={() => handleStatusChange(reserve._id, 'completed')}
                                                >
                                                    <FaCheck /> Concluir
                                                </button>
                                                <button
                                                    className="cancel-button"
                                                    onClick={() => handleStatusChange(reserve._id, 'cancelled')}
                                                >
                                                    <FaTimes /> Cancelar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reserves; 