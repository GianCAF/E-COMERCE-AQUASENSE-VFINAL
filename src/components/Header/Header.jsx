import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Modal, Button, Form, Navbar, Nav } from 'react-bootstrap';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

function Header({ user, onLoginSuccess }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Hook para saber en qué ruta estamos

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
            setShowLoginModal(false);
            // La redirección a /crud ocurre automáticamente en App.js
        } catch (error) {
            setLoginError('Error de autenticación. Verifica tu correo y contraseña.');
            console.error("Error de login:", error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            onLoginSuccess();
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

    // Determina si estamos en la página principal ( / )
    const isHomePage = location.pathname === '/';
    // Determina si estamos en /crud o subrutas de /crud
    const isCrudPage = location.pathname.startsWith('/crud');


    return (
        <Navbar expand="lg" className="mb-4 bg-vino">
            <div className="container-fluid">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    {/* Rutas corregidas para Vercel (deben estar en /public/) */}
                    <img src="/logo_itsoeh.jpg" width="90" height="30" className="d-inline-block align-top me-2" alt="Logo ITSOEH" />
                    <img src="/logo_gestion.jpg" width="60" height="60" className="d-inline-block align-top me-2" alt="Logo Gestión" />
                    Gestión Empresarial
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link href="https://itsoeh.edu.mx/front/" target="_blank">Página de la Escuela</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto d-flex align-items-center">

                        {/* BOTÓN DE REGRESO A INICIO (Visible si está logueado y no en Home) */}
                        {user && !isHomePage && (
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/')}
                                className="me-3"
                            >
                                🏠 Inicio
                            </Button>
                        )}

                        {user ? (
                            <>
                                <Navbar.Text className="me-2">Bienvenido, {user.email}</Navbar.Text>
                                <Button variant="danger" onClick={handleLogout}>Cerrar Sesión</Button>
                                {/* Botón Ir al CRUD solo es visible si no estamos ya en la página CRUD */}
                                {!isCrudPage && (
                                    <Button variant="success" onClick={() => navigate('/crud')} className="ms-2">Ir al CRUD</Button>
                                )}
                            </>
                        ) : (
                            <Button variant="outline-primary" onClick={() => setShowLoginModal(true)}>
                                Acceder al CRUD
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </div>

            {/* Modal de Login */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Iniciar Sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {loginError && <p className="text-danger">{loginError}</p>}
                        <Button variant="primary" type="submit">
                            Iniciar Sesión
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Navbar>
    );
}

export default Header;