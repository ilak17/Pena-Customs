import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptLocale from '@fullcalendar/core/locales/pt';
import '../../styles/admin/Calendar.css';

function Calendar() {
    // Configurar timezone para Portugal
    const timeZone = 'Europe/Lisbon';
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchReserves();
    }, []);

    const fetchReserves = async () => {
        try {
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
                const reservesData = Array.isArray(data.message) ? data.message : [];
                console.log('Reservas recebidas:', reservesData);
                const calendarEvents = reservesData.map(reserve => {
                    // Extrair o nome do cliente com fallback
                    const clientName = reserve.clientID?.name || 'Cliente não especificado';
                    
                    // Extrair os nomes dos serviços com fallback
                    const serviceNames = reserve.serviceID?.map(s => s.name).join(', ') || 'Serviço não especificado';
                    
                    // Extrair a matrícula do veículo com fallback
                    const vehiclePlate = reserve.vehicleID?.plate || 'Veículo não especificado';

                    // Ajustar as horas para o fuso horário local
                    const startDate = new Date(reserve.startTime);
                    const endDate = new Date(reserve.endTime);

                    const status = reserve.status || 'pending';

                    return {
                        id: reserve._id,
                        title: `#${reserve.sku} - ${clientName} - ${serviceNames}`,
                        start: startDate,
                        end: endDate,
                        display: 'block',
                        allDay: false,
                        extendedProps: {
                            sku: reserve.sku,
                            status: status,
                            client: clientName,
                            services: reserve.serviceID || [],
                            plate: vehiclePlate
                        }
                    };
                });
                setEvents(calendarEvents);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erro ao buscar reservas:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#ffd700',    // Amarelo
            confirmed: '#3498db',  // Azul
            running: '#9b59b6',    // Roxo
            waiting: '#f39c12',    // Laranja
            completed: '#27ae60',  // Verde
            cancelled: '#e74c3c'   // Vermelho
        };
        return colors[status] || '#95a5a6'; // Cinza como fallback
    };

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const handleEventDidMount = (info) => {
        info.el.setAttribute('data-status', info.event.extendedProps.status);
    };

    if (loading) return <div className="calendar-loading">Carregando calendário...</div>;
    if (error) return <div className="calendar-error">{error}</div>;

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                eventClick={handleEventClick}
                eventDidMount={handleEventDidMount}
                eventDisplay="block"
                locale={ptLocale}
                height="auto"
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                timeZone={timeZone}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: '08:00',
                    endTime: '20:00',
                }}
                weekends={false}
            />

            {showModal && selectedEvent && (
                <div className="calendar-modal-overlay" onClick={closeModal}>
                    <div className="calendar-modal" onClick={e => e.stopPropagation()}>
                        <div className="calendar-modal-header">
                            <h2>Detalhes da Reserva</h2>
                            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="calendar-modal-content">
                            <div className="modal-info-group">
                                <label>SKU:</label>
                                <p>#{selectedEvent.extendedProps.sku}</p>
                            </div>
                            <div className="modal-info-group">
                                <label>Cliente:</label>
                                <p>{selectedEvent.extendedProps.client}</p>
                            </div>
                            <div className="modal-info-group">
                                <label>Veículo:</label>
                                <p>{selectedEvent.extendedProps.plate}</p>
                            </div>
                            <div className="modal-info-group">
                                <label>Serviços:</label>
                                <p>{selectedEvent.extendedProps.services.map(s => s.name).join(', ') || 'Nenhum serviço'}</p>
                            </div>
                            <div className="modal-info-group">
                                <label>Estado:</label>
                                <span className={`status-badge ${selectedEvent.extendedProps.status}`}>
                                    {selectedEvent.extendedProps.status}
                                </span>
                            </div>
                            <div className="modal-info-group">
                                <label>Início:</label>
                                <p>{selectedEvent.start.toLocaleString()}</p>
                            </div>
                            <div className="modal-info-group">
                                <label>Fim:</label>
                                <p>{selectedEvent.end.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar; 