import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_URL}/categories`, { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${API_URL}/categories/${id}`, { name: editName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will fail if food items are using this category.")) return;
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category. Make sure no food items are linked to it.");
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag size={28} color="var(--primary)" />
          Category Management
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Create and manage food categories for your menu</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="New Category Name (e.g., Beverages)" 
            className="form-input"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Category
          </button>
        </form>
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>NAME</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>
                  {editingId === cat.id ? (
                    <input 
                      className="form-input" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cat.name}</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => handleUpdate(cat.id)} style={{ color: 'var(--success)', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <Check size={20} />
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} style={{ color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No categories created yet.
          </div>
        )}
      </div>
    </div>
  );
}
