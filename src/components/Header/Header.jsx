import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Modal } from 'react-bootstrap';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; // Importamos useLocation

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false); // Nuevo estado para el modal de alerta
    const { currentUser, userData, logout } = useAuth();
    const location = useLocation(); // Hook para obtener el estado de la navegación

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleAlertClose = () => setShowAlertModal(false);

    // Efecto para verificar si se requiere mostrar el prompt de login
    useEffect(() => {
        // Verifica si el estado de navegación contiene la bandera 'showLoginPrompt'
        // y si el usuario realmente NO está logeado.
        if (location.state && location.state.showLoginPrompt && !currentUser) {
            setShowAlertModal(true); // Muestra el modal de alerta

            // Importante: Limpiamos el estado de navegación para que la alerta no reaparezca al recargar
            // Esto evita bucles de alerta al presionar F5.
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

    // Función que se ejecuta al hacer click en "Iniciar Sesión" desde el modal de alerta
    const handleLoginClick = () => {
        handleAlertClose(); // Cierra la alerta
        handleShow(); // Abre el modal de login real (AuthModal)
    };

    return (
        <>
            {/* Navbar (se mantiene igual) */}
            <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    <Navbar.Brand href="#home">
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
                            <Nav.Link href="#product-info">Producto</Nav.Link>
                            <Nav.Link href="#sensors">Sensores</Nav.Link>
                            <Nav.Link href="#purchase-flow">Membresías</Nav.Link>
                            <Nav.Link href="#faq">FAQ</Nav.Link>
                        </Nav>

                        {/* Contenedor para el botón de Monitoreo y la autenticación */}
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

            {/* El Modal de Login real */}
            <AuthModal show={showModal} handleClose={handleClose} />

            {/* NUEVO: Modal de Alerta de Acceso Requerido */}
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