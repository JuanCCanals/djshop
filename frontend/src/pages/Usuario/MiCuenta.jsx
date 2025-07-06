import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Slider from '../../components/Slider/Slider';
import './MiCuenta.css';

const MiCuenta = () => {
  const [user, setUser] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('perfil');

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Cargar datos del usuario
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Obtener información del usuario actualizada
        const userResponse = await axios.get(`http://localhost:5000/api/usuarios/${parsedUser.id_usuario}`);
        setUser(userResponse.data);
        
        // Obtener suscripciones del usuario
        const suscripcionResponse = await axios.get(`http://localhost:5000/api/suscripciones/activa/${parsedUser.id_usuario}`);
        if (suscripcionResponse.data) {
          setSuscripcion(suscripcionResponse.data);
        }
        
        // Obtener historial de compras
        const comprasResponse = await axios.get(`http://localhost:5000/api/compras/usuario/${parsedUser.id_usuario}`);
        setCompras(comprasResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        setError("No se pudieron cargar los datos de tu cuenta");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatCurrency = (amount) => {
    return `S/ ${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <section className='mi-cuenta section-p-top bg-md-black'>
        <div className='container'>
          <Header />
          <Slider titulo="Mi Cuenta" />
          <div className="loading-container">Cargando información de tu cuenta...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='mi-cuenta section-p-top bg-md-black'>
        <div className='container'>
          <Header />
          <Slider titulo="Mi Cuenta" />
          <div className="error-container">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className='mi-cuenta section-p-top bg-md-black'>
      <div className='container'>
        <Header />
        <Slider titulo="Mi Cuenta" />
        
        <div className="user-dashboard">
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-placeholder">{user?.nombre?.charAt(0) || 'U'}</span>
            </div>
            <div className="user-details">
              <h2>{user?.nombre || 'Usuario'}</h2>
              <p>{user?.email || 'correo@ejemplo.com'}</p>
              <div className="user-credits">
                <span className="credits-label">Créditos disponibles:</span>
                <span className="credits-value">{user?.creditos_disponibles || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-tabs">
            <button 
              className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              Mi Perfil
            </button>
            <button 
              className={`tab-btn ${activeTab === 'suscripcion' ? 'active' : ''}`}
              onClick={() => setActiveTab('suscripcion')}
            >
              Mi Suscripción
            </button>
            <button 
              className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`}
              onClick={() => setActiveTab('compras')}
            >
              Mis Compras
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'perfil' && (
              <div className="perfil-tab">
                <div className="perfil-card">
                  <h3>Información Personal</h3>
                  <div className="perfil-details">
                    <div className="detail-item">
                      <span className="detail-label">Nombre:</span>
                      <span className="detail-value">{user?.nombre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user?.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{user?.telefono || 'No especificado'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha de registro:</span>
                      <span className="detail-value">{formatDate(user?.fecha_registro)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rol:</span>
                      <span className="detail-value">{user?.rol_nombre || 'Usuario'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Créditos disponibles:</span>
                      <span className="detail-value credits-highlight">{user?.creditos_disponibles || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suscripcion' && (
              <div className="suscripcion-tab">
                {suscripcion ? (
                  <div className={`suscripcion-card ${suscripcion.activa ? 'activa' : 'inactiva'}`}>
                    <div className="suscripcion-header">
                      <h3>Plan {suscripcion.plan_nombre || 'Suscripción'}</h3>
                      <span className={`suscripcion-status ${suscripcion.activa ? 'activa' : 'inactiva'}`}>
                        {suscripcion.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    
                    <div className="suscripcion-details">
                      <div className="detail-item">
                        <span className="detail-label">Fecha de inicio:</span>
                        <span className="detail-value">{formatDate(suscripcion.fecha_inicio)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Fecha de vencimiento:</span>
                        <span className="detail-value">{formatDate(suscripcion.fecha_fin)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Monto pagado:</span>
                        <span className="detail-value">{formatCurrency(suscripcion.monto_pagado)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Método de pago:</span>
                        <span className="detail-value">{suscripcion.metodo_pago}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-suscripcion">
                    <p>No tienes una suscripción activa.</p>
                    <a href="/planes" className="btn-get-plan">Ver planes disponibles</a>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'compras' && (
              <div className="compras-tab">
                {compras.length > 0 ? (
                  <div className="compras-list">
                    <div className="compras-header">
                      <span className="compra-col">Pista</span>
                      <span className="compra-col">Fecha</span>
                      <span className="compra-col">Precio</span>
                      <span className="compra-col">Créditos</span>
                      <span className="compra-col">Acción</span>
                    </div>
                    
                    {compras.map((compra) => (
                      <div className="compra-item" key={compra.id}>
                        <span className="compra-col">{compra.pista_titulo || 'Pista'}</span>
                        <span className="compra-col">{formatDate(compra.fecha_compra)}</span>
                        <span className="compra-col">{formatCurrency(compra.precio_pagado)}</span>
                        <span className="compra-col">{compra.creditos_usados}</span>
                        <span className="compra-col">
                          <button 
                            className="download-again-btn"
                            onClick={async () => {
                              try {
                                const response = await axios.get(`http://localhost:5000/generate-video-token/${compra.archivo_url}`);
                                if (response.data.token) {
                                  window.location.href = `http://localhost:5000/download/${response.data.token}`;
                                }
                              } catch (error) {
                                console.error("Error al descargar:", error);
                                alert("Error al procesar la descarga. Inténtalo de nuevo.");
                              }
                            }}
                          >
                            Descargar
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-compras">
                    <p>No has realizado ninguna compra todavía.</p>
                    <a href="/audios" className="btn-explore">Explorar pistas</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiCuenta;
