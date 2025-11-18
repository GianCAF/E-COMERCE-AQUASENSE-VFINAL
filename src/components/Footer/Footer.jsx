// src/components/Footer/Footer.jsx
import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4">
            <Container>
                <Row>
                    <Col md={4} className="mb-3 mb-md-0">
                        <h5>AquaSense</h5>
                        <p className="text-muted">Monitoreo inteligente para la calidad del agua.</p>
                        <div className="d-flex">
                            <a href="#" className="text-white me-3"><i className="bi bi-facebook fs-4"></i></a>
                            <a href="#" className="text-white me-3"><i className="bi bi-twitter fs-4"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                        </div>
                    </Col>
                    <Col md={2} className="mb-3 mb-md-0">
                        <h5>Ayuda</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#faq" className="text-white-50">Centro de Ayuda</Nav.Link>
                            <Nav.Link href="#product-info" className="text-white-50">Envíos y Entregas</Nav.Link>
                            <Nav.Link href="#" className="text-white-50">Devoluciones</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={3} className="mb-3 mb-md-0">
                        <h5>Legal</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#" className="text-white-50">Términos y Condiciones</Nav.Link>
                            <Nav.Link href="#" className="text-white-50">Política de Privacidad</Nav.Link>
                            <Nav.Link href="#product-info" className="text-white-50">Métodos de pago</Nav.Link>
                        </Nav>
                    </Col>
                    {/**  <Col md={3}>
                        <h5>Contacto</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#" className="text-white-50">Contáctanos</Nav.Link>
                            <Nav.Link href="#" className="text-white-50">Trabaja con nosotros</Nav.Link>
                        </Nav>
                    </Col> */}
                </Row>
                <Row className="mt-4 border-top border-secondary pt-3">
                    <Col className="text-center text-muted small">
                        &copy; {new Date().getFullYear()} AquaSense. Todos los derechos reservados.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;