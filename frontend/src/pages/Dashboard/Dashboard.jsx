import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('planes');
  const [planes, setPlanes] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para formularios
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    tokens_asignados: '',
    usuario_id: '',
    plan_id: '',
    tokens: '',
    activar_suscripcion: false
  });

  useEffect(() => {
    // Verificar si hay un usuario administrador logueado
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.rol_id !== 1) {
      // No es administrador, redirigir
      window.location.href = "/";
      return;
    }

    setUser(parsedUser);

    // Cargar datos iniciales
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener planes, suscripciones y usuarios en paralelo
      const [planesResponse, suscripcionesResponse, usuariosResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/planes'),
        axios.get('http://localhost:5000/api/suscripciones'),
        axios.get('http://localhost:5000/auth/usuarios')
      ]);
      
      setPlanes(planesResponse.data);
      setSuscripciones(suscripcionesResponse.data);
      setUsuarios(usuariosResponse.data.Result || []);
      
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("No se pudieron cargar los datos del dashboard");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedPlan) {
        // Actualizar plan existente
        await axios.put(`http://localhost:5000/api/planes/${selectedPlan.id_plan}`, {
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          tokens_asignados: parseInt(formData.tokens_asignados)
        });
      } else {
        // Crear nuevo plan
        await axios.post('http://localhost:5000/api/planes', {
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          tokens_asignados: parseInt(formData.tokens_asignados)
        });
      }
      
      // Recargar datos y resetear formulario
      fetchData();
      resetPlanForm();
    } catch (error) {
      console.error("Error al guardar plan:", error);
      alert("Error al guardar el plan. Inténtalo de nuevo.");
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/planes/asignar-tokens', {
        usuario_id: parseInt(formData.usuario_id),
        plan_id: formData.activar_suscripcion ? parseInt(formData.plan_id) : undefined,
        tokens: parseInt(formData.tokens),
        admin_id: user.id_usuario,
        activar_suscripcion: formData.activar_suscripcion
      });
      
      // Recargar datos y resetear formulario
      fetchData();
      resetTokenForm();
      alert("Tokens asignados correctamente");
    } catch (error) {
      console.error("Error al asignar tokens:", error);
      alert("Error al asignar tokens. Inténtalo de nuevo.");
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      ...formData,
      nombre: plan.nombre,
      precio: plan.precio,
      tokens_asignados: plan.tokens_asignados
    });
    setShowPlanForm(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/planes/${planId}`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar plan:", error);
      alert("Error al eliminar el plan. Inténtalo de nuevo.");
    }
  };

  const resetPlanForm = () => {
    setFormData({
      ...formData,
      nombre: '',
      precio: '',
      tokens_asignados: ''
    });
    setSelectedPlan(null);
    setShowPlanForm(false);
  };

  const resetTokenForm = () => {
    setFormData({
      ...formData,
      usuario_id: '',
      plan_id: '',
      tokens: '',
      activar_suscripcion: false
    });
    setSelectedUsuario(null);
    setShowTokenForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">Cargando dashboard administrativo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="admin-info">
          <span>Administrador: {user?.nombre}</span>
        </div>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'planes' ? 'active' : ''}`}
          onClick={() => setActiveTab('planes')}
        >
          Planes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'suscripciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('suscripciones')}
        >
          Suscripciones
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          Asignar Tokens
        </button>
      </div>
      
      <div className="dashboard-content">
        {/* Pestaña de Planes */}
        {activeTab === 'planes' && (
          <div className="planes-tab">
            <div className="section-header">
              <h2>Gestión de Planes</h2>
              <button 
                className="add-btn"
                onClick={() => setShowPlanForm(true)}
              >
                Nuevo Plan
              </button>
            </div>
            
            {showPlanForm && (
              <div className="form-container">
                <h3>{selectedPlan ? 'Editar Plan' : 'Nuevo Plan'}</h3>
                <form onSubmit={handlePlanSubmit}>
                  <div className="form-group">
                    <label>Nombre del Plan</label>
                    <input 
                      type="text" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Precio ($)</label>
                    <input 
                      type="number" 
                      name="precio" 
                      value={formData.precio} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.01" 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Tokens Asignados</label>
                    <input 
                      type="number" 
                      name="tokens_asignados" 
                      value={formData.tokens_asignados} 
                      onChange={handleInputChange} 
                      min="1" 
                      required 
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      {selectedPlan ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={resetPlanForm}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Tokens</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.length > 0 ? (
                    planes.map(plan => (
                      <tr key={plan.id_plan}>
                        <td>{plan.id_plan}</td>
                        <td>{plan.nombre}</td>
                        <td>${plan.precio}</td>
                        <td>{plan.tokens_asignados}</td>
                        <td>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditPlan(plan)}
                          >
                            Editar
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeletePlan(plan.id_plan)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">No hay planes disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pestaña de Suscripciones */}
        {activeTab === 'suscripciones' && (
          <div className="suscripciones-tab">
            <div className="section-header">
              <h2>Suscripciones Activas</h2>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Plan</th>
                    <th>Estado</th>
                    <th>Tokens Restantes</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {suscripciones.length > 0 ? (
                    suscripciones.map(suscripcion => {
                      const usuario = usuarios.find(u => u.id_usuario === suscripcion.usuario_id);
                      const plan = planes.find(p => p.id_plan === suscripcion.plan_id);
                      
                      return (
                        <tr key={suscripcion.id_suscripcion} className={suscripcion.estado === 'pendiente' ? 'pending-row' : ''}>
                          <td>{suscripcion.id_suscripcion}</td>
                          <td>{usuario ? usuario.nombre : `Usuario #${suscripcion.usuario_id}`}</td>
                          <td>{plan ? plan.nombre : `Plan #${suscripcion.plan_id}`}</td>
                          <td>
                            <span className={`status-badge ${suscripcion.estado}`}>
                              {suscripcion.estado}
                            </span>
                          </td>
                          <td>{suscripcion.tokens_restantes}</td>
                          <td>{formatDate(suscripcion.fecha_inicio)}</td>
                          <td>{formatDate(suscripcion.fecha_fin)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">No hay suscripciones disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pestaña de Asignación de Tokens */}
        {activeTab === 'tokens' && (
          <div className="tokens-tab">
            <div className="section-header">
              <h2>Asignación de Tokens</h2>
              <button 
                className="add-btn"
                onClick={() => setShowTokenForm(true)}
              >
                Asignar Tokens
              </button>
            </div>
            
            {showTokenForm && (
              <div className="form-container">
                <h3>Asignar Tokens a Usuario</h3>
                <form onSubmit={handleTokenSubmit}>
                  <div className="form-group">
                    <label>Usuario</label>
                    <select 
                      name="usuario_id" 
                      value={formData.usuario_id} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar Usuario</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id_usuario} value={usuario.id_usuario}>
                          {usuario.nombre} ({usuario.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <input 
                      type="checkbox" 
                      id="activar_suscripcion" 
                      name="activar_suscripcion" 
                      checked={formData.activar_suscripcion} 
                      onChange={handleInputChange} 
                    />
                    <label htmlFor="activar_suscripcion">Activar suscripción pendiente / Crear nueva suscripción</label>
                  </div>
                  
                  {formData.activar_suscripcion && (
                    <div className="form-group">
                      <label>Plan</label>
                      <select 
                        name="plan_id" 
                        value={formData.plan_id} 
                        onChange={handleInputChange}
                        required={formData.activar_suscripcion}
                      >
                        <option value="">Seleccionar Plan</option>
                        {planes.map(plan => (
                          <option key={plan.id_plan} value={plan.id_plan}>
                            {plan.nombre} (${plan.precio} - {plan.tokens_asignados} tokens)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Cantidad de Tokens</label>
                    <input 
                      type="number" 
                      name="tokens" 
                      value={formData.tokens} 
                      onChange={handleInputChange} 
                      min="1" 
                      required 
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Asignar Tokens
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={resetTokenForm}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="usuarios-list">
              <h3>Usuarios Registrados</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Suscripción</th>
                      <th>Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map(usuario => {
                        const suscripcion = suscripciones.find(
                          s => s.usuario_id === usuario.id_usuario && s.estado === 'activa'
                        );
                        
                        return (
                          <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol_id === 1 ? 'Administrador' : 'Usuario'}</td>
                            <td>
                              {suscripcion ? (
                                <span className="status-badge activa">Activa</span>
                              ) : (
                                <span className="status-badge inactiva">Sin suscripción</span>
                              )}
                            </td>
                            <td>{suscripcion ? suscripcion.tokens_restantes : 0}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No hay usuarios registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="dashboard-footer">
        <a href="/" className="back-link">Volver al sitio</a>
      </div>
    </div>
  );
};

export default Dashboard;
