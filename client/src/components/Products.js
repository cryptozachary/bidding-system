import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Image from './Image';

const Products = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [imgSrcs, setImgSrcs] = useState([]);

    const handleBidBtn = (product) =>
        navigate(`/products/bid/${product._id}/${product.name}/${product.price}`);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/getproducts');
                const data = await response.json();
                console.log('first chain data:', data);
                setProducts(data);
                setLoading(false);
                return data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const loadImage = async (data, index) => {
            try {
                const blob = new Blob([data.imgFile], { type: 'image/png' });
                const url = URL.createObjectURL(blob);
                setImgSrcs((prevImgSrcs) => {
                    const updatedImgSrcs = [...prevImgSrcs];
                    updatedImgSrcs[index] = url;
                    return updatedImgSrcs;
                });
                console.log('Image loaded successfully');
            } catch (error) {
                console.error('Error loading image:', error);
            }
        };

        fetchProducts()
            .then((data) => {
                const initialImgSrcs = new Array(data.length).fill(null);
                setImgSrcs(initialImgSrcs);
                return data;
            })
            .then((data) =>
                Promise.all(
                    data.map((product, index) => loadImage(product, index))
                )
            )
            .catch((error) => {
                console.error('Error fetching products or loading image:', error);
            });
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
                            products.map((product, index) => (
                                <tr key={`${product._id}`}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.description || 'None'}</td>
                                    <td>
                                        {imgSrcs[index] ? (
                                            <img src={imgSrcs[index]} alt="product image" />
                                        ) : (
                                            <p>Loading image...</p>
                                        )}
                                        <Link
                                            to={{
                                                pathname: '/image',
                                                state: { imgSrc: imgSrcs[index] },
                                            }}
                                        >
                                            Image
                                        </Link>
                                    </td>
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
}

export default Products;