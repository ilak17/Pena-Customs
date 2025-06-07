import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import '../../styles/admin/Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar utilizadores');
            }

            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                throw new Error(data.message || 'Erro ao carregar utilizadores');
            }
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Erro ao carregar utilizadores');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Tem certeza que deseja eliminar este utilizador?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/admin/delete-user/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setUsers(users.filter(user => user._id !== userId));
                    showNotification('Utilizador eliminado com sucesso!', 'success');
                } else {
                    throw new Error('Erro ao eliminar utilizador');
                }
            } catch (err) {
                showNotification('Erro ao eliminar utilizador', 'error');
                setError('Erro ao eliminar utilizador');
            }
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/admin/verify-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isVerified: true })
            });

            if (!response.ok) {
                throw new Error('Erro ao verificar utilizador');
            }

            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user => 
                    user._id === userId ? { ...user, isVerified: true } : user
                ));
                showNotification('Utilizador verificado com sucesso!', 'success');
            } else {
                throw new Error(data.message || 'Erro ao verificar utilizador');
            }
        } catch (err) {
            showNotification('Erro ao verificar utilizador', 'error');
            setError(err.message || 'Erro ao verificar utilizador');
        }
    };

    const showNotification = (message, type) => {
        // Implementar sistema de notificações aqui
        console.log(`${type}: ${message}`);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>A carregar utilizadores...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-button">Tentar Novamente</button>
        </div>
    );

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>Gestão de Utilizadores</h2>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Procurar utilizadores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>
                                Nome {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('email')}>
                                Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th>Telefone</th>
                            <th>Verificado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.isVerified ? (
                                        <div className="verified-badge">
                                            <FaCheck className="verified-icon" />
                                            <span>Verificado</span>
                                        </div>
                                    ) : (
                                        <button
                                            className="verify-button"
                                            onClick={() => handleVerifyUser(user._id)}
                                        >
                                            <FaTimes className="not-verified-icon" />
                                            <span>Verificar</span>
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteUser(user._id)}
                                            title="Eliminar Utilizador"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    );
}

export default Users; 