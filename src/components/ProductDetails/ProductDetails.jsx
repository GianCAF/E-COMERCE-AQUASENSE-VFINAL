import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Image, Badge, Collapse, Spinner } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
// Importa la imagen que ya te funciona
import imagen1 from '../../imgcar/imagen1.jpg'; //producto
import imagen2 from '../../imgcar/imag2.jpg';
import imagen3 from '../../imgcar/img3.jpg';
import imagen4 from '../../imgcar/img4.jpg';
import visa from '../../imgcar/visa.png';
import master from '../../imgcar/mastercad.png';

// Importamos el componente de Reseñas que carga datos de Firebase
import ReviewsSection from '../ReviewsSection';
// NOTA: Asegúrate de que la ruta de importación para ReviewsSection sea correcta.


const ProductDetails = () => {
    const { addToCart } = useCart();

    const productData = {
        // Es crucial que el producto tenga un 'id' único
        id: 'aquasense-monitor-123',
        name: 'AquaSense - Monitor de Calidad de Agua Inteligente',
        price: 22390,
        discount: '12 meses sin intereses',
        deliveryTime: 'Llega en una o dos semanas',
        stock: 25,
        seller: 'AquaSense Oficial',
        sellerLink: '#',
        rating: 4.5, // Mantener para mostrar estrellas
        reviewsCount: 37, // Mantener para mostrar conteo
        description: `El AquaSense es la solución definitiva para el monitoreo de la calidad del agua. Con un diseño robusto y sensores de alta precisión (pH, Turbidez, Conductividad), te permite tener control total sobre tu fuente de agua en tiempo real.`,
        longDescription: `El AquaSense no solo mide, sino que predice. Utiliza algoritmos de IA para analizar las tendencias de los datos y alertarte antes de que un problema de calidad del agua se vuelva crítico. Incluye una batería de iones de litio de 3000mAh que dura hasta 6 meses con una sola carga. Ideal para monitoreo remoto en estanques, acuarios industriales o pozos profundos.`,
        features: [
            'Monitoreo en tiempo real de pH, Turbidez y Conductividad',
            'Diseño compacto y resistente al agua (IP67)',
            'Conectividad Wi-Fi para acceso remoto a datos',
            'Alertas personalizables en tu smartphone',
            'Batería de larga duración',
            'Fácil instalación y mantenimiento',
        ],
        specs: [
            { label: 'Sensores incluidos', value: 'pH, Turbidez, Conductividad' },
            { label: 'Conectividad', value: 'Wi-Fi 2.4GHz 4G' },
            { label: 'Material', value: 'Plástico ABS de alta resistencia' },
            { label: 'Batería', value: 'Ion-Litio 3000mAh' },
            { label: 'Dimensiones', value: '15cm x 10cm x 5cm' },
        ],
        // Eliminamos el array 'reviews' estático
    };

    const [mainImage, setMainImage] = useState(imagen1);
    const [openSpecs, setOpenSpecs] = useState(false);
    const [openDescription, setOpenDescription] = useState(false);
    const productImages = [
        { src: imagen1 },
        { src: imagen2 },
        { src: imagen3 },
        { src: imagen4 },
    ];

    const mediosImage = [
        { src: visa },
        { src: master }
    ];

    const handleThumbnailClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    const handleAddToCart = () => {
        addToCart(productData);
        console.log(`${productData.name} ha sido agregado al carrito.`);
    };

    return (
        <Container className="my-5" id="product-info">
            <Row>
                {/* Columna de Imágenes (Se mantiene igual) */}
                <Col md={5}>
                    <div
                        className="position-relative mb-3 d-flex justify-content-center align-items-center border shadow-sm rounded-4"
                        style={{ height: '400px', overflow: 'hidden' }}
                    >
                        <Image
                            src={mainImage}
                            alt={productData.name}
                            style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
                        />
                    </div>

                    {/* Miniaturas */}
                    <div className="d-flex overflow-auto" style={{ maxWidth: '100%' }}>
                        {productImages.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-wrapper me-2 mb-2 border rounded-3 ${mainImage === img.src ? 'border-primary border-3' : ''}`}
                                onClick={() => handleThumbnailClick(img.src)}
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px'
                                }}
                            >
                                <Image
                                    src={img.src}
                                    thumbnail
                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                />
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Columna de Información Central del Producto */}
                <Col md={4}>
                    <h1 className="mb-2">{productData.name}</h1>
                    <div className="d-flex align-items-center mb-3">
                        <div className="text-warning me-2">
                            {'★'.repeat(Math.floor(productData.rating))}
                            {'☆'.repeat(5 - Math.floor(productData.rating))}
                        </div>
                        <span>({productData.reviewsCount} calificaciones)</span>
                    </div>

                    <h2 className="text-primary my-3 fw-bold">${productData.price.toFixed(2)} MXN</h2>
                    <p className="text-success">{productData.discount}</p>

                    <h5 className="mt-4">Características principales:</h5>
                    <ListGroup variant="flush">
                        {productData.features.map((feature, index) => (
                            <ListGroup.Item key={index}>• {feature}</ListGroup.Item>
                        ))}
                    </ListGroup>
                    <hr />
                </Col>

                {/* Columna de Opciones de Compra (Se mantiene igual) */}
                <Col md={3}>
                    <Card className="shadow-sm rounded-4">
                        <Card.Body>
                            <Card.Title className="text-success">
                                {productData.deliveryTime}
                            </Card.Title>
                            <Card.Text>
                                <Badge bg={productData.stock > 0 ? "success" : "danger"} className="me-2">
                                    {productData.stock > 0 ? 'En Stock' : 'Agotado'}
                                </Badge>
                                {productData.stock > 0 && `(${productData.stock} disponibles)`}
                            </Card.Text>

                            <Button variant="primary" size="lg" className="w-100 mb-2 rounded-3" disabled={productData.stock === 0}>
                                Comprar ahora
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="lg"
                                className="w-100 rounded-3"
                                onClick={handleAddToCart}
                                disabled={productData.stock === 0}
                            >
                                Agregar al carrito
                            </Button>

                            <div className="mt-3 text-muted small">
                                Vendido por <a href={productData.sellerLink}>{productData.seller}</a>
                            </div>
                            <hr />
                            <p className="small">
                                <i className="bi bi-shield-check me-1"></i>Compra Protegida: recibes el producto que esperabas o te devolvemos tu dinero.
                            </p>
                            <p className="small">
                                <i className="bi bi-arrow-return-left me-1"></i>Devolución gratis. Tienes 30 días para devolver el producto.
                            </p>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 shadow-sm rounded-4">
                        <Card.Body>
                            <Card.Title>Medios de Pago</Card.Title>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <Image src={visa} height="35px" alt="Visa" />
                                <Image src={master} height="35px" alt="Mastercard" />
                            </div>
                            <Button variant="link" className="p-0 mt-3">Ver más medios de pago</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- SECCIONES COLAPSABLES (Se mantienen igual) --- */}

            {/* 1. Características Detalladas (Especificaciones) */}
            <Row className="mt-5">
                <Col md={12}>
                    <h3
                        onClick={() => setOpenSpecs(!openSpecs)}
                        aria-controls="specs-collapse"
                        aria-expanded={openSpecs}
                        className="mb-3 text-primary cursor-pointer hover-underline"
                        style={{ cursor: 'pointer' }}
                    >
                        Características Detalladas
                        <i className={`bi ms-2 bi-chevron-${openSpecs ? 'up' : 'down'}`}></i>
                    </h3>
                    <Collapse in={openSpecs}>
                        <div id="specs-collapse">
                            <Row className="border p-3 rounded-3 bg-light">
                                {productData.specs.map((spec, index) => (
                                    <Col sm={6} md={4} key={index} className="mb-3">
                                        <strong>{spec.label}:</strong> {spec.value}
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Collapse>
                    <hr />
                </Col>
            </Row>

            {/* 2. Descripción Detallada */}
            <Row className="mt-4">
                <Col md={12}>
                    <h3
                        onClick={() => setOpenDescription(!openDescription)}
                        aria-controls="description-collapse"
                        aria-expanded={openDescription}
                        className="mb-3 text-primary cursor-pointer hover-underline"
                        style={{ cursor: 'pointer' }}
                    >
                        Descripción del Producto
                        <i className={`bi ms-2 bi-chevron-${openDescription ? 'up' : 'down'}`}></i>
                    </h3>
                    <Collapse in={openDescription}>
                        <div id="description-collapse" className="border p-3 rounded-3 bg-light">
                            <p>{productData.description}</p>
                            <p className="fst-italic">{productData.longDescription}</p>
                        </div>
                    </Collapse>
                    <hr />
                </Col>
            </Row>

            {/* --- SECCIÓN DE RESEÑAS DINÁMICAS (REEMPLAZO) --- */}
            <Row>
                <Col md={12}>
                    {/* Llamamos al componente ReviewsSection que carga datos de Firebase */}
                    <ReviewsSection />
                </Col>
            </Row>


        </Container>
    );
};

export default ProductDetails;