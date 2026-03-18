import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UtensilsCrossed, Edit } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryIds: [],
    imageUrl: '',
    prepTime: '15',
    available: true,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch categories first
    axios.get(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCategories(res.data))
    .catch(err => console.error("Failed to fetch categories", err));
  }, [token]);

  useEffect(() => {
    if (editId) {
      setLoading(true);
      axios.get(`${API_URL}/food-items/${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const item = res.data;
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            categoryIds: item.categories?.map(c => c.id) || [],
            imageUrl: item.imageUrl || '',
            prepTime: (item.prepTime || 15).toString(),
            available: item.available,
          });
        }
      })
      .catch(err => {
        console.error("Failed to fetch item for editing", err);
        setError("Could not load item details.");
      })
      .finally(() => setLoading(false));
    }
  }, [editId, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleCategory = (catId) => {
    setFormData(prev => {
      const isSelected = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: isSelected 
          ? prev.categoryIds.filter(id => id !== catId)
          : [...prev.categoryIds, catId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        prepTime: parseInt(formData.prepTime),
      };

      if (editId) {
        await axios.patch(`${API_URL}/food-items/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/food-items`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editId ? 'update' : 'add'} item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary-light)', 
            padding: '10px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            {editId ? <Edit size={28} color="var(--primary)" /> : <UtensilsCrossed size={28} color="var(--primary)" />}
          </div>
          {editId ? 'Refine Dish Details' : 'Add New Culinary Delight'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginLeft: '60px' }}>
          {editId ? 'Keep your menu fresh by updating item information.' : 'Introduce a new flavor to your customers.'}
        </p>
      </div>

      <div className="card" style={{ 
        padding: '3.5rem', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(255, 75, 43, 0.1)',
        boxShadow: '0 20px 50px rgba(255, 75, 43, 0.08), 0 10px 20px rgba(0,0,0,0.02)',
        borderRadius: '24px'
      }}>
        {/* Elegant top accent line */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px', 
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))' 
        }} />
        {/* Subtle decorative background element */}
        <div style={{ 
          position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', 
          background: 'var(--primary-light)', borderRadius: '50%', opacity: 0.3, zIndex: 0 
        }} />

        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 280px', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Dish Name</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Signature Seafood Platter"
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="A mouth-watering description to entice your customers..."
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    className="form-input"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    style={{ paddingLeft: '2rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Categories (Select one or more)</label>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.75rem', 
                  padding: '1.25rem',
                  background: 'var(--card-bg)', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  minHeight: '100px'
                }}>
                  {categories.map(cat => {
                    const isSelected = formData.categoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                          background: isSelected ? 'var(--primary-light)' : 'white',
                          color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                        }}
                      >
                        {cat.name}
                        {isSelected && <span style={{ fontSize: '1.1rem' }}>×</span>}
                      </button>
                    );
                  })}
                  {categories.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No categories available. Please add some first.</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Preparation Time</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    className="form-input"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleChange}
                    required
                    min="1"
                    style={{ paddingRight: '4rem' }}
                  />
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>mins</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <div 
                  onClick={() => handleChange({ target: { name: 'available', type: 'checkbox', checked: !formData.available } })}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', 
                    background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  className="status-toggle"
                >
                  <div style={{ 
                    width: '44px', height: '24px', background: formData.available ? 'var(--success)' : '#cbd5e1', 
                    borderRadius: '20px', position: 'relative', transition: 'all 0.3s'
                  }}>
                    <div style={{ 
                      width: '18px', height: '18px', background: 'white', borderRadius: '50%',
                      position: 'absolute', top: '3px', left: formData.available ? '23px' : '3px',
                      transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: formData.available ? 'var(--success)' : 'var(--text-muted)' }}>
                    {formData.available ? 'Currently Available' : 'Sold Out / Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Dish Image</label>
              <div style={{ 
                width: '100%', height: '240px', background: '#f1f5f9', borderRadius: 'var(--radius)',
                border: '2px dashed var(--border)', overflow: 'hidden', display: 'flex',
                alignItems: 'center', justifyItems: 'center', position: 'relative'
              }}>
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x240?text=Invalid+URL'; }}
                  />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.8rem' }}>Enter a URL below to see preview</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading} 
                style={{ width: '100%', padding: '1.1rem' }}
              >
                {loading ? (editId ? 'Saving Changes...' : 'Creating Dish...') : (editId ? 'Save Item Changes' : 'Launch New Dish')}
              </button>
              <button
                type="button"
                className="btn-logout"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/menu')}
              >
                Cancel & Return
              </button>
            </div>
          </div>
        </form>
        {error && <div style={{ 
          marginTop: '2rem', padding: '1rem', background: '#fef2f2', borderLeft: '4px solid var(--danger)', 
          color: 'var(--danger)', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 600
        }}>
          {error}
        </div>}
      </div>
    </div>
  );
}
