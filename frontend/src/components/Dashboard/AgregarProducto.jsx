import {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AgregarProducto.css';

const AgregarProducto = () => {
    const APIURL = import.meta.env.VITE_API_URL
    
    const [product, setProduct] = useState({
        nombre: '',
        genero_id: '1',
        artista: '',
        tipo: 'audio',
        pista: '',
        cancion: '',
        duracion: '',
        precio: '',
        estado: 'activo'
    });

    const [genero, setGenero] = useState([])
    const navigate = useNavigate()

    useEffect( () => {
        axios.get( APIURL + '/auth/generos')
        
        .then(result => {
            if(result.data.Status){
                setGenero(result.data.Result)
            }else {
                console.log('Error en la carga de géneros:',result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('product:',product)
        const formData = new FormData()
        formData.append('nombre', product.nombre)
        formData.append('genero_id', product.genero_id)
        formData.append('artista', product.artista)
        formData.append('tipo', product.tipo)
        formData.append('pista', product.pista)
        formData.append('cancion', product.cancion)
        formData.append('duracion', product.duracion)
        formData.append('precio', product.precio)
        formData.append('estado', product.estado)
        console.log('formData:',formData)
        axios.post( APIURL + '/auth/add_product', formData)
        .then(result => {
            
            if(result.data.Status) {
                navigate('/dashboard/productos')
            } else {
                alert('Error en la creación de Producto:',result.data.Error)
            }
        })
        .catch(err => console.log(err))

        return 
    }

    return (
        <div className='d-flex justify-content-center align-items-center mt-3'>
            <div className='p-3 rounded w-50 border'>
                <h1 className='text-center'>Agregar Producto</h1>
                <form className='row g-1' onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className='col-12'>
                        <label htmlFor="nombre" className='form-label color-negro lmedium'>Nombre:</label>
                        <input
                            type="text"
                            id='nombre'
                            name='nombre'
                            placeholder="Ingrese Nombre"
                            className='form-control rounded-0 lmedium'
                            onChange={(e) => setProduct({...product, nombre: e.target.value})}
                        />
                    </div>
                    <div className='col-6'>
                        <label htmlFor="category" className='form-label color-negro lmedium'>Género:</label>
                        <select id='genero_id' name='genero_id' className='form-select lmedium'
                            onChange={(e) => setProduct({...product, genero_id: e.target.value})}
                        >
                            { genero.map( (g) => (
                                <option 
                                    key = {g.id} 
                                    value = {g.id}> {g.nombre} 
                                </option>
                            ) ) }
                        </select>
                    </div>
                    <div className='col-6'>
                        <label htmlFor="artista" className='form-label color-negro lmedium'>Artista:</label>
                        <input
                            type="text"
                            id="artista"
                            name='artista'
                            placeholder="Ingrese Artista"
                            className='form-control rounded-0 lmedium'
                            onChange={(e) => setProduct({...product, artista: e.target.value})}
                        />
                    </div>
                    <div className='col-8'>
                        <label htmlFor="tipo" className='form-label color-negro lmedium'>Tipo:</label>
                        <select 
                            name="tipo"
                            className="form-control mb-2 lmedium"
                            onChange={(e) => setProduct({...product, tipo: e.target.value})}
                            >
                                <option value="audio">Audio</option>
                                <option value="video">Video</option>
                                
                        </select>
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor='image' className='form-label color-negro lmedium'>Ingrese pista</label>
                        <input
                            type="file"
                            id="pista"
                            name="pista"
                            className="form-control rounded-0 lmedium"
                            onChange={(e) => setProduct({...product, pista: e.target.files[0]})}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor='image' className='form-label color-negro lmedium'>Ingrese canción</label>
                        <input
                            type="file"
                            id="cancion"
                            name="cancion"
                            className="form-control rounded-0 lmedium"
                            onChange={(e) => setProduct({...product, cancion: e.target.files[0]})}
                        />
                    </div>
                    <div className='col-12'>
                        <label htmlFor="active" className='form-label color-negro lmedium'>Duración:</label>
                        <input
                            type="time"
                            id="duracion"
                            name='duracion'
                            className='form-control rounded-0 lmedium'
                            onChange={(e) => setProduct({...product, duracion: e.target.value})}
                        />
                    </div>
                    <div className='col-12'>
                        <label htmlFor="category" className='form-label color-negro lmedium'>Precio:</label>
                        <input
                            type="number"
                            id="precio"
                            name='precio'
                            placeholder="Precio"
                            className='form-control rounded-0 lmedium'
                            onChange={(e) => setProduct({...product, precio: e.target.value})}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor='image' className='form-label color-negro lmedium'>Estado</label>
                        <select 
                            name="estado"
                            className="form-control mb-2 lmedium"
                            onChange={(e) => setProduct({...product, estado: e.target.value})}
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                
                        </select>
                    </div>
                    <button type="submit" className="btn btn-warning w-100 lmedium">Agregar Producto</button>
                </form>
            </div>
        </div>
    )
}

export default AgregarProducto