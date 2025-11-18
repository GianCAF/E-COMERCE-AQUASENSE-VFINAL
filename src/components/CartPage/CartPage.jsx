// src/components/CartPage/CartPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from '../../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();

    // Calcula el precio total de todos los productos en el carrito
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // PayPal Sandbox client ID de tu archivo HTML
    const initialOptions = {
        "client-id": "AZwt7EKhggItrKSKu8Rn05p1NTlO8FlTCnWPmhsTqVN4iJgDAe1FU4pAZlkpfgv8SIWflTsQ5WoD4-NY",
        currency: "MXN",
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: subtotal.toFixed(2),
                        currency_code: "MXN",
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            alert("Transacción completada por " + details.payer.name.given_name);
            clearCart();
        });
    };

    const onError = (err) => {
        alert('Error en pago. Intenta nuevamente');
        console.error(err);
    };

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <h2 className="mb-4">Tu Carrito de Compras</h2>
                    {cartItems.length === 0 ? (
                        <div className="alert alert-info">
                            Tu carrito está vacío. <a href="/">Ver productos</a>.
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row className="align-items-center">
                                        <Col xs={2}>
                                            <img
                                                src="/assets/product-images/aquasense-main.jpg"
                                                alt={item.name}
                                                className="img-fluid rounded"
                                            />
                                        </Col>
                                        <Col xs={5}>
                                            <h5>{item.name}</h5>
                                            <p className="text-muted small">
                                                Precio: ${item.price.toFixed(2)}
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <p>Cant: {item.quantity}</p>
                                        </Col>
                                        <Col xs={2}>
                                            <h6 className="text-primary">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </h6>
                                        </Col>
                                        <Col xs={1}>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Resumen de Compra</Card.Title>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold fs-5 mt-3">
                                <span>Total:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            {cartItems.length > 0 && (
                                <div className="mt-4">
                                    <PayPalScriptProvider options={initialOptions}>
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            )}
                            {cartItems.length === 0 && (
                                <Button variant="success" size="lg" className="w-100 mt-4" disabled>
                                    Comprar ahora
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