import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom'
import { ShoppingCart, UtensilsCrossed, LogOut, ListOrdered, PlusCircle, BarChart3, Users, Tag } from 'lucide-react'
import axios from 'axios'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import AddItem from './pages/AddItem.jsx'
import Revenue from './pages/Revenue.jsx'
import UsersPage from './pages/UsersPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import { CartProvider, useCart } from './context/CartContext.jsx'

const API_URL = 'http://localhost:3000';

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
  const { cartCount, resetCartCount } = useCart();


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
          

        </div>

        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/menu')}>Menu</button>
          <button className="nav-btn flex" onClick={() => navigate('/orders')}>
            <ListOrdered size={18} /> Orders
          </button>
          
          {role === 'USER' && (
            <button className="nav-btn flex" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
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
              <button className="nav-btn flex" onClick={() => navigate('/categories')}>
                <Tag size={18} /> Categories
              </button>
              <button className="nav-btn flex" onClick={() => navigate('/users')}>
                <Users size={18} /> Users
              </button>
              <button className="nav-btn flex" onClick={() => navigate('/revenue')}>
                <BarChart3 size={18} /> Revenue
              </button>
            </>
          )}
          
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <CartProvider>
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
    </CartProvider>
  )
}

export default App
