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
    // Estado para almacenar los datos crudos para la tabla y el gráfico
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ESTADO CLAVE: Controla qué sección se muestra
    const [viewMode, setViewMode] = useState('all'); // Valores: 'all', 'total', 'individual', 'table'

    const fetchData = () => {
        // Guard clause para evitar consultas sin credenciales
        if (!url || !token || !org || !bucket) {
            setLoading(false);
            setError("Error de configuración: Las credenciales de InfluxDB no están cargadas. Revisa tu archivo .env.local.");
            return;
        }

        setLoading(true);
        setError(null);

        // Mapa temporal para pivotar los datos en el cliente (clave: _time)
        const pivotMap = {};

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                const timeKey = o._time;
                const field = o._field;
                // Aseguramos que el valor sea un número (o nulo)
                const value = o._value !== undefined ? parseFloat(o._value) : null;

                if (!pivotMap[timeKey]) {
                    // Inicializa el registro en el mapa
                    pivotMap[timeKey] = {
                        time: new Date(timeKey).toLocaleString('es-MX'),
                        timestamp: new Date(timeKey).getTime(), // Para ordenamiento
                        ph: null,
                        turbidez: null,
                        conductividad: null,
                    };
                }

                // Asignar el valor al campo correspondiente si es numérico y válido
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
                // Convertir el mapa pivotado en un arreglo de registros y ordenar por tiempo
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
        // Recargar automáticamente cada 60 segundos (60000ms)
        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId); // Limpieza al desmontar
    }, []);

    // --- LÓGICA DEL GRÁFICO (usa useMemo para rendimiento) ---
    const chartData = useMemo(() => {
        if (rawData.length === 0) return { datasets: [] };

        const labels = rawData.map(d => d.time.split(',')[1].trim()); // Usamos solo la hora para etiquetas

        // Función auxiliar para crear un dataset con estilo lineal + puntos
        const createDataset = (key, label, color) => ({
            label,
            data: rawData.map(d => d[key]),
            borderColor: color,
            backgroundColor: color + '40',
            tension: 0.2,       // Líneas suaves (suaviza la línea entre puntos)
            pointRadius: 3,     // Marca los puntos de dato
            fill: false,        // Sin relleno bajo la línea
            spanGaps: true,     // Conecta los puntos si hay valores nulos
        });

        // Datasets para la gráfica combinada
        const combinedDatasets = [
            createDataset('ph', 'pH', 'rgb(75, 192, 192)'),
            createDataset('turbidez', 'Turbidez (NTU)', 'rgb(255, 99, 132)'),
            createDataset('conductividad', 'Conductividad (µS/cm)', 'rgb(54, 162, 235)'),
        ];

        // Datasets individuales
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

    // Opciones base del gráfico de Chart.js
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

    // Opciones específicas para la gráfica combinada
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

    // Opciones específicas para la gráfica de pH (ejemplo de límites de escala)
    const phOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: { display: true, text: 'Histórico de Nivel de pH' },
        },
        scales: {
            ...baseOptions.scales,
            y: {
                title: { display: true, text: 'pH (0-14)' },
                min: 0,
                max: 14,
            },
        }
    };

    // Opciones para Turbidez
    const turbidezOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: { display: true, text: 'Histórico de Turbidez (NTU)' },
        },
    };

    // Opciones para Conductividad
    const conductividadOptions = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: { display: true, text: 'Histórico de Conductividad (µS/cm)' },
        },
    };


    // Determina si hay suficientes datos para graficar
    const hasChartData = rawData.length > 0 && chartData.combinedDatasets.length > 0;

    return (
        <Container fluid className="px-0">
            {/* --- SECCIÓN DE ENCABEZADO CON FONDO AZUL --- */}
            <div className="bg-info-subtle py-4 mb-5 border-bottom">
                <Container>
                    <h2 className="mb-1 text-primary fw-bold">Dashboard de Monitoreo en Tiempo Real</h2>
                    <p className="text-muted fst-italic mb-0">Actualización automática cada 60 segundos desde InfluxDB Cloud.</p>
                </Container>
            </div>
            {/* --- FIN ENCABEZADO AZUL --- */}

            <Container>
                {/* --- CONTROLES DE VISTA --- */}
                <div className="d-flex justify-content-center mb-5">
                    <ButtonGroup aria-label="Modos de visualización" size="lg">
                        <Button
                            variant={viewMode === 'all' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('all')}
                            disabled={loading}
                            className="rounded-end-0 border-end-0"
                        >
                            Ver Todo
                        </Button>
                        <Button
                            variant={viewMode === 'total' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('total')}
                            disabled={loading || !hasChartData}
                            className="rounded-0 border-end-0"
                        >
                            Monitoreo Total
                        </Button>
                        <Button
                            variant={viewMode === 'individual' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('individual')}
                            disabled={loading || !hasChartData}
                            className="rounded-0 border-end-0"
                        >
                            Monitoreo Individual
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'primary' : 'outline-secondary'}
                            onClick={() => setViewMode('table')}
                            disabled={loading}
                            className="rounded-start-0"
                        >
                            Ver Registros
                        </Button>
                    </ButtonGroup>
                </div>
                {/* --- FIN CONTROLES DE VISTA --- */}

                {/* SPINNER Y ERRORES */}
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" role="status" className="me-2" style={{ width: '3rem', height: '3rem' }} />
                        <p className="mt-3 fs-5 text-secondary">Cargando datos de monitoreo...</p>
                    </div>
                )}

                {error && <Alert variant="danger" className="shadow-lg">{error}</Alert>}


                {/* 1. VISTA: VER TODO (COMBINADO + INDIVIDUAL + TABLA) */}
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

                {/* 2. VISTA: MONITOREO TOTAL (Solo gráfica combinada) */}
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

                {/* 3. VISTA: MONITOREO INDIVIDUAL (Solo gráficas individuales) */}
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

                {/* 4. VISTA: VER REGISTROS (Solo tabla) */}
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

                {/* Mensaje de No Hay Datos (Aparece si no hay datos y no estamos cargando) */}
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
                /* Estilo de la tabla para que coincida con la temática */
                .table thead th {
                    background-color: #007bff; /* Color primario de Bootstrap */
                    border-color: #007bff;
                }
                /* Asegura que los botones sean suaves y se vean como pestañas */
                .btn-group .btn {
                    padding-left: 1.5rem;
                    padding-right: 1.5rem;
                    font-weight: 600;
                }
            `}</style>

        </Container>
    );
};

export default MonitoringPage;