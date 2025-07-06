import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import styled from "styled-components";
import Swal from 'sweetalert2';
import './Productos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Productos() {
    const APIURL = import.meta.env.VITE_API_URL

  const navigate = useNavigate()
  axios.defaults.withCredentials = true

  // useEffect( () => {
  //     axios.get('http://localhost:3000/verify')
  //     .then(result => {
  //     if(result.data.Status === false){
  //         navigate('/')
  //     }
  //     }).catch(err => console.log(err))
  // }, [])




  const [product, setProduct] = useState([])

  useEffect( () => {
      axios.get( APIURL + "/auth/productos")
      .then(result => {
          if(result.data.Status){
              setProduct(result.data.Result)
          }else{
              alert(result.data.Error)
          }
      }).catch(err => console.log(err))
  }, [])

  const handleDelete = (id) => {
      Swal.fire({
          title: 'Confirmar eliminación!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              axios.delete(APIURL + '/delete_producto/' + id)
                  .then(result => {
                      if (result.data.Status) {
                        toast.success("Producto eliminado de la tabla productos");
                        // Recarga la página después de mostrar el toast
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500); // Retraso de 1.5 segundos para mostrar el mensaje antes de recargar
                      } else {
                          Swal.fire(
                              'Error',
                              result.data.Error,
                              'error'
                          );
                      }
                  });
          }
      });
  };
  

  return (
    <Container>

<div className="px-5 mt-3">
        <div className="d-flex justify-content-center">
                <h3>Lista de Productos</h3>
            </div>
            <Link to="/dashboard/agregarproducto" className="btn btn-warning">Agregar Producto</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Nombren</th>
                            <th>Género</th>
                            <th>Artista</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            product.map( (p) => (
                                <tr>
                                    <td>{p.nombre}</td>
                                    <td>{p.genero_id}</td>
                                    <td>{p.artista}</td>
                                    <td>{p.tipo}</td>
                                    <td>{p.precio}</td>
                                    <td>{p.estado}</td>
                                    <td>
                                        <Link
                                            to ={'/editar-producto/'+p.id}
                                            className='btn btn-info btn-sm me-1'
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            className='btn btn-warning btn-sm btn-wsm'
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>

    <ToastContainer autoClose={1500} />
    </Container>);
}
const Container =styled.div`
  height:100vh;
`