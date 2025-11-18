// src/components/ProblemSolver/ProblemSolver.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProblemSolver = () => {
    const solutions = [
        {
            title: 'Ahorro en Laboratorios',
            description: 'Evita costos recurrentes y el tiempo de espera de análisis de laboratorio con mediciones en casa.',
            icon: 'bi-cash-coin',
        },
        {
            title: 'Monitoreo en Tiempo Real',
            description: 'Obtén datos instantáneos y continuos de la calidad de tu agua, 24/7.',
            icon: 'bi-graph-up',
        },
        {
            title: 'Visualización y Gráficos',
            description: 'Accede a gráficos claros y fáciles de entender de tus datos históricos y actuales.',
            icon: 'bi-bar-chart-line',
        },
        {
            title: 'Almacenamiento de Datos Históricos',
            description: 'Guarda tus datos de forma segura en la nube para análisis a largo plazo y seguimiento de tendencias.',
            icon: 'bi-cloud-fill',
        },
    ];

    return (
        <div className="bg-info text-white py-5" id="problem-solver">
            <Container>
                <h2 className="text-center mb-5">¿Cómo AquaSense Resuelve tus Problemas?</h2>
                <Row className="justify-content-center">
                    {solutions.map((solution, index) => (
                        <Col md={6} lg={3} className="mb-4" key={index}>
                            <Card className="h-100 text-center bg-white text-dark shadow-sm border-0 p-3">
                                <Card.Body>
                                    <i className={`bi ${solution.icon} display-4 text-primary mb-3`}></i>
                                    <Card.Title as="h5" className="mb-3">{solution.title}</Card.Title>
                                    <Card.Text>{solution.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default ProblemSolver;