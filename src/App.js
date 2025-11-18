import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Agregamos useLocation
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
import MonitoringPage from './components/MonitoringPage/MonitoringPage.jsx';
import { useAuth } from './context/AuthContext';

// Componente de verificación de autenticación para proteger rutas
const AuthWrapper = ({ element }) => {
  const { currentUser } = useAuth();

  // Si el usuario NO está logeado, redirige al home con un estado que indica abrir el modal.
  if (!currentUser) {
    // Redirigimos al home, enviando un 'state' para que el Header o HomePage lo capture
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