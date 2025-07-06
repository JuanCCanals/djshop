import React from 'react'
import Header from '../components/Header/Header'
import Slider from '../components/Slider/Slider'
import Listado from '../components/Listado/Listado'

const Audios = () => {
    const titulo = "Audios"
    return (
        <section className='services section-p-top bg-md-black' id="services">
            <div className='container'>
                <Header />
                <Slider titulo={titulo}/>
                {/* Pasar el tipo 'audio' para filtrar solo audios */}
                <Listado tipo="audio" />
            </div>
        </section>
    )
}

export default Audios
