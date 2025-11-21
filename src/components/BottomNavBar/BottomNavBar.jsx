import React, { useState } from 'react';
import { Nav, Button, Modal, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../AuthModal/AuthModal'; // Importamos el modal de autenticación

const BottomNavBar = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const handleCloseAuthModal = () => setShowAuthModal(false);
    const handleShowAuthModal = () => setShowAuthModal(true);
    const handleAlertClose = () => setShowAlertModal(false);

    // Lógica para el botón de Monitoreo (AuthGuard)
    const handleMonitorClick = () => {
        if (currentUser) {
            navigate('/monitoreo');
        } else {
            setShowAlertModal(true);
        }
    };

    const handleLoginClick = () => {
        handleAlertClose(); // Cierra la alerta
        handleShowAuthModal(); // Abre el modal de login
    };

    // Array de botones para generar la barra
    const navItems = [
        // 1. HOME
        { id: 'home', icon: 'bi-house-fill', label: 'Inicio', path: '/' },
        // 2. TIPS/AYUDA (Pregunta)
        { id: 'tips', icon: 'bi-question-circle-fill', label: 'Ayuda', path: '/ayuda' },
        // 3. TÉCNICO/SOLUCIÓN (Herramienta)
        { id: 'tech', icon: 'bi-gear-fill', label: 'Técnico', path: '/tecnico' },
        // 4. MONITOREO (Usa función para validación de login)
        { id: 'monitor', icon: 'bi-graph-up', label: 'Monitoreo', action: handleMonitorClick },
        // 5. CARRITO
        { id: 'cart', icon: 'bi-cart-fill', label: 'Carrito', path: '/cart' },
    ];

    return (
        <>
            {/* Barra de Navegación Inferior Fija */}
            <div className="fixed-bottom w-100 bg-white border-top shadow-lg d-lg-none d-flex justify-content-around p-1">
                {navItems.map((item) => (
                    <div key={item.id} className="text-center" style={{ flexGrow: 1 }}>
                        {item.path ? (
                            <Link
                                to={item.path}
                                className="d-flex flex-column align-items-center text-decoration-none py-1"
                                style={{ color: location.pathname === item.path ? '#007bff' : '#6c757d', transition: 'color 0.2s' }}
                            >
                                <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                                <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
                            </Link>
                        ) : (
                            // Para el botón de Monitoreo (usa onClick)
                            <Button
                                variant="link"
                                onClick={item.action}
                                className="d-flex flex-column align-items-center text-decoration-none py-1"
                                style={{ color: '#6c757d', transition: 'color 0.2s', padding: 0 }}
                            >
                                <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                                <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de Alerta de Acceso (se mantiene la lógica) */}
            <Modal show={showAlertModal} onHide={handleAlertClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Acceso Restringido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="lead">Debes iniciar sesión para acceder al Dashboard de Monitoreo en Tiempo Real.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAlertClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleLoginClick}>
                        Iniciar Sesión
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Login (si se activa) */}
            <AuthModal show={showAuthModal} handleClose={handleCloseAuthModal} />
        </>
    );
};

export default BottomNavBar;