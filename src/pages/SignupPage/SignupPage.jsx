import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name };

    axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, requestBody)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error al conectar con el servidor";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage"> 
      <div className="auth-card"> 
        <h1>Crear Cuenta</h1>

        <form onSubmit={handleSignup}>
          <label>Nombre:</label>
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Tu nombre"
          />

          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="ejemplo@correo.com"
          />

          <label>Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="********"
          />

          <button type="submit">Registrarme</button>
        </form>

        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;