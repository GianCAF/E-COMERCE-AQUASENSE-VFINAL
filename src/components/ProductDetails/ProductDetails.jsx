// src/components/ProductDetails/ProductDetails.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Image, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import ReviewsSection from '../ReviewsSection/ReviewsSection'; // Importar el componente de reseñas dinámicas

// --- TUS IMPORTACIONES DE IMÁGENES ---
import imagen1 from '../../imgcar/imagen1.jpg';
import imagen2 from '../../imgcar/imag2.jpg';
import imagen3 from '../../imgcar/img3.jpg';
import imagen4 from '../../imgcar/img4.jpg';
import visa from '../../imgcar/visa.png';
import master from '../../imgcar/mastercad.png';

const ProductDetails = () => {
    const { addToCart } = useCart();

    const productData = {
        // Datos del producto
        id: 'aquasense-monitor-123',
        name: 'AquaSense - Monitor de Calidad de Agua Inteligente',
        price: 22390.00, // Ajuste de precio a formato flotante para el carrito
        discount: ' Hasta 12 meses sin intereses',
        deliveryTime: 'Llega en una o dos semanas',
        stock: 25,
        seller: 'AquaSense Oficial',
        sellerLink: '#',
        rating: 4.5, // Se mantiene para mostrar en la info principal
        reviewsCount: 37, // Se mantiene para mostrar en la info principal
        description: `El AquaSense es la solución definitiva para el monitoreo de la calidad del agua. Con un diseño robusto y sensores de alta precisión (pH, Turbidez, Conductividad), te permite tener control total sobre tu fuente de agua en tiempo real.`,
        features: [
            'Monitoreo en tiempo real de pH, Turbidez y Conductividad',
            'Diseño compacto y resistente al agua',
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
    };

    // --- ESTADOS PARA GALERÍA Y ZOOM ---
    const [mainImage, setMainImage] = useState(imagen1);
    const [zoomStyle, setZoomStyle] = useState({});

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
        // Resetea el zoom al cambiar de imagen
        setZoomStyle({});
    };

    const handleAddToCart = () => {
        addToCart(productData);
        alert(`${productData.name} ha sido agregado al carrito.`);
    };

    const renderStars = (rating) => {
        const fullStar = '★'.repeat(Math.floor(rating));
        const emptyStar = '☆'.repeat(5 - Math.floor(rating));
        return <span className="text-warning">{fullStar}{emptyStar}</span>;
    };


    // --- LÓGICA DEL ZOOM (Implementada tal como la proporcionaste) ---
    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();

        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const zoomFactor = 2;

        // Calcula el desplazamiento
        const translateX = -(x * 100 * zoomFactor - x * 100);
        const translateY = -(y * 100 * zoomFactor - y * 100);

        setZoomStyle({
            transform: `scale(${zoomFactor}) translate(${translateX / zoomFactor}%, ${translateY / zoomFactor}%)`,
            transition: 'transform 0.1s ease-out',
            transformOrigin: '0 0',
            width: `${100 / zoomFactor * 100}%`,
            height: `${100 / zoomFactor * 100}%`,
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({});
    };
    // ------------------------------------------------------------------

    return (
        <Container className="my-5" id="product-info">
            <Row>
                {/* Columna de Imágenes y Miniaturas */}
                <Col md={5}>

                    {/* Contenedor principal de la imagen: ZOOM AREA */}
                    <div
                        className="position-relative d-flex justify-content-center align-items-center border shadow-sm mb-3"
                        style={{ height: '400px', overflow: 'hidden', cursor: 'zoom-in' }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Imagen principal: Aplica el zoomStyle para la lupa */}
                        <Image
                            src={mainImage}
                            alt={productData.name}
                            style={{
                                objectFit: 'contain',
                                maxHeight: '100%',
                                maxWidth: '100%',
                                ...zoomStyle, // Aplica los estilos de zoom
                            }}
                        />
                    </div>

                    {/* Miniaturas */}
                    <div className="d-flex overflow-auto" style={{ maxWidth: '100%' }}>
                        {productImages.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-wrapper me-2 border ${mainImage === img.src ? 'border-primary border-3' : ''}`}
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
                        {/* <div className="text-warning me-2">
                            {renderStars(productData.rating)}
                        </div>
                         <span>({productData.reviewsCount} calificaciones)</span> */}
                    </div>

                    <h2 className="text-primary my-3">${productData.price.toFixed(2)} MXN</h2>
                    <p className="text-success">{productData.discount}</p>

                    <h5 className="mt-4">Características principales:</h5>
                    <ListGroup variant="flush">
                        {productData.features.map((feature, index) => (
                            <ListGroup.Item key={index}>• {feature}</ListGroup.Item>
                        ))}
                    </ListGroup>
                    <hr />
                </Col>

                {/* Columna de Opciones de Compra */}
                <Col md={3}>
                    <Card className="shadow-sm">
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

                            <Button variant="primary" size="lg" className="w-100 mb-2" disabled={productData.stock === 0}>
                                Comprar ahora
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="lg"
                                className="w-100"
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

                    <Card className="mt-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Medios de Pago</Card.Title>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {/* Usando las variables importadas */}
                                <Image src={visa} height="35px" alt="Visa" />
                                <Image src={master} height="35px" alt="Mastercard" />
                            </div>
                            <Button variant="link" className="p-0 mt-3">Ver más medios de pago</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Características Detalladas (expandido) */}
            <Row className="mt-5">
                <Col md={12}>
                    <h3 className="mb-3">Características del producto</h3>
                    <Row>
                        {productData.specs.map((spec, index) => (
                            <Col sm={6} md={4} key={index} className="mb-3">
                                <strong>{spec.label}:</strong> {spec.value}
                            </Col>
                        ))}
                    </Row>
                    <hr />
                </Col>
            </Row>

            {/* Descripción Detallada */}
            <Row className="mt-4">
                <Col md={12}>
                    <h3 className="mb-3">Descripción</h3>
                    <p>{productData.description}</p>
                    <Button variant="link" className="p-0">Ver descripción completa</Button>
                    <hr />
                </Col>
            </Row>

            {/* SECCIÓN DE RESEÑAS DINÁMICAS (Reemplaza a la sección estática) */}
            <ReviewsSection productId={'aquasense-monitor-123'} />

        </Container>
    );
};

export default ProductDetails;