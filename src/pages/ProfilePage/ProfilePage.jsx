import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { Link } from "react-router-dom";
import "./ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const { user, logOutUser, authenticateUser } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccion, setSeccion] = useState("perfil");

  // Datos según rol
  const [misClases, setMisClases] = useState([]);
  const [clasesCompradas, setClasesCompradas] = useState([]);
  const [solicitudesClase, setSolicitudesClase] = useState([]);
  const [solicitudesRol, setSolicitudesRol] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  // Edición inline de descripción y foto
  const [editando, setEditando] = useState(false);
  const [nuevaBio, setNuevaBio] = useState("");
  const [nuevoAvatar, setNuevoAvatar] = useState("");
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // Formulario solicitud de rol (para usuario con rol "User")
  const [rolPedido, setRolPedido] = useState("Alumno");
  const [justificacion, setJustificacion] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [temas, setTemas] = useState("");
  const [mensajeForm, setMensajeForm] = useState("");

  useEffect(() => {
    if (!user) return;

    if (user.role === "Professor") {
      axios.get(`${API_URL}/api/skills`)
        .then(res => {
          const misClasesData = res.data.filter(s =>
            String(s.teacher?._id || s.teacher) === String(user._id)
          );
          setMisClases(misClasesData);
        }).catch(console.log);

      axios.get(`${API_URL}/api/reviews/teacher/${user._id}`)
        .then(res => setResenas(res.data))
        .catch(console.log);

      axios.get(`${API_URL}/api/favorites/teacher/${user._id}`)
        .then(res => setTotalLikes(res.data.totalLikes))
        .catch(console.log);
    }

    if (user.role === "Alumno") {
      axios.get(`${API_URL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setClasesCompradas(res.data)).catch(console.log);
    }

    if (user.role === "Admin" || user.role === "Helper") {
      axios.get(`${API_URL}/api/requests/all`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setSolicitudesRol(res.data.filter(r => r.status === "Pending")))
        .catch(console.log);
    }
  }, [user]);

  const cambiarEstadoClase = (id, estado) => {
    axios.put(`${API_URL}/api/bookings/${id}/status`, { status: estado }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setSolicitudesClase(prev => prev.map(b => b._id === id ? { ...b, status: estado } : b));
    }).catch(console.log);
  };

  const gestionarSolicitudRol = (id, estado) => {
    axios.patch(`${API_URL}/api/requests/handle/${id}`, { status: estado }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setSolicitudesRol(prev => prev.filter(r => r._id !== id));
    }).catch(console.log);
  };

  const enviarSolicitudRol = (e) => {
    e.preventDefault();
    const datos = { requestedRole: rolPedido, justification: justificacion };
    if (rolPedido === "Professor") { datos.experience = experiencia; datos.subjects = temas; }

    axios.post(`${API_URL}/api/requests/submit`, datos, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setMensajeForm("¡Solicitud enviada! Un admin la revisará en 1-3 días.");
      setJustificacion(""); setExperiencia(""); setTemas("");
    }).catch(() => setMensajeForm("Error al enviar. Inténtalo de nuevo."));
  };

  const abrirEdicion = () => {
    setNuevaBio(user.bio || "");
    setNuevoAvatar(user.avatar || "");
    setEditando(true);
  };

  const subirFoto = async (e) => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    setSubiendoFoto(true);
    try {
      const res = await axios.post(`${API_URL}/api/upload/image`, uploadData);
      setNuevoAvatar(res.data.fileUrl);
    } catch (err) {
      console.log(err);
    } finally {
      setSubiendoFoto(false);
    }
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`${API_URL}/api/users/me`,
        { name: user.name, avatar: nuevoAvatar, bio: nuevaBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await authenticateUser();
      setEditando(false);
    } catch (err) {
      console.log(err);
    }
  };

  const irSeccion = (s) => {
    setSeccion(s);
    setMenuAbierto(false);

    if (s === "solicitudes") {
      console.log("cargando solicitudes...");
      if (user.role === "Professor") {
        axios.get(`${API_URL}/api/bookings/received`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setSolicitudesClase(res.data)).catch(console.log);
      }
      if (user.role === "Alumno") {
        axios.get(`${API_URL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => setClasesCompradas(res.data)).catch(console.log);
      }
    }
  };

  if (!user) return <div className="loading">Cargando...</div>;

  const reservasAceptadas = clasesCompradas.filter(b => b.status === "accepted" && new Date(b.date) > new Date());
  reservasAceptadas.sort((a, b) => new Date(a.date) - new Date(b.date));
  const proximaClase = reservasAceptadas[0];

  return (
    <div className="ProfilePage">

      {menuAbierto && <div className="sidebar-overlay" onClick={() => setMenuAbierto(false)} />}

      <aside className={`sidebar-menu ${menuAbierto ? "abierto" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-avatar">
            {user.avatar
              ? <img src={user.avatar} alt="avatar" />
              : user.name.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-userinfo">
            <p className="sidebar-nombre">{user.name}</p>
            <p className={`sidebar-rol rol-${user.role?.toLowerCase()}`}>{user.role}</p>
          </div>
          <button className="btn-cerrar-menu" onClick={() => setMenuAbierto(false)}>X</button>
        </div>

        <nav className="sidebar-nav">
          <button className={seccion === "perfil" ? "activo" : ""} onClick={() => irSeccion("perfil")}>
            Mi Perfil
          </button>

          {(user.role === "Professor" || user.role === "Alumno") && (
            <button className={seccion === "solicitudes" ? "activo" : ""} onClick={() => irSeccion("solicitudes")}>
              Solicitudes de Clase
            </button>
          )}

          <button className={seccion === "datos" ? "activo" : ""} onClick={() => irSeccion("datos")}>
            Datos Personales
          </button>

          {user.role === "Professor" && (
            <Link to="/skills/create" className="sidebar-link">+ Publicar Clase</Link>
          )}

          {(user.role === "Admin" || user.role === "Helper") && (
            <Link to="/admin/buzon" className="sidebar-link">Panel de Admin</Link>
          )}
        </nav>

        <button className="btn-logout-sidebar" onClick={logOutUser}>Cerrar Sesión</button>
      </aside>

      <div className="profile-topbar">
        <button className="btn-hamburger" onClick={() => setMenuAbierto(true)}>Menu</button>
        <h2 className="topbar-nombre">{user.name}</h2>
        <button className="btn-logout-top" onClick={logOutUser}>Cerrar Sesión</button>
      </div>

      {seccion === "perfil" && (
        <div className="profile-contenido">

          <div className="descripcion-card">
            <div className="desc-header">
              {/* AVATAR — en modo edición se puede cambiar */}
              <div className="desc-avatar">
                {editando ? (
                  <label className="avatar-edit-label" title="Cambiar foto">
                    {subiendoFoto
                      ? <span className="avatar-subiendo">...</span>
                      : (nuevoAvatar
                          ? <img src={nuevoAvatar} alt="avatar" />
                          : user.name.charAt(0).toUpperCase()
                        )
                    }
                    <div className="avatar-edit-overlay">Foto</div>
                    <input type="file" accept="image/*" onChange={subirFoto} className="avatar-file-input" />
                  </label>
                ) : (
                  user.avatar
                    ? <img src={user.avatar} alt="avatar" />
                    : user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="desc-header-info">
                <h2>{user.name}</h2>
                <span className={`rol-badge rol-${user.role?.toLowerCase()}`}>{user.role}</span>
              </div>

              {/* Botón lápiz para entrar/salir de edición */}
              {!editando && (
                <button className="btn-editar-desc" onClick={abrirEdicion} title="Editar descripción y foto">
                  Editar
                </button>
              )}
            </div>

            {/* BIO — modo lectura o modo edición */}
            {editando ? (
              <div className="desc-edicion">
                <textarea
                  className="bio-textarea"
                  value={nuevaBio}
                  onChange={e => setNuevaBio(e.target.value)}
                  placeholder="Escribe una descripción sobre ti..."
                  rows={4}
                />
                <div className="edicion-botones">
                  <button className="btn-guardar-bio" onClick={guardarEdicion}>
                    Guardar cambios
                  </button>
                  <button className="btn-cancelar-bio" onClick={() => setEditando(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="desc-bio">
                {user.bio
                  ? <p>{user.bio}</p>
                  : <p className="bio-vacia">Pulsa <strong>Editar</strong> para añadir una descripción.</p>}
              </div>
            )}

            {/* Estadísticas del Profesor */}
            {user.role === "Professor" && (
              <>
                <div className="desc-stats">
                  <div className="stat"><strong>{misClases.length}</strong><span>Clases</span></div>
                  <div className="stat"><strong>{resenas.length}</strong><span>Reseñas</span></div>
                  <div className="stat"><strong>{totalLikes}</strong><span>Likes</span></div>
                </div>

                {/* Lista de reseñas bajo la descripción */}
                {resenas.length > 0 && (
                  <div className="resenas-lista">
                    <h4>Reseñas de alumnos</h4>
                    {resenas.map(r => (
                      <div key={r._id} className="resena-card">
                        <div className="resena-header">
                          <div className="resena-avatar">
                            {r.author?.avatar
                              ? <img src={r.author.avatar} alt={r.author.name} />
                              : r.author?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{r.author?.name}</strong>
                            <span className="resena-clase"> sobre {r.skill?.title}</span>
                          </div>
                          <div className="resena-estrellas">
                            {r.rating}/5
                          </div>
                        </div>
                        <p className="resena-comentario">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Estadísticas del Alumno */}
            {user.role === "Alumno" && (
              <div className="desc-stats">
                <div className="stat">
                  <strong>{clasesCompradas.length}</strong>
                  <span>Clases Compradas</span>
                </div>
                {proximaClase && (
                  <div className="proxima-clase">
                    Próxima clase: <strong>{new Date(proximaClase.date).toLocaleDateString("es-ES")}</strong>
                  </div>
                )}
              </div>
            )}

            {user.role === "User" && (
              <div className="user-sin-rol">
                <p>Eres un <strong>usuario básico</strong>. Solicita un rol para acceder a todas las funciones.</p>
                <form onSubmit={enviarSolicitudRol} className="form-rol">
                  <div className="form-campo">
                    <label>¿Qué rol quieres?</label>
                    <select value={rolPedido} onChange={e => setRolPedido(e.target.value)}>
                      <option value="Alumno">Alumno</option>
                      <option value="Professor">Profesor</option>
                    </select>
                  </div>
                  <div className="form-campo">
                    <label>¿Por qué quieres este rol?</label>
                    <textarea
                      value={justificacion}
                      onChange={e => setJustificacion(e.target.value)}
                      placeholder="Cuéntanos un poco sobre ti..."
                      required
                    />
                  </div>
                  {rolPedido === "Professor" && (
                    <>
                      <div className="form-campo">
                        <label>Experiencia docente</label>
                        <textarea
                          value={experiencia}
                          onChange={e => setExperiencia(e.target.value)}
                          placeholder="¿Cuántos años llevas enseñando?"
                          required
                        />
                      </div>
                      <div className="form-campo">
                        <label>Temas que puedes enseñar</label>
                        <input
                          value={temas}
                          onChange={e => setTemas(e.target.value)}
                          placeholder="Ej: Matemáticas, Inglés, Programación..."
                          required
                        />
                      </div>
                    </>
                  )}
                  <button type="submit" className="btn-enviar-sol">Enviar Solicitud</button>
                  {mensajeForm && <p className="msg-envio">{mensajeForm}</p>}
                </form>
              </div>
            )}

            {(user.role === "Admin" || user.role === "Helper") && (
              <div className="admin-solicitudes">
                <h3>Solicitudes de Rol Pendientes ({solicitudesRol.length})</h3>
                {solicitudesRol.length === 0 ? (
                  <p className="bio-vacia">No hay solicitudes pendientes.</p>
                ) : (
                  solicitudesRol.map(req => (
                    <div key={req._id} className="solicitud-card">
                      <div className="solicitud-info">
                        <strong>{req.user?.name}</strong> quiere ser <strong>{req.requestedRole}</strong>
                        <p>{req.justification}</p>
                        {req.requestedRole === "Professor" && (
                          <p><em>Exp: {req.experience} | Temas: {req.subjects}</em></p>
                        )}
                      </div>
                      <div className="solicitud-btns">
                        <button className="btn-accept" onClick={() => gestionarSolicitudRol(req._id, "Approved")}>
                          Aceptar
                        </button>
                        <button className="btn-reject" onClick={() => gestionarSolicitudRol(req._id, "Rejected")}>
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {user.role === "Professor" && misClases.length > 0 && (
            <div className="profile-section">
              <h2>Mis Clases Publicadas</h2>
              <div className="clases-grid">
                {misClases.map(skill => (
                  <div key={skill._id} className="mini-skill-card">
                    <img src={skill.image} alt={skill.title} />
                    <div className="mini-card-info">
                      <h4>{skill.title}</h4>
                      <p className="price-text">{skill.price}€/h</p>
                      <Link to={`/skills/${skill._id}`} className="view-link">Ver detalle</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {seccion === "solicitudes" && (
        <div className="profile-contenido">
          <h2 className="seccion-titulo">
            {user.role === "Professor" ? "Solicitudes de Clase Recibidas" : "Mis Reservas de Clase"}
          </h2>

          {user.role === "Professor" && (
            solicitudesClase.length === 0 ? (
              <div className="empty-state"><p>No tienes solicitudes pendientes.</p></div>
            ) : (
              solicitudesClase.map(b => (
                <div key={b._id} className="booking-received-card">
                  <div className="booking-info">
                    <strong>{b.student?.name}</strong> quiere aprender <strong>{b.skill?.title}</strong>
                    <p>Fecha: {new Date(b.date).toLocaleString()}</p>
                    {b.message && <p className="booking-msg">"{b.message}"</p>}
                  </div>
                  <div className="booking-btns">
                    {b.status === "pending" ? (
                      <>
                        <button className="btn-accept" onClick={() => cambiarEstadoClase(b._id, "accepted")}>Aceptar</button>
                        <button className="btn-reject" onClick={() => cambiarEstadoClase(b._id, "rejected")}>Rechazar</button>
                      </>
                    ) : (
                      <span className={`status-badge ${b.status}`}>{b.status.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {user.role === "Alumno" && (
            clasesCompradas.length === 0 ? (
              <div className="empty-state">
                <p>No has reservado ninguna clase todavía.</p>
                <Link to="/skills"><button>Busca tu clase</button></Link>
              </div>
            ) : (
              clasesCompradas.map(b => (
                <div key={b._id} className="booking-received-card">
                  <div className="booking-info">
                    <strong>{b.skill?.title}</strong> con <strong>{b.teacher?.name}</strong>
                    <p>Fecha: {new Date(b.date).toLocaleString()}</p>
                  </div>
                  <span className={`status-badge ${b.status}`}>{b.status.toUpperCase()}</span>
                </div>
              ))
            )
          )}
        </div>
      )}

      {seccion === "datos" && (
        <div className="profile-contenido">
          <h2 className="seccion-titulo">Datos Personales</h2>
          <div className="datos-card">
            <div className="dato-fila">
              <span className="dato-label">Gmail</span>
              <span className="dato-valor">{user.email}</span>
            </div>
            <div className="dato-fila">
              <span className="dato-label">Rol de la cuenta</span>
              <span className={`rol-badge rol-${user.role?.toLowerCase()}`}>{user.role}</span>
            </div>
            <div className="dato-fila">
              <span className="dato-label">Cuenta creada el</span>
              <span className="dato-valor">
                {new Date(user.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            </div>
            <div className="dato-fila">
              <span className="dato-label">Contraseña</span>
              <div className="pass-row">
                <input
                  type="password"
                  value="••••••••"
                  disabled
                  className="pass-input-disabled"
                />
                <button disabled className="btn-cambiar-pass">Cambiar contraseña</button>
              </div>
              <small className="texto-desarrollo">Función en desarrollo</small>
            </div>
            <div className="dato-fila dato-fila-last">
              <Link to="/profile/edit">
                <button className="btn-edit-profile">Editar Perfil</button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilePage;
