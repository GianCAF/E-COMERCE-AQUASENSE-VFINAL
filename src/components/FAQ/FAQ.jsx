// src/components/FAQ/FAQ.jsx
import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const FAQ = () => {
    const faqs = [
        {
            id: '1',
            question: '¿AquaSense es fácil de instalar?',
            answer: 'Sí, AquaSense está diseñado para una instalación sencilla. Incluye un manual detallado y videos tutoriales que te guiarán paso a paso. No se requieren herramientas especiales.',
        },
        {
            id: '2',
            question: '¿Qué tipo de agua puede monitorear AquaSense?',
            answer: 'AquaSense es versátil y puede monitorear una amplia gama de tipos de agua, incluyendo agua potable, agua de acuarios, piscinas, estanques, y soluciones hidropónicas.',
        },
        {
            id: '3',
            question: '¿Necesito una suscripción para usar AquaSense?',
            answer: 'El equipo básico funciona sin suscripción, pero ofrecemos programas de membresía con beneficios adicionales como almacenamiento ilimitado de datos, analíticas avanzadas y soporte prioritario.',
        },
        {
            id: '4',
            question: '¿Cómo recibo las alertas de calidad del agua?',
            answer: 'Las alertas se pueden configurar para ser enviadas a tu correo electrónico o, con la membresía Premium, también a través de mensajes SMS directamente a tu teléfono móvil.',
        },
        {
            id: '5',
            question: '¿Es el equipo resistente al agua?',
            answer: 'El módulo principal de AquaSense tiene una clasificación de resistencia al agua IP67, lo que significa que es resistente a salpicaduras y puede ser sumergido brevemente sin sufrir daños.',
        },
    ];

    return (
        <Container className="my-5" id="faq">
            <h2 className="text-center mb-4">Preguntas Frecuentes</h2>
            <Accordion defaultActiveKey="0">
                {faqs.map((faq, index) => (
                    <Accordion.Item eventKey={faq.id} key={faq.id} className="mb-2 shadow-sm">
                        <Accordion.Header>{faq.question}</Accordion.Header>
                        <Accordion.Body>{faq.answer}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
};

export default FAQ;