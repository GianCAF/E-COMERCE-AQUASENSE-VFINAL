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


    return (
        <>
            {/* Navbar (Encabezado principal) */}
            <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
                <Container>
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
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Navegación superior con enlaces a las nuevas secciones */}
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/ayuda">Ayuda</Nav.Link>
                            <Nav.Link as={Link} to="/tecnico">Detalles Técnicos</Nav.Link>
                            <Nav.Link as={Link} to="/monitoreo">Monitoreo</Nav.Link>
                        </Nav>

                        {/* Contenedor para los botones de utilidad y autenticación */}
                        <div className="d-flex align-items-center">
                            {/* EL BOTÓN DE MONITOREO SUPERIOR FUE ELIMINADO */}

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

            {/* NOTA: EL MODAL DE ALERTA DE ACCESO FUE MOVIDO AL BottomNavBar.jsx */}
        </>
    );
};

export default Header;