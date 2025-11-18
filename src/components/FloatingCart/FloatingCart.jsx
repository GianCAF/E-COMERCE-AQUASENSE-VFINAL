// src/components/FloatingCart/FloatingCart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCart = () => {
    const { cartItems } = useCart();
    // Calcula el número total de productos
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1050,
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
            }}
        >
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
                <i className="bi bi-cart3" style={{ fontSize: '1.8rem' }}></i>
                {totalItems > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.75rem',
                        }}
                    >
                        {totalItems}
                    </span>
                )}
            </Link>
        </div>
    );
};

export default FloatingCart;