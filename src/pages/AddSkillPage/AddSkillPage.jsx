import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddSkillPage.css";

const API_URL = "http://localhost:3000";

function AddSkillPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Otros");
  const [image, setImage] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    setSubiendo(true);
    setErrorMsg("");
    try {
      const res = await axios.post(`${API_URL}/api/upload/image`, uploadData);
      setImage(res.data.fileUrl);
    } catch (err) {
      setErrorMsg("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subiendo) return;

    const storedToken = localStorage.getItem("authToken");
    axios.post(
      `${API_URL}/api/skills`,
      { title, description, price, category, image },
      { headers: { Authorization: `Bearer ${storedToken}` } }
    )
      .then(() => navigate("/skills"))
      .catch(() => setErrorMsg("Error al crear la clase"));
  };

  return (
    <div className="AddSkillPage">
      <div className="form-card">
        <h3>Publicar Nueva Clase</h3>
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>

          {image && (
            <div className="image-preview">
              <img src={image} alt="Previsualización" />
            </div>
          )}

          <label>Imagen de la clase</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="form-input file-input"
          />
          {subiendo && <p className="msg-subiendo">Subiendo imagen...</p>}
          {image && !subiendo && <p className="msg-success">Imagen lista</p>}

          <label>Título</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ej: Clases de Guitarra"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            className="form-textarea"
            placeholder="Explica tu clase..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />

          <div className="form-row">
            <div className="form-col">
              <label>Precio (€/h)</label>
              <input
                type="number"
                className="form-input"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-col">
              <label>Categoría</label>
              <select
                className="form-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Idiomas">Idiomas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Cocina">Cocina</option>
                <option value="Deportes">Deportes</option>
                <option value="Arte">Arte</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={subiendo}>
            {subiendo ? "Subiendo imagen..." : "Publicar Ahora"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSkillPage;
