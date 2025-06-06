import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import '../../styles/admin/Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

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
                } else {
                    throw new Error('Erro ao eliminar utilizador');
                }
            } catch (err) {
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
            } else {
                throw new Error(data.message || 'Erro ao verificar utilizador');
            }
        } catch (err) {
            setError(err.message || 'Erro ao verificar utilizador');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">A carregar utilizadores...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>Gestão de Utilizadores</h2>
                <div className="search-bar">
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
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Verificado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.isVerified ? (
                                        <FaCheck className="verified-icon" />
                                    ) : (
                                        <button
                                            className="verify-button"
                                            onClick={() => handleVerifyUser(user._id)}
                                        >
                                            <FaTimes className="not-verified-icon" />
                                            Verificar
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteUser(user._id)}
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
        </div>
    );
}

export default Users; 