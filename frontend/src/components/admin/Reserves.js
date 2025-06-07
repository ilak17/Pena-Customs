import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/admin/Reserves.css';

function Reserves() {
    const [reserves, setReserves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [editingReserve, setEditingReserve] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const statusOptions = [
        { value: 'pending', label: 'Pendente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'running', label: 'Em Andamento' },
        { value: 'waiting', label: 'Em Espera' },
        { value: 'completed', label: 'Concluída' },
        { value: 'cancelled', label: 'Cancelada' }
    ];

    const fetchReserves = async () => {
        try{
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/reserve', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar reservas');
            }

            const data = await response.json();
            if (data.success) {
                const reservesData = Array.isArray(data.message) ? data.message : 
                                   Array.isArray(data.reserves) ? data.reserves : [];
                
                setReserves(reservesData);
                setLoading(false);
            } else {
                throw new Error(data.message || 'Erro ao carregar reservas');
            }
        } catch (err) {
            console.error('Erro completo:', err);
            setError(err.message || 'Erro ao carregar reservas');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReserves();
    }, []);

    // Função para mostrar mensagem e recarregar dados
    const showMessageAndReload = (message, isError = false) => {
        if (isError) {
            setError(message);
            setSuccess(null);
        } else {
            setSuccess(message);
            setError(null);
        }

        // Limpa a mensagem e recarrega os dados após 3 segundos
        setTimeout(() => {
            setError(null);
            setSuccess(null);
            fetchReserves();
        }, 3000);
    };

    const handleStatusChange = async (reserveSKU, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/reserve/${reserveSKU}`, {
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
                showMessageAndReload('Estado da reserva atualizado com sucesso!');
            } else {
                throw new Error(data.message || 'Erro ao atualizar estado da reserva');
            }
        } catch (err) {
            showMessageAndReload(err.message || 'Erro ao atualizar estado da reserva', true);
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
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Converte diretamente para o formato do input mantendo a hora UTC
        return date.toISOString().slice(0, 16);
    };

    const filteredReserves = reserves.filter(reserve => {
        if (!reserve) return false;
        
        const matchesSearch = (
            (reserve.clientID?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reserve.serviceID || []).some(service => 
                (service.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        
        return filterStatus === 'all' 
            ? matchesSearch 
            : matchesSearch && reserve.status === filterStatus;
    });

    const handleEdit = (reserve) => {
        setEditingReserve(reserve);
        setShowEditModal(true);
    };

    const handleDelete = async (sku) => {
        if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/reserve/${sku}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir reserva');
                }

                const data = await response.json();
                if (data.success) {
                    showMessageAndReload('Reserva excluída com sucesso!');
                } else {
                    throw new Error(data.message || 'Erro ao excluir reserva');
                }
            } catch (err) {
                showMessageAndReload(err.message || 'Erro ao excluir reserva', true);
            }
        }
    };

    const getStatusLabel = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.label : status;
    };

    const handleUpdateReserve = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            const updateData = {
                status: editingReserve.status,
                addComent: editingReserve.addComent
            };

            if (editingReserve.startTime) {
                updateData.startTime = new Date(editingReserve.startTime).toISOString();
            }

            if (editingReserve.endTime) {
                updateData.endTime = new Date(editingReserve.endTime).toISOString();
            }

            const response = await fetch(`http://localhost:3000/reserve/${editingReserve.sku}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar reserva');
            }

            const data = await response.json();
            if (data.success) {
                setShowEditModal(false);
                setEditingReserve(null);
                showMessageAndReload('Reserva atualizada com sucesso!');
            } else {
                throw new Error(data.message || 'Erro ao atualizar reserva');
            }
        } catch (err) {
            showMessageAndReload(err.message || 'Erro ao atualizar reserva', true);
        }
    };

    if (loading) return <div className="loading">A carregar reservas...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="reserves-container">
            {(error || success) && (
                <div className={`message ${error ? 'error' : 'success'}`}>
                    {error || success}
                </div>
            )}
            
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
                            <tr key={reserve.sku}>
                                <td>{reserve.clientID?.name || 'N/A'}</td>
                                <td>{reserve.serviceID?.map(service => service.name).join(', ') || 'N/A'}</td>
                                <td>{formatDate(reserve.startTime)}</td>
                                <td>{formatDate(reserve.endTime)}</td>
                                <td>
                                    <div className="status-cell">
                                        {getStatusIcon(reserve.status)}
                                        <span className={`status-text ${reserve.status}`}>
                                            {getStatusLabel(reserve.status)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {reserve.status === 'pending' && (
                                            <>
                                                <button
                                                    className="complete-button"
                                                    onClick={() => handleStatusChange(reserve.sku, 'completed')}
                                                >
                                                    <FaCheck /> Concluir
                                                </button>
                                                <button
                                                    className="cancel-button"
                                                    onClick={() => handleStatusChange(reserve.sku, 'cancelled')}
                                                >
                                                    <FaTimes /> Cancelar
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(reserve)}
                                        >
                                            <FaEdit /> Editar
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(reserve.sku)}
                                        >
                                            <FaTrash /> Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showEditModal && editingReserve && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Reserva</h3>
                        <form onSubmit={handleUpdateReserve}>
                            <div className="form-group">
                                <label>Estado:</label>
                                <select
                                    value={editingReserve.status}
                                    onChange={(e) => setEditingReserve({
                                        ...editingReserve,
                                        status: e.target.value
                                    })}
                                    className="status-select"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Data e Hora de Início:</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateForInput(editingReserve.startTime)}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                                        setEditingReserve({
                                            ...editingReserve,
                                            startTime: utcDate.toISOString()
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Data e Hora de Fim (opcional):</label>
                                <input
                                    type="datetime-local"
                                    value={formatDateForInput(editingReserve.endTime)}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                                        setEditingReserve({
                                            ...editingReserve,
                                            endTime: utcDate.toISOString()
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Comentários Adicionais:</label>
                                <textarea
                                    value={editingReserve.addComent || ''}
                                    onChange={(e) => setEditingReserve({
                                        ...editingReserve,
                                        addComent: e.target.value
                                    })}
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="save-button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingReserve(null);
                                    }}
                                    >
                                        Salvar
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingReserve(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reserves; 