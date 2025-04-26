import React from 'react';
import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider';
import Info from '../components/Info/Info';
import { Formik } from 'formik';
import images from '../constants/images';
import './Contacto.css';

const Contacto = () => {
  const titulo = "Contacto";
  return (
    <section className='contact section-p-top bg-black'>
        <div className='container'>
            <Header />
            <Slider titulo = {titulo}/>
            <div className='contact-content grid text-center'>
                <div className='contact-left'>
                    <div className='section-t'>
                        <h3 className='section-p-top'>Escríbanos</h3> 
                        {/* <p className='text'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, assumenda quia repellendus architecto culpa nisi?</p> */}
                    </div>

                    <Formik
                        initialValues={{ name: "", email: '', address: '' }}
                        validate={values => {
                            const errors = {};

                            if(!values.name){
                                errors.name = "Nombre es requerido";
                            } else if(!/^[A-Za-z\s]*$/.test(values.name)){
                                errors.name = "Nombre con formato inválido";
                            }

                            if (!values.email) {
                                errors.email = 'Correo es requerido';
                            } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = 'Correo con formato inválido';
                            }

                            if(!values.address){
                                errors.address = "Motivo es requerido";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                            }, 400);
                        }}
                        >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className='form-elem'>
                                    <input type = "text" name = "name" onChange = {handleChange} onBlur = {handleBlur} value = {values.name} placeholder = "Nombre" className = "form-control" />
                                    <span className='form-control-text'>{errors.name && touched.name && errors.name}</span>
                                </div>

                                <div className='form-elem'>
                                    <input type = "email" name = "email" onChange = {handleChange} onBlur = {handleBlur} value = {values.email} placeholder = "Correo" className = "form-control" />
                                    <span className='form-control-text'>{errors.email && touched.email && errors.email}</span>
                                </div>

                                <div className='form-elem'>
                                    <input type = "text" name = "address" onChange = {handleChange} onBlur = {handleBlur} value = {values.address} placeholder = "Motivo" className = "form-control" />
                                    <span className='form-control-text'>{errors.address && touched.address && errors.address}</span>
                                </div>

                                <div className='flex flex-start'>
                                    <button type = "submit" disabled = {isSubmitting} className = "submit-btn">Enviar correo</button>
                                </div>
                            </form>
                        )}
                        </Formik>
                </div>

                <div className='contact-right section-p-top'>
                    <img src = {images.form_main_img} alt = "" />
                </div>
            </div>
        </div>

        <Info />
    </section>

  )
}

export default Contacto