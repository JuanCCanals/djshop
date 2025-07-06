import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsArrowRightCircle } from "react-icons/bs";
import "../../pages/Planes.css";

const SinglePlan = ({ plan, onSuscribir }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSuscribir = () => {
    if (!user) {
      alert("Debes iniciar sesión para suscribirte a un plan");
      // Redirigir a login
      window.location.href = "/login";
      return;
    }
    
    // Llamar a la función de suscripción pasada como prop
    onSuscribir(plan);
  };

  return (
    <div className='item bg-dark translate-effect'>
      <div className='plan-header'>
        <h4 className='item-title fs-25'>{plan.nombre}</h4>
        <div className='plan-price'>
          <span className='price-value'>${plan.precio}</span>
          <span className='price-period'>/mes</span>
        </div>
      </div>
      
      <div className='plan-features'>
        <p className='fs-19 text'>
          <span className='feature-highlight'>{plan.tokens_asignados} tokens</span> para descargar pistas
        </p>
        <p className='fs-19 text'>Acceso a todas las pistas</p>
        <p className='fs-19 text'>Soporte prioritario</p>
      </div>
      
      <button 
        onClick={handleSuscribir} 
        className='suscribir-btn'
      >
        Suscribirse <BsArrowRightCircle size={20} />
      </button>
    </div>
  );
};

export default SinglePlan;
