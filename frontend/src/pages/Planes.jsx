import Header from '../components/Header/Header';
import Slider from '../components/Slider/Slider'
import SinglePlan from '../components/SinglePlan/SinglePlan'
import sections from "../constants/data";

const Planes = () => {
    const titulo = "Planes"
    return (
        <section className='services section-p-top bg-md-black' id = "services">
            <div className='container'>
                <Header />
                <Slider titulo = {titulo}/>
                <div className='services-content'>
                    <svg width = "1em" height = "1em">
                        <linearGradient id = "blue-gradient" x1 = "100%" y1 = "100%" x2 = "0%" y2 = "0%">
                            <stop stopColor = "#55b3d5" offset="0%" />
                            <stop stopColor = "#5764de" offset = "100%" />
                        </linearGradient>
                    </svg>

                    <div className='item-list grid text-white text-center'>
                        {
                            sections.services.map(service => {
                                return (
                                    <SinglePlan service = {service} key = {service.id} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Planes