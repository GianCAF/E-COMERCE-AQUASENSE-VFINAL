import React, { useEffect } from 'react'; // Necesitamos useEffect para el RouteChangeTracker
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
import FloatingCart from './components/FloatingCart/FloatingCart';
import CartPage from './components/CartPage/CartPage';
import PurchaseFlow from './components/PurchaseFlow/PurchaseFlow';
import RutaMapa from './components/map/RutaMapa.jsx';
// Importación corregida a /pages/MonitoringPage para consistencia
import MonitoringPage from './components/MonitoringPage/MonitoringPage.jsx';
import { useAuth } from './context/AuthContext';

// --- SEGUIMIENTO DE GOOGLE TAG MANAGER (GTM) ---
const RouteChangeTracker = () => {
  const location = useLocation();
  // Usamos GTM, que maneja el dataLayer global.
  const gtmId = process.env.REACT_APP_GTM_CONTAINER_ID;

  useEffect(() => {
    // Verificar si el dataLayer está inicializado y si tenemos el ID de GTM
    if (window.dataLayer && gtmId) {
      // Usamos dataLayer.push para enviar el evento de cambio de página (pageview virtual)
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search,
        page_title: document.title,
        gtm_id: gtmId // Aunque GTM ya sabe su ID, es buena práctica pasarlo
      });
      // console.log("GTM Evento: page_view", location.pathname); // Para depuración
    }
  }, [location, gtmId]); // Se ejecuta cada vez que 'location' cambia

  return null;
};

// --- VALIDACIÓN DE AUTENTICACIÓN ---
const AuthWrapper = ({ element }) => {
  const { currentUser } = useAuth();

  // Si el usuario NO está logeado, redirige al home con un estado que indica abrir el modal.
  if (!currentUser) {
    return <Navigate to="/" replace state={{ showLoginPrompt: true }} />;
  }

  // Si el usuario SÍ está logeado, permite el acceso al componente.
  return element;
};

// Componente para la página de inicio que agrupa las secciones
const HomePage = () => (
  <>
    <HeroProduct />
    <ProductDetails />
    <SensorDetailsSection />
    <PurchaseFlow />
    <ProblemSolver />
    <RutaMapa />
    <FAQ />
    <ContactForm />
  </>
);

function App() {
  return (
    <Router>
      {/* El rastreador de rutas debe ir dentro del Router */}
      <RouteChangeTracker />
      <Header />
      <main>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Ruta Protegida para Monitoreo */}
          <Route
            path="/monitoreo"
            element={<AuthWrapper element={<MonitoringPage />} />}
          />

        </Routes>
      </main>
      <FloatingCart />
      <Footer />
    </Router>
  );
}

export default App;