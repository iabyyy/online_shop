import { Col, Row, Container, Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCartItems = async () => {
            const user = JSON.parse(localStorage.getItem('user'));



            if (!user || !user.user_id) {
                console.error('User not found or user ID is missing');
                return;
            }
            const userId = user.user_id
            console.log(userId);

            try {
                const response = await axios.get(`http://localhost:8000/usercart/${userId}`);
                const cartData = response.data;

                // Fetch product details for each cart item if needed
                const detailedCartItems = await Promise.all(cartData.map(async (item) => {
                    // If item.product is an ID, fetch details
                    if (typeof item.product === 'number') {
                        const productResponse = await axios.get(`http://localhost:8000/api/products/${item.product}/`);
                        return {
                            ...item,
                            product: productResponse.data
                        };
                    }
                    // Otherwise, product is already an object
                    return item;
                }));

                setCartItems(detailedCartItems);
            } catch (err) {
                setError('Failed to load cart items');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleUpdateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.user_id) return;

            const productId = item.product.id;
            if (!productId) {
                console.error("Product ID is missing");
                return;
            }

            console.log('Sending update with:', {
                user: user.user_id,
                product: productId,
                quantity: newQuantity
            });

            await axios.put(`http://localhost:8000/usercart/${item.id}/`, {
                user: user.user_id,
                product: productId,
                quantity: newQuantity
            });

            // Update state
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
            ));
        } catch (err) {
            console.error('Error updating quantity:', err);
            setError('Failed to update quantity');
        }
    };


    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8000/usercart/${itemId}/`);
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
    };

    const handleCheckout = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
        
          const cart_id = cartItems.length > 0 ? cartItems[0].id : null;
      
          if (!cart_id) {
            setError('Cart ID missing');
            return;
          }
      
          const orderPayload = {
            user_id: user.user_id,
            cart_id: cart_id,
            products: cartItems.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              
            })),
          };
      
          console.log('Sending order:', orderPayload);
      
          await axios.post('http://localhost:8000/order/', orderPayload);
      
          alert('Order placed successfully!');
          
         
      
        } catch (err) {
          console.error('Checkout error:', err.response?.data || err.message);
          setError('Failed to place order');
        }
      };
      
      








    if (loading) return <p>Loading cart items...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container className="p-3">
            <h3>Your Cart</h3>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <Row>
                        {cartItems.map((item) => (
                            <Col md={6} lg={4} key={item.id}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Row>
                                            <Col md={4}>
                                                <Card.Img variant="top" src={item.product.image} />
                                            </Col>
                                            <Col md={8}>
                                                <Card.Title>{item.product.name}</Card.Title>
                                                <p>Price: ₹ {item.product.price}</p>
                                                <p>Subtotal: ₹ {item.product.price * item.quantity}</p>
                                                <div>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="mx-3">{item.quantity}</span>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="danger"
                                                    className="mt-3"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Row className="mt-4">
                        <Col className="text-end">
                            <h5>Total: ₹ {calculateTotal()}</h5>
                            <Button variant="success" size="lg" onClick={handleCheckout}>
                                Proceed to Checkout
                            </Button>

                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Cart;
