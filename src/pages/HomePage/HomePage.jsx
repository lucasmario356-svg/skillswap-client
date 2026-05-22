import "./HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Intercambia habilidades.<br /> <span className="highlight">Aprende sin límites.</span></h1>
          <p>
            Únete a la comunidad donde el conocimiento es la moneda de cambio.
            Encuentra expertos cerca de ti o enseña lo que te apasiona.
          </p>
          <div className="hero-buttons">
            <Link to="/skills">
              <button className="btn-primary">Ver Habilidades</button>
            </Link>
            <Link to="/signup">
              <button className="btn-secondary">Unirme Ahora</button>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glowing-circle"></div>
        </div>
      </header>

      <section className="steps-section">
        <h2 className="section-title">¿Cómo funciona?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Crea tu cuenta</h3>
            <p>Regístrate gratis y solicita el rol de Alumno o Profesor según lo que necesites.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Encuentra tu clase</h3>
            <p>Explora clases por categoría, precio o valoración. Guarda las que más te gusten.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Reserva y aprende</h3>
            <p>Solicita una reserva directamente al profesor, acuerda la fecha y empieza.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Valora tu experiencia</h3>
            <p>Deja una reseña para ayudar a otros alumnos y mejorar la comunidad.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎓</div>
          <h3>Publica tu Clase</h3>
          <p>Crea tu perfil de profesor, define tu precio y comparte tu talento con alumnos de todo el mundo.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Encuentra Expertos</h3>
          <p>Explora cientos de habilidades: programación, idiomas, música, diseño y mucho más.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Reservas Sencillas</h3>
          <p>Solicita tu clase con un clic. El profesor confirma la fecha y listo — sin complicaciones.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Reseñas Reales</h3>
          <p>Lee opiniones de otros alumnos y elige al profesor con mejor valoración para ti.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
