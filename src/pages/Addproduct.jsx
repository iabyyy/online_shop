import React, { useState } from 'react';
import axios from 'axios';
import './product.css';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post('http://localhost:8000/api/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Product added:', response.data);

      // Optional: Add to localStorage (if needed for caching)
      const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
      existingProducts.push(response.data); // Append new product
      localStorage.setItem('products', JSON.stringify(existingProducts));

      navigate('/listproducts');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
      <input name="price" type="number" step="0.01" placeholder="Price" onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" onChange={handleChange} required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct;
