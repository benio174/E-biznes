import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  const [authStatus, setAuthStatus] = useState('');

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const provider = urlParams.get('provider'); // Pobieramy info o dostawcy

  if (status === 'success') {
    if (provider === 'google') {
      setAuthStatus('Udało się zalogować przez Google OAuth2!');
    } else if (provider === 'github') {
      setAuthStatus('Udało się zalogować przez GitHub OAuth2!');
    } else {
      setAuthStatus('Zalogowano pomyślnie!');
    }
  } else if (status === 'error') {
    setAuthStatus('Wystąpił błąd podczas logowania zewnętrznego.');
  }
}, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>System Autentykacji</h1>
      
      {authStatus && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', textAlign: 'center', marginBottom: '20px', borderRadius: '4px' }}>
          {authStatus}
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h3>Logowanie przez dostawców zewnętrznych</h3>
  
          <a 
            href="http://localhost:5000/api/auth/google" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#4285F4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            Zaloguj się przez Google
          </a>
          <a 
            href="http://localhost:5000/api/auth/github" 
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#24292e',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Zaloguj się przez GitHub
          </a>
      </div>

      <hr />
      <RegisterForm />
      <hr />
      <LoginForm />
    </div>
  );
}

export default App;