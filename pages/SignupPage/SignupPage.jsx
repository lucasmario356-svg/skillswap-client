import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name };

    // Usamos la variable de entorno que configuramos en el .env
    axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
      .then(() => {
        navigate("/login"); // Si sale bien, nos manda al login
      })
      .catch((error) => {
        console.log("Error en el registro:", error);
      });
  };

  return (
    <div className="SignupPage">
      <h1>Registro</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Nombre:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default SignupPage;