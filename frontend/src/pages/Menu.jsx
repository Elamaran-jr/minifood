import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, Trash2, ShoppingCart, Edit, Search, Clock, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import { API_URL } from '../services/api';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});  // { itemId: qty }
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateCartCount, showCartToast } = useCart();
  const socket = useSocket();
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Initialize state from URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const cat = searchParams.get('category') || '';
    if (search !== searchTerm) setSearchTerm(search);
    if (cat !== selectedCategory) setSelectedCategory(cat);
  }, []);

  const fetchItems = async (p = 1, search = '', catId = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/food-items?page=${p}&limit=9&search=${search}&categoryId=${catId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data.items);
      setMeta(res.data.meta);
      setPage(res.data.meta.currentPage);
      
      const initQty = {};
      res.data.items.forEach(item => { initQty[item.id] = 1; });
      setQuantities(initQty);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  // Initial fetch and handle page/category changes
  useEffect(() => {
    fetchItems(page, searchTerm, selectedCategory);
  }, [page, selectedCategory]);

  // Sync state with URL params
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Debounced search and suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      setPage(1);
      fetchItems(1, searchTerm, selectedCategory);
      
      if (searchTerm.length > 1) {
        try {
          const res = await axios.get(`${API_URL}/food-items?limit=5&search=${searchTerm}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSuggestions(res.data.items);
          setShowSuggestions(true);
        } catch (err) { console.error(err); }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!socket) return;

    const handleMenuUpdated = () => {
      fetchItems(page, searchTerm, selectedCategory);
    };

    socket.on('menuUpdated', handleMenuUpdated);

    return () => {
      socket.off('menuUpdated', handleMenuUpdated);
    };
  }, [socket, page, searchTerm, selectedCategory]);

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
      
      showCartToast(`${qty}x ${item.name} added to cart!`);
      updateCartCount(qty);
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
      fetchItems(page, searchTerm);
    } catch (err) {
      alert('Error deleting item');
    }
  };

  if (loading && items.length === 0 && !searchTerm) return <div className="loading-container">Loading menu...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Menu</h2>
          <p style={{ color: 'var(--text-muted)' }}>Explore our delicious South Indian cuisines</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px', maxWidth: '700px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search for dishes..." 
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 2000)}
              style={{ 
                paddingLeft: '3rem', 
                borderRadius: 'var(--radius-full)', 
                background: 'white', 
                border: '2px solid var(--primary)', 
                boxShadow: 'var(--shadow-glow)',
                width: '100%'
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)', marginTop: '0.5rem', overflow: 'hidden'
              }}>
                {suggestions.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSearchTerm(s.name); setShowSuggestions(false); }}
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}
                  >
                    {s.imageUrl && <img src={s.imageUrl} style={{ width: '30px', height: '30px', borderRadius: '4px' }} />}
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                padding: '0.85rem 2.5rem 0.85rem 1.25rem', 
                borderRadius: 'var(--radius-full)', 
                border: '2px solid var(--primary)', 
                appearance: 'none', 
                background: 'white', 
                color: 'var(--text-main)',
                fontWeight: 700, 
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                outline: 'none',
                height: '100%',
                minWidth: '160px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => navigate('/add-item')}>
            <Plus size={18} /> Add Food Item
          </button>
        )}
      </div>

      {items.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <h3>No dishes found matching "{searchTerm}"</h3>
          <p>Try searching for something else or clear the filter.</p>
          <button 
            className="link-btn" 
            onClick={() => setSearchTerm('')}
            style={{ marginTop: '1rem', margin: '1rem auto' }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          {items.map(item => (
            <div key={item.id} className="food-card-container" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <div className="food-card">
                {item.imageUrl && (
                  <div className="food-img-container">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="food-image"
                      loading="lazy"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}>
                      {item.categories?.map(cat => (
                        <span key={cat.id} className="category-badge" style={{ position: 'static' }}>{cat.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="food-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 className="food-title">{item.name}</h3>
                    <span className="food-price">${item.price.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    <span>{item.prepTime || 15} mins prep</span>
                  </div>
                  <p className="food-desc" style={{ marginBottom: '1.5rem' }}>{item.description}</p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {role === 'USER' ? (
                      <>
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            onClick={() => updateQty(item.id, -1)}
                            disabled={!item.available}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{quantities[item.id] || 1}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQty(item.id, 1)}
                            disabled={!item.available}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button 
                          className="btn-primary" 
                          style={{ flex: 1, padding: '0.6rem 1.25rem', fontSize: '0.95rem' }} 
                          onClick={() => addToCart(item)}
                          disabled={!item.available}
                        >
                          <ShoppingCart size={16} />
                          {item.available ? 'Add' : 'Sold Out'}
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <button className="btn-primary" style={{ flex: 1, background: 'var(--success)', padding: '0.6rem' }} onClick={() => navigate(`/add-item?edit=${item.id}`)}>
                          <Edit size={16} /> Edit
                        </button>
                        <button className="btn-logout" style={{ padding: '0.6rem', border: '1px solid var(--border)' }} onClick={() => deleteItem(item.id)}>
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {meta && meta.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '2rem', 
          marginTop: '2rem',
          padding: '2rem',
          borderTop: '1px solid var(--border)'
        }}>
          <button 
            className="btn-primary" 
            disabled={page === 1} 
            onClick={() => {
              setPage(p => p - 1);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            style={{ 
              opacity: page === 1 ? 0.3 : 1,
              padding: '0.8rem 2rem',
              boxShadow: page === 1 ? 'none' : 'var(--shadow-glow)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              background: page === 1 ? '#cbd5e1' : 'linear-gradient(135deg, var(--primary), var(--secondary))'
            }}
          >
            &larr; Previous
          </button>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            alignItems: 'center',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-main)'
          }}>
            <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{page}</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/</span>
            <span>{meta.totalPages}</span>
          </div>

          <button 
            className="btn-primary" 
            disabled={page === meta.totalPages} 
            onClick={() => {
              setPage(p => p + 1);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            style={{ 
              opacity: page === meta.totalPages ? 0.5 : 1,
              padding: '0.8rem 2.5rem',
              boxShadow: page === meta.totalPages ? 'none' : 'var(--shadow-glow)',
              cursor: page === meta.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next &rarr;
          </button>
        </div>
      )}

      {items.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
          No food items found.
        </div>
      )}
    </div>
  );
}
