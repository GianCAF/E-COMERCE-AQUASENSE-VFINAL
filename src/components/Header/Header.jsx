import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Modal, Offcanvas, ListGroup } from 'react-bootstrap';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false); // Estado para Offcanvas (Hamburguesa)
    const { currentUser, userData, logout } = useAuth();
    const location = useLocation();

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleAlertClose = () => setShowAlertModal(false);
    const handleOffcanvasClose = () => setShowOffcanvas(false); // Cierra el Offcanvas
    const handleOffcanvasShow = () => setShowOffcanvas(true); // Abre el Offcanvas

    // Función para obtener la inicial del nombre
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

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

    // Definición de todos los enlaces del menú de hamburguesa
    const allLinks = [
        { path: '/', label: 'Página Principal', icon: 'bi-house-fill' },
        { path: '/ayuda', label: 'Ayuda y Recursos', icon: 'bi-question-circle' },
        { path: '/monitoreo', label: 'Dashboard de Monitoreo', icon: 'bi-graph-up' },

        // --- NUEVA SECCIÓN AGREGADA: ANÁLISIS DE MERCADO ---
        { path: '/mercado', label: 'Análisis y Mercado (Hidalgo)', icon: 'bi-bar-chart-line' },

        // --- PERFIL ---
        { path: '/perfil', label: 'Mi Perfil', icon: 'bi-person-circle' },

        // --- SECCIONES OCULTAS/COMPLEMENTARIAS ---
        { path: '/sensores', label: 'Detalles Técnicos y Sensores', icon: 'bi-cpu' },
        { path: '/membresias', label: 'Programas de Membresía', icon: 'bi-gem' },
        { path: '/problemas', label: 'Cómo Resolvemos Problemas', icon: 'bi-tools' },
        { path: '/mapa', label: 'Ubicación y Rutas (Mapa)', icon: 'bi-geo-alt' },
        { path: '/cart', label: 'Mi Carrito de Compras', icon: 'bi-cart-fill' },
    ];

    // Componente para renderizar el Avatar del Usuario Logeado
    const UserAvatar = () => (
        <div
            className="d-flex align-items-center justify-content-center border border-primary text-white bg-primary rounded-circle shadow-sm"
            style={{ width: '40px', height: '40px', fontWeight: 'bold', cursor: 'pointer' }}
            onClick={handleOffcanvasShow} // Al hacer clic en el avatar, abre el menú de hamburguesa
        >
            {getInitials(userData?.names)}
        </div>
    );


    return (
        <>
            {/* Navbar (Encabezado principal) */}
            <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    {/* Botón de Hamburguesa (Menú Offcanvas) */}
                    <Button variant="light" onClick={handleOffcanvasShow} className="me-3 border-0 d-none d-lg-block">
                        <i className="bi bi-list fs-4"></i>
                    </Button>

                    {/* Brand ahora siempre regresa a la raíz */}
                    <Navbar.Brand as={Link} to="/">
                        <img
                            src="/assets/logos/aquasense-logo.png"
                            height="30"
                            className="d-inline-block align-top"
                            alt="AquaSense Logo"
                        />
                        {' '}AquaSense
                    </Navbar.Brand>

                    {/* El toggle de Bootstrap se mantiene para pantallas pequeñas si expand="lg" */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Navegación (se mantiene el nav de escritorio como guía) */}
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/ayuda">Ayuda</Nav.Link>
                            <Nav.Link as={Link} to="/monitoreo">Monitoreo</Nav.Link>
                        </Nav>

                        {/* Botón de Hamburguesa para Móvil (Oculto en Desktop) */}
                        <Button variant="light" onClick={handleOffcanvasShow} className="me-3 border-0 d-lg-none">
                            <i className="bi bi-list fs-4"></i>
                        </Button>

                        {/* Contenedor de Autenticación */}
                        <div className="d-flex align-items-center">
                            {currentUser && userData ? (
                                <UserAvatar /> // Mostramos el avatar
                            ) : (
                                <Button variant="outline-primary" onClick={handleShow}>
                                    Soy Cliente
                                </Button>
                            )}
                        </div>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* --- OFFCANVAS (MENÚ DE HAMBURGUESA) --- */}
            <Offcanvas show={showOffcanvas} onHide={handleOffcanvasClose} placement="start">
                <Offcanvas.Header closeButton className="bg-primary text-white">
                    <Offcanvas.Title>
                        <i className="bi bi-grid-3x3-gap-fill me-2"></i>Navegación Completa
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    {/* Sección de Perfil/Bienvenida */}
                    {currentUser && userData && (
                        <div className="p-4 bg-light border-bottom">
                            <h5 className="mb-0">Hola, {userData.names}!</h5>
                            <p className="text-muted small">ID: {currentUser.uid.substring(0, 8)}...</p>
                        </div>
                    )}

                    <ListGroup variant="flush">
                        {allLinks.map((item) => (
                            <ListGroup.Item
                                key={item.path}
                                action
                                as={Link}
                                to={item.path}
                                onClick={handleOffcanvasClose}
                                className="d-flex align-items-center py-3"
                            >
                                <i className={`bi ${item.icon} me-3 fs-5 text-primary`}></i>
                                {item.label}
                            </ListGroup.Item>
                        ))}

                        {/* Opción de Cerrar Sesión */}
                        {currentUser && (
                            <ListGroup.Item action onClick={handleLogout} className="d-flex align-items-center py-3 text-danger">
                                <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                                Cerrar Sesión
                            </ListGroup.Item>
                        )}
                    </ListGroup>

                    <div className="p-4 border-top">
                        <p className="text-muted small">
                            Versión: {process.env.REACT_APP_VERSION || '1.0.0'}
                        </p>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Modales */}
            <AuthModal show={showModal} handleClose={handleClose} />
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