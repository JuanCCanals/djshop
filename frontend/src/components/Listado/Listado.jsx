import React from 'react'
import "./Listado.css"

const Listado = () => {

    const product = [
        {
            id : '1',
            titulo: 'Yeri Mua, La Loquera- Croketita',
            genero: 'Dance',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id: '2',
            titulo: 'Matthew Wilder - Break My Stride',
            genero: '80s  Dance  Retro',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id : '1',
            titulo: 'Yeri Mua, La Loquera- Croketita',
            genero: 'Dance',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id: '2',
            titulo: 'Matthew Wilder - Break My Stride',
            genero: '80s  Dance  Retro',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id : '1',
            titulo: 'Yeri Mua, La Loquera- Croketita',
            genero: 'Dance',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id: '2',
            titulo: 'Matthew Wilder - Break My Stride',
            genero: '80s  Dance  Retro',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id : '1',
            titulo: 'Yeri Mua, La Loquera- Croketita',
            genero: 'Dance',
            artista: 'Yeri Mua, La Loquera'
        },
        {
            id: '2',
            titulo: 'Matthew Wilder - Break My Stride',
            genero: '80s  Dance  Retro',
            artista: 'Yeri Mua, La Loquera'
        }
    ]

    return (
        <div className='mt-3'>
        <table className='table'>
            <thead>
                <tr>
                    <th>Pista</th>
                    <th  className='nombre-head'>Nombre</th>
                    <th>Género</th>
                    <th>Artista</th>
                    <th>Comprar</th>
                </tr>
            </thead>
            <tbody>
                {
                    product.map( (p) => (
                        <tr>
                            <td><img
                                    src={'https://maletadvj.com/assets/img/player.png'}
                                    className='video-image'
                                    alt=""
                                />
                            </td>
                            <td>{p.titulo}</td>
                            <td>{p.genero}</td>
                            <td>{p.artista}</td>
                            <td>
                                <button
                                    className='btn marco-blanco btn-sm'
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Descargar
                                </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>

    )
}

export default Listado