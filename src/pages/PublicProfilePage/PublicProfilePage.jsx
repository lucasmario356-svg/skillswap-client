import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./PublicProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

function PublicProfilePage() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [clases, setClases] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/users/${id}`)
      .then(res => {
        setPerfil(res.data);
        // Si es profesor, cargamos sus clases publicadas
        if (res.data.role === "Professor") {
          axios.get(`${API_URL}/api/skills`)
            .then(skillsRes => {
              setClases(skillsRes.data.filter(s =>
                String(s.teacher?._id || s.teacher) === String(res.data._id)
              ));
            }).catch(console.log);
        }
      }).catch(console.log);
  }, [id]);

  if (!perfil) return <div className="pp-loading">Cargando perfil...</div>;

  // Admin y Helper: perfil privado
  if (perfil.role === "Admin" || perfil.role === "Helper") {
    return (
      <div className="PublicProfilePage">
        <div className="pp-card">
          <div className="pp-avatar">
            {perfil.avatar
              ? <img src={perfil.avatar} alt={perfil.name} />
              : perfil.name.charAt(0).toUpperCase()}
          </div>
          <div className="pp-info">
            <h1>{perfil.name}</h1>
            <span className={`rol-badge rol-${perfil.role?.toLowerCase()}`}>{perfil.role}</span>
            <p className="pp-privado">El perfil de este usuario es privado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="PublicProfilePage">
      <div className="pp-card">
        <div className="pp-avatar">
          {perfil.avatar
            ? <img src={perfil.avatar} alt={perfil.name} />
            : perfil.name.charAt(0).toUpperCase()}
        </div>
        <div className="pp-info">
          <h1>{perfil.name}</h1>
          <span className={`rol-badge rol-${perfil.role?.toLowerCase()}`}>{perfil.role}</span>
          {perfil.bio && <p className="pp-bio">{perfil.bio}</p>}
        </div>
      </div>

      {perfil.role === "Professor" && (
        <div className="pp-seccion">
          <h2>Clases de {perfil.name}</h2>
          {clases.length === 0 ? (
            <p className="pp-vacio">Este profesor no tiene clases publicadas todavía.</p>
          ) : (
            <div className="pp-grid">
              {clases.map(skill => (
                <div key={skill._id} className="mini-skill-card">
                  <img src={skill.image} alt={skill.title} />
                  <div className="mini-card-info">
                    <h4>{skill.title}</h4>
                    <p className="price-text">{skill.price}€/h</p>
                    <Link to={`/skills/${skill._id}`} className="view-link">Ver / Reservar</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PublicProfilePage;
