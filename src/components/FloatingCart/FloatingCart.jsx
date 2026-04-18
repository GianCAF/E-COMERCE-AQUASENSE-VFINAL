import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const FloatingCart = () => {
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Estilos responsivos usando una constante para limpiar el código
    const cartStyle = {
        position: 'fixed',
        zIndex: 10000,
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
    };

    return (
        <>
            <style>
                {`
                    /* Estilo para MÓVIL (Pantallas pequeñas) */
                    .floating-cart-btn {
                        bottom: 85px;   /* Se eleva para no tapar la BottomNavBar */
                        right: 20px;
                        width: 50px;    /* Más pequeño en celular */
                        height: 50px;
                    }
                    .floating-cart-icon {
                        font-size: 1.3rem;
                    }

                    /* Estilo para PC (Pantallas grandes) */
                    @media (min-width: 768px) {
                        .floating-cart-btn {
                            bottom: 30px; /* Vuelve a su posición normal */
                            right: 30px;
                            width: 65px;  /* Tamaño normal en PC */
                            height: 65px;
                        }
                        .floating-cart-icon {
                            font-size: 1.8rem;
                        }
                    }
                `}
            </style>

            <Link
                to="/cart"
                className="floating-cart-btn"
                style={cartStyle}
            >
                <div className="position-relative">
                    <i className={`bi bi-cart3 floating-cart-icon`}></i>

                    {totalItems > 0 && (
                        <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{
                                fontSize: '0.7rem',
                                padding: '0.35em 0.5em',
                                border: '1px solid white'
                            }}
                        >
                            {totalItems}
                        </span>
                    )}
                </div>
            </Link>
        </>
    );
};

export default FloatingCart;