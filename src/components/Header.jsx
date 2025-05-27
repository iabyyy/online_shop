import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaCartArrowDown } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Header.css';

function Header() {
  // Get user info from localStorage safely
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { id } = useParams();
//   const cartItem = localStorage.getItem(`cartItems${id}`);
//   console.log(cartItem);





  
  
  

  
  const navigate = useNavigate();

  // Ensure user is defined before using its properties
  const currentUser = user ? user.user_id : null;
  console.log(currentUser);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'yellow' }}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left navigation links */}
          <Nav className="me-auto">
            {user && currentUser && (
              <Nav.Link as={Link} to={`/${user.user_id}`} className='headernavlink'>
                HOME
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/register" className='headernavlink'>
              REGISTER
            </Nav.Link>
            <Nav.Link as={Link} to="/addproduct" className='headernavlink'>
              ADD PRODUCT
            </Nav.Link>
            <Nav.Link as={Link} to="/listproducts" className='headernavlink'>
              LIST PRODUCT
            </Nav.Link>
            <Nav.Link as={Link} to="/orderproducts" className='headernavlink'>
              ORDERED PRODUCT
            </Nav.Link>
          </Nav>

          {/* Right navigation links */}
          <Nav>
            {isAuthenticated ? (
              <Nav.Link onClick={handleLogout} className='headernavlink' style={{ cursor: 'pointer' }}>
                LOGOUT
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className='headernavlink'>
                LOGIN
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/cart" className="headernavlink position-relative">
              <FaCartArrowDown />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
