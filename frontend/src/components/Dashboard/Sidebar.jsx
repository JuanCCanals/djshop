import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "./Sidebar.css"; // Asegúrate de crear este archivo CSS

const Sidebar = ({ isOpen, toggleSidebar, handleLogout }) => {
  // const [isOpen, setIsOpen] = useState(true);

  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen);
  // };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <FaBars className="menu-icon" onClick={toggleSidebar} />
        <h3 className={`sidebar-title ${isOpen ? "show" : "hide"}`}>Admin</h3>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard/productos">
            <MdDashboard /> <span className={isOpen ? "show" : "hide"}>Productos</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard/generos">
            <FaUser /> <span className={isOpen ? "show" : "hide"}>Géneros</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaHome /> <span className={isOpen ? "show" : "hide"}>Inicio</span>
          </Link>
        </li>
        {/* 🔴 BOTÓN DE SALIR */}
        <li onClick={handleLogout} className="logout">
          <FaSignOutAlt /> <span className={isOpen ? "show" : "hide"}>Salir</span>
        </li>
      </ul>
    </div>  );
};

export default Sidebar;
