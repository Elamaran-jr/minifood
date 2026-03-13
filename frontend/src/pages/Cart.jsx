import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
      
      alert('Order placed successfully!');
      setCart([]);
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading cart...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Cart</h2>
        {cart.length > 0 && (
          <button className="btn-logout" onClick={clearCart}>
            <Trash2 size={16} /> Clear Cart
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
          <button className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }} onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            {cart.map(item => (
              <div key={item.id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>${item.price.toFixed(2)} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Quantity controls */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => changeQty(item.id, item.quantity, -1)}
                      style={{
                        background: 'none', border: 'none', padding: '0.4rem 0.6rem',
                        cursor: 'pointer', color: 'var(--text-main)',
                        borderRight: '1px solid var(--border)'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0.4rem 0.8rem', fontWeight: 600, minWidth: '36px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, item.quantity, 1)}
                      style={{
                        background: 'none', border: 'none', padding: '0.4rem 0.6rem',
                        cursor: 'pointer', color: 'var(--text-main)',
                        borderLeft: '1px solid var(--border)'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span style={{ fontWeight: 600, minWidth: '60px', textAlign: 'right' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  <button className="nav-btn" style={{ color: 'var(--danger)' }} onClick={() => removeItem(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="card" style={{ position: 'sticky', top: '5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} disabled={placingOrder} onClick={placeOrder}>
                {placingOrder ? 'Processing...' : 'Checkout & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
