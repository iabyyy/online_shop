import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Addproduct from './pages/Addproduct';
import ProductList from './pages/Listproducts';
import Cart from './pages/Cart';
import OrderedProducts from './pages/orderProducts';

function App() {
    return (
        <BrowserRouter>  {/* Wrap the entire app in BrowserRouter */}
            <Header />  {/* Now Header will be inside the Router context */}

            <Routes>
                <Route path="/:user_id" element={<Home />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/addproduct" element={<Addproduct />} />
                <Route path="/listproducts" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orderproducts" element={<OrderedProducts />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
