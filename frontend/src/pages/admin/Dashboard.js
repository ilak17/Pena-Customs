import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaCalendarAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Users from '../../components/admin/Users';
import Reserves from '../../components/admin/Reserves';
import Services from '../../components/admin/Services';
import Calendar from '../../components/admin/Calendar';
import '../../styles/admin/Dashboard.css';

function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalServices: 0,
        totalReserves: 0
    });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (activeSection === 'overview') {
            fetchStatistics();
        }
    }, [activeSection]);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/admin/statistics', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar estatísticas');
            }

            const data = await response.json();
            
            if(data.success){
                console.log(data.message);
                setStatistics({
                    totalUsers: data.message.totalUsers,
                    totalServices: data.message.totalServices,
                    totalReserves: data.message.totalReserves
                });
            }
            
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        }
    };

    const handleGenerateReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams();
            
            if (startDate) {
                const startDateTime = new Date(startDate);
                startDateTime.setHours(0, 0, 0, 0);
                queryParams.append('startDate', startDateTime.toISOString());
            }
            
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                queryParams.append('endDate', endDateTime.toISOString());
            }

            const response = await fetch(`http://localhost:3000/report?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'relatorio-servicos.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="overview-container">
                        <div className="overview-grid">
                            <div className="stat-card">
                                <FaUsers className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Total de Utilizadores</h3>
                                    <p>{statistics.totalUsers}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaCar className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Serviços Disponíveis</h3>
                                    <p>{statistics.totalServices}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <FaCalendarAlt className="stat-icon" />
                                <div className="stat-info">
                                    <h3>Reservas Totais</h3>
                                    <p>{statistics.totalReserves}</p>
                                </div>
                            </div>
                        </div>
                        <div className="calendar-wrapper">
                            <Calendar />
                        </div>
                    </div>
                );
            case 'users':
                return <Users />;
            case 'reserves':
                return <Reserves />;
            case 'services':
                return <Services />;
            case 'reports':
                return (
                    <div className="reports-section">
                        <h2>Gerar Relatório de Serviços</h2>
                        <div className="date-filters">
                            <div className="date-input">
                                <label>Data Inicial:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="date-input">
                                <label>Data Final:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="generate-report-btn" onClick={handleGenerateReport}>
                            Gerar Relatório PDF
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-container">
                    <img src="/assets/images/logo.png" alt="Pena-Customs Logo" className="dashboard-logo" />
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveSection('overview')}
                    >
                        <FaUsers /> Visão Geral
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveSection('users')}
                    >
                        <FaUsers /> Utilizadores
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveSection('services')}
                    >
                        <FaCar /> Serviços
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'reserves' ? 'active' : ''}`}
                        onClick={() => setActiveSection('reserves')}
                    >
                        <FaCalendarAlt /> Reservas
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveSection('reports')}
                    >
                        <FaFileAlt /> Relatórios
                    </button>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Terminar Sessão
                </button>
            </aside>
            <main className="main-content">
                <div className="dashboard-header">
                    <h1>
                        {activeSection === 'overview' && 'Visão Geral'}
                        {activeSection === 'users' && 'Gestão de Utilizadores'}
                        {activeSection === 'services' && 'Gestão de Serviços'}
                        {activeSection === 'reserves' && 'Gestão de Reservas'}
                        {activeSection === 'reports' && 'Relatórios'}
                    </h1>
                </div>
                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;


