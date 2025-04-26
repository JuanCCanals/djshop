import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Generos = () => {
    const [generos, setGeneros] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        obtenerGeneros();
    }, []);

    const obtenerGeneros = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/generos');
            setGeneros(data);
        } catch (error) {
            console.error('Error al obtener géneros:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/generos/${editId}`, { nombre });
                toast.success('Género actualizado');
            } else {
                await axios.post('http://localhost:5000/api/generos', { nombre });
                toast.success('Género agregado');
            }
            obtenerGeneros();
            setNombre('');
            setEditId(null);
        } catch (error) {
            toast.error('Error al guardar género');
        }
    };

    const handleEdit = (genero) => {
        setNombre(genero.nombre);
        setEditId(genero.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/generos/${id}`);
            toast.success('Género eliminado');
            obtenerGeneros();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Géneros Musicales</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del género"
                    required
                />
                <button type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
            </form>

            <DataTable
                columns={[
                    { name: 'ID', selector: (row) => row.id, sortable: true },
                    { name: 'Nombre', selector: (row) => row.nombre, sortable: true },
                    {
                        name: 'Acciones',
                        cell: (row) => (
                            <>
                                <button onClick={() => handleEdit(row)}>✏️</button>
                                <button onClick={() => handleDelete(row.id)}>🗑️</button>
                            </>
                        ),
                    },
                ]}
                data={generos}
                pagination
            />
            <ToastContainer />
        </div>
    );
};

export default Generos;
