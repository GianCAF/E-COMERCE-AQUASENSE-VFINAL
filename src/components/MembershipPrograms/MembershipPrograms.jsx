// src/components/MembershipPrograms/MembershipPrograms.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const MembershipPrograms = () => {
    const memberships = [
        {
            id: 1,
            name: 'Membresía Básica',
            price: 'Desde $19.99/mes',
            description: 'Acceso a monitoreo básico, almacenamiento de datos por 30 días y soporte estándar.',
            benefits: [
                'Monitoreo de pH y Turbidez',
                'Historial de datos por 30 días',
                'Alertas por email',
                'Soporte técnico por chat',
            ],
            link: '/memberships/basic',
        },
        {
            id: 2,
            name: 'Membresía Premium',
            price: 'Desde $49.99/mes',
            description: 'Monitoreo completo, almacenamiento ilimitado, analíticas avanzadas y soporte prioritario.',
            benefits: [
                'Monitoreo de pH, Turbidez y Conductividad',
                'Historial de datos ilimitado',
                'Alertas por SMS y email',
                'Analíticas avanzadas y reportes',
                'Soporte técnico prioritario 24/7',
            ],
            link: '/memberships/premium',
            highlight: true,
        },
        {
            id: 3,
            name: 'Membresía Empresarial',
            price: 'Desde $99.99/mes',
            description: 'Soluciones personalizadas para grandes volúmenes de datos y múltiples equipos.',
            benefits: [
                'Todas las ventajas de Premium',
                'Monitoreo de múltiples equipos',
                'Integración con sistemas externos (API)',
                'Consultoría especializada',
                'Gestor de cuenta dedicado',
            ],
            link: '/memberships/enterprise',
        },
    ];

    return (
        <Container className="my-5" id="memberships">
            <h2 className="text-center mb-4">Programas de Membresía AquaSense</h2>
            <p className="text-center text-muted mb-5">Elige el plan que mejor se adapte a tus necesidades para mantener tu equipo AquaSense siempre funcional y actualizado.</p>
            <Row className="justify-content-center">
                {memberships.map((membership) => (
                    <Col md={4} className="mb-4" key={membership.id}>
                        <Card className={`h-100 shadow-lg ${membership.highlight ? 'border-primary border-3' : ''}`}>
                            <Card.Header className={`text-center py-3 ${membership.highlight ? 'bg-primary text-white' : 'bg-light'}`}>
                                <h4 className="mb-0">{membership.name}</h4>
                            </Card.Header>
                            <Card.Body className="d-flex flex-column">
                                <h3 className="text-center mb-3">{membership.price}</h3>
                                <Card.Text className="text-center text-muted mb-4">{membership.description}</Card.Text>
                                <ul className="list-unstyled flex-grow-1">
                                    {membership.benefits.map((benefit, idx) => (
                                        <li key={idx} className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>{benefit}</li>
                                    ))}
                                </ul>
                                <div className="text-center mt-auto">
                                    <Button variant={membership.highlight ? "primary" : "outline-primary"} href={membership.link} className="w-75">
                                        Ver más
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MembershipPrograms;