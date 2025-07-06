import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Listado.css";

const Listado = ({ tipo = 'all' }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [pistas, setPistas] = useState([]);
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

    // Cargar pistas desde la API
    useEffect(() => {
        const fetchPistas = async () => {
            try {
                setLoading(true);
                let url = 'http://localhost:5000/api/pistas';
                
                // Si se especifica un tipo, usar la ruta específica
                if (tipo !== 'all') {
                    url = `http://localhost:5000/api/pistas/tipo/${tipo}`;
                }
                
                const response = await axios.get(url);
                setPistas(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar pistas:", err);
                setError("No se pudieron cargar las pistas");
                setLoading(false);
            }
        };

        const fetchGeneros = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/generos');
                setGeneros(response.data);
            } catch (err) {
                console.error("Error al cargar géneros:", err);
            }
        };

        fetchPistas();
        fetchGeneros();
    }, [tipo]);

    // Filtrar pistas por género
    const pistasFiltradas = filtroGenero === 'all' 
        ? pistas 
        : pistas.filter(pista => pista.genero_id === parseInt(filtroGenero));

    const handleDownload = async (id, archivo_url) => {
        const user = localStorage.getItem("user"); // Verifica si hay usuario logueado
        if (!user) {
            alert("Debes iniciar sesión para descargar esta pista.");
            return;
        }

        try {
            // 1️⃣ Solicita un token al backend
            const response = await axios.get(`http://localhost:5000/generate-video-token/${archivo_url}`);
            if (response.data.token) {
                // 2️⃣ Registra la descarga
                const userData = JSON.parse(user);
                await axios.post('http://localhost:5000/api/compras', {
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
        return <div className="loading-container">Cargando pistas...</div>;
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
                    {pistasFiltradas.length > 0 ? (
                        pistasFiltradas.map((pista) => (
                            <div className="pista-card" key={pista.id}>
                                <div className="pista-header">
                                    <img
                                        src={pista.imagen_url || 'https://maletadvj.com/assets/img/player.png'}
                                        className='video-image'
                                        alt="Reproductor"
                                    />
                                    <h3 className="pista-titulo">{pista.nombre}</h3>
                                </div>
                                <div className="pista-info">
                                    <p><span>Artista:</span> {pista.artista}</p>
                                    <p><span>Género:</span> {pista.genero_nombre || 'Sin género'}</p>
                                    <p><span>Tipo:</span> {pista.tipo}</p>
                                    <p><span>Precio:</span> S/ {pista.precio}</p>
                                </div>
                                <div className="pista-actions">
                                    <button
                                        className='btn marco-blanco btn-sm'
                                        onClick={() => handleDownload(pista.id, pista.pista)}
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
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pistasFiltradas.length > 0 ? (
                                pistasFiltradas.map((pista) => (
                                    <tr key={pista.id}>
                                        <td>
                                            <img
                                                src={pista.imagen_url || 'https://maletadvj.com/assets/img/player.png'}
                                                className='video-image'
                                                alt="Reproductor"
                                            />
                                        </td>
                                        <td>{pista.titulo}</td>
                                        <td>{pista.genero_nombre || 'Sin género'}</td>
                                        <td>{pista.descripcion}</td>
                                        <td>S/ {pista.precio}</td>
                                        <td>
                                            <button
                                                className='btn marco-blanco btn-sm'
                                                onClick={() => handleDownload(pista.id, pista.archivo_url)}
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
