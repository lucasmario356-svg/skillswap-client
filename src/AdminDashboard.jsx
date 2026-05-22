import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./context/auth.context";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem("authToken");

  const cargarSolicitudes = () => {
    setCargando(true);
    axios.get(`${API_URL}/api/requests/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRequests(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.log(err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleStatus = (id, newStatus) => {
    axios.patch(`${API_URL}/api/requests/handle/${id}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => cargarSolicitudes())
      .catch(console.log);
  };

  if (!user || (user.role !== "Admin" && user.role !== "Helper")) {
    return (
      <div className="buzon-no-acceso">
        <h2>Acceso denegado</h2>
        <p>Solo Admin y Helper pueden ver esta página.</p>
      </div>
    );
  }

  const pendientes  = requests.filter(r => r.status === "Pending");
  const gestionadas = requests.filter(r => r.status !== "Pending");

  return (
    <div className="AdminBuzon">

      {/* CABECERA */}
      <div className="buzon-header">
        <div>
          <h1>Buzón de Solicitudes</h1>
          <p className="buzon-subtitle">Gestiona las solicitudes de rol de los usuarios</p>
        </div>
        <div className="buzon-acciones">
          {pendientes.length > 0 && (
            <span className="badge-pendientes">{pendientes.length} pendiente{pendientes.length > 1 ? "s" : ""}</span>
          )}
          <button className="btn-refresh" onClick={cargarSolicitudes}>
            ↻ Actualizar
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="buzon-loading">Cargando solicitudes...</div>
      ) : (
        <>
          {/* SOLICITUDES PENDIENTES */}
          <section className="buzon-seccion">
            <h2 className="buzon-seccion-titulo pendiente-titulo">
              Pendientes
              <span className="buzon-count">{pendientes.length}</span>
            </h2>

            {pendientes.length === 0 ? (
              <div className="buzon-vacio">
                <p>No hay solicitudes pendientes.</p>
              </div>
            ) : (
              pendientes.map(req => (
                <div key={req._id} className="solicitud-card pendiente">
                  <div className="solicitud-usuario">
                    <div className="sol-avatar">
                      {req.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{req.user?.name}</strong>
                      <span className="sol-email">{req.user?.email}</span>
                    </div>
                    <span className="sol-rol-pedido">→ {req.requestedRole}</span>
                  </div>

                  <div className="solicitud-detalle">
                    <div className="detalle-item">
                      <span className="detalle-label">Justificación</span>
                      <p>{req.justification}</p>
                    </div>
                    {req.requestedRole === "Professor" && (
                      <>
                        <div className="detalle-item">
                          <span className="detalle-label">Experiencia docente</span>
                          <p>{req.experience || "—"}</p>
                        </div>
                        <div className="detalle-item">
                          <span className="detalle-label">Temas que enseña</span>
                          <p>{req.subjects || "—"}</p>
                        </div>
                      </>
                    )}
                    <div className="detalle-item">
                      <span className="detalle-label">Fecha de solicitud</span>
                      <p>{new Date(req.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>

                  <div className="solicitud-botones">
                    <button
                      className="btn-aceptar"
                      onClick={() => handleStatus(req._id, "Approved")}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn-rechazar"
                      onClick={() => handleStatus(req._id, "Rejected")}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* SOLICITUDES GESTIONADAS */}
          {gestionadas.length > 0 && (
            <section className="buzon-seccion">
              <h2 className="buzon-seccion-titulo">
                Historial
                <span className="buzon-count">{gestionadas.length}</span>
              </h2>

              {gestionadas.map(req => (
                <div key={req._id} className={`solicitud-card gestionada ${req.status === "Approved" ? "aprobada" : "rechazada"}`}>
                  <div className="solicitud-usuario">
                    <div className="sol-avatar">
                      {req.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{req.user?.name}</strong>
                      <span className="sol-email">{req.user?.email}</span>
                    </div>
                    <span className="sol-rol-pedido">→ {req.requestedRole}</span>
                    <span className={`estado-badge ${req.status === "Approved" ? "aprobado" : "rechazado"}`}>
                      {req.status === "Approved" ? "Aprobado" : "Rechazado"}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
