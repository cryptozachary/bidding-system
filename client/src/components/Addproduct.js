import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ socket }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [owner, setOwner] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, price, owner: localStorage.getItem('userName') });
        socket.emit('addProduct', {
            name,
            price,
            owner: localStorage.getItem('username'),
        })
        navigate('/products');
    };

    return (
        <div>
            <div className="addproduct__container">
                <h2>Add a new product</h2>
                <form className="addProduct__form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name of the product</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="price">Starting price</label>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <label htmlFor="price">Owner name</label>
                    <input
                        type="text"
                        name="owner"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        required
                    />

                    <button className="addProduct__cta">SEND</button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;