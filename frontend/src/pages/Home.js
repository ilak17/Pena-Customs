import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Home.css';
import car1 from '../assets/images/car1.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />
      
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Bem-vindo à Pena-Customs</h1>
            <p>A sua oficina especializada em transformar o seu automóvel num verdadeiro ícone sobre rodas</p>
            <button onClick={() => navigate('/servicos')} className="cta-button">
              Descubra os Nossos Serviços
            </button>
          </div>
          <div className="hero-image">
            <img src={car1} alt="Automóvel customizado em destaque" className="image-placeholder" />
          </div>
        </section>

        <section className="featured-section">
          <h2>Porquê Escolher-nos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-tools"></i>
              <h3>Experiência Comprovada</h3>
              <p>Mais de 10 anos de excelência em personalização automóvel</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-award"></i>
              <h3>Qualidade Premium</h3>
              <p>Utilizamos apenas materiais e componentes de alta qualidade</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-clock"></i>
              <h3>Prazos Garantidos</h3>
              <p>Cumprimos rigorosamente os prazos estabelecidos</p>
            </div>
          </div>
        </section>

        <section className="services-preview">
          <h2>Os Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-image">
                <i className="fas fa-spray-can"></i>
              </div>
              <h3>Pintura Personalizada</h3>
              <p>Designs exclusivos e acabamento premium para o seu automóvel</p>
              <button onClick={() => navigate('/servicos/pintura')} className="service-button">
                Saber Mais
              </button>
            </div>
            <div className="service-card">
              <div className="service-image">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Modificações Mecânicas</h3>
              <p>Otimização de performance e potência ao mais alto nível</p>
              <button onClick={() => navigate('/servicos/mecanica')} className="service-button">
                Saber Mais
              </button>
            </div>
            <div className="service-card">
              <div className="service-image">
                <i className="fas fa-car"></i>
              </div>
              <h3>Interior Personalizado</h3>
              <p>Conforto e estilo em cada pormenor do seu automóvel</p>
              <button onClick={() => navigate('/servicos/interior')} className="service-button">
                Saber Mais
              </button>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Pronto para Transformar o Seu Automóvel?</h2>
            <p>Agende já uma reserva personalizada e dê vida aos seus sonhos automóveis</p>
            <button onClick={() => navigate('/reservas')} className="cta-button">
              Agendar Reserva
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contactos</h3>
            <p><i className="fas fa-envelope"></i> geral@pena-customs.pt</p>
            <p><i className="fas fa-phone"></i> (+351) 123 456 789</p>
            <p><i className="fas fa-map-marker-alt"></i> Rua Principal, 123, Porto</p>
          </div>
          <div className="footer-section">
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado: 9h às 13h</p>
            <p>Domingo: Encerrado</p>
          </div>
          <div className="footer-section">
            <h3>Siga-nos</h3>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 