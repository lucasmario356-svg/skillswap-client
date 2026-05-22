import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "./EditProfile.css";

const API_URL = "http://localhost:3000";

function EditProfile() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, authenticateUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
      setBio(user.bio || "");
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/upload/image`, uploadData);
      setAvatar(res.data.fileUrl);
    } catch (error) {
      console.log("Error subiendo foto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/api/users/me`,
        { name, avatar, bio },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      await authenticateUser();
      navigate("/profile");
    } catch (error) {
      console.log("Error actualizando perfil:", error);
    }
  };

  return (
    <div className="EditProfilePage">
      <h2>Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Foto de perfil</label>
          <input type="file" onChange={handleFileUpload} />
        </div>

        {avatar && (
          <div className="edit-avatar-preview">
            <img src={avatar} alt="Avatar actual" />
          </div>
        )}

        <div>
          <label>Descripción / Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos algo sobre ti..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-guardar">
          {loading ? "Subiendo..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
