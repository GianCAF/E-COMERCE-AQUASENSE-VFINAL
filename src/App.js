import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './components/Header/Header';
import HeroProduct from './components/HeroProduct/HeroProduct';
import ProductDetails from './components/ProductDetails/ProductDetails';
import SensorDetailsSection from './components/SensorDetailsSection/SensorDetailsSection';
import MembershipPrograms from './components/MembershipPrograms/MembershipPrograms';
import { ContactForm } from './components/ContactForm/ContactForm.jsx';
import ProblemSolver from './components/ProblemSolver/ProblemSolver';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import CartPage from './components/CartPage/CartPage';
import PurchaseFlow from './components/PurchaseFlow/PurchaseFlow';
import RutaMapa from './components/map/RutaMapa.jsx';
// Asegúrate de que esta ruta sea correcta: si MonitoringPage está en /pages/, ajusta
import MonitoringPage from './components/MonitoringPage/MonitoringPage.jsx';
import { useAuth } from './context/AuthContext';
import BottomNavBar from './components/BottomNavBar/BottomNavBar'; // Importamos la nueva barra

// --- ELIMINACIÓN DEL RASTREADOR DE RUTAS GTM (RouteChangeTracker) ---
// Se eliminó la dependencia a useLocation y useEffect innecesaria aquí.

// Componente para la nueva sección de Tips/Ayuda (Icono Pregunta)
const HelpPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Sección de Ayuda y Recursos</h2>
    {/* Aquí iría la sección de Tips/Guías específicas para control de parámetros */}
    <div className="container text-center mb-5">
      <p className="lead text-muted">Aquí irá una sección de Tips/Guías específicas para controlar los parámetros de calidad del agua.</p>
      <div className="border p-4 rounded-3">
        <h4>Tips Rápidos:</h4>
        <ul>
          <li>Para subir el pH: Añadir bicarbonato de sodio.</li>
          <li>Para bajar el pH: Añadir vinagre o ácido cítrico.</li>
          <li>La turbidez debe estar por debajo de 5 NTU para ser agua potable.</li>
        </ul>
      </div>
    </div>
    <RutaMapa />
    <FAQ />
    <ContactForm />
  </>
);

// Componente para la nueva sección Técnica/Solución (Icono Herramienta)
const TechnicalPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Detalles Técnicos y Solución de Problemas</h2>
    <SensorDetailsSection />
    <ProblemSolver />
  </>
);


// --- VALIDACIÓN DE AUTENTICACIÓN ---
const AuthWrapper = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace state={{ showLoginPrompt: true }} />;
  }
  return element;
};

// Componente para la página de inicio (Vista "Casa" o Principal)
const HomePage = () => (
  <>
    <HeroProduct />
    <ProductDetails />
    <MembershipPrograms />
    <PurchaseFlow />
    <ContactForm />
  </>
);

function App() {
  return (
    <Router>
      <Header />
      <main style={{ paddingBottom: '70px' }}> {/* Añadimos padding para que el BottomNav no tape el contenido */}
        <Routes>
          {/* 1. RUTA PRINCIPAL (Icono Casa) */}
          <Route path="/" element={<HomePage />} />

          {/* 2. RUTA AYUDA (Icono Pregunta) */}
          <Route path="/ayuda" element={<HelpPage />} />

          {/* 3. RUTA TÉCNICA (Icono Herramienta) */}
          <Route path="/tecnico" element={<TechnicalPage />} />

          {/* Otras rutas */}
          <Route path="/cart" element={<CartPage />} />

          {/* Ruta Protegida para Monitoreo */}
          <Route
            path="/monitoreo"
            element={<AuthWrapper element={<MonitoringPage />} />}
          />

        </Routes>
      </main>
      <Footer />
      <BottomNavBar /> {/* Barra de navegación fija inferior */}
    </Router>
  );
}

export default App;