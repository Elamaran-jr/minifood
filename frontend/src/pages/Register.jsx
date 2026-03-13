import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { username, email, password, role: 'USER' });
      
      // Successfully registered, redirect to login page
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="nav-brand" style={{ justifyContent: 'center', fontSize: '2.25rem', marginBottom: '0.5rem' }}>suvai</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to discover delicious food.</p>
        </div>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Username</label>
            <input 
              type="text" 
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a unique username"
              required 
              minLength={3}
            />
          </div>

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
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
