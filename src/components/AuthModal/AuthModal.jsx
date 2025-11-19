import React, { useState } from 'react';
import { Modal, Form, Button, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ show, handleClose }) => {
    const { login, register, signInWithGoogle } = useAuth();
    const [key, setKey] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (key === 'login') {
                await login(email, password);

                // NOTA: Código de seguimiento (dataLayer.push) eliminado.

                handleClose(); // Cerrar modal al éxito
            } else {
                await register(email, password, name, surname, phone);
                handleClose(); // Cerrar modal al éxito
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message.includes('auth/wrong-password') ? "Contraseña incorrecta." :
                err.message.includes('auth/user-not-found') ? "Usuario no encontrado." :
                    err.message.includes('auth/email-already-in-use') ? "El email ya está registrado." :
                        "Error de autenticación: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Manejo de Login con Google (también incluye el seguimiento)
    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();

            // NOTA: Código de seguimiento (dataLayer.push) eliminado.

            handleClose(); // Cerrar modal al éxito
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError("Error al iniciar sesión con Google.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{key === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="login" title="Iniciar Sesión">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="loginEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="loginPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Acceder'}
                                </Button>
                                <Button variant="outline-danger" onClick={handleGoogleLogin} disabled={loading}>
                                    <i className="bi bi-google me-2"></i> Acceder con Google
                                </Button>
                            </div>
                        </Form>
                    </Tab>
                    <Tab eventKey="register" title="Registrarse">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="registerName">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="registerSurname">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="registerPhone">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="registerEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="registerPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <div className="d-grid">
                                <Button variant="success" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Crear Cuenta'}
                                </Button>
                            </div>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;