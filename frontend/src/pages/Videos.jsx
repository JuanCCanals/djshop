import React from 'react'
import Header from '../components/Header/Header'
import Slider from '../components/Slider/Slider'
import Listado from '../components/Listado/Listado'

const Videos = () => {
    const titulo = "Videos"
    return (
        <section className='services section-p-top bg-md-black' id="services">
            <div className='container'>
                <Header />
                <Slider titulo={titulo}/>
                {/* Pasar el tipo 'video' para filtrar solo videos */}
                <Listado tipo="video" />
            </div>
        </section>
    )
}

export default Videos
