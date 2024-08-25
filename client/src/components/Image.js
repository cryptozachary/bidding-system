import React from 'react';
import { useLocation } from 'react-router-dom';

const Image = () => {
    const location = useLocation();
    const imgSrc = location.state?.imgSrc;

    return (
        <div>
            {imgSrc ? <img src={imgSrc} alt="product image" /> : <div>No Picture</div>}
        </div>
    );
};

export default Image;