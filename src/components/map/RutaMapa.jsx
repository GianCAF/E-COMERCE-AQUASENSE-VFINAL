// RutaMapa.jsx

import React, { useEffect, useState, useRef } from 'react';
// 1. Importa los estilos CSS de las librerías
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
// 2. Importa los estilos CSS específicos para el tamaño del mapa
import './RutaMapa.css';

// Importación dinámica para cargar Leaflet solo en el cliente (browser)
let L;
if (typeof window !== 'undefined') {
    L = require('leaflet');
    require('leaflet-routing-machine');

    // Solución estándar para que los iconos de Leaflet se muestren correctamente en React
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
}

const DESTINO_LAT = 20.2464;{/*20.205128623481347*/}
const DESTINO_LNG = -99.2066; {/*-99.22281526188324*/ }
const DESTINO_NOMBRE = "7ma Demarcación, Mixquiahuala";

const RutaMapa = () => {
    const mapContainerRef = useRef(null);
    const mapaRef = useRef(null);
    const controlRutaRef = useRef(null);

    const [mensaje, setMensaje] = useState('Presiona el botón para trazar la ruta.');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Inicialización del mapa. Se asegura de que el contenedor exista antes de crear el mapa.
     */
    useEffect(() => {
        // Solo inicializa si L está cargado, el contenedor está listo y el mapa no existe
        if (L && mapContainerRef.current && !mapaRef.current) {
            const destino = L.latLng(DESTINO_LAT, DESTINO_LNG);

            // Inicializa el mapa en el contenedor referenciado
            const newMap = L.map(mapContainerRef.current).setView(destino, 14);
            mapaRef.current = newMap;

            // Capa base de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(newMap);

            // Marcador del destino
            L.marker(destino)
                .addTo(newMap)
                .bindPopup(`<b>${DESTINO_NOMBRE}</b>`).openPopup();

            // Limpieza al desmontar
            return () => {
                if (mapaRef.current) {
                    mapaRef.current.remove();
                    mapaRef.current = null;
                }
            };
        }
    }, []);

    /**
     * Lógica para obtener la ubicación y trazar la ruta.
     */
    const trazarRutaDesdeUbicacion = () => {
        if (!L || !mapaRef.current) {
            setMensaje("Error: El mapa no está inicializado.");
            return;
        }

        setIsLoading(true);
        setMensaje("🗺️ Obteniendo ubicación actual...");

        if (!navigator.geolocation) {
            setMensaje("❌ Tu navegador no soporta geolocalización.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const ubicacionActual = L.latLng(
                    position.coords.latitude,
                    position.coords.longitude
                );
                const destino = L.latLng(DESTINO_LAT, DESTINO_LNG);

                setMensaje("✅ Ubicación obtenida. Calculando ruta...");

                // Eliminar ruta anterior
                if (controlRutaRef.current) {
                    mapaRef.current.removeControl(controlRutaRef.current);
                    controlRutaRef.current = null;
                }

                // Crear el control de enrutamiento
                controlRutaRef.current = L.Routing.control({
                    waypoints: [ubicacionActual, destino],
                    routeWhileDragging: false,
                    language: 'es',
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                    showAlternatives: false,
                    lineOptions: {
                        styles: [{ color: '#007bff', weight: 6, opacity: 0.8 }]
                    }
                }).addTo(mapaRef.current);

                setMensaje(`🚗 Ruta trazada hacia ${DESTINO_NOMBRE}.`);
                setIsLoading(false);
            },
            (error) => {
                let errorMsg = "❌ Error al obtener la ubicación. ";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg += "El usuario denegó el permiso de ubicación.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMsg += "Información no disponible.";
                } else if (error.code === error.TIMEOUT) {
                    errorMsg += "La solicitud expiró.";
                }
                setMensaje(errorMsg);
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        // Estilo de tarjeta (card) como en tus productos
        <div style={styles.cardContainer}>
            <h2 style={styles.title}>📍 Dónde estamos (AquaSense)</h2>

            {/* Contenedor del mapa. El ID 'mapa-aquasense' es clave para el CSS */}
            <div id="mapa-aquasense" ref={mapContainerRef}></div>

            <div style={styles.controlesRuta}>
                <button
                    onClick={trazarRutaDesdeUbicacion}
                    disabled={isLoading}
                    style={{
                        ...styles.button,
                        ...(isLoading && styles.buttonDisabled)
                    }}
                >
                    {isLoading ? 'Calculando...' : 'Cómo llegar desde mi ubicación'}
                </button>
                <p style={styles.mensaje}>{mensaje}</p>
            </div>
        </div>
    );
};

// Estilos JSX para el diseño
const styles = {
    cardContainer: {
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: '600',
    },
    controlesRuta: {
        textAlign: 'center',
        padding: '10px 0',
    },
    button: {
        backgroundColor: '#007bff', // Azul de tu botón "Comprar ahora"
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    buttonDisabled: {
        backgroundColor: '#a0c7ff',
        cursor: 'not-allowed',
    },
    mensaje: {
        marginTop: '10px',
        color: '#555',
        fontSize: '14px',
        minHeight: '20px',
    }
};

export default RutaMapa;