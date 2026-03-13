import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Save token
      localStorage.setItem('token', res.data.access_token);
      
      // Decode JWT payload to get role and email
      const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
      localStorage.setItem('role', payload.role);
      localStorage.setItem('email', payload.email || email); // Use payload email if present, else form email
      
      // Redirect based on role
      if (payload.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="nav-brand" style={{ justifyContent: 'center', fontSize: '2.25rem', marginBottom: '0.5rem' }}>suvai</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to your account to order delicious food.</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>
          
          {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '6px', textAlign: 'center' }}>{error}</div>}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
