import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  const { isLoggedIn, user } = useContext(AuthContext);

  const rolClass = (role) => {
    const map = { Admin: "nav-rol-admin", Helper: "nav-rol-helper", Professor: "nav-rol-professor", Alumno: "nav-rol-alumno" };
    return map[role] || "nav-rol-user";
  };

  return (
    <nav className="Navbar">
      <Link to="/" className="logo">
        <span className="logo-skill">Skill</span>
        <span className="logo-swap">Swap</span>
      </Link>

      <div className="navbar-acciones">
        {isLoggedIn && (
          <>
            {user?.role !== "Professor" && (
              <Link to="/skills"><button>Busca tu clase</button></Link>
            )}
            {user?.role !== "Professor" && (
              <Link to="/profesores"><button>Busca tu profesor</button></Link>
            )}
            {(user?.role === "Admin" || user?.role === "Helper") && (
              <Link to="/admin/buzon"><button className="btn-buzon">Buzón</button></Link>
            )}

            <Link to="/profile" className="navbar-perfil-link">
              <div className="navbar-perfil">
                <div className="navbar-user-info">
                  <span className="navbar-user-nombre">{user?.name}</span>
                  <span className={`navbar-user-rol ${rolClass(user?.role)}`}>{user?.role}</span>
                </div>

                {user?.avatar ? (
                  <img src={user.avatar} alt="Perfil" className="navbar-avatar-img" />
                ) : (
                  <div className="navbar-avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/signup"><button>Registro</button></Link>
            <Link to="/login"><button>Login</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
