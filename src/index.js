// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Importar AuthProvider


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
    </CartProvider>
  </React.StrictMode>
);