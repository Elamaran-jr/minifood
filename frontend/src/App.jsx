import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { ShoppingCart, UtensilsCrossed, LogOut, ListOrdered, PlusCircle, BarChart3, Users, Tag, Loader2 } from 'lucide-react'
import axios from 'axios'
import { CartProvider, useCart } from './context/CartContext.jsx'
import { API_URL } from './services/api';

// Lazy loaded pages
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Menu = lazy(() => import('./pages/Menu.jsx'))
const Cart = lazy(() => import('./pages/Cart.jsx'))
const Orders = lazy(() => import('./pages/Orders.jsx'))
const AddItem = lazy(() => import('./pages/AddItem.jsx'))
const Revenue = lazy(() => import('./pages/Revenue.jsx'))
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage.jsx'))

// Protected Route - redirects to /login if no token
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Dashboard Layout - only shown for authenticated pages
const DashboardLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const { cartCount, resetCartCount, toastMsg, toastKey } = useCart();


  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('cart');
    resetCartCount();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-brand">
            <UtensilsCrossed size={24} />
            <span>suvai</span>
          </div>
          {username && (
            <div style={{
              fontSize: '1rem',
              color: '#f59e0b',
              marginTop: '0.1rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              marginLeft: '2.4rem',
              textTransform: 'capitalize',
              fontStyle: 'italic'
            }}>
              hey {username}!
            </div>
          )}
          

        </div>

        <div className="nav-links">
          <button className={`nav-btn ${isActive('/menu') ? 'active' : ''}`} onClick={() => navigate('/menu')}>Menu</button>
          <button className={`nav-btn flex ${isActive('/orders') ? 'active' : ''}`} onClick={() => navigate('/orders')}>
            <ListOrdered size={18} /> Orders
          </button>
          
          {role === 'USER' && (
            <button className={`nav-btn flex ${isActive('/cart') ? 'active' : ''}`} onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
              <ShoppingCart size={18} /> 
              <span>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: '2px solid white'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}
          
          {role === 'ADMIN' && (
            <>
              <button className={`nav-btn flex ${isActive('/categories') ? 'active' : ''}`} onClick={() => navigate('/categories')}>
                <Tag size={18} /> Categories
              </button>
              <button className={`nav-btn flex ${isActive('/users') ? 'active' : ''}`} onClick={() => navigate('/users')}>
                <Users size={18} /> Users
              </button>
              <button className={`nav-btn flex ${isActive('/revenue') ? 'active' : ''}`} onClick={() => navigate('/revenue')}>
                <BarChart3 size={18} /> Revenue
              </button>
            </>
          )}
          
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {toastMsg && (
        <div 
          key={toastKey}
          style={{
            position: 'fixed', 
            top: '65px', 
            right: '200px', 
            zIndex: 1001,
            background: 'linear-gradient(135deg, #10b981, #059669)', 
            color: 'white', 
            padding: '0.75rem 1.5rem',
            borderRadius: '12px', 
            fontWeight: 700, 
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            fontSize: '0.9rem',
            animation: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none'
          }}
        >
          <ShoppingCart size={18} /> {toastMsg}
        </div>
      )}

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '60vh', 
    width: '100%',
    color: 'var(--primary)',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <Loader2 size={48} className="spin" />
    <p style={{ fontWeight: 600, opacity: 0.7 }}>Loading Suvai...</p>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes - NO navbar, NO layout */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - WITH navbar and dashboard layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/categories" element={<CategoriesPage />} />

              <Route path="/admin" element={<Navigate to="/revenue" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </CartProvider>
  )
}

export default App
