import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Package, XCircle, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:3000';

const STATUS_STEPS = [
  { status: 'PLACED', label: 'Order Item', icon: Package },
  { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'PROCESSING', label: 'Processing', icon: Clock },
  { status: 'DELIVERED', label: 'Delivered', icon: Truck },
];

const OrderTracker = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="order-cancelled-notice">
        <XCircle size={20} />
        <span>This order has been cancelled</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="order-tracker-container">
      <div className="tracker-line">
        <motion.div 
          className="tracker-progress"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
      <div className="tracker-steps">
        {STATUS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.status} className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <motion.div 
                className="step-icon-wrapper"
                initial={false}
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? 'var(--primary)' : 'var(--bg-color)',
                  color: isCompleted ? 'white' : 'var(--text-muted)'
                }}
              >
                <Icon size={18} />
              </motion.div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  
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

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchOrders(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

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
    <div className="orders-page">
      <div className="page-header">
        <h2>{role === 'ADMIN' ? 'Order Management' : 'My Order History'}</h2>
        <p className="subtitle">Track and manage your delicious meals</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="card empty-state">
          <Clock size={48} />
          <p>No orders found yet. Time to eat something?</p>
        </div>
      ) : (
        <>
          <div className="orders-list">
            <AnimatePresence mode="popLayout">
              {orders.map(order => (
                <motion.div 
                  layout
                  key={order.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card order-card"
                >
                  <div className="order-card-header">
                    <div className="order-info-main">
                      <span className="order-number">Order #{order.id.slice(0, 8)}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="order-status-actions">
                      {role === 'ADMIN' ? (
                        <div className="status-updater">
                          <label>Update Status:</label>
                          <select 
                            value={order.status} 
                            disabled={updatingId === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="PLACED" disabled={order.status !== 'PLACED'}>Order Item</option>
                            <option value="CONFIRMED" disabled={order.status === 'PROCESSING' || order.status === 'DELIVERED' || order.status === 'CANCELLED'}>Confirmed</option>
                            <option value="PROCESSING" disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}>Processing</option>
                            <option value="DELIVERED" disabled={order.status === 'CANCELLED'}>Delivered</option>
                            <option value="CANCELLED" disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}>Cancelled</option>
                          </select>
                        </div>
                      ) : (
                        <div className={`status-pill ${order.status.toLowerCase()}`}>
                          {order.status}
                        </div>
                      )}
                    </div>
                  </div>

                  <OrderTracker currentStatus={order.status} />

                  <div className="order-card-content">
                    <div className="order-items-summary">
                      <h4>Order Items</h4>
                      <ul className="items-list">
                        {order.orderItems?.map(item => (
                          <li key={item.id}>
                            <ChevronRight size={14} className="bullet" />
                            <span className="qty">{item.quantity}x</span>
                            <span className="name">{item.food?.name}</span>
                            <span className="price">${(item.food?.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="order-summary-side">
                      {role === 'ADMIN' && order.user && (
                        <div className="customer-info">
                          <label>Customer:</label>
                          <span className="username">{order.user.username || order.user.email}</span>
                        </div>
                      )}
                      
                      <div className="order-total-box">
                        <span className="label">Total Paid</span>
                        <span className="value">${order.total.toFixed(2)}</span>
                      </div>

                      {role === 'USER' && order.status === 'PLACED' && (
                        <button className="btn-cancel" onClick={() => cancelOrder(order.id)}>
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn-pagination" 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="page-count">{page} / {meta.totalPages}</span>
              <button 
                className="btn-pagination" 
                disabled={page === meta.totalPages} 
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

