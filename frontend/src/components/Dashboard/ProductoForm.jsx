import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductoForm = ({ show, handleClose, productoEdit, refreshProductos }) => {
    const APIURL = import.meta.env.VITE_API_URL;
    const [producto, setProducto] = useState({
        nombre: '',
        genero_id: '',
        artista: '',
        tipo: 'audio',
        pista: '',
        cancion: '',
        duracion: '',
        precio: '',
        estado: 'activo'
    });
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        axios.get(APIURL + '/generos')
            .then(result => setGeneros(result.data.Result))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (productoEdit) {
            setProducto(productoEdit);
        }
    }, [productoEdit]);

    const handleChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const request = productoEdit ? axios.put : axios.post;
        const url = productoEdit ? `${APIURL}/productos/${productoEdit.id}` : `${APIURL}/productos`;

        request(url, producto)
            .then(result => {
                if (result.data.Status) {
                    toast.success(productoEdit ? 'Producto actualizado' : 'Producto agregado');
                    handleClose();
                    refreshProductos();
                } else {
                    toast.error(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        show && (
            <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{productoEdit ? 'Editar Producto' : 'Agregar Producto'}</h5>
                            <button type="button" className="close" onClick={handleClose}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="nombre" placeholder="Nombre" className="form-control mb-2" onChange={handleChange} value={producto.nombre} required />
                                <select name="genero_id" className="form-control mb-2" onChange={handleChange} value={producto.genero_id} required>
                                    <option value="">Seleccione género</option>
                                    {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                </select>
                                <input type="text" name="artista" placeholder="Artista" className="form-control mb-2" onChange={handleChange} value={producto.artista} required />
                                <input type="text" name="pista" placeholder="URL Pista" className="form-control mb-2" onChange={handleChange} value={producto.pista} required />
                                <input type="text" name="cancion" placeholder="URL Canción" className="form-control mb-2" onChange={handleChange} value={producto.cancion} required />
                                <input type="time" name="duracion" className="form-control mb-2" onChange={handleChange} value={producto.duracion} />
                                <input type="number" name="precio" placeholder="Precio" className="form-control mb-2" onChange={handleChange} value={producto.precio} required />
                                <select name="estado" className="form-control mb-2" onChange={handleChange} value={producto.estado}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                <button type="submit" className="btn btn-success w-100">Guardar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProductoForm;
