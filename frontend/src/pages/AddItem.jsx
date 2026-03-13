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
    category: '',
    imageUrl: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (editId) {
      setLoading(true);
      axios.get(`${API_URL}/food-items`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const item = res.data.find(i => i.id === editId);
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            imageUrl: item.imageUrl || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
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
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {editId ? <Edit size={24} color="var(--primary)" /> : <UtensilsCrossed size={24} color="var(--primary)" />}
        <h2>{editId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Margherita Pizza"
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
            rows="3"
            placeholder="Item description..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className="form-input"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="e.g., 12.99"
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Main Course"
            />
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
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
            id="available"
          />
          <label htmlFor="available" className="form-label" style={{ marginBottom: 0 }}>
            Available
          </label>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ background: 'var(--text-muted)' }}
            onClick={() => navigate('/menu')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update Item' : 'Add Item')}
          </button>
        </div>
      </form>
    </div>
  );
}
