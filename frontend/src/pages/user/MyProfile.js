import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/user/MyProfile.css';

function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3000/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.client);
          setFormData({
            name: data.client.name,
            email: data.client.email,
            phone: data.client.phone
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao eliminar conta:', error);
    }
  };

  if (!user) {
    return <div className="loading">A carregar...</div>;
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <section className="profile-section">
          <div className="section-header">
            <h2>Meu Perfil</h2>
          </div>
          <div className="profile-content">
            <div className="profile-form">
              <div className="form-group">
                <label>Nome:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.name}</p>
                )}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <p className="form-value">{user.email}</p>
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{user.phone}</p>
                )}
              </div>
              <div className="action-buttons">
                {isEditing ? (
                  <>
                    <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
                    <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={handleEdit}>Editar Perfil</button>
                )}
              </div>
              <div className="delete-account-section">
                <button 
                  className="btn btn-danger" 
                  onClick={() => setShowDeleteModal(true)}
                >
                  Eliminar Conta
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Eliminar Conta</h3>
            <p>Tem certeza que deseja eliminar a sua conta? Esta ação não pode ser desfeita.</p>
            <div className="modal-buttons">
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteAccount}
              >
                Sim, Eliminar
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile; 