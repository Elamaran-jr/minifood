import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Calendar, ShoppingBag, ShieldCheck, Mail, LogOut, 
  ArrowRight, UserCircle, Gift, Star, Clock, MapPin, 
  CreditCard, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  if (loading) return <div className="loading-container"><div className="loader"></div><p>Preparing your dashboard...</p></div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="profile-dashboard">
      <header className="dashboard-header-alt">
        <div className="profile-hero">
          <div className="profile-main-avatar">
            {profile?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="hero-text">
            <h1>Welcome back, {profile?.email?.split('@')[0]}!</h1>
            <h1 className="profile-hero-name">
              Welcome, {profile?.username || profile?.email?.split('@')[0]}!
            </h1>
            <p className="profile-hero-subtitle">
              User ID: {profile?.id?.slice(0, 8)} • Member since {new Date(profile?.createdAt).toLocaleDateString()}
            </p>
            <div className="hero-status">
              <span className={`status-badge ${profile?.role?.toLowerCase()}`}>
                <ShieldCheck size={14} /> {profile?.role} Member
              </span>
              <span className="member-date">
                <Calendar size={14} /> Joined {new Date(profile?.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content-grid">
        <div className="main-column">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card-mini">
              <div className="stat-icon orders"><ShoppingBag size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{profile?.orderCount || 0}</span>
              </div>
            </div>
            <div className="stat-card-mini">
              <div className="stat-icon rewards"><Star size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Suvai Points</span>
                <span className="stat-value">{(profile?.orderCount || 0) * 50}</span>
              </div>
            </div>
            <div className="stat-card-mini">
              <div className="stat-icon credit"><CreditCard size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Wallet Balance</span>
                <span className="stat-value">₹0.00</span>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <section className="dashboard-section section-card">
            <div className="section-header">
              <div className="title-with-icon">
                <Gift size={20} className="text-secondary" />
                <h2>My Rewards & Perks</h2>
              </div>
              <button className="link-btn">View All <ChevronRight size={14} /></button>
            </div>
            <div className="rewards-grid">
              <div className="reward-item">
                <div className="reward-icon"><Star size={20} /></div>
                <span className="reward-label">SILVER TIER</span>
                <span className="reward-value">Status</span>
              </div>
              <div className="reward-item">
                <div className="reward-icon"><Gift size={20} /></div>
                <span className="reward-label">FREE DELIVERY</span>
                <span className="reward-value">2 Left</span>
              </div>
              <div className="reward-item">
                <div className="reward-icon"><Star size={20} /></div>
                <span className="reward-label">CASHBACK</span>
                <span className="reward-value">5% OFF</span>
              </div>
            </div>
          </section>

          {/* Recent Orders Mockup */}
          <section className="dashboard-section section-card">
            <div className="section-header">
              <div className="title-with-icon">
                <Clock size={20} className="text-primary" />
                <h2>Recent Activity</h2>
              </div>
              <button className="link-btn" onClick={() => navigate('/orders')}>Order History <ChevronRight size={14} /></button>
            </div>
            {profile?.orderCount > 0 ? (
              <div className="recent-orders-list">
                <div className="mini-order-card">
                  <div className="order-meta">
                    <span className="order-id">#ORD-29482</span>
                    <span className="order-date">Placed on Oct 12, 2023</span>
                  </div>
                  <span className="order-amt">₹450.00</span>
                </div>
                <div className="mini-order-card">
                  <div className="order-meta">
                    <span className="order-id">#ORD-28103</span>
                    <span className="order-date">Placed on Sep 28, 2023</span>
                  </div>
                  <span className="order-amt">₹890.00</span>
                </div>
              </div>
            ) : (
              <div className="empty-activity">
                <p>No recent orders found. Time to satisfy your hunger!</p>
                <button className="btn-primary-sm" onClick={() => navigate('/menu')}>Order Now</button>
              </div>
            )}
          </section>
        </div>

        <div className="side-column">
          <section className="dashboard-section section-card profile-info-card">
            <h2>Account Details</h2>
            <div className="info-stack">
              <div className="info-block">
                <label><Mail size={14} /> Email</label>
                <span>{profile?.email}</span>
              </div>
              <div className="info-block">
                <label><ShieldCheck size={14} /> Role</label>
                <span>{profile?.role}</span>
              </div>
              <div className="info-block">
                <label><MapPin size={14} /> Saved Address</label>
                <span className="text-muted italic">No address saved yet</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4">Edit Profile</button>
          </section>

          <button className="btn-danger-outline w-full" onClick={handleLogout}>
            <LogOut size={18} /> Logout from Session
          </button>
        </div>
      </div>
    </div>
  );
}

