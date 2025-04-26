import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./Header.css";
//import Slider from '..Slider/Slider/Slider'
import {FaPaperPlane} from "react-icons/fa";

const Header = () => {
    return (
        <header className='header flex flex-center flex-column'>
            <Navbar />
        </header>
    )
}

export default Header


