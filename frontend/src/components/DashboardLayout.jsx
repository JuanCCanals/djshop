import React, {useState} from "react";
import Sidebar from "./Dashboard/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
      localStorage.removeItem("token"); // Elimina el token de autenticación
      navigate("/"); // Redirige al inicio o al login
  };

  return (
      <div className="dashboard-container">
          <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              handleLogout={handleLogout} // 🔹 Pasamos la función como prop
          />
          <div className={`dashboard-content ${isSidebarOpen ? "open" : "closed"}`}>
              <Outlet />
          </div>
      </div>
  );
};

export default DashboardLayout;
