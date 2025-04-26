import React from 'react';
import {BsArrowRightCircle} from "react-icons/bs";
import "../../pages/Planes.css";

const SinglePlan = ({service}) => {
  return (
    <div className='item bg-dark translate-effect'>
        <span className='item-icon'>
            {service.icon}
        </span>
        <p className='fs-19 text'>{service.text1}</p>
        <h4 className='item-title fs-25'>{service.title}</h4>
        <p className='fs-19 text'>{service.text2}</p>
        <a href = "/" className='item-link text-grey'>
            <BsArrowRightCircle size = {30} />
        </a>
    </div>
  )
}

export default SinglePlan