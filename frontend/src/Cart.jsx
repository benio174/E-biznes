import React from 'react';
import { Link } from 'react-router-dom';

export const Cart = () => {
    const tempItems = [
        { id: 1, name: "Przykładowy produkt", price: 100 }
    ];

    return (
        <div style={{ padding: '10px', border: '1px solid orange' }}>
            <h2>Koszyk (Widok)</h2>
            {tempItems.map(item => (
                <div key={item.id}>• {item.name} - {item.price} PLN</div>
            ))}
            <hr />
            <Link to="/payment">
                <button>Przejdź do Płatności</button>
            </Link>
            <br />
            <Link to="/">Wróć do produktów</Link>
        </div>
    );
};