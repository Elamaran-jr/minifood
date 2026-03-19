import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { API_URL } from '../services/api';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { fetchCartCount, resetCartCount, showCartToast } = useCart();

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // remove any stale local storage cart
    localStorage.removeItem('cart');
  }, []);

  // Sync badge count whenever cart changes
  useEffect(() => {
    fetchCartCount();
  }, [cart.length, cart.reduce((acc, item) => acc + item.quantity, 0)]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const changeQty = async (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      return removeItem(id);
    }
    
    // Optimistic UI update
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    
    try {
      await axios.patch(`${API_URL}/cart/${id}`, { quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      fetchCart(); // Revert on failure
    }
  };

  const removeItem = async (id) => {
    // Optimistic UI update
    setCart(prev => prev.filter(item => item.id !== id));
    
    try {
      await axios.delete(`${API_URL}/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const clearCart = async () => {
    setCart([]); // Optimistic update
    try {
      await axios.delete(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const payload = {
        items: cart.map(i => ({ foodId: i.id, quantity: i.quantity }))
      };

      await axios.post(`${API_URL}/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCart([]);
      resetCartCount();
      
      // Use centralized toast and navigate immediately 
      showCartToast('Order placed and confirmed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="loading-container">Loading cart...</div>;

  return (
    <div className="cart-page fade-in">
      <div className="cart-header-actions">
        <h2 className="cart-title">Your Cart</h2>
        {cart.length > 0 && (
          <button className="btn-clear-cart" onClick={clearCart}>
            <Trash2 size={18} /> Clear Cart
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="empty-cart-premium">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-cart-text">Your cart is feeling a bit light. Time to add some flavor!</p>
          <button className="btn-primary" onClick={() => navigate('/menu')}>
            Explore Our Menu
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-section">
            <div className="cart-items-box">
              {cart.map(item => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-image-wrapper">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="cart-item-image" loading="lazy" />
                    ) : (
                      <div className="cart-item-image-placeholder" style={{ 
                        width: '100%', height: '100%', background: '#ffedd5', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)', fontWeight: 800, fontSize: '0.7rem'
                      }}>
                        No Img
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="cart-actions">
                    <div className="quantity-control-premium" style={{ borderSize: '1px' }}>
                      <button
                        className="btn-qty-mini"
                        onClick={() => changeQty(item.id, item.quantity, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-display" style={{ minWidth: '24px', fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button
                        className="btn-qty-mini"
                        onClick={() => changeQty(item.id, item.quantity, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="cart-item-subtotal" style={{ fontSize: '1rem', minWidth: '70px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    
                    <button 
                      className="btn-delete-cart-item" 
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cart-summary-section">
            <div className="cart-summary-premium">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-row">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} 
                disabled={placingOrder} 
                onClick={placeOrder}
              >
                {placingOrder ? 'Processing Payment...' : 'Confirm & Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
