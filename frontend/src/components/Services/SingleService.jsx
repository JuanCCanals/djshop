import React from 'react';
import {BsArrowRightCircle} from "react-icons/bs";
import "./Services.css";

const SingleService = ({service}) => {
  return (
    <div className='item color-gris translate-effect'>
        <span className='item-icon'>
        </span>
        <h4 className='item-title fs-25'>{service.title}</h4>
        <p className='fs-19 text'>{service.text}</p>
        <a href = "/" className='item-link text-grey'>
            <BsArrowRightCircle size = {30} />
        </a>
    </div>
  )
}

export default SingleService