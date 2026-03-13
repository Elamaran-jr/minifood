import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, Trash2, Edit, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});  // { itemId: qty }
  const [addedMsg, setAddedMsg] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/food-items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
      // Initialize quantities to 1 for each item
      const initQty = {};
      res.data.forEach(item => { initQty[item.id] = 1; });
      setQuantities(initQty);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateQty = (itemId, delta) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[itemId] || 1) + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  const addToCart = async (item) => {
    const qty = quantities[item.id] || 1;
    
    try {
      if (role === 'USER') {
        await axios.post(`${API_URL}/cart`, 
          { foodId: item.id, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Show brief confirmation
      setAddedMsg(`${qty}x ${item.name} added to cart!`);
      setTimeout(() => setAddedMsg(''), 2000);
      
      // Reset quantity for this item
      setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const deleteItem = async (id) => {
    if(!confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/food-items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      alert('Error deleting item');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading menu...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Menu</h2>
        {role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => navigate('/add-item')}>
            <Plus size={18} /> Add Food Item
          </button>
        )}
      </div>

      {/* Cart confirmation toast */}
      {addedMsg && (
        <div style={{
          position: 'fixed', top: '80px', right: '2rem', zIndex: 999,
          background: 'var(--success)', color: 'white', padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius)', fontWeight: 600, boxShadow: 'var(--shadow)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <ShoppingCart size={18} /> {addedMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {item.imageUrl && (
              <div style={{ height: '180px', width: '100%', marginBottom: '1rem' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>${item.price.toFixed(2)}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{item.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#e2e8f0', borderRadius: '4px' }}>
                {item.category}
              </span>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {role === 'USER' ? (
                <>
                  {/* Quantity selector */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      disabled={!item.available}
                      style={{
                        background: 'none', border: 'none', padding: '0.5rem 0.75rem',
                        cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600,
                        borderRight: '1px solid var(--border)'
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{
                      padding: '0.5rem 1rem', fontWeight: 600,
                      minWidth: '40px', textAlign: 'center', fontSize: '0.95rem'
                    }}>
                      {quantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      disabled={!item.available}
                      style={{
                        background: 'none', border: 'none', padding: '0.5rem 0.75rem',
                        cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600,
                        borderLeft: '1px solid var(--border)'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {/* Add to cart button */}
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1 }} 
                    onClick={() => addToCart(item)}
                    disabled={!item.available}
                  >
                    <ShoppingCart size={16} />
                    {item.available ? `Add ${quantities[item.id] > 1 ? `(${quantities[item.id]})` : ''}` : 'Unavailable'}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-primary" style={{ flex: 1, background: 'var(--success)' }} onClick={() => navigate(`/add-item?edit=${item.id}`)}>
                    <Edit size={16} /> Edit
                  </button>
                  <button className="btn-primary" style={{ background: 'var(--danger)' }} onClick={() => deleteItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
          No food items found.
        </div>
      )}
    </div>
  );
}
