// src/components/SensorDetailsSection/SensorDetailsSection.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Image } from 'react-bootstrap';

// Importa la imagen que ya te funciona
import sensorPH from '../../../src/assets/sensor-ph.png';
import sensorConductividad from '../../../src/assets/sensor-conductividad.jpg';
import sensorTurbidez from '../../../src/assets/sensor-turbidez.jpg';

const SensorDetailsSection = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState(null);

    const sensors = [
        {
            id: 1,
            name: 'Sensor de pH',
            image: sensorPH,
            description: 'Mide la acidez o alcalinidad del agua, esencial para la salud de acuarios y cultivos.',
            longDescription: 'Nuestro sensor de pH de alta precisión utiliza tecnología de electrodo de vidrio para proporcionar lecturas exactas y estables. Calibración sencilla y larga vida útil. Rango de medición: 0-14 pH, Precisión: ±0.01 pH.',
        },
        {
            id: 2,
            name: 'Sensor de Turbidez',
            image: sensorTurbidez,
            description: 'Detecta la claridad del agua, indicando la presencia de partículas suspendidas.',
            longDescription: 'El sensor de turbidez AquaSense utiliza un método óptico para determinar la cantidad de partículas suspendidas en el agua. Ideal para identificar contaminación o sedimento. Rango de medición: 0-1000 NTU, Resolución: 1 NTU.',
        },
        {
            id: 3,
            name: 'Sensor de Conductividad',
            image: sensorConductividad,
            description: 'Mide la capacidad del agua para conducir electricidad, relacionado con la concentración de sales.',
            longDescription: 'Nuestro sensor de conductividad mide los sólidos disueltos totales (TDS) y la conductividad eléctrica del agua. Crucial para monitorear la calidad del agua potable o para procesos industriales. Rango de medición: 0-2000 µS/cm, Precisión: ±2% F.S.',
        },
    ];

    const handleShowModal = (sensor) => {
        setSelectedSensor(sensor);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container className="my-5" id="sensors">
            <h2 className="text-center mb-4">Sensores de Alta Precisión AquaSense</h2>
            <Row className="justify-content-center">
                {sensors.map((sensor) => (
                    <Col md={4} className="mb-4" key={sensor.id}>
                        <Card className="h-100 shadow-sm text-center">
                            <Card.Img variant="top" src={sensor.image} style={{ height: '200px', objectFit: 'contain', padding: '15px' }} />
                            <Card.Body>
                                <Card.Title>{sensor.name}</Card.Title>
                                <Card.Text>{sensor.description}</Card.Text>
                                <Button variant="outline-primary" onClick={() => handleShowModal(sensor)}>
                                    Ver más detalles
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedSensor && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedSensor.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <Image src={selectedSensor.image} fluid className="mb-3" style={{ maxHeight: '250px', objectFit: 'contain' }} />
                        <p>{selectedSensor.longDescription}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default SensorDetailsSection;