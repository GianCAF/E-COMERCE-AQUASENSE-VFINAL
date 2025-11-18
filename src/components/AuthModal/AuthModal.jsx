// src/components/AuthModal/AuthModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ show, handleClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();

    // Estados de los formularios
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ email: '', password: '', names: '', surnames: '', address: '' });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(loginData.email, loginData.password);
            handleClose(); // Cerrar modal al éxito
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tu correo y contraseña.');
            console.error(err);
        }
        setLoading(false);
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(signupData.email, signupData.password, signupData.names, signupData.surnames, signupData.address);
            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            setActiveTab('login'); // Cambiar a la pestaña de login
            setSignupData({ email: '', password: '', names: '', surnames: '', address: '' });
        } catch (err) {
            setError('Error al crear cuenta. El correo ya puede estar en uso o la contraseña es muy débil (mínimo 6 caracteres).');
            console.error(err);
        }
        setLoading(false);
    };

    // --- Renderización de Formularios ---

    const renderLoginForm = () => (
        <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Validando...' : 'Iniciar Sesión'}
            </Button>
        </Form>
    );

    const renderSignupForm = () => (
        <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Contraseña (mínimo 6 caracteres)</Form.Label>
                <Form.Control type="password" name="password" value={signupData.password} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nombres</Form.Label>
                <Form.Control type="text" name="names" value={signupData.names} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control type="text" name="surnames" value={signupData.surnames} onChange={handleSignupChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Dirección Completa</Form.Label>
                <Form.Control type="text" name="address" value={signupData.address} onChange={handleSignupChange} required />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
        </Form>
    );


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Acceso de Clientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="tabs" className="mb-4">
                        <Nav.Item>
                            <Nav.Link eventKey="login">Iniciar Sesión</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="signup">Crear Cuenta</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="login">
                            {renderLoginForm()}
                        </Tab.Pane>
                        <Tab.Pane eventKey="signup">
                            {renderSignupForm()}
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>

            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;