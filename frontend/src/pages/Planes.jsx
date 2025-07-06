import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider';
import SinglePlan from '../components/SinglePlan/SinglePlan';
import axios from 'axios';
import './Planes.css';

const Planes = () => {
    const titulo = "Planes";
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/planes');
                setPlanes(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar planes:", err);
                setError("No se pudieron cargar los planes de suscripción");
                setLoading(false);
            }
        };

        fetchPlanes();
    }, []);

    const handleSuscribir = (plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const handleConfirmarSuscripcion = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            
            if (!userData) {
                alert("Debes iniciar sesión para suscribirte");
                return;
            }

            const response = await axios.post('http://localhost:5000/api/suscripciones', {
                usuario_id: userData.id_usuario,
                plan_id: selectedPlan.id_plan,
                tokens_restantes: selectedPlan.tokens_asignados
            });

            alert(`Solicitud de suscripción registrada correctamente. Por favor realiza una transferencia de S/ ${selectedPlan.precio} a la cuenta bancaria indicada. El administrador verificará el pago y activará tu suscripción.`);
            setShowModal(false);
        } catch (error) {
            console.error("Error al solicitar suscripción:", error);
            alert("Error al procesar la solicitud de suscripción. Inténtalo de nuevo.");
        }
    };

    if (loading) {
        return (
            <section className='services section-p-top bg-md-black' id="services">
                <div className='container'>
                    <Header />
                    <Slider titulo={titulo} />
                    <div className='loading-container'>Cargando planes de suscripción...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='services section-p-top bg-md-black' id="services">
                <div className='container'>
                    <Header />
                    <Slider titulo={titulo} />
                    <div className='error-container'>{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='services section-p-top bg-md-black' id="services">
            <div className='container'>
                <Header />
                <Slider titulo={titulo} />
                <div className='services-content'>
                    <svg width="1em" height="1em">
                        <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop stopColor="#55b3d5" offset="0%" />
                            <stop stopColor="#5764de" offset="100%" />
                        </linearGradient>
                    </svg>
                    
                    <h2 className='section-title text-white text-center mb-4'>Planes de Suscripción</h2>
                    
                    <div className='item-list grid text-white text-center'>
                        {planes.length > 0 ? (
                            planes.map(plan => (
                                <SinglePlan 
                                    key={plan.id} 
                                    plan={plan} 
                                    onSuscribir={handleSuscribir} 
                                />
                            ))
                        ) : (
                            <div className='no-planes'>No hay planes disponibles en este momento</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de información de pago */}
            {showModal && selectedPlan && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Información de Pago</h3>
                        <div className="plan-info">
                            <p><strong>Plan:</strong> {selectedPlan.nombre}</p>
                            <p><strong>Precio:</strong> S/ {selectedPlan.precio}</p>
                            <p><strong>Duración:</strong> {selectedPlan.duracion_meses} mes(es)</p>
                            <p><strong>Créditos:</strong> {selectedPlan.creditos}</p>
                        </div>
                        
                        <div className="bank-info">
                            <h4>Datos Bancarios para Transferencia</h4>
                            <p><strong>Banco:</strong> Banco de Crédito del Perú (BCP)</p>
                            <p><strong>Titular:</strong> DJShop Music E.I.R.L.</p>
                            <p><strong>Cuenta Corriente:</strong> 194-2345678-0-12</p>
                            <p><strong>CCI:</strong> 00219400234567801234</p>
                            <p><strong>Moneda:</strong> Soles (PEN)</p>
                            <p className="payment-note">
                                Una vez realizada la transferencia, envía el comprobante por WhatsApp al 
                                +51 959 884 259 o por email a prodixperu@hotmail.com. El administrador 
                                verificará el pago y activará tu suscripción con los créditos correspondientes.
                            </p>
                        </div>
                        
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={handleConfirmarSuscripcion}>
                                Confirmar Solicitud
                            </button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Planes;
