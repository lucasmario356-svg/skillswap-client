import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SkillsListPage.css";

function SkillsListPage() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let url = `${API_URL}/api/skills?page=${page}&limit=6`;
    if (search) url += `&search=${search}`;
    if (category) url += `&category=${category}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    axios.get(url)
      .then((response) => setSkills(response.data))
      .catch((error) => console.log(error));
  }, [search, category, maxPrice, page]);

  return (
    <div className="SkillsListPage">
      <h1>Explora Habilidades</h1>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="filters-input"
        />

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="filters-select"
        >
          <option value="">Todas las categorías</option>
          <option value="Idiomas">Idiomas</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Deportes">Deportes</option>
          <option value="Cocina">Cocina</option>
          <option value="Arte">Arte</option>
          <option value="Otros">Otros</option>
        </select>

        <input
          type="number"
          placeholder="Precio máx €"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
          className="filters-input filters-input-price"
        />
      </div>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill._id} className="skill-card">
            <img src={skill.image} alt={skill.title} className="card-image" />
            <div className="card-content">
              <p className="card-category">{skill.category}</p>
              <h3>{skill.title}</h3>
              <p className="card-price">{skill.price}€ / hora</p>
              <Link to={`/skills/${skill._id}`}>
                <button className="btn-details">Ver Detalles</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn-pagination"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          disabled={skills.length < 6}
          onClick={() => setPage(page + 1)}
          className="btn-pagination"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default SkillsListPage;
