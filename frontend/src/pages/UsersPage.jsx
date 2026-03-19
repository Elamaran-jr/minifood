import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Mail, Shield, Calendar, Search } from 'lucide-react';
import { API_URL } from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await axios.patch(`${API_URL}/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user. Note: Users with order history cannot be deleted.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-container">Loading users...</div>;

  return (
    <div className="users-page fade-in">
      <div className="page-header">
        <h2>User Management</h2>
        <p className="subtitle">Manage and view all registered users in Minifood</p>
      </div>

      <div className="search-container-premium">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="search-input-premium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>ID</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info-flex">
                    <div className="user-avatar-pill">
                      {(user.username || user.email)[0].toUpperCase()}
                    </div>
                    <div className="user-info-text">
                      <div className="username">{user.username || 'N/A'}</div>
                      <div className="email">
                        <Mail size={12} /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`user-role-badge ${user.role.toLowerCase()}`}>
                    <Shield size={12} /> {user.role}
                  </span>
                </td>
                <td>
                  <div className="user-date-info">
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <span className="user-id-monospace">#{user.id.slice(0, 8)}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="user-actions-flex">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`status-select-mini ${user.role.toLowerCase()}`}
                      style={{ width: '100px', padding: '4px 8px' }}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="btn-cancel-mini"
                      style={{ height: '32px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="empty-state-container">
            <UsersIcon size={48} className="empty-icon" />
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
