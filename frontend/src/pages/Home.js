import React, { useEffect, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState({
    services: false,
    features: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.querySelector('.services-preview');
      const featuresSection = document.querySelector('.features-section');
      const ctaSection = document.querySelector('.cta-section');
      
      const isElementVisible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.75;
      };

      setIsVisible({
        services: isElementVisible(servicesSection),
        features: isElementVisible(featuresSection),
        cta: isElementVisible(ctaSection)
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToServices = (category) => {
    const params = new URLSearchParams();
    params.append('category', category);
    navigate(`/servicos?${params.toString()}`);
  };

  return (
    <div className="page-container home-page-container">
      <Header />
      <div className="content-wrapper">
        <main>
          <section className="hero-section">
            <div className="hero-content">
              <h1>Bem-vindo à Pena Customs</h1>
              <p>Transformamos o seu automóvel de sonho em realidade com tecnologia de ponta e qualidade incomparável</p>
              {isLoggedIn ? (
                <button onClick={() => navigate('/marcar-reserva')} className="cta-button">
                  <span>Agendar Reserva</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button onClick={() => navigate('/registar')} className="cta-button">
                  <span>Começar Agora</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
            <div className="hero-image">
              <img src={car1} alt="Viatura personalizada em destaque" />
            </div>
          </section>

          <section className={`services-preview ${isVisible.services ? 'visible' : ''}`}>
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
                    <span>Saber Mais</span>
                    <i className="fas fa-chevron-right"></i>
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
                    <span>Saber Mais</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <div className="service-card">
                <div className="service-image">
                  <img src={serviceImageInterior} alt="Serviço de Interior Personalizado" />
                </div>
                <div className="service-content">
                  <h3>Interior Personalizado</h3>
                  <p>Requinte e conforto em cada pormenor do veículo</p>
                  <button onClick={() => navigateToServices('Personalização')} className="service-button">
                    <span>Saber Mais</span>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className={`features-section ${isVisible.features ? 'visible' : ''}`}>
            <h2>Porquê Escolher-nos?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <i className="fas fa-tools feature-icon"></i>
                <h3>Experiência Comprovada</h3>
                <p>Mais de 10 anos de excelência em personalização automóvel</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-award feature-icon"></i>
                <h3>Qualidade Premium</h3>
                <p>Utilizamos apenas materiais e equipamentos de topo</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-shield-alt feature-icon"></i>
                <h3>Garantia de Serviço</h3>
                <p>Todos os nossos trabalhos têm garantia assegurada</p>
              </div>
            </div>
          </section>

          <section className={`cta-section ${isVisible.cta ? 'visible' : ''}`}>
            <div className="cta-content">
              <h2>Pronto para Transformar a Sua Viatura?</h2>
              <p>Agende já uma consulta personalizada e descubra todas as possibilidades</p>
              <button onClick={() => navigate('/contactos')} className="cta-button">
                <span>Contacte-nos</span>
                <i className="fas fa-arrow-right"></i>
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
              <p><i className="fas fa-map-marker-alt"></i> Rua Principal, 123</p>
              <p>4560-000 Penafiel</p>
            </div>
            <div className="footer-section">
              <h3>Horário de Funcionamento</h3>
              <p><i className="far fa-clock"></i> Segunda a Sexta: 9h às 18h</p>
              <p><i className="far fa-clock"></i> Sábado: 9h às 13h</p>
              <p><i className="far fa-clock"></i> Domingo: Encerrado</p>
            </div>
            <div className="footer-section">
              <h3>Redes Sociais</h3>
              <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Pena-Customs. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home; 