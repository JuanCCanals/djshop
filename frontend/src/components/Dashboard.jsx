import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Sidebar from "./Dashboard/Sidebar";
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("http://localhost:3000/verify", { credentials: "include" });
        const data = await res.json();
        if (data.Status) {
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        navigate("/login");
      }
    };

    verificarSesion();
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error al cerrar sesión:", error));
  };

  if (!user) {
    return <h2 className="text-center mt-5">Verificando sesión...</h2>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar handleLogout={handleLogout} />
      <Container className="content">
        <h2>Bienvenido {user.correoUsu}</h2>
        <p>Rol: {user.admin === "admin" ? "Administrador" : "Lector"}</p>
      </Container>
    </div>
  );
};

export default Dashboard;
