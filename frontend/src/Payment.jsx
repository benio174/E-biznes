import React, { useState } from 'react';

export const Payment = () => {
    const [status, setStatus] = useState('');

    const handlePayment = async () => {
        setStatus('Wysyłanie danych o płatności...');
        
        try {
            const response = await fetch('http://localhost:8081/api/payment', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ amount: 100, currency: 'PLN' }) 
            });

            if (response.ok) {
                setStatus('Dane pomyślnie wysłane do serwera!');
            } else {
                setStatus('Błąd serwera podczas przetwarzania płatności.');
            }
        } catch (error) {
            console.error("Błąd połączenia:", error);
            setStatus('Brak połączenia z serwerem.');
        }
    };

    return (
        <section style={{ border: '1px solid #ccc', padding: '20px' }}>
            <h2>Płatności (Wysyłanie danych)</h2>
            <p>Kliknij poniższy przycisk, aby wysłać żądanie POST na serwer.</p>
            <button onClick={handlePayment}>
                Zasymuluj płatność (100 PLN)
            </button>
            {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
        </section>
    );
};