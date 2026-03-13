import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchOrders = async () => {
    try {
      const endpoint = role === 'ADMIN' ? `${API_URL}/orders` : `${API_URL}/orders/my-orders`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    if(!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.delete(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling order');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>{role === 'ADMIN' ? 'All Orders' : 'My Orders'}</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
      ) : (
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
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                  ${order.total.toFixed(2)}
                </div>
                
                {role === 'USER' && order.status !== 'CANCELLED' && (
                  <button className="btn-logout" onClick={() => cancelOrder(order.id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
