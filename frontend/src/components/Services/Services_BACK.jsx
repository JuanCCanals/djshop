import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Services.css";
import VideoPlayer from "./VideoPlayer";

const Services = () => {
  const baseURL = "http://localhost:5000/stream-video/";
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener productos y géneros en paralelo
        const [productosResponse, generosResponse] = await Promise.all([
          axios.get("http://localhost:5000/auth/productos"),
          axios.get("http://localhost:5000/generos")
        ]);
        
        // Filtrar solo los 3 productos más recientes o destacados
        const productosDestacados = productosResponse.data.Result
          .sort((a, b) => b.id - a.id) // Ordenar por ID descendente (asumiendo que IDs más altos son más recientes)
          .slice(0, 3);
          
        setProductos(productosDestacados);
        setGeneros(generosResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("No se pudieron cargar las pistas destacadas");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDownload = async (id, filename) => {
    const user = localStorage.getItem("user"); // Verifica si hay usuario logueado
    if (!user) {
        alert("Debes iniciar sesión para descargar esta pista.");
        return;
    }
    
    try {
        // 1️⃣ Solicita un token al backend
        const response = await axios.get(`http://localhost:5000/generate-video-token/${filename}`);
        
        if (response.data.token) {
            // 2️⃣ Registra la descarga
            const userData = JSON.parse(user);
            await axios.post('http://localhost:5000/descargas', {
                usuario_id: userData.id_usuario,
                producto_id: id,
                tokens_gastados: 1 // Valor por defecto, podría variar según el producto
            });
            
            // 3️⃣ Usa el token para descargar la pista
            window.location.href = `http://localhost:5000/download/${response.data.token}`;
        }
    } catch (error) {
        console.error("Error al descargar la pista:", error);
        alert("Error al procesar la descarga. Inténtalo de nuevo.");
    }
  };

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <section className="services section-p bg-md-black" id="services">
        <div className="container">
          <div className="services-content text-center">
            <p className="loading-text text-white">Cargando pistas destacadas...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services section-p bg-md-black" id="services">
        <div className="container">
          <div className="services-content text-center">
            <p className="error-text text-white">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services section-p bg-md-black" id="services">
      <div className="container">
        <div className="services-content">
          <h2 className="section-title text-white text-center mb-4">Pistas Destacadas</h2>
          <div className="item-list grid text-white text-center">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div key={producto.id} className="item color-gris translate-effect">
                  {/* 🔹 Usa VideoPlayer con el nombre del archivo */}
                  <VideoPlayer filename={producto.pista} />
                  <h4 className="item-title fs-25">{producto.nombre}</h4>
                  <p className="fs-19 text">{producto.artista}</p>
                  <p className="fs-17 text">
                    <span className="genero-tag">
                      {generos.find(g => g.id === producto.genero_id)?.nombre || 'Sin género'}
                    </span>
                  </p>
                  <p className="precio-tag">{producto.precio} tokens</p>
                  <button 
                    onClick={() => handleDownload(producto.id, producto.pista)} 
                    className="item-link text-grey download-btn"
                  >
                    Descargar Pista
                  </button>
                </div>
              ))
            ) : (
              <div className="no-products text-white text-center">
                <p>No hay pistas disponibles en este momento</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
