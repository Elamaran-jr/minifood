import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const endpoint = role === 'ADMIN' ? `${API_URL}/orders?page=${p}` : `${API_URL}/orders/my-orders?page=${p}`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.items);
      setMeta(res.data.meta);
      setPage(res.data.meta.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const cancelOrder = async (id) => {
    if(!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.delete(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling order');
    }
  };

  if (loading && orders.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>{role === 'ADMIN' ? 'All Orders' : 'My Orders'}</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600 }}>Order #{order.id.slice(0, 8)}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: order.status === 'PAID' ? 'var(--success)' : 
                                  order.status === 'CANCELLED' ? 'var(--danger)' : '#e2e8f0',
                      color: order.status === 'CANCELLED' || order.status === 'PAID' ? 'white' : 'black',
                      fontWeight: 600
                    }}>
                      {order.status}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {order.orderItems?.map(item => (
                      <li key={item.id} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {item.quantity}x {item.food?.name} - ${(item.food?.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  {role === 'ADMIN' && order.user && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Customer: {order.user.email}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                    ${order.total.toFixed(2)}
                  </div>
                  
                  {role === 'USER' && order.status !== 'CANCELLED' && order.status !== 'PAID' && (
                    <button className="btn-logout" onClick={() => cancelOrder(order.id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '2rem', 
              marginTop: '4rem',
              padding: '2rem',
              borderTop: '1px solid var(--border)'
            }}>
              <button 
                className="btn-logout" 
                disabled={page === 1} 
                onClick={() => {
                  setPage(p => p - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ 
                  opacity: page === 1 ? 0.3 : 1,
                  padding: '0.8rem 2rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: page === 1 ? 'none' : 'var(--shadow-md)',
                  background: 'white',
                  cursor: page === 1 ? 'not-allowed' : 'pointer'
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
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
        </>
      )}
    </div>
  );
}
