import React from 'react';

const Image = (props) => {
    const { imgSrc } = props.location.state || {};


    return (
        <div>
            {imgSrc ? <img src={imgSrc} alt="product image" /> : <div>No Picture</div>}
        </div>
    );
};

export default Image;