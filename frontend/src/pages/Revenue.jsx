import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, ShoppingCart, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function Revenue() {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchRevenue = async (p) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders/revenue?period=${p}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue(period);
  }, [period]);

  const periodLabel = { day: "Today", month: "This Month", year: "This Year" };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Revenue Dashboard</h2>
        <div style={{
          display: 'flex', gap: '0',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden'
        }}>
          {['day', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '0.5rem 1.25rem', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem',
                background: period === p ? 'var(--primary)' : 'transparent',
                color: period === p ? 'white' : 'var(--text-main)',
                transition: 'all 0.2s'
              }}
            >
              {periodLabel[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading...</div>
      ) : data && (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px',
                padding: '0.75rem', display: 'flex'
              }}>
                <DollarSign size={28} color="var(--primary)" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Revenue</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>${data.totalRevenue.toFixed(2)}</h2>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px',
                padding: '0.75rem', display: 'flex'
              }}>
                <ShoppingCart size={28} color="var(--success)" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Orders</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{data.totalOrders}</h2>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px',
                padding: '0.75rem', display: 'flex'
              }}>
                <TrendingUp size={28} color="#6366f1" />
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg. Order Value</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                  ${data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders).toFixed(2) : '0.00'}
                </h2>
              </div>
            </div>
          </div>

          {/* Top Dishes Analytics Section */}
          <div className="card" style={{ 
            marginBottom: '2.5rem', 
            border: '1px solid rgba(255, 75, 43, 0.05)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem' }}>
                 <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
                   <TrendingUp size={20} color="var(--primary)" />
                 </div>
                 Most Loved Dishes
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
                Performance Insights
              </span>
            </div>
            
            {data.topDishes?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No dish data available for this period.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {data.topDishes?.map((dish, index) => (
                  <div key={dish.name} style={{ 
                    padding: '1.5rem', borderRadius: '16px', background: '#fffcf6', 
                    border: '1px solid rgba(255, 75, 43, 0.1)', transition: 'all 0.3s ease'
                  }} className="analytics-dish-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{dish.name}</h4>
                      <div style={{ 
                        background: index === 0 ? 'var(--primary)' : 'var(--primary-light)', 
                        color: index === 0 ? 'white' : 'var(--primary)', 
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800,
                        boxShadow: index === 0 ? '0 4px 10px rgba(255, 75, 43, 0.2)' : 'none'
                      }}>
                        RANK #{index + 1}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ padding: '0.75rem', background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Sold</span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{dish.count} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>units</span></span>
                      </div>
                      <div style={{ padding: '0.75rem', background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Contribution</span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--success)' }}>${dish.avgRevenue.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
                          width: `${(dish.count / data.topDishes[0].count) * 100}%`,
                          transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {((dish.count / data.topDishes[0].count) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>
              <Calendar size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
              {periodLabel[period]} — Paid Orders
            </h3>
            {data.orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                No paid orders for this period.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Items</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={tdStyle}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>
                        <td style={tdStyle}>{order.user?.email || 'N/A'}</td>
                        <td style={tdStyle}>
                          {order.orderItems?.map(oi =>
                            `${oi.quantity}x ${oi.food?.name}`
                          ).join(', ')}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--primary)' }}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td style={tdStyle}>
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontWeight: 600,
  letterSpacing: '0.05em',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.9rem',
};
