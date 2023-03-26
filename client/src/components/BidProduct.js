import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { useCookies } from 'react-cookie';

const BidProduct = ({ socket }) => {

    const { id, name, price } = useParams();
    const [userInput, setUserInput] = useState(price);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [cookies, setCookies] = useCookies(['access_token'])

    const [deleteClicked, setDeleteClicked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // new product price
        let newPrice = {
            price: userInput
        }

        if (userInput > Number(price)) {
            socket.emit('bidProduct', {
                userInput,
                name,
            });

            //send request to axios to increase price on item if price is bigger than previous price
            axios.put(`http://localhost:4000/products/bid/${id}`, newPrice, { withCredentials: true })
            navigate('/products');
        } else {
            setError(true);
        }


    };

    const handleDelete = (e) => {
        e.preventDefault()

        //if deleteClicked state is true it proceeds to show delete button , otherwise exit function
        if (!deleteClicked) {
            setDeleteClicked(true);
            return;
        }

        //create object for item id
        let itemID = {
            id: id
        }

        // send request to axios to delete item with the item ID
        axios.delete(`http://localhost:4000/products/bid/${id}`, itemID, { headers: { authorization: cookies.access_token } })
        console.log(id)
        navigate('/products')
    }

    return (
        <div>
            <div className="bidproduct__container">
                {deleteClicked ? (
                    <>
                        <p className='delete-confirmation'>Are you sure you want to delete this item?</p>
                        <button className="delete-button bidProduct__cta" type='button' onClick={handleDelete}>Confirm</button>
                        <button className="delete-button bidProduct__cta" type='button' onClick={() => setDeleteClicked(false)}>Cancel</button>
                    </>
                ) : (
                    <button className="delete-button bidProduct__cta" type='button' onClick={handleDelete}>Delete</button>
                )}
                <h2>Place a Bid</h2>
                <form className="bidProduct__form" onSubmit={handleSubmit}>
                    <h3 className="bidProduct__name">{name}</h3>

                    <label htmlFor="amount">Bidding Amount</label>
                    {/* The error message */}
                    {error && (
                        <p style={{ color: 'red' }}>
                            The bidding amount must be greater than {price}
                        </p>
                    )}

                    <input
                        type="number"
                        name="amount"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        required
                    />

                    <button className="bidProduct__cta">SEND</button>
                </form>
            </div>
        </div>
    );
};

export default BidProduct;