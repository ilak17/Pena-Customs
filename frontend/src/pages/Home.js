import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Home.css';
import car1 from '../assets/images/car1.jpg';
import serviceImagePaint from '../assets/images/serviceImagePaint.jpg';
import serviceImageMotor from '../assets/images/serviceImageMotor.jpg';
import serviceImageInterior from '../assets/images/serviceImageInter1.jpg';

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const navigateToServices = (category) => {
    const params = new URLSearchParams();
    params.append('category', category);
    navigate(`/servicos?${params.toString()}`);
  };

  return (
    <div className="page-container">
      <Header />
      
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Bem-vindo à Pena-Customs</h1>
            <p>A sua oficina de personalização automóvel de referência em Portugal</p>
            {isLoggedIn ? (
              <button onClick={() => navigate('/marcar-reserva')} className="cta-button">
                Agendar Reserva
              </button>
            ) : (
              <button onClick={() => navigate('/registar')} className="cta-button">
                Começar Agora
              </button>
            )}
          </div>
          <div className="hero-image">
            <img src={car1} alt="Viatura personalizada em destaque" className="image-placeholder" />
          </div>
        </section>

        <section className="services-preview">
          <h2>Os Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-image">
                <img src={serviceImagePaint} alt="Serviço de Pintura Personalizada" />
              </div>
              <div className="service-content">
                <h3>Pintura Personalizada</h3>
                <p>Designs exclusivos e acabamento premium para a sua viatura</p>
                <button onClick={() => navigateToServices('Chapa e Pintura')} className="service-button">
                  Saber Mais
                </button>
              </div>
            </div>
            <div className="service-card">
              <div className="service-image">
                <img src={serviceImageMotor} alt="Serviço de Modificações Mecânicas" />
              </div>
              <div className="service-content">
                <h3>Modificações Mecânicas</h3>
                <p>Otimização de desempenho e potência para máxima performance</p>
                <button onClick={() => navigateToServices('Mecânica Avançada')} className="service-button">
                  Saber Mais
                </button>
              </div>
            </div>
            <div className="service-card">
              <div className="service-image">
                <img src={serviceImageInterior} alt="Serviço de Interior Personalizado" />
              </div>
              <div className="service-content">
                <h3>Interior Personalizado</h3>
                <p>Requinte e conforto em cada pormenor do habitáculo</p>
                <button onClick={() => navigateToServices('Personalização')} className="service-button">
                  Saber Mais
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Porquê Escolher-nos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="feature-icon expertise-icon"></i>
              <h3>Experiência Comprovada</h3>
              <p>Mais de 10 anos de excelência em personalização automóvel</p>
            </div>
            <div className="feature-card">
              <i className="feature-icon quality-icon"></i>
              <h3>Qualidade Premium</h3>
              <p>Utilizamos apenas materiais e equipamentos de topo</p>
            </div>
            <div className="feature-card">
              <i className="feature-icon warranty-icon"></i>
              <h3>Garantia de Serviço</h3>
              <p>Todos os nossos trabalhos têm garantia assegurada</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Pronto para Transformar a Sua Viatura?</h2>
            <p>Agende já uma consulta personalizada e descubra todas as possibilidades</p>
            <button onClick={() => navigate('/contactos')} className="cta-button">
              Contacte-nos
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contactos</h3>
            <p>Email: geral@pena-customs.pt</p>
            <p>Telefone: (+351) 123 456 789</p>
            <p>Morada: Rua Principal, 123</p>
            <p>2750-000 Cascais</p>
          </div>
          <div className="footer-section">
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado: 9h às 13h</p>
            <p>Domingo: Encerrado</p>
          </div>
          <div className="footer-section">
            <h3>Redes Sociais</h3>
            <div className="social-links">
              {/*
              <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              */}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Pena-Customs. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home; 