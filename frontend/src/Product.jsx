import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8081/api/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Błąd pobierania produktów:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Ładowanie produktów...</p>;

    return (
        <section style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h2>Lista Produktów (Pobieranie danych)</h2>
            <Link to="/cart">Zobacz koszyk</Link>
            <div style={{ display: 'flex', gap: '15px' }}>
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} style={{ border: '1px solid black', padding: '10px' }}>
                            <h3>{product.name}</h3>
                            <p>Cena: {product.price} PLN</p>
                        </div>
                    ))
                ) : (
                    <p>Brak produktów do wyświetlenia lub brak połączenia z serwerem.</p>
                )}
            </div>
        </section>
    );
};