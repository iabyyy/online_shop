import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderedProducts.css'; // Import CSS

function OrderedProducts({ userId }) {
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    userId = user?.user_id;

    useEffect(() => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        axios.get(`http://localhost:8000/order/${userId}`)
            .then(response => {
                setOrderedProducts(response.data.ordered_products);
                setLoading(false);
            })
            .catch(error => {
                const message =
                    error.response?.data?.error || error.message || 'Failed to fetch orders';
                setError(message);
                setLoading(false);
            });
    }, [userId]);

    if (!userId) {
        return <p>Please provide a user ID.</p>;
    }

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    if (orderedProducts.length === 0) {
        return <p>No orders found for this user.</p>;
    }

    return (
        <div className="ordered-products-container">
            <h2 className="ordered-products-title">Ordered Products for User {userId}</h2>
            <table className="ordered-products-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product ID</th>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orderedProducts.map(({ order_id, product_id, product_name, product_image, quantity, price, order_date }) => (
                        <tr key={`${order_id}-${product_id}`}>
                            <td>{order_id}</td>
                            <td>{product_id}</td>
                            <td>
                                <img
                                    src={product_image}
                                    alt={product_name}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/fallback-image.jpg';
                                    }}
                                />
                            </td>
                            <td>{product_name}</td>
                            <td>{quantity}</td>
                            <td>${Number(price).toFixed(2)}</td>
                            <td>{new Date(order_date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderedProducts;
