// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Asegúrate de que esta ruta sea correcta
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    // Función para obtener datos adicionales del usuario desde Firestore
    const fetchUserData = async (user) => {
        if (user) {
            const docRef = doc(db, "usuarios", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                setUserData(null);
            }
        } else {
            setUserData(null);
        }
        setLoading(false);
    };

    // Observador de estado de autenticación (mantener sesión activa)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            fetchUserData(user);
        });
        return unsubscribe;
    }, [auth]);

    // Registro de Usuario (Auth + Firestore Data)
    const signup = async (email, password, names, surnames, address) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos adicionales en Firestore usando el UID como ID de documento
        await setDoc(doc(db, "usuarios", user.uid), {
            email,
            names,
            surnames,
            address,
            nivelMembresia: 'basico', // Por defecto
            productoID: null,
        });
    };

    // Inicio de Sesión
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Cierre de Sesión
    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userData,
        loading,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};