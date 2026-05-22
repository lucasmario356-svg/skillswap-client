import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import "./SkillDetailsPage.css";

function SkillDetailsPage() {
  const [skill, setSkill] = useState(null);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [error, setError] = useState(null);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("ID de clase no válido.");
      return;
    }

    axios.get(`${API_URL}/api/skills/${id}`)
      .then((res) => {
        setSkill(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la información de la clase.");
      });
  }, [id]);

  const handleBooking = (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    if (!date) {
      setBookingMessage("Por favor, selecciona una fecha.");
      return;
    }

    const bookingData = { skillId: id, date, message };

    axios.post(`${API_URL}/api/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(() => {
      setBookingMessage("¡Reserva enviada con éxito! El profesor recibirá un email.");
      setTimeout(() => navigate("/profile"), 2000);
    })
    .catch((err) => {
      console.log(err);
      setBookingMessage("Hubo un error al realizar la reserva.");
    });
  };

  const handleDelete = () => {
    const storedToken = localStorage.getItem("authToken");

    if (!window.confirm("¿Estás seguro de que quieres eliminar esta clase?")) {
      return;
    }

    axios.delete(`${API_URL}/api/skills/${id}`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(() => {
        navigate("/skills");
      })
      .catch((err) => {
        console.log(err);
        setError("Hubo un error al borrar la clase.");
      });
  };

  if (error) {
    return (
      <div className="skill-error-page">
        <h3>{error}</h3>
        <p>Parece que el enlace está roto o la clase ya no existe.</p>
        <button onClick={() => navigate("/skills")}>Volver al catálogo</button>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="skill-loading-page">
        <h3>Cargando detalles de la clase...</h3>
      </div>
    );
  }

  const teacherId = skill.teacher?._id || skill.teacher;
  const isOwner = user && teacherId && String(user._id) === String(teacherId);

  return (
    <div className="SkillDetails">

      <div className="skill-top">
        <img
          src={skill.image}
          alt={skill.title}
          className="skill-main-image"
        />
        <div className="skill-info">
          <h1>{skill.title}</h1>
          <p>{skill.description}</p>
          <h2 className="skill-price">{skill.price}€ / h</h2>
          <div className="skill-teacher-box">
            <p><strong>Profesor:</strong> {skill.teacher?.name || "Instructor"}</p>
          </div>
        </div>
      </div>

      <hr className="skill-divider" />

      {!isOwner && user ? (
        <div className="booking-box">
          <h3>Reserva tu sesión</h3>

          <form onSubmit={handleBooking}>
            <div className="booking-field">
              <label className="booking-label">¿Cuándo quieres empezar?</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="booking-input"
              />
            </div>

            <div className="booking-field">
              <label className="booking-label">Mensaje para el profesor:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hola, me gustaría aprender..."
                className="booking-textarea"
              />
            </div>

            <button type="submit" className="booking-btn">
              Enviar Solicitud
            </button>
          </form>

          {bookingMessage && (
            <div className={`booking-msg ${bookingMessage.includes("éxito") ? "success" : "error"}`}>
              {bookingMessage}
            </div>
          )}
        </div>
      ) : isOwner ? (
        <div className="owner-controls">
          <Link to={`/skills/edit/${id}`}>
            <button className="btn-edit-skill">Editar Clase</button>
          </Link>
          <button onClick={handleDelete} className="btn-delete-skill">
            Borrar Clase
          </button>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Inicia sesión para poder reservar esta clase.</p>
          <Link to="/login">Ir al Login</Link>
        </div>
      )}
    </div>
  );
}

export default SkillDetailsPage;
