import React from 'react';
import './Slider.css';

const Slider = (props) => {
  return (
    <>
    <header className='header flex flex-center flex-column'>
        <div className='container'>
            <header className='header flex flex-center flex-column'>
                <h1 className='text-uppercase header-title'>{props.titulo}</h1>
                {/* <p className='text-lead'>Aquí encontrarás las mejores selecciones de música para Disk Jockeys. Música y Videos variados para todos los gustos musicales.</p> */}

                <div className='all-buttons'>
                    <div className='header-buttons section-p-top'>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>CUMBIA</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>BACHATA</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>TECNO</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>ROCK</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>BLUE</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>JAZZ</span>
                        </a>
                        </div>
                        <div className='header-buttons'>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>dance</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>pop</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>huayno</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>reggae</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>retro</span>
                        </a>
                        <a href = "/" className='btn bg-robin-blue'>
                            <span>salsa</span>
                        </a>
                    </div>
                </div>
            </header>
        </div>
    </header>
    </>
  )
}

export default Slider