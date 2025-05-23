import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal, Form } from 'react-bootstrap';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: '',
        price: '',
        stock: '',
        image: null,
    });

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products/');
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    // Handle Update form field change
    const handleUpdateChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setUpdatedData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setUpdatedData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle Open Modal for Update
    const handleEdit = (product) => {
        setCurrentProduct(product);
        setUpdatedData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: null,
        });
        setShowModal(true);
    };

    // Handle Update Product
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
    
        // Only append fields if necessary
        Object.entries(updatedData).forEach(([key, value]) => {
            if (key === 'image') {
                if (value) {
                    data.append('image', value); // Only append if a new image is selected
                }
            } else {
                data.append(key, value);
            }
        });
    
        try {
            await axios.patch(`http://localhost:8000/api/products/${currentProduct.id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            
    
            setShowModal(false);
            setUpdatedData({
                name: '',
                price: '',
                stock: '',
                image: null,
            });
    
            // Refresh product list
            const response = await axios.get('http://localhost:8000/api/products/');
            setProducts(response.data);
        } catch (err) {
            console.error(err);
        }
    };
    

    // Handle Delete Product
    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${productId}/`);

            // Remove deleted product from the state
            setProducts(products.filter((product) => product.id !== productId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container id="list-products">
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>
                                        {product.image && <img src={product.image} alt={product.name} width="50" />}
                                    </td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEdit(product)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDeleteProduct(product.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Update Product Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateProduct}>
                        <Form.Group controlId="formName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedData.name}
                                onChange={handleUpdateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={updatedData.price}
                                onChange={handleUpdateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={updatedData.stock}
                                onChange={handleUpdateChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            {currentProduct && currentProduct.image && !updatedData.image && (
                                <div>
                                    <img src={currentProduct.image} alt="Current" width="50" />
                                    <p>Current Image</p>
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleUpdateChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default ProductList;
