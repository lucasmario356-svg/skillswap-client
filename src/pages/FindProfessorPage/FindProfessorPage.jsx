import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FindProfessorPage.css";

const API_URL = "http://localhost:3000";

function FindProfessorPage() {
  const [profesores, setProfesores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/users/profesores`)
      .then(res => setProfesores(res.data))
      .catch(console.log);
  }, []);

  const filtrados = profesores.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.bio && p.bio.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="FindProfessorPage">
      <div className="fp-header">
        <h1>Busca tu Profesor</h1>
        <p>Encuentra al profesor perfecto para ti</p>
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="fp-buscador"
        />
      </div>

      {filtrados.length === 0 ? (
        <p className="fp-vacio">No se encontraron profesores.</p>
      ) : (
        <div className="fp-grid">
          {filtrados.map(prof => (
            <Link to={`/users/${prof._id}`} key={prof._id} className="fp-card">
              <div className="fp-avatar">
                {prof.avatar
                  ? <img src={prof.avatar} alt={prof.name} />
                  : prof.name.charAt(0).toUpperCase()}
              </div>
              <h3>{prof.name}</h3>
              <p className="fp-bio">{prof.bio || "Sin descripción todavía."}</p>
              <span className="fp-btn">Ver Perfil →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindProfessorPage;
