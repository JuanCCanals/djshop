import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Listado.css";

const Listado = ({ tipo = 'all' }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generos, setGeneros] = useState([]);
    const [filtroGenero, setFiltroGenero] = useState('all');

    // Función para manejar cambios en el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/auth/productos');
                
                // Filtrar por tipo si es necesario
                let filteredProducts = response.data.Result;
                if (tipo !== 'all') {
                    filteredProducts = filteredProducts.filter(producto => producto.tipo === tipo);
                }
                
                setProductos(filteredProducts);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar productos:", err);
                setError("No se pudieron cargar los productos");
                setLoading(false);
            }
        };

        const fetchGeneros = async () => {
            try {
                const response = await axios.get('http://localhost:5000/generos');
                setGeneros(response.data);
            } catch (err) {
                console.error("Error al cargar géneros:", err);
            }
        };

        fetchProductos();
        fetchGeneros();
    }, [tipo]);

    // Filtrar productos por género
    const productosFiltrados = filtroGenero === 'all' 
        ? productos 
        : productos.filter(producto => producto.genero_id === parseInt(filtroGenero));

    const handleDownload = async (id, pista) => {
        const user = localStorage.getItem("user"); // Verifica si hay usuario logueado
        if (!user) {
            alert("Debes iniciar sesión para descargar esta pista.");
            return;
        }

        try {
            // 1️⃣ Solicita un token al backend
            const response = await axios.get(`http://localhost:5000/generate-video-token/${pista}`);
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

    if (loading) {
        return <div className="loading-container">Cargando productos...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    // Renderizado condicional basado en el ancho de la ventana
    const renderMobileView = () => {
        return (
            <>
                <div className="filtro-genero-mobile">
                    <select 
                        value={filtroGenero} 
                        onChange={(e) => setFiltroGenero(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="all">Todos los géneros</option>
                        {generos.map(genero => (
                            <option key={genero.id} value={genero.id}>
                                {genero.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="pistas-mobile">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((p) => (
                            <div className="pista-card" key={p.id}>
                                <div className="pista-header">
                                    <img
                                        src={'https://maletadvj.com/assets/img/player.png'}
                                        className='video-image'
                                        alt="Reproductor"
                                    />
                                    <h3 className="pista-titulo">{p.nombre}</h3>
                                </div>
                                <div className="pista-info">
                                    <p><span>Género:</span> {generos.find(g => g.id === p.genero_id)?.nombre || 'Sin género'}</p>
                                    <p><span>Artista:</span> {p.artista}</p>
                                    <p><span>Precio:</span> {p.precio} tokens</p>
                                </div>
                                <div className="pista-actions">
                                    <button
                                        className='btn marco-blanco btn-sm'
                                        onClick={() => handleDownload(p.id, p.pista)}
                                    >
                                        Descargar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No se encontraron pistas para esta categoría</div>
                    )}
                </div>
            </>
        );
    };

    const renderTableView = () => {
        return (
            <>
                <div className="filtro-genero">
                    <select 
                        value={filtroGenero} 
                        onChange={(e) => setFiltroGenero(e.target.value)}
                        className="filtro-select"
                    >
                        <option value="all">Todos los géneros</option>
                        {generos.map(genero => (
                            <option key={genero.id} value={genero.id}>
                                {genero.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="table-responsive">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Pista</th>
                                <th className='nombre-head'>Nombre</th>
                                <th>Género</th>
                                <th>Artista</th>
                                <th>Precio</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <img
                                                src={'https://maletadvj.com/assets/img/player.png'}
                                                className='video-image'
                                                alt="Reproductor"
                                            />
                                        </td>
                                        <td>{p.nombre}</td>
                                        <td>{generos.find(g => g.id === p.genero_id)?.nombre || 'Sin género'}</td>
                                        <td>{p.artista}</td>
                                        <td>{p.precio} tokens</td>
                                        <td>
                                            <button
                                                className='btn marco-blanco btn-sm'
                                                onClick={() => handleDownload(p.id, p.pista)}
                                            >
                                                Descargar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-results">No se encontraron pistas para esta categoría</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    return (
        <div className='mt-3 listado-container'>
            {windowWidth < 768 ? renderMobileView() : renderTableView()}
        </div>
    );
};

export default Listado;
