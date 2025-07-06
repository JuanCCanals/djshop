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
  const [activeTab, setActiveTab] = useState('suscripcion');

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
        
        // Obtener información de suscripción
        const suscripcionResponse = await axios.get(`http://localhost:5000/api/planes/verificar/${parsedUser.id_usuario}`);
        
        if (suscripcionResponse.data.tiene_suscripcion) {
          setSuscripcion(suscripcionResponse.data.suscripcion);
        } else if (suscripcionResponse.data.suscripcion_pendiente) {
          setSuscripcion({
            ...suscripcionResponse.data.suscripcion,
            pendiente: true
          });
        }
        
        // Obtener historial de compras/descargas
        const comprasResponse = await axios.get(`http://localhost:5000/api/descargas?usuario_id=${parsedUser.id_usuario}`);
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
            </div>
          </div>
          
          <div className="dashboard-tabs">
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
            {activeTab === 'suscripcion' && (
              <div className="suscripcion-tab">
                {suscripcion ? (
                  <div className={`suscripcion-card ${suscripcion.pendiente ? 'pendiente' : 'activa'}`}>
                    <div className="suscripcion-header">
                      <h3>{suscripcion.plan_nombre || 'Plan'}</h3>
                      <span className={`suscripcion-status ${suscripcion.pendiente ? 'pendiente' : 'activa'}`}>
                        {suscripcion.pendiente ? 'Pendiente de aprobación' : 'Activa'}
                      </span>
                    </div>
                    
                    <div className="suscripcion-details">
                      {!suscripcion.pendiente && (
                        <>
                          <div className="detail-item">
                            <span className="detail-label">Tokens restantes:</span>
                            <span className="detail-value">{suscripcion.tokens_restantes}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Fecha de inicio:</span>
                            <span className="detail-value">{formatDate(suscripcion.fecha_inicio)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Fecha de vencimiento:</span>
                            <span className="detail-value">{formatDate(suscripcion.fecha_fin)}</span>
                          </div>
                        </>
                      )}
                      
                      {suscripcion.pendiente && (
                        <div className="pending-message">
                          <p>Tu solicitud de suscripción está pendiente de aprobación. Una vez que el administrador verifique tu pago, tu suscripción será activada.</p>
                          <div className="bank-info-reminder">
                            <h4>Recuerda realizar la transferencia a:</h4>
                            <p><strong>Banco:</strong> Banco Nacional</p>
                            <p><strong>Titular:</strong> DJShop Music</p>
                            <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                          </div>
                        </div>
                      )}
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
                      <span className="compra-col">Tokens</span>
                      <span className="compra-col">Acción</span>
                    </div>
                    
                    {compras.map((compra) => (
                      <div className="compra-item" key={compra.id_descarga}>
                        <span className="compra-col">{compra.producto_nombre || 'Pista'}</span>
                        <span className="compra-col">{formatDate(compra.fecha_descarga)}</span>
                        <span className="compra-col">{compra.tokens_gastados}</span>
                        <span className="compra-col">
                          <button 
                            className="download-again-btn"
                            onClick={async () => {
                              try {
                                const response = await axios.get(`http://localhost:5000/generate-video-token/${compra.producto_pista}`);
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
