import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import RightSidebar from '../../components/RightSidebar';
import "./Navbar.css";

const MyNavbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [user, setUser] = useState(null);
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
                <div className="navbar-menu">
                    <Link to="/">Inicio</Link>
                    <Link to="/videos">Videos</Link>
                    <Link to="/audios">Audios</Link>
                    <Link to="/planes">Planes</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>

                {/* {isAuthenticated && user ? (
                    <div className="user-greeting">
                        Bienvenido, <strong>{user.nombre}</strong>
                    </div>
                ) : null} */}

                {/* Botón de sesión */}
                {isAuthenticated ? (
                    <>
                        {user?.rol_id === 1 ? (
                            <Button 
                                variant="outline-light" 
                                className="ms-auto btn-login"
                                onClick={() => navigate("/dashboard")}  // ✅ Redirige al Dashboard
                            >
                                Panel Admin
                            </Button>
                        ) : (
                            <Button 
                                variant="outline-light" 
                                className="ms-auto btn-login"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </Button>
                        )}
                    </>
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
        </Navbar>

        {/* Sidebar para login */}
        <RightSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
        </>
    );
};

export default MyNavbar;
