// src/components/PurchaseFlow/PurchaseFlow.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PurchaseFlow = () => {
    const [purchaseStatus, setPurchaseStatus] = useState({ pro: false, platino: false });
    const [showAlert, setShowAlert] = useState(false);

    // Precios de las membresías (puedes ajustarlos)
    const MEMBERSHIPS = {
        pro: {
            price: 24.99,
            name: 'Membresía Pro',
        },
        platino: {
            price: 49.99,
            name: 'Membresía Platino',
        },
    };

    // Tu Client ID de PayPal Sandbox
    const initialOptions = {
        "client-id": "AZwt7EKhggItrKSKu8Rn05p1NTlO8FlTCnWPmhsTqVN4iJgDAe1FU4pAZlkpfgv8SIWflTsQ5WoD4-NY",
        currency: "MXN",
    };

    const createOrder = (membershipName, price) => (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: price.toFixed(2),
                        currency_code: "MXN",
                    },
                    description: `Renovación de ${membershipName}`,
                },
            ],
        });
    };

    const onApprove = (membershipType) => (data, actions) => {
        return actions.order.capture().then((details) => {
            const payerEmail = details.payer.email_address;
            setPurchaseStatus(prev => ({ ...prev, [membershipType]: true }));
            setShowAlert(true);

            // Aquí es donde obtienes el correo del pagador
            console.log(`Pago aprobado para ${membershipType}. Email del pagador: ${payerEmail}`);
        });
    };

    const onError = (err) => {
        alert('Error en el pago. Intenta nuevamente.');
        console.error(err);
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <Container className="my-5" id="purchase-flow">
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        ¡Pago validado con éxito! Tu membresía se ha activado. Tendrás acceso a todos los beneficios durante 1 mes.
                    </Alert>
                )}

                <h2 className="text-center mb-4">Proceso de Compra y Membresías</h2>
                <p className="lead text-center text-muted mb-5">
                    Desde que compras tu dispositivo hasta que accedes a todas sus funcionalidades.
                </p>

                {/* Sección del Flujo de Compra */}
                <div className="mb-5">
                    <h3 className="text-primary mb-4">El Viaje de tu Producto</h3>
                    <Row className="g-4">
                        <Col md={6} lg={4}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title>1. Compra y Entrega</Card.Title>
                                    <Card.Text>
                                        Adquiere el dispositivo AquaSense y espera la entrega a domicilio.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={4}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title>2. Activación e Instalación</Card.Title>
                                    <Card.Text>
                                        Destapa el producto para encontrar tu **ID de usuario** y contraseña. Instálalo en el área de monitoreo para empezar a sensar datos.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={4}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title>3. Visualización Básica</Card.Title>
                                    <Card.Text>
                                        Con tu ID y contraseña, accede a la plataforma web para ver los datos sensados en **formato plano (solo números)**.
                                        <div className="mt-2 text-center">
                                            <Link to="/login" className="btn btn-outline-primary btn-sm">Iniciar Sesión</Link>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <hr />

                {/* Sección de Membresías */}
                <div className="mb-5">
                    <h3 className="text-primary mb-4">Niveles de Membresía</h3>
                    <Row className="g-4">
                        {/* Membresía Gratuita */}
                        <Col md={6} lg={4}>
                            <Card className="h-100 border-0 shadow-lg">
                                <Card.Header className="bg-success text-white text-center py-3">
                                    <h5>Membresía Gratuita</h5>
                                    <small>(Incluida con la compra)</small>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Text>
                                        Visualiza datos en formato plano (solo números) en la plataforma web.
                                    </Card.Text>
                                    <h6 className="mt-3">Beneficios adicionales:</h6>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <i className="bi bi-envelope me-2"></i>Soporte técnico por correo electrónico.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-arrow-repeat me-2"></i>Recalibración gratuita cada 6 meses.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-book me-2"></i>1 capacitación gratuita para el uso.
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Membresía Pro */}
                        <Col md={6} lg={4}>
                            <Card className="h-100 border-0 shadow-lg">
                                <Card.Header className="bg-info text-white text-center py-3">
                                    <h5>Membresía Pro</h5>
                                    <div className="fs-3">${MEMBERSHIPS.pro.price.toFixed(2)} MXN</div>
                                    <small>por mes</small>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Text>
                                        Obtén una visualización avanzada de tus datos en la página web con gráficos detallados:
                                        <ul className="mt-2 mb-0">
                                            <li>Lineal a través del tiempo</li>
                                            <li>De correlación</li>
                                            <li>Área bajo la curva</li>
                                            <li>De barras</li>
                                        </ul>
                                        <Badge bg="danger" className="mt-2">Alertas en la página si los parámetros están fuera de rango.</Badge>
                                    </Card.Text>
                                    <h6 className="mt-3">Beneficios adicionales:</h6>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <i className="bi bi-person-video me-2"></i>Soporte técnico personal y por videollamada.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-arrow-repeat me-2"></i>Recalibración gratuita cada 3 meses.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-book me-2"></i>3 capacitaciones gratuitas.
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <div className="mt-auto pt-3">
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            createOrder={createOrder(MEMBERSHIPS.pro.name, MEMBERSHIPS.pro.price)}
                                            onApprove={onApprove('pro')}
                                            onError={onError}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Membresía Platino */}
                        <Col md={6} lg={4}>
                            <Card className="h-100 border-0 shadow-lg">
                                <Card.Header className="bg-dark text-white text-center py-3">
                                    <h5>Membresía Platino</h5>
                                    <div className="fs-3">${MEMBERSHIPS.platino.price.toFixed(2)} MXN</div>
                                    <small>por mes</small>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Text>
                                        Lleva tu monitoreo al siguiente nivel con acceso móvil y descarga de datos.
                                        <ul className="mt-2 mb-0">
                                            <li>Visualiza todos los gráficos de la membresía Pro en una **app móvil**.</li>
                                            <li>Descarga datos en formato **PDF o CSV**.</li>
                                        </ul>
                                        <Badge bg="danger" className="mt-2">Alertas vía SMS si los parámetros están fuera de rango.</Badge>
                                    </Card.Text>
                                    <h6 className="mt-3">Beneficios adicionales:</h6>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <i className="bi bi-person-plus me-2"></i>Prioridad de asistencia personal y videollamada.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-arrow-repeat me-2"></i>Recalibración gratuita cada mes.
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <i className="bi bi-book-fill me-2"></i>Capacitaciones gratuitas ilimitadas.
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <div className="mt-auto pt-3">
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            createOrder={createOrder(MEMBERSHIPS.platino.name, MEMBERSHIPS.platino.price)}
                                            onApprove={onApprove('platino')}
                                            onError={onError}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </PayPalScriptProvider>
    );
};

export default PurchaseFlow;