import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Modal } from 'react-bootstrap';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const { currentUser, userData, logout } = useAuth();
    const location = useLocation();

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleAlertClose = () => setShowAlertModal(false);

    // Determina si estamos en la página principal para ocultar el botón de Home
    // La página principal es aquella con la ruta exacta "/"
    const isHomePage = location.pathname === '/';

    // Efecto para verificar si se requiere mostrar el prompt de login
    useEffect(() => {
        if (location.state && location.state.showLoginPrompt && !currentUser) {
            setShowAlertModal(true);
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location.state, currentUser, location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            console.error("Hubo un error al cerrar sesión.");
        }
    };

    const handleLoginClick = () => {
        handleAlertClose();
        handleShow();
    };

    // --- COMPONENTE FLOTANTE DE INICIO ---
    // Renderizado dentro del Header para que siempre esté activo
    const FloatingHomeButton = () => (
        // El botón solo se muestra si NO estamos en la página principal
        !isHomePage && (
            <Link
                to="/"
                style={{
                    position: 'fixed',
                    // Posicionado a la izquierda del carrito, ajusta el valor 'right' si es necesario.
                    // Asumimos que el carrito está en right: '2rem'
                    right: '85px',
                    bottom: '2rem',
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
                    textDecoration: 'none',
                }}
            >
                <i className="bi bi-house-fill" style={{ fontSize: '1.8rem' }}></i>
            </Link>
        )
    );
    // --- FIN COMPONENTE FLOTANTE DE INICIO ---

    return (
        <>
            {/* Navbar (Encabezado principal) */}
            <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    {/* El Brand ya te lleva al ancla #home, pero usaremos Link para asegurar el cambio de ruta */}
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src="/assets/logos/aquasense-logo.png"
                            height="30"
                            className="d-inline-block align-top"
                            alt="AquaSense Logo"
                        />
                        {' '}AquaSense
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            {/* Los enlaces de navegación deben usar el prefijo /# para funcionar si estás en otra ruta, 
                                o ser Links simples si apuntas a otra ruta principal. Los mantendremos como anclas por ahora */}
                            <Nav.Link href="/#product-info">Producto</Nav.Link>
                            <Nav.Link href="/#sensors">Sensores</Nav.Link>
                            <Nav.Link href="/#purchase-flow">Membresías</Nav.Link>
                            <Nav.Link href="/#faq">FAQ</Nav.Link>
                        </Nav>

                        {/* Contenedor para los botones de utilidad y autenticación */}
                        <div className="d-flex align-items-center">
                            <Link
                                to="/monitoreo"
                                className="btn btn-outline-info me-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Monitoreo
                            </Link>

                            {/* Lógica condicional del botón Soy Cliente/Usuario */}
                            {currentUser && userData ? (
                                <NavDropdown
                                    title={`Hola, ${userData.names} ${userData.surnames}`}
                                    id="basic-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item href="/data-dashboard">Mi Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Button variant="outline-primary" onClick={handleShow}>
                                    Soy Cliente
                                </Button>
                            )}
                        </div>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* INYECTAMOS EL BOTÓN FLOTANTE */}
            <FloatingHomeButton />

            {/* El Modal de Login real */}
            <AuthModal show={showModal} handleClose={handleClose} />

            {/* Modal de Alerta de Acceso Requerido */}
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
        </>
    );
};

export default Header;