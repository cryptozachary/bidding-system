import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleBidBtn = (product) =>

        //place product information in params after fetching 
        navigate(`/products/bid/${product._id}/${product.name}/${product.price}`);

    //fetch the products from the database via the GET api created in express 
    useEffect(() => {
        const fetchProducts = () => {
            fetch('http://localhost:4000/getproducts')
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    //loads product data into state
                    setProducts(data);
                    //sets loading variable as false
                    setLoading(false);
                });
        };
        fetchProducts();
    }, []);

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
                                <td>Loading</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={`${product._id}`}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.description || 'None'}</td>
                                    <td>{product.imgFile || 'None'}</td>
                                    <td>
                                        <button onClick={() => handleBidBtn(product)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;