// src/components/CartPage/CartPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from '../../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    // --- LÓGICA DE CÁLCULOS FISCALES (MÉXICO) ---
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const iva = subtotal * 0.16; // Cálculo del 16% de IVA
    const totalFinal = subtotal + iva;

    const initialOptions = {
        "client-id": "AZwt7EKhggItrKSKu8Rn05p1NTlO8FlTCnWPmhsTqVN4iJgDAe1FU4pAZlkpfgv8SIWflTsQ5WoD4-NY",
        currency: "MXN",
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        // Enviamos el total final (subtotal + iva) a PayPal
                        value: totalFinal.toFixed(2),
                        currency_code: "MXN",
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            alert("¡Pago exitoso! Transacción completada por " + details.payer.name.given_name);
            clearCart();
        });
    };

    const onError = (err) => {
        alert('Hubo un error con el pago de PayPal. Por favor, intenta de nuevo.');
        console.error(err);
    };

    return (
        <Container className="my-5" style={{ minHeight: '70vh' }}>
            <Row>
                <Col md={8}>
                    <h2 className="mb-4 fw-bold">Tu Carrito de Compras</h2>
                    {cartItems.length === 0 ? (
                        <div className="alert alert-info shadow-sm">
                            Tu carrito está vacío actualmente. <a href="/" className="fw-bold text-decoration-none">Explorar productos</a>.
                        </div>
                    ) : (
                        <ListGroup variant="flush" className="shadow-sm rounded-3 overflow-hidden">
                            {cartItems.map((item, index) => (
                                <ListGroup.Item key={index} className="py-3">
                                    <Row className="align-items-center">
                                        <Col xs={3} md={2}>
                                            <img
                                                src="/assets/product-images/aquasense-main.jpg"
                                                alt={item.name}
                                                className="img-fluid rounded border"
                                            />
                                        </Col>
                                        <Col xs={6} md={5}>
                                            <h5 className="mb-1">{item.name}</h5>
                                            <p className="text-muted small mb-0">
                                                Precio unitario: ${item.price.toLocaleString()} MXN
                                            </p>
                                        </Col>
                                        <Col xs={3} md={2} className="text-center">
                                            <span className="badge bg-light text-dark border">Cant: {item.quantity}</span>
                                        </Col>
                                        <Col xs={9} md={2} className="text-end text-md-center mt-2 mt-md-0">
                                            <h6 className="text-primary fw-bold mb-0">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </h6>
                                        </Col>
                                        <Col xs={3} md={1} className="text-end mt-2 mt-md-0">
                                            <Button
                                                variant="outline-danger border-0"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>

                <Col md={4} className="mt-4 mt-md-0">
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4">
                            <Card.Title className="fw-bold mb-4">Resumen de Compra</Card.Title>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal:</span>
                                <span className="fw-medium">${subtotal.toLocaleString()} MXN</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Envío:</span>
                                <span className="text-success fw-bold">Gratis</span>
                            </div>

                            {/* --- DESGLOSE DE IVA 16% --- */}
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">IVA (16%):</span>
                                <span className="fw-medium">${iva.toLocaleString()} MXN</span>
                            </div>

                            <hr className="my-3" />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold fs-5">Total Final:</span>
                                <span className="fw-bold fs-4 text-primary">
                                    ${totalFinal.toLocaleString()} <small style={{ fontSize: '0.6em' }}>MXN</small>
                                </span>
                            </div>

                            {cartItems.length > 0 ? (
                                <div className="mt-4">
                                    <PayPalScriptProvider options={initialOptions}>
                                        <PayPalButtons
                                            style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </PayPalScriptProvider>
                                    <p className="text-center text-muted small mt-3">
                                        <i className="bi bi-shield-lock-fill me-1"></i>
                                        Transacción segura con PayPal
                                    </p>
                                </div>
                            ) : (
                                <Button variant="secondary" size="lg" className="w-100 mt-2" disabled>
                                    Carrito vacío
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;