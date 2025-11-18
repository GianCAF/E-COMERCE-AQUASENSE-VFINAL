// src/components/ContactForm.jsx

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

// 1. Obtener las variables de entorno
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY; 

export const ContactForm = () => {
    // Referencia para acceder a los datos del formulario HTML
    const form = useRef();
    const [statusMessage, setStatusMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setStatusMessage('');
        setIsSending(true);

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
            publicKey: PUBLIC_KEY,
        })
            .then(
                () => {
                    setStatusMessage('✅ ¡Mensaje enviado con éxito! Te responderemos pronto.');
                    form.current.reset(); // Limpiar el formulario
                    setIsSending(false);
                },
                (error) => {
                    console.error('EmailJS FAILED:', error.text);
                    setStatusMessage('❌ Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.');
                    setIsSending(false);
                },
            );
    };

    return (
        <section id="contacto">
                <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Formulario de Contacto</h2>

            <form ref={form} onSubmit={sendEmail} style={{ display: 'grid', gap: '15px' }}>

                {/* Campo Opcional: Nombre (usado como {{user_name}} en la plantilla) */}
                <div>
                    <label htmlFor="user_name">Correo:</label>
                    <input
                        type="text"
                        id="user_name"
                        name="user_name" // Coincide con {{user_name}}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* b) Asunto (usado como {{subject}}) */}
                <div>
                    <label htmlFor="subject">Asunto:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject" // Coincide con {{subject}}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                {/* c) Texto detallado del mensaje (usado como {{message}}) */}
                <div>
                    <label htmlFor="message">Mensaje Detallado:</label>
                    <textarea
                        id="message"
                        name="message" // Coincide con {{message}}
                        rows="5"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSending}
                    style={{ padding: '10px', backgroundColor: isSending ? '#ccc' : '#007bff', color: 'white', border: 'none', cursor: isSending ? 'not-allowed' : 'pointer' }}
                >
                    {isSending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
            </form>

            {/* Mostrar el mensaje de estado */}
            {statusMessage && (
                <p style={{ marginTop: '10px', padding: '10px', backgroundColor: statusMessage.startsWith('✅') ? '#d4edda' : '#f8d7da', color: statusMessage.startsWith('✅') ? '#155724' : '#721c24', borderRadius: '4px' }}>
                    {statusMessage}
                </p>
            )}
        </div>
        </section>
    );
};