// src/components/ReviewsSection/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const REVIEWS_PER_PAGE = 3;

const ReviewsSection = ({ productId }) => {
    const { currentUser, userData } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [pageStartDocs, setPageStartDocs] = useState([null]); // Almacena el documento inicial de cada página

    // --- 1. Obtener Reseñas de Firestore ---
    const fetchReviews = async (startIndexDoc = null, pageNumber = 1) => {
        setLoading(true);
        setError('');

        try {
            let reviewsQuery;

            // Construye la consulta basada en el documento inicial de la página
            reviewsQuery = query(
                collection(db, 'reviews'),
                orderBy('timestamp', 'desc'),
                ...(startIndexDoc ? [startAfter(startIndexDoc)] : []),
                limit(REVIEWS_PER_PAGE)
            );

            const documentSnapshots = await getDocs(reviewsQuery);
            const reviewsData = documentSnapshots.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Manejo de la paginación (Verificar si hay más elementos)
            if (documentSnapshots.docs.length > 0) {
                setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

                // Consultar el siguiente documento para ver si hay una página más
                const nextQuery = query(
                    collection(db, 'reviews'),
                    orderBy('timestamp', 'desc'),
                    startAfter(documentSnapshots.docs[documentSnapshots.docs.length - 1]),
                    limit(1)
                );
                const nextSnap = await getDocs(nextQuery);
                setHasMore(nextSnap.docs.length > 0);
            } else {
                setHasMore(false);
            }

            setReviews(reviewsData);
            setPage(pageNumber);

        } catch (err) {
            console.error('Error al cargar las reseñas:', err);
            setError('Error al cargar las reseñas. Intenta de nuevo.');
        }
        setLoading(false);
    };

    useEffect(() => {
        // Cargar la primera página al montar el componente
        fetchReviews(null, 1);
    }, []);

    const handleNextPage = () => {
        const nextPageNum = page + 1;
        const startIndexDoc = lastDoc; // El último doc de la página actual es el inicio de la siguiente

        // Guardar el documento inicial de la siguiente página para poder retroceder
        if (pageStartDocs.length <= page) {
            setPageStartDocs(prev => [...prev, startIndexDoc]);
        }

        fetchReviews(startIndexDoc, nextPageNum);
    };

    const handlePrevPage = () => {
        const prevPageNum = page - 1;
        if (prevPageNum < 1) return;

        // Obtener el documento inicial de la página anterior
        const startIndexDoc = pageStartDocs[prevPageNum - 1];

        fetchReviews(startIndexDoc, prevPageNum);
    };

    // --- 2. Enviar Reseña a Firestore ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setError('Debes iniciar sesión para dejar una reseña.');
            return;
        }
        if (!newComment.trim()) {
            setError('El comentario no puede estar vacío.');
            return;
        }

        setLoading(true);
        setError('');

        const reviewData = {
            userId: currentUser.uid,
            userName: `${userData?.names} ${userData?.surnames}`, // Usar el operador opcional (?) para seguridad
            comment: newComment.trim(),
            rating: newRating,
            productId: productId,
            timestamp: new Date().toISOString(),
        };

        try {
            await addDoc(collection(db, 'reviews'), reviewData);
            setNewComment('');
            setNewRating(5);
            // Recargar la primera página para ver la nueva reseña
            setPageStartDocs([null]);
            fetchReviews(null, 1);
        } catch (err) {
            console.error('Error al enviar reseña:', err);
            setError('Hubo un error al publicar la reseña.');
        }
        setLoading(false);
    };

    // --- 3. Renderizar Estrellas ---
    const renderStars = (rating) => {
        const fullStar = '★'.repeat(Math.floor(rating));
        const emptyStar = '☆'.repeat(5 - Math.floor(rating));
        return <span className="text-warning">{fullStar}{emptyStar}</span>;
    };

    return (
        <Container className="my-5" id="reviews-section">
            <h3 className="mb-4 text-primary">Opiniones del Producto</h3>

            {/* Formulario de Reseña */}
            {currentUser ? (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Card.Title>Deja tu Opinión, {userData?.names}</Card.Title>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmitReview}>
                            <Form.Group className="mb-3">
                                <Form.Label>Puntuación ({newRating} estrellas)</Form.Label>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i
                                            key={star}
                                            className="bi bi-star-fill text-warning me-1"
                                            style={{ cursor: 'pointer', fontSize: '1.5rem', opacity: newRating >= star ? 1 : 0.4 }}
                                            onClick={() => setNewRating(star)}
                                        ></i>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tu Comentario</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Publicando...' : 'Publicar Reseña'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="info">
                    <Link to="#" onClick={() => alert('Inicia sesión primero')}>Inicia sesión</Link> para dejar una reseña.
                </Alert>
            )}

            {/* Lista de Reseñas */}
            <h5 className="mt-5 mb-3">Reseñas de Clientes ({reviews.length} mostradas)</h5>

            {loading && reviews.length === 0 ? <p>Cargando reseñas...</p> : null}
            {reviews.length === 0 && !loading && <p>Sé el primero en dejar una reseña para AquaSense.</p>}

            {reviews.map((review) => (
                <Card key={review.id} className="mb-3 shadow-sm border-light">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <h6>{review.userName || 'Usuario Anónimo'}</h6>
                            <small className="text-muted">{new Date(review.timestamp).toLocaleDateString()}</small>
                        </div>
                        <div className="mb-2">
                            {renderStars(review.rating)}
                        </div>
                        <Card.Text>{review.comment}</Card.Text>
                    </Card.Body>
                </Card>
            ))}

            {/* Controles de Paginación */}
            <div className="d-flex justify-content-center mt-4">
                <Button
                    variant="outline-secondary"
                    onClick={handlePrevPage}
                    disabled={page === 1 || loading}
                    className="me-3"
                >
                    <i className="bi bi-arrow-left"></i> Anteriores
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                >
                    Siguientes <i className="bi bi-arrow-right"></i>
                </Button>
            </div>
        </Container>
    );
};

export default ReviewsSection;