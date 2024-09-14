import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleBidBtn = (product) =>
        navigate(`/products/bid/${product._id}/${product.name}/${product.price}`);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/getproducts');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const imgStyles = {
        minWidth: '100px',
        maxWidth: '100px',
        minHeight: '100px',
        maxHeight: '100px'
    }

    return (
        <div>
            <div className="table__container">
                <Link to="/products/add" className="products__cta">
                    ADD ITEM
                </Link>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Picture</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5">Loading...</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{`$${product.price}`}</td>
                                    <td>{product.description || 'None'}</td>
                                    <td>
                                        {product.imgFile ? (
                                            <img src={product.imgFile} alt={product.name} style={imgStyles} />
                                        ) : (
                                            <p>No image available</p>
                                        )}
                                    </td>
                                    <td>
                                        <button className='button2' onClick={() => handleBidBtn(product)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Products;