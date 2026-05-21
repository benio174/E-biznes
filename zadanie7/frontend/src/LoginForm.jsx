import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    console.log("React próbuje wysłać:", { email, password });

    try {
      const response = await axios.post('http://localhost:5000/api/login', 
        { email, password },
        { withCredentials: true }
      );

      console.log("Odpowiedź z serwera:", response.data);
      setMessage(`Sukces: ${response.data.message}`);
    } catch (error) {
      console.error("Błąd wysyłania:", error);
      
      if (error.response) {
        setMessage(`Błąd serwera: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage("Brak połączenia z serwerem! Sprawdź czy backend działa na porcie 5000.");
      } else {
        setMessage(`Błąd aplikacji: ${error.message}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Hasło:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Zaloguj</button>
      </form>
      {message && (
        <p style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: message.includes('Sukces') ? '#d4edda' : '#f8d7da',
          color: message.includes('Sukces') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default LoginForm;