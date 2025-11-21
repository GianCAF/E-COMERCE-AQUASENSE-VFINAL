import React, { useState } from 'react';
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
import MonitoringPage from './components/MonitoringPage/MonitoringPage.jsx';
import { useAuth } from './context/AuthContext';
import BottomNavBar from './components/BottomNavBar/BottomNavBar';
import { Container, Card, Image, Button, Form, Alert } from 'react-bootstrap'; // Importaciones para la página de Perfil


// --- COMPONENTES DE PÁGINA (Para el Menú de Hamburguesa) ---

const SensorDetailPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Detalles Técnicos y Sensores</h2>
    <SensorDetailsSection />
  </>
);

const MembershipPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Programas de Membresía</h2>
    <MembershipPrograms />
  </>
);

const ProblemSolverPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Cómo AquaSense Resuelve Problemas</h2>
    <ProblemSolver />
  </>
);

const MapPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Ubicación y Rutas</h2>
    <RutaMapa />
  </>
);

// Componente para la nueva sección de Perfil (donde puede cambiar la imagen)
const ProfilePage = () => {
  const { currentUser, userData } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      setStatus('Archivo seleccionado. Haga clic en Subir para guardar.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTA: La lógica real para subir la imagen a Firebase Storage y actualizar la URL
    // del usuario en Firestore iría aquí. Esto es solo una simulación.
    if (imageFile) {
      setStatus('Subiendo imagen... (Simulación)');
      setTimeout(() => {
        setStatus('✅ ¡Imagen de perfil actualizada con éxito!');
        // Aquí se llamaría a una función en el contexto de auth para actualizar la imagen
        setImageFile(null); // Limpiar archivo después de "subir"
      }, 1500);
    } else {
      setStatus('Seleccione un archivo de imagen primero.');
    }
  };

  if (!currentUser || !userData) {
    return <Alert variant="warning" className="m-5">Inicie sesión para ver su perfil.</Alert>;
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 text-primary">Mi Perfil de Usuario</h2>
      <Card className="shadow-lg p-4 rounded-4 mx-auto" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            {/* Avatar o Iniciales */}
            <div
              className="mx-auto border border-secondary text-white bg-primary rounded-circle mb-3"
              style={{ width: '100px', height: '100px', fontSize: '3rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Si tu userData tuviera una fotoURL, la usarías aquí: <Image src={userData.photoURL} roundedCircle fluid /> */}
              {getInitials(userData.names)}
            </div>
            <h4>{userData.names} {userData.surnames}</h4>
            <p className="text-muted">{currentUser.email}</p>
          </div>

          <h5 className="mb-3 border-bottom pb-2">Actualizar Imagen</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Seleccionar nueva foto de perfil</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
            </Form.Group>

            {status && <Alert variant={status.startsWith('✅') ? 'success' : 'info'} className="mt-3">{status}</Alert>}

            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" disabled={!imageFile}>
                Subir y Guardar Imagen
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};


// Componente para la nueva sección de Tips/Ayuda (Icono Pregunta)
const HelpPage = () => (
  <>
    <h2 className="text-center my-5 text-primary">Sección de Ayuda y Recursos</h2>
    {/* Contenido de Tips/Guías */}
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

    <FAQ />
    <ContactForm />
  </>
);


// --- VALIDACIÓN DE AUTENTICACIÓN ---
const AuthWrapper = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirige a la página principal y muestra un prompt de login
    return <Navigate to="/" replace state={{ showLoginPrompt: true }} />;
  }
  return element;
};

// Componente para la página de inicio (Vista "Casa" o Principal)
const HomePage = () => (
  <>
    {/* Contenido principal: Carusel y Detalles de Producto */}
    <HeroProduct />
    <ProductDetails />
    <PurchaseFlow />
  </>
);

function App() {
  return (
    <Router>
      <Header />
      <main style={{ paddingBottom: '70px' }}>
        <Routes>
          {/* 1. RUTA PRINCIPAL (Icono Casa) */}
          <Route path="/" element={<HomePage />} />

          {/* 2. RUTA AYUDA (Icono Pregunta) */}
          <Route path="/ayuda" element={<HelpPage />} />

          {/* RUTAS DEL MENÚ DE HAMBURGUESA (Acceso Total) */}
          <Route path="/sensores" element={<SensorDetailPage />} />
          <Route path="/membresias" element={<MembershipPage />} />
          <Route path="/problemas" element={<ProblemSolverPage />} />
          <Route path="/mapa" element={<MapPage />} />

          {/* RUTA DE PERFIL (Protegida solo si es estrictamente necesario, sino, el componente maneja el estado) */}
          <Route
            path="/perfil"
            element={<AuthWrapper element={<ProfilePage />} />}
          />

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
      <BottomNavBar />
    </Router>
  );
}

export default App;