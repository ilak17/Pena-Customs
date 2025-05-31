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
            <p>Transformando seu veículo em uma obra de arte sobre rodas</p>
            <button onClick={() => navigate('/servicos')} className="cta-button">
              Conheça Nossos Serviços
            </button>
          </div>
          <div className="hero-image">
            <img src={car1} alt="Carro customizado em destaque" className="image-placeholder" />
          </div>
        </section>

        <section className="services-preview">
          <h2>Nossos Serviços</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-image">
                {/* Imagem de Pintura Personalizada */}
                [Imagem de pintura customizada]
              </div>
              <h3>Pintura Personalizada</h3>
              <p>Designs únicos e acabamento premium para seu veículo</p>
            </div>
            <div className="service-card">
              <div className="service-image">
                {/* Imagem de Modificações Mecânicas */}
                [Imagem de motor customizado]
              </div>
              <h3>Modificações Mecânicas</h3>
              <p>Performance e potência otimizadas</p>
            </div>
            <div className="service-card">
              <div className="service-image">
                {/* Imagem de Interior Customizado */}
                [Imagem de interior personalizado]
              </div>
              <h3>Interior Customizado</h3>
              <p>Conforto e estilo em cada detalhe</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Pronto para Transformar Seu Veículo?</h2>
            <p>Faça sua reserva agora e garanta um atendimento personalizado</p>
            <button onClick={() => navigate('/reservas')} className="cta-button">
              Fazer Reserva
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contato</h3>
            <p>Email: contato@pena-customs.com</p>
            <p>Telefone: (XX) XXXX-XXXX</p>
          </div>
          <div className="footer-section">
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado: 9h às 13h</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 