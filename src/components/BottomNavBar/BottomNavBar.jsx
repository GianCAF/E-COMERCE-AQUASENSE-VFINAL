import React, { useState } from 'react';
import { Nav, Button, Modal, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Asegúrate de que useLocation esté aquí
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../AuthModal/AuthModal';

const BottomNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Correcto: Llamar al hook aquí
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
        handleAlertClose();
        handleShowAuthModal();
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
        { id: 'monitor', icon: 'bi-graph-up', label: 'Monitoreo', action: handleMonitorClick, path: '/monitoreo' },
        // 5. CARRITO
        { id: 'cart', icon: 'bi-cart-fill', label: 'Carrito', path: '/cart' },
    ];

    // Función para determinar si el ícono debe estar activo
    const isActive = (itemPath) => {
        // Caso especial para Home (ruta exacta)
        if (itemPath === '/') {
            return location.pathname === '/';
        }
        // Para las otras rutas, verifica si la ruta actual comienza con la ruta del ícono
        return location.pathname.startsWith(itemPath);
    }

    return (
        <>
            {/* Barra de Navegación Inferior Fija */}
            {/* d-lg-none oculta la barra en escritorio, es ideal para móvil */}
            <div className="fixed-bottom w-100 bg-white border-top shadow-lg d-lg-none d-flex justify-content-around p-1">
                {navItems.map((item) => {
                    // CORRECCIÓN: Declaramos la variable dentro del scope del map,
                    // y usamos la función isActive que accede al hook location.
                    const currentColor = isActive(item.path) ? '#007bff' : '#6c757d';

                    return (
                        <div key={item.id} className="text-center" style={{ flexGrow: 1 }}>
                            {item.path !== '/monitoreo' ? ( // Usa Link para Home, Ayuda, Técnico, Carrito
                                <Link
                                    to={item.path}
                                    className="d-flex flex-column align-items-center text-decoration-none py-1"
                                    style={{ color: currentColor, transition: 'color 0.2s' }}
                                >
                                    <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                                    <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
                                </Link>
                            ) : (
                                // Para el botón de Monitoreo (usa onClick para la validación)
                                <Button
                                    variant="link"
                                    onClick={item.action}
                                    className="d-flex flex-column align-items-center text-decoration-none py-1"
                                    style={{ color: currentColor, transition: 'color 0.2s', padding: 0 }}
                                >
                                    <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem' }}></i>
                                    <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
                                </Button>
                            )}
                        </div>
                    );
                })}
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