import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './CartContext'; 
import { Product } from './Product';
import { Cart } from './Cart';
import { Payment } from './Payment';

function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
          <nav style={{ marginBottom: '20px', padding: '10px', background: '#eee', display: 'flex', gap: '15px' }}>
            <Link to="/">Sklep</Link>
            <Link to="/cart">Koszyk</Link>
            <Link to="/payment">Płatności</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;