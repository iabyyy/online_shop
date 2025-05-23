import { Col, Row, Container, Card, Button } from 'react-bootstrap';
import './Home.css';
import Carousel from 'react-bootstrap/Carousel';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const user = JSON.parse(localStorage.getItem('user'))
    const currentuser = user.user_id || null;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products/');
                setProducts(response.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            const quantity = 1; // Default quantity is 1
            const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user from localStorage
            
            if (!user || !user.user_id) {
                console.error('User not found or user ID is missing');
                return;
            }
            
            const userId = user.user_id;
            console.log('User ID:', userId);
            
            // 1. Get the existing cart items for the user
            const cartResponse = await axios.get(`http://localhost:8000/AddToCartView/?user=${userId}`);
            let cartItems = cartResponse.data;
            console.log('Current Cart Items:', cartItems);
            
            // 2. Check if the product already exists in the cart
            const existingCartItem = cartItems.find(item => item.product === product.id);
    
            if (existingCartItem) {
                // 3. If the product exists in the cart, update the quantity
                const updatedQuantity = existingCartItem.quantity + 1;
    
                // Update the cart item with the new quantity
                const updateResponse = await axios.put(`http://localhost:8000/AddToCartView/${existingCartItem.id}/`, {
                    user_id: userId,
                    product_id: product.id,
                    quantity: updatedQuantity,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                });
    
                // Update the local cartItems array with the new quantity
                cartItems = cartItems.map(item =>
                    item.product === product.id ? { ...item, quantity: updatedQuantity } : item
                );
            } else {
                // 4. If the product does not exist in the cart, create a new cart item
                const addResponse = await axios.post('http://localhost:8000/AddToCartView/', {
                    user_id: userId,
                    product_id: product.id,
                    quantity,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                });
    
                // Add the new item to the local cartItems array
                cartItems = [...cartItems, addResponse.data];
            }
    
            // Update localStorage with the latest cart items
            localStorage.setItem(`cartItems${userId}`, JSON.stringify(cartItems));
    
        } catch (error) {
            console.error('Error adding/updating item in cart:', error);
        }
    };
    
    

    // const handleAddToCart = async (product) => {
    //     try {
    //         const quantity = 1;
    //         const user = JSON.parse(localStorage.getItem('user'));
    
    //         if (!user || !user.user_id) {
    //             console.error('User not found or user ID is missing');
    //             return;
    //         }
    
    //         const userId = user.user_id;
    
    //         // Just send a POST request to add to cart
    //         const addResponse = await axios.post('http://localhost:8000/AddToCartView/', {
    //             user_id: userId,
    //             product_id: product.id,
    //             quantity,
    //         });
    
    //     } catch (error) {
    //         console.error('Error adding item to cart:', error.response?.data || error.message);
    //     }
    // };

    
    
    
    
    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Row>
                <Col>
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://www.mydesignation.com/cdn/shop/files/01-Desktop-dragonVkoi_copy.jpg?v=1745388131&width=1500"
                                alt="Banner 1"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://www.mydesignation.com/cdn/shop/files/01-desktop_banner-redleopard-couplecombo.jpg?v=1741785879"
                                alt="Banner 2"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://www.mydesignation.com/cdn/shop/files/01-desktop-overszied-inside-banner_20793a24-bcad-407d-8514-c60621589655.jpg?v=1736926147"
                                alt="Banner 3"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>

            <Container className='p-3'>
                <Row>
                    {products.map((product) => (
                        <Col md={6} lg={4} xl={3} key={product.id}>
                            <Card className="bg-light mb-4">
                                <div className="p-3">
                                    <Card.Img variant="top" src={product.image} />
                                </div>
                                <Card.Body>
                                    <Card.Title className="fw-bold text-uppercase">{product.name}</Card.Title>
                                    <p className="fw-bold text-uppercase">₹ {product.price}</p>
                                    <p className="text-muted">{product.category}</p>
                                    <Button variant="primary" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default Home;
