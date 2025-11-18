import React from 'react';
import { Container, Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa la imagen que ya te funciona
import sensorPH from '../../../src/assets/sensor-ph.png';
import sensorConductividad from '../../../src/assets/sensor-conductividad.jpg';
import sensorTurbidez from '../../../src/assets/sensor-turbidez.jpg';

const carouselImages = [
    {
        src: sensorPH,
        alt: 'AquaSense Principal',
        title: 'AquaSense SE1',
        description: 'La solución inteligente para el cuidado del agua.'
    },
    {
        src: sensorConductividad,
        alt: 'Aplicación en Acuario',
        title: 'Perfecto para Acuarios',
        description: 'Mantén un ambiente saludable para tus peces.'
    },
    {
        src:  sensorTurbidez,
        alt: 'Sensores en Acción',
        title: 'Tecnología Avanzada',
        description: 'Sensores de última generación para mediciones precisas.'
    },
    {
        src: sensorConductividad,
        alt: 'Aplicación en Estanques',
        title: 'Ideal para Estanques',
        description: 'Controla la calidad del agua en espacios exteriores.'
    }
];

const HeroProduct = () => {
    return (
        <div className="hero-section position-relative" style={{ height: '60vh', marginBottom: '2rem' }}>

            <Carousel
                fade
                interval={5000}
                controls={true}
                indicators={true}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ zIndex: 0 }}
            >
                {carouselImages.map((image, index) => (
                    <Carousel.Item key={index} style={{ height: '60vh' }}>
                        <img
                            className="d-block w-100 h-100"
                            src={image.src}
                            alt={image.alt}
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center'
                            }}
                        />
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.4)'
                            }}
                        />

                        {/* Texto opcional en cada slide */}
                        <Carousel.Caption className="d-none d-md-block">
                            <h3>{image.title}</h3>
                            <p>{image.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            {/* Contenido Superpuesto Principal */}
            <div
                className="position-absolute top-0 w-100 h-100 d-flex align-items-center justify-content-center text-white text-center"
                style={{ zIndex: 1 }}
            >
                <Container>
                    <h1 className="display-4 fw-bold mb-3">AquaSense</h1>
                    <p className="lead mb-4"></p> 
                    <Button variant="primary" size="lg" href="#product-info" className="px-4 py-2">
                        Conocer más
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default HeroProduct;