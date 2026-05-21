import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        password
      });

      setMessage(`Sukces: ${response.data.message}`);
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.response) {
        setMessage(`Błąd: ${error.response.data.message}`);
      } else {
        setMessage('Brak połączenia z serwerem.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', width: '100%' }}>
          Zarejestruj się
        </button>
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

export default RegisterForm;