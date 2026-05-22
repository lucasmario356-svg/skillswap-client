import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error al conectar con el servidor";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="LoginPage">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Entrar</button>
        </form>

        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;