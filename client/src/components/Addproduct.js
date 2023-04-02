import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useCookies } from 'react-cookie';
import "../NewItem.css";


const AddProduct = ({ socket }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const navigate = useNavigate();

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];
        console.log(imageFile)
        const reader = new FileReader();
        reader.readAsBinaryString(imageFile);

        reader.onloadend = () => {
            setFile(reader.result);
            console.log(reader.result)
        };

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // save the product data to an object to send to api
        let productData = {
            name: name,
            price: price,
            description: description,
            file: file,
        }

        try {
            await axios.post("http://localhost:4000/addproduct", productData, { withCredentials: true });
            alert("Item added successfully");
            setName("");
            setDescription("");
            setPrice("");
            setFile(null);
            // send socketio the same data
            socket.emit('addProduct', productData)
            navigate('/products');
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <div className="new-item">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Upload Item Image</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        maxLength={125}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="startingPrice">Starting Price</label>
                    <input
                        type="number"
                        id="startingPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default AddProduct;