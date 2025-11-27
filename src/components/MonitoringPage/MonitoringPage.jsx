import React, { useState, useEffect, useMemo } from 'react';
import { Container, Spinner, Alert, Table, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
// Importaciones de librerías de gráficos e InfluxDB
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { InfluxDB } from '@influxdata/influxdb-client';

// Registro de componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- CONFIGURACIÓN DE INFLUXDB (usa variables de entorno) ---
const url = process.env.REACT_APP_INFLUX_URL;
const token = process.env.REACT_APP_INFLUX_TOKEN;
const org = process.env.REACT_APP_INFLUX_ORG;
const bucket = process.env.REACT_APP_INFLUX_BUCKET;

// Inicialización del cliente de InfluxDB
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// CONSULTA FLUX: Rango de 7 días, sin filtro de medición (para flexibilidad)
const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)`;

const MonitoringPage = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // Valores: 'all', 'total', 'individual', 'table'

    const fetchData = () => {
        // Lógica de obtención de datos (se mantiene igual)
        if (!url || !token || !org || !bucket) {
            setLoading(false);
            setError("Error de configuración: Las credenciales de InfluxDB no están cargadas. Revisa tu archivo .env.local.");
            return;
        }

        setLoading(true);
        setError(null);
        const pivotMap = {};

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                const timeKey = o._time;
                const field = o._field;
                const value = o._value !== undefined ? parseFloat(o._value) : null;

                if (!pivotMap[timeKey]) {
                    pivotMap[timeKey] = {
                        time: new Date(timeKey).toLocaleString('es-MX'),
                        timestamp: new Date(timeKey).getTime(),
                        ph: null,
                        turbidez: null,
                        conductividad: null,
                    };
                }
                if (value !== null) {
                    if (field === 'ph') {
                        pivotMap[timeKey].ph = value;
                    } else if (field === 'turbidez') {
                        pivotMap[timeKey].turbidez = value;
                    } else if (field === 'conductividad') {
                        pivotMap[timeKey].conductividad = value;
                    }
                }
            },
            error(err) {
                console.error('InfluxDB Query Error:', err);
                setError(`Error de consulta: ${err.message}. El problema es de CREDENCIALES (Token/Org) o URL.`);
                setLoading(false);
            },
            complete() {
                const finalData = Object.values(pivotMap).sort((a, b) => a.timestamp - b.timestamp);
                setRawData(finalData);

                if (finalData.length === 0 && !error) {
                    setError(`Conexión OK, pero no se encontraron registros válidos con los campos esperados en los últimos 7 días.`);
                }
                setLoading(false);
            },
        });
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 60000);
        return () => clearInterval(intervalId);
    }, []);

    // --- LÓGICA DEL GRÁFICO (useMemo se mantiene igual) ---
    const chartData = useMemo(() => {
        if (rawData.length === 0) return { datasets: [] };

        const labels = rawData.map(d => d.time.split(',')[1].trim());

        const createDataset = (key, label, color) => ({
            label,
            data: rawData.map(d => d[key]),
            borderColor: color,
            backgroundColor: color + '40',
            tension: 0.2,
            pointRadius: 3,
            fill: false,
            spanGaps: true,
        });

        const combinedDatasets = [
            createDataset('ph', 'pH', 'rgb(75, 192, 192)'),
            createDataset('turbidez', 'Turbidez (NTU)', 'rgb(255, 99, 132)'),
            createDataset('conductividad', 'Conductividad (µS/cm)', 'rgb(54, 162, 235)'),
        ];

        const phDataset = createDataset('ph', 'Nivel de pH', 'rgb(75, 192, 192)');
        const turbidezDataset = createDataset('turbidez', 'Nivel de Turbidez (NTU)', 'rgb(255, 99, 132)');
        const conductividadDataset = createDataset('conductividad', 'Nivel de Conductividad (µS/cm)', 'rgb(54, 162, 235)');

        return {
            labels,
            combinedDatasets,
            phDataset,
            turbidezDataset,
            conductividadDataset,
        };
    }, [rawData]);

    // Opciones base del gráfico de Chart.js (se mantiene igual)
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            x: { title: { display: true, text: 'Tiempo' } },
            y: { title: { display: true, text: 'Valor' } }
        }
    };

    // Opciones específicas para la gráfica combinada (se mantiene igual)
    const combinedOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: {
                display: true,
                text: 'Gráfica Combinada de Calidad de Agua (Actualización Minuto)',
            },
        },
    };

    const phOptions = { ...baseOptions, /* ... */ };
    const turbidezOptions = { ...baseOptions, /* ... */ };
    const conductividadOptions = { ...baseOptions, /* ... */ };


    // Determina si hay suficientes datos para graficar
    const hasChartData = rawData.length > 0 && chartData.combinedDatasets.length > 0;

    return (
        <Container fluid className="px-0">
            {/* --- SECCIÓN DE ENCABEZADO CON FONDO AZUL (se mantiene igual) --- */}
            <div className="bg-info-subtle py-4 mb-5 border-bottom">
                <Container>
                    <h2 className="mb-1 text-primary fw-bold">Dashboard de Monitoreo en Tiempo Real</h2>
                    <p className="text-muted fst-italic mb-0">Actualización automática cada 60 segundos desde InfluxDB Cloud.</p>
                </Container>
            </div>

            <Container>
                {/* --- CONTROLES DE VISTA --- */}
                {/* CORRECCIÓN: Reemplazamos ButtonGroup por un DIV con flex-wrap y estilizamos los botones individualmente */}
                <div className="d-flex justify-content-center mb-5">
                    <div
                        className="d-flex flex-wrap shadow-lg rounded-pill p-2"
                        style={{ maxWidth: '100%', backgroundColor: '#f8f9fa' }}
                    >
                        {/* Botón Ver Todo */}
                        <Button
                            variant={viewMode === 'all' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('all')}
                            disabled={loading}
                            className="flex-fill m-1 rounded-pill" // Añadimos m-1 para margen y flex-fill
                            style={{ minWidth: '150px' }} // Establece un ancho mínimo para que el texto quepa
                        >
                            Ver Todo
                        </Button>
                        {/* Botón Monitoreo Total */}
                        <Button
                            variant={viewMode === 'total' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('total')}
                            disabled={loading || !hasChartData}
                            className="flex-fill m-1 rounded-pill"
                            style={{ minWidth: '150px' }}
                        >
                            Monitoreo Total
                        </Button>
                        {/* Botón Monitoreo Individual */}
                        <Button
                            variant={viewMode === 'individual' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('individual')}
                            disabled={loading || !hasChartData}
                            className="flex-fill m-1 rounded-pill"
                            style={{ minWidth: '150px' }}
                        >
                            Monitoreo Individual
                        </Button>
                        {/* Botón Ver Registros */}
                        <Button
                            variant={viewMode === 'table' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('table')}
                            disabled={loading}
                            className="flex-fill m-1 rounded-pill"
                            style={{ minWidth: '150px' }}
                        >
                            Ver Registros
                        </Button>
                    </div>
                </div>
                {/* --- FIN CONTROLES DE VISTA --- */}


                {/* Contenido de Gráficas y Tablas (se mantiene igual) */}

                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" role="status" className="me-2" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3 fs-5 text-secondary">Cargando datos de monitoreo...</p>
                    </div>
                )}

                {error && <Alert variant="danger" className="shadow-lg">{error}</Alert>}


                {/* 1. VISTA: VER TODO */}
                {(viewMode === 'all' && hasChartData) && (
                    <div className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <h3 className="mb-4 text-primary fs-4">Gráfica de Tendencia Combinada</h3>
                        <div className="shadow-lg p-4 bg-white rounded-4 mb-5 card-hover-shadow">
                            <div style={{ height: '500px' }}>
                                <Line
                                    data={{ labels: chartData.labels, datasets: chartData.combinedDatasets }}
                                    options={combinedOptions}
                                />
                            </div>
                        </div>

                        <h3 className="mb-4 text-primary fs-4">Históricos Individuales</h3>
                        <Row className="g-4 mb-5">
                            {/* Gráfica de pH */}
                            <Col md={12} lg={4}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.phDataset] }}
                                        options={phOptions}
                                    />
                                </div>
                            </Col>
                            {/* Gráfica de Turbidez */}
                            <Col md={12} lg={4}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.turbidezDataset] }}
                                        options={turbidezOptions}
                                    />
                                </div>
                            </Col>
                            {/* Gráfica de Conductividad */}
                            <Col md={12} lg={4}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.conductividadDataset] }}
                                        options={conductividadOptions}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {/* Tabla de Datos Crudos (al final del modo "all") */}
                        <div className="shadow-lg p-4 bg-light rounded-4 mt-5">
                            <h5 className="mb-3 text-secondary">Tabla de Registros ({rawData.length} puntos)</h5>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive size="sm" className="align-middle">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th>Tiempo</th>
                                            <th>pH</th>
                                            <th>Turbidez (NTU)</th>
                                            <th>Conductividad (µS/cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rawData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.time}</td>
                                                <td>{data.ph !== null ? data.ph.toFixed(2) : 'N/A'}</td>
                                                <td>{data.turbidez !== null ? data.turbidez.toFixed(2) : 'N/A'}</td>
                                                <td>{data.conductividad !== null ? data.conductividad.toFixed(2) : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. VISTA: MONITOREO TOTAL */}
                {viewMode === 'total' && hasChartData && (
                    <div className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <h3 className="mb-4 text-primary fs-4">Gráfica de Tendencia Combinada</h3>
                        <div className="shadow-lg p-4 bg-white rounded-4 mb-5 card-hover-shadow">
                            <div style={{ height: '500px' }}>
                                <Line
                                    data={{ labels: chartData.labels, datasets: chartData.combinedDatasets }}
                                    options={combinedOptions}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. VISTA: MONITOREO INDIVIDUAL */}
                {viewMode === 'individual' && hasChartData && (
                    <div className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <h3 className="mb-4 text-primary fs-4">Históricos Individuales</h3>
                        <Row className="g-4 mb-5">
                            {/* Gráfica de pH */}
                            <Col md={12}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.phDataset] }}
                                        options={phOptions}
                                    />
                                </div>
                            </Col>
                            {/* Gráfica de Turbidez */}
                            <Col md={12}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.turbidezDataset] }}
                                        options={turbidezOptions}
                                    />
                                </div>
                            </Col>
                            {/* Gráfica de Conductividad */}
                            <Col md={12}>
                                <div className="shadow-md p-3 bg-white rounded-4 chart-card" style={{ height: '350px' }}>
                                    <Line
                                        data={{ labels: chartData.labels, datasets: [chartData.conductividadDataset] }}
                                        options={conductividadOptions}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* 4. VISTA: VER REGISTROS */}
                {(viewMode === 'table') && rawData.length > 0 && (
                    <div className={`transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="shadow-lg p-4 bg-light rounded-4 mt-4">
                            <h5 className="mb-3 text-secondary">Registros ({rawData.length})</h5>
                            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive size="sm" className="align-middle">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th>Tiempo</th>
                                            <th>pH</th>
                                            <th>Turbidez (NTU)</th>
                                            <th>Conductividad (µS/cm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rawData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.time}</td>
                                                <td>{data.ph !== null ? data.ph.toFixed(2) : 'N/A'}</td>
                                                <td>{data.turbidez !== null ? data.turbidez.toFixed(2) : 'N/A'}</td>
                                                <td>{data.conductividad !== null ? data.conductividad.toFixed(2) : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensaje de No Hay Datos */}
                {!loading && rawData.length === 0 && !error && (
                    <Alert variant="info" className="mt-5">
                        No se encontraron registros en los últimos 7 días.
                    </Alert>
                )}
            </Container>

            {/* Estilos CSS para animaciones y diseño */}
            <style jsx="true">{`
                .transition-opacity {
                    transition: opacity 0.5s ease-in-out;
                }
                .rounded-4 {
                    border-radius: 1rem !important;
                }
                .shadow-md {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
                    transition: transform 0.3s ease;
                }
                .chart-card:hover {
                    transform: translateY(-5px);
                }
                .table thead th {
                    background-color: #007bff;
                    border-color: #007bff;
                }
                /* Estilo de los botones */
                .btn-group-responsive .btn {
                    padding: 8px 10px;
                    font-size: 0.9rem;
                    white-space: normal; /* Permite el salto de línea en el texto si se reduce el ancho */
                }
            `}</style>

        </Container>
    );
};

export default MonitoringPage;