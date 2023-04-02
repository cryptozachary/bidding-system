import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Image from './Image';

const Products = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [theImg, setTheImg] = useState(null)

    const handleBidBtn = (product) =>

        //place product information in params after fetching 
        navigate(`/products/bid/${product._id}/${product.name}/${product.price}`);

    //fetch the products from the database via the GET api created in express 
    useEffect(() => {
        const fetchProducts = () => {
            fetch('http://localhost:4000/getproducts')
                .then((res) => res.json())
                .then((data) => {
                    console.log('first chain data:', data)
                    //loads product data into state
                    setProducts(data);
                    //sets loading variable as false
                    setLoading(false);
                    return data
                }).then((data) => {
                    console.log('second chain data:', data[0].imgFile)
                    // Create a blob from the buffer
                    const blob = new Blob([data[0].imgFile], { type: 'image/png' });

                    // Create a URL for the blob
                    const url = URL.createObjectURL(blob);

                    // Set the URL as the source of an <img> element
                    const img = document.createElement('img');
                    img.src = url;

                    // Append the <img> element to the DOM
                    setTheImg(prev => {
                        return img
                    })
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
                                    <td><img src={theImg} /></td>
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