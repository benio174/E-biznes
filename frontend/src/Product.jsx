import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

export const Product = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('http://localhost:8081/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    return (
        <div>
            <h2>Produkty</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                {products.map(p => (
                    <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <h4>{p.name}</h4>
                        <p>{p.price} PLN</p>
                        <button onClick={() => addToCart(p)}>Dodaj do koszyka</button>
                    </div>
                ))}
            </div>
        </div>
    );
};