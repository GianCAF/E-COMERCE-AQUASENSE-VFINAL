import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';

// NOTA: Estas URLs simulan la carga de tus gráficas de Tableau.
const MAPA_CALOR_URL = "";
const GRAFICA_PASTEL_URL = "https://placehold.co/400x400/E040FB/333333?text=GRÁFICA+DE+PASTEL";
const DASHBOARD_COMBINADO = "/public/assets/dashboardIntegrador.jpg";


const MarketAnalysisPage = () => {
    return (
        <Container className="my-5">
            <h2 className="text-center mb-1 text-primary fw-bold">Análisis de Mercado: Potencial Hídrico en Hidalgo</h2>
            <p className="text-muted text-center lead mb-5">
                Datos clave que justifican la necesidad de monitoreo de precisión en el estado.
            </p>

            <Row className="mb-5 justify-content-center">
                <Col md={12}>
                    <Card className="shadow-lg rounded-4 p-4">
                        <Card.Body>

                            {/* --- SECCIÓN 1: DASHBOARD CONSOLIDADO (Gráficas Juntas) --- */}
                            <h3 className="text-secondary mb-4 border-bottom pb-2">Vista Consolidada (Dashboard Tableau)</h3>

                            <Row className="justify-content-center">
                                {/* Simulación del dashboard con las dos gráficas juntas */}
                                <Col md={12} className="mb-4">
                                    <Image
                                        src={DASHBOARD_COMBINADO}
                                        fluid
                                        className="border rounded-3"
                                        alt="Dashboard consolidado de pozos y cuerpos de agua en Hidalgo"
                                    />
                                    <p className="small text-center text-muted mt-2">
                                        Visualización integrada de la distribución geográfica y tipológica de los recursos hídricos.
                                    </p>
                                </Col>
                            </Row>

                            {/* --- SECCIÓN 2: GRÁFICAS Y ANÁLISIS DETALLADO --- */}
                            <h3 className="text-secondary mt-4 mb-4 border-bottom pb-2">Análisis Detallado por Variable</h3>

                            {/* Detalle 1: Mapa de Calor (Pozos) */}
                            <Row className="mb-5 align-items-center">
                                <Col md={7}>
                                    <h4 className="text-info mb-3">1. Mapa de Calor de Pozos en Hidalgo</h4>
                                    <p>
                                        El mapa de calor no solo muestra la presencia de pozos, sino la **densidad de puntos de captación** en municipios clave como Tula, Actopan y Tizayuca. Esta alta concentración geográfica justifica la inversión en soluciones de monitoreo IoT para la gestión eficiente de recursos subterráneos y la prevención de la sobreexplotación.
                                    </p>
                                    <p>
                                        **Potencial de Mercado:** Cada punto en el mapa representa un posible cliente, demostrando que existe un mercado consolidado para la tecnología de medición de calidad de agua.
                                    </p>
                                </Col>
                                <Col md={5} className="text-center">
                                    <Image src={MAPA_CALOR_URL} fluid className="rounded-3 shadow-sm" alt="Mapa de calor de pozos" />
                                </Col>
                            </Row>

                            <hr className="my-5" />

                            {/* Detalle 2: Gráfica de Pastel (Tipos de Agua) */}
                            <Row className="mb-4 align-items-center flex-row-reverse">
                                <Col md={7}>
                                    <h4 className="text-info mb-3">2. Distribución de Cuerpos de Agua por Tipo</h4>
                                    <p>
                                        Esta gráfica de pastel desglosa los recursos hídricos en Hidalgo. Los **Ríos (36.62%)** y los **Pozos (27.42%)** son las fuentes dominantes. Esto demuestra que la mayor parte del mercado se enfoca en recursos dinámicos (ríos) y recursos críticos (pozos).
                                    </p>
                                    <p>
                                        **Impacto:** El proyecto AquaSense está dirigido precisamente a estas fuentes, ofreciendo soluciones específicas para la turbidez en ríos durante épocas de lluvia y el control de la conductividad en pozos debido a la concentración de minerales.
                                    </p>
                                </Col>
                                <Col md={5} className="text-center">
                                    <Image src={GRAFICA_PASTEL_URL} fluid className="rounded-3 shadow-sm" alt="Gráfica de pastel de cuerpos de agua" />
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Guía de Enfoque Estratégico (Opcional) */}
            <Row className="mt-5">
                <Col>
                    <Card className="shadow-sm border-info bg-light-info">
                        <Card.Body>
                            <Card.Title className="text-info">Conclusión Estratégica del Análisis</Card.Title>
                            <p className="mb-0">
                                La concentración de recursos hídricos en el Valle del Mezquital y la dependencia de Pozos y Ríos validan el modelo de negocio. La solución AquaSense ofrece un valor directo para monitorear la calidad en estas fuentes clave de Hidalgo.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MarketAnalysisPage;