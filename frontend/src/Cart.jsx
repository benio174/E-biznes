import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

export const Cart = () => {
    const { cartItems } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div>
            <h2>Twój Koszyk</h2>
            {cartItems.length === 0 ? <p>Koszyk jest pusty</p> : (
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>{item.name} - {item.price} PLN</li>
                    ))}
                </ul>
            )}
            <h3>Suma: {total} PLN</h3>
            <Link to="/payment"><button disabled={cartItems.length === 0}>Do kasy</button></Link>
        </div>
    );
};