import React, { useState } from 'react';
import { useCart } from './CartContext';

export const Payment = () => {
    const { cartItems, clearCart } = useCart();
    const [msg, setMsg] = useState('');
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handlePayment = () => {
        fetch('http://localhost:8081/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                totalAmount: total, 
                itemsCount: cartItems.length 
            })
        })
        .then(() => {
            setMsg('Zapłacono pomyślnie!');
            clearCart();
        });
    };

    return (
        <div>
            <h2>Płatność</h2>
            <p>Ilość przedmiotów: {cartItems.length}</p>
            <p>Do zapłaty: <strong>{total} PLN</strong></p>
            <button onClick={handlePayment} disabled={total === 0}>Zapłać teraz</button>
            <p>{msg}</p>
        </div>
    );
};