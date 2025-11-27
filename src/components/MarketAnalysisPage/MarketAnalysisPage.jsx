import React from 'react';
import { Container, Row, Col, Card, Image, ListGroup } from 'react-bootstrap';

// -----------------------------------------------------------
// 1. IMPORTAR LAS IMÁGENES COMO MÓDULOS (Método Funcional)
// -----------------------------------------------------------
// NOTA: Debes reemplazar estas rutas relativas por las correctas si tus archivos
// no están en la misma ubicación que las imágenes de los sensores.
import MapaCalor from '../assets/mapa-calor-hidalgo.jpg';       // Asume que tienes este archivo
import GraficaPastel from '../assets/grafica-pastel-agua.jpg'; // Asume que tienes este archivo
import DashboardCombinado from '../assets/dashboard-combinado.jpg'; // Asume que tienes este archivo
// -----------------------------------------------------------

const MarketAnalysisPage = () => {
    // Usaremos las variables importadas directamente:
    const MAPA_CALOR_SRC = MapaCalor;
    const GRAFICA_PASTEL_SRC = GraficaPastel;
    const DASHBOARD_COMBINADO_SRC = DashboardCombinado;


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
                                {/* Usa la imagen de Dashboard Combinado */}
                                <Col md={12} className="mb-4">
                                    <Image
                                        src={DASHBOARD_COMBINADO_SRC}
                                        fluid
                                        className="border rounded-3 shadow-sm"
                                        alt="Dashboard consolidado de pozos y cuerpos de agua en Hidalgo"
                                    />
                                    <p className="small text-center text-muted mt-2">
                                        Visualización integrada de la distribución geográfica de pozos y la composición por subtipo de cuerpo de agua.
                                    </p>
                                </Col>
                            </Row>

                            {/* --- SECCIÓN 2: GRÁFICAS Y ANÁLISIS DETALLADO --- */}
                            <h3 className="text-secondary mt-4 mb-4 border-bottom pb-2">Análisis Detallado de Componentes</h3>

                            {/* Detalle 1: Mapa de Calor (Pozos) */}
                            <Row className="mb-5 align-items-center">
                                <Col md={7}>
                                    <h4 className="text-info mb-3">1. Mapa de Calor de Pozos en Hidalgo (Clientes Potenciales)</h4>
                                    <p>
                                        El mapa de calor muestra la **concentración geográfica de los puntos de captación**, evidenciando áreas de alta densidad de pozos en municipios clave. Esta distribución puntual demuestra un mercado objetivo claro para la instalación de dispositivos IoT de monitoreo subterráneo, vital para prevenir la sobreexplotación.
                                    </p>
                                    <p>
                                        **Justificación de Mercado:** Cada punto caliente en el mapa representa una concentración de potenciales clientes (agricultores, gestores municipales o industrias) con una necesidad directa de medición de la calidad del agua a nivel local.
                                    </p>
                                </Col>
                                <Col md={5} className="text-center">
                                    <Image src={MAPA_CALOR_SRC} fluid className="rounded-3 shadow-sm" alt="Mapa de calor de pozos en Hidalgo" />
                                </Col>
                            </Row>

                            <hr className="my-5" />

                            {/* Detalle 2: Gráfica de Pastel (Tipos de Agua) */}
                            <Row className="mb-4 align-items-center flex-row-reverse">
                                <Col md={7}>
                                    <h4 className="text-info mb-3">2. Distribución Porcentual de Cuerpos de Agua</h4>
                                    <p>
                                        La gráfica de pastel desglosa los recursos hídricos en el estado. Con **Ríos (36.62%)** y **Pozos (27.42%)** como las fuentes dominantes, se confirma que la mayor parte del mercado se centra en recursos dinámicos (que requieren monitoreo constante de turbidez) y recursos críticos (que requieren control de conductividad y minerales).
                                    </p>
                                    <p>
                                        **Enfoque de Solución:** El proyecto AquaSense está diseñado para ofrecer soluciones específicas para estos tipos de cuerpos de agua, validando el ajuste de la solución a las necesidades hídricas regionales de Hidalgo.
                                    </p>
                                </Col>
                                <Col md={5} className="text-center">
                                    <Image src={GRAFICA_PASTEL_SRC} fluid className="rounded-3 shadow-sm" alt="Gráfica de pastel de cuerpos de agua por subtipo" />
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Guía de Enfoque Estratégico */}
            <Row className="mt-5">
                <Col>
                    <Card className="shadow-sm border-info bg-light-info">
                        <Card.Body>
                            <Card.Title className="text-info">Conclusión Estratégica del Análisis</Card.Title>
                            <p className="mb-0">
                                La alta concentración de recursos hídricos y la diversidad tipológica en Hidalgo validan la necesidad y el tamaño del mercado para el proyecto AquaSense. La solución ofrece valor directo para la gestión sostenible de los principales recursos del estado.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MarketAnalysisPage;