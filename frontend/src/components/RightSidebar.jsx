import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../pages/Login';
import './RightSidebar.css';

const RightSidebar = ({ show, onClose, isAuthenticated, handleLogout }) => {
    return (
        
        <div className={`right-sidebar ${show ? 'show' : ''}`}>
            <button className="close-btn" onClick={onClose}>X</button>
            {isAuthenticated ? (
                <>
                    <h3>Panel de Administración</h3>
                    <nav>
                        <ul>
                            <li><Link to="/admin/productos">Productos</Link></li>
                            <li><Link to="/admin/generos">Géneros</Link></li>
                            <li><Link to="/admin/usuarios">Usuarios</Link></li>
                        </ul>
                    </nav>
                    <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                </>
            ) : (
                <>
                <div className={`right-sidebar-overlay ${show ? "show" : ""}`} onClick={onClose}></div>
                <div className={`right-sidebar ${show ? "show" : ""}`}>
                    <button className="close-btn" onClick={onClose}>✖</button>
                    {/* Aquí iría el formulario de login */}
                    <Login />
                </div>
            </>
            )}
        </div>
    );
};

export default RightSidebar;
