import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Truck, Package, XCircle, ChevronRight, Users } from 'lucide-react';
import { API_URL } from '../services/api';

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

  if (loading && orders.length === 0) return <div className="loading-container">Loading orders...</div>;

  return (
    <div className="orders-page fade-in">
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
                  className="order-card"
                >
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className={`order-card-header ${role === 'ADMIN' ? 'admin-header' : ''}`}>
                      <div className="order-info-main">
                        <div className="order-id-chip">
                          <span className="order-number">#{order.id.slice(0, 8)}</span>
                        </div>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {role === 'ADMIN' && order.user && (
                          <div className="admin-customer-pill">
                            <Users size={14} />
                            <span>{order.user.username || order.user.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="order-status-actions">
                        {role === 'ADMIN' ? (
                          <div className="status-updater-compact">
                            <select 
                              value={order.status} 
                              disabled={updatingId === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className={`status-select-mini ${order.status.toLowerCase()}`}
                            >
                              <option value="PLACED">Placed</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        ) : (
                          <div className={`status-pill-mini ${order.status.toLowerCase()}`}>
                            {order.status}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <OrderTracker currentStatus={order.status} />
                  )}

                  <div className="order-card-body-compact">
                    {order.status === 'DELIVERED' || order.status === 'CANCELLED' ? (
                      <div className={`delivered-details-final ${order.status === 'CANCELLED' ? 'cancelled-view' : ''}`}>
                        <div className="final-detail main-id">
                          <span className="final-label">Order ID:</span>
                          <span className="final-value bold-big">#{order.id}</span>
                        </div>
                        <div className="final-detail">
                          <span className="final-label">Order status:</span>
                          <span className={`final-value ${order.status === 'CANCELLED' ? 'status-red' : 'status-green'}`}>
                            {order.status === 'CANCELLED' ? 'Cancelled' : 'Delivered'}
                          </span>
                        </div>
                        <div className="final-detail">
                          <span className="final-label">Payment status:</span>
                          <span className={`final-value ${order.status === 'CANCELLED' ? 'status-red' : 'status-green'}`}>
                            {order.status === 'CANCELLED' ? 'Cancelled' : (order.paymentStatus || 'PAID')}
                          </span>
                        </div>
                        <div className="final-detail">
                          <span className="final-label">Time:</span>
                          <span className="final-value">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="final-detail">
                          <span className="final-label">{order.status === 'CANCELLED' ? 'Cancelled Item:' : 'Ordered Item:'}</span>
                          <span className="final-value">
                            {order.orderItems?.map((item, idx) => (
                              <span key={item.id}>
                                {item.quantity}x {item.food?.name}
                                {idx < order.orderItems.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </span>
                        </div>
                        <div className="final-detail">
                          <span className="final-label">Username:</span>
                          <span className="final-value">{order.user?.username || order.user?.email}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="items-preview-inline">
                          <Package size={14} className="text-muted" />
                          <div className="items-scroll">
                            {order.orderItems?.map((item, idx) => (
                              <span key={item.id} className="item-token">
                                {item.quantity}x {item.food?.name}
                                {idx < order.orderItems.length - 1 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="order-card-footer-compact">
                          <div className="order-price-bold">
                            ${order.total.toFixed(2)}
                          </div>
                          
                          {role === 'USER' && order.status === 'PLACED' && (
                            <button className="btn-cancel-mini" onClick={() => cancelOrder(order.id)}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </>
                    )}
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

