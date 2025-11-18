// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el proveedor del contexto
export const CartProvider = ({ children }) => {
    // Inicializamos el estado del carrito como un array vacío
    const [cartItems, setCartItems] = useState([]);

    // Función para agregar un producto al carrito
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Verificar si el producto ya está en el carrito
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                // Si ya está, aumentar la cantidad
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Si no está, agregarlo con cantidad 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Función para eliminar un producto del carrito
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    // Función para vaciar el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Crear un hook personalizado para usar el contexto fácilmente
export const useCart = () => {
    return useContext(CartContext);
};