import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import RightSidebar from '../../components/RightSidebar';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import "./Navbar.css";

const MyNavbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user"); // Eliminar usuario
        localStorage.removeItem('token'); // Eliminar token
        setIsAuthenticated(false);
        setShowSidebar(false);
        setUser(null);
        navigate("/"); // Redirigir a inicio
        window.location.reload(); // Refrescar cambios
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    return (
        <>
            {isAuthenticated && user ? (
                <div className="user-greeting-container">
                    <div className="user-greeting">
                        Bienvenido, {user.nombre}
                    </div>
                </div>
            ) : null}
            
            <Navbar className="navbar-custom">
                <div className="container-fluid">
                    <div className="navbar-brand">DJShop.</div>
                    
                    {/* Botón hamburguesa para móviles */}
                    <div className="menu-toggle" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                    
                    {/* Menú de navegación */}
                    <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
                        <Link to="/videos" onClick={() => setMenuOpen(false)}>Videos</Link>
                        <Link to="/audios" onClick={() => setMenuOpen(false)}>Audios</Link>
                        <Link to="/planes" onClick={() => setMenuOpen(false)}>Planes</Link>
                        <Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
                    </div>
                    
                    {/* Botón de sesión */}
                    <div className="login-button-container">
                        {isAuthenticated ? (
                            <div className="user-menu-container">
                                <Button 
                                    variant="outline-light" 
                                    className="ms-auto btn-user"
                                    onClick={toggleUserMenu}
                                >
                                    <FaUser /> {user.nombre.split(' ')[0]}
                                </Button>
                                
                                {userMenuOpen && (
                                    <div className="user-dropdown-menu">
                                        {user?.rol_id === 1 ? (
                                            <Link 
                                                to="/dashboard" 
                                                className="dropdown-item"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                Panel Admin
                                            </Link>
                                        ) : null}
                                        
                                        <Link 
                                            to="/mi-cuenta" 
                                            className="dropdown-item"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Mi Cuenta
                                        </Link>
                                        
                                        <button 
                                            className="dropdown-item logout-btn"
                                            onClick={handleLogout}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button 
                                variant="outline-light" 
                                className="ms-auto btn-login"
                                onClick={() => setShowSidebar(true)}
                            >
                                Iniciar Sesión
                            </Button>
                        )}
                    </div>
                </div>
            </Navbar>
            
            {/* Sidebar para login */}
            <RightSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
        </>
    );
};

export default MyNavbar;
