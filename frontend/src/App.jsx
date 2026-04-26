import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Product } from './Product';
import { Payment } from './Payment';
import { Cart } from './Cart';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Sklep</Link>
          <Link to="/cart" style={{ marginRight: '10px' }}>Koszyk</Link>
          <Link to="/payment">Płatności</Link>
        </nav>

        <h1>Sklep - Etap 3.5 (Routing)</h1>

        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;