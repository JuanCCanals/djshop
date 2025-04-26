import React, { useState, useEffect } from "react";
import "./Services.css";
import VideoPlayer from "./VideoPlayer"; // ✅ Importa el componente

const Services = () => {
  const baseURL = "http://localhost:5000/stream-video/";
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/productos"); // Endpoint del backend
        const data = await response.json();
        setProductos(data.Result.slice(0, 3)); // Mostrar solo 3 productos
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleDownload = async (filename) => {
    const user = localStorage.getItem("user"); // Verifica si hay usuario logueado
    if (!user) {
        alert("Debes iniciar sesión para descargar esta pista.");
        window.location.href = "/login"; // Redirige a login
        return;
    }

    try {
        // 1️⃣ Solicita un token al backend
        const response = await fetch(`http://localhost:5000/generate-video-token/${filename}`);
        const data = await response.json();

        if (data.token) {
            // 2️⃣ Usa el token para descargar la pista
            window.location.href = `http://localhost:5000/download/${data.token}`;
        }
    } catch (error) {
        console.error("Error al descargar la pista:", error);
    }
};


  return (
    <section className="services section-p bg-md-black" id="services">
      <div className="container">
        <div className="services-content">
          <div className="item-list grid text-white text-center">
            
            {productos.map((producto) => (
              <div key={producto.id} className="item color-gris translate-effect">
                {/* 🔹 Usa VideoPlayer con el nombre del archivo */}
                <VideoPlayer filename={producto.pista} />

                <h4 className="item-title fs-25">{producto.nombre}</h4>
                <p className="fs-19 text">{producto.artista}</p>

                <button onClick={() => handleDownload(producto.pista)} className="item-link text-grey">
                    Descargar Pista
                </button>
              
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
