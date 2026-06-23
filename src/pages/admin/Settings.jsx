import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function Settings() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'admin' });

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        }
        throw new Error('Failed to load admin users');
      }
      
      const data = await response.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admins:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadAdmins(); 
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        }
        throw new Error('Failed to create admin user');
      }
      
      setForm({ name: '', email: '', password: '', role: 'admin' });
      await loadAdmins();
    } catch (err) {
      console.error('Failed to create admin:', err);
      alert(err.message);
    }
  };

  const startEdit = (admin) => {
    setEditingId(admin._id);
    setEditForm({ name: admin.name, email: admin.email, role: admin.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', role: 'admin' });
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ role: editForm.role })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        }
        throw new Error('Failed to update admin user');
      }
      
      setEditingId(null);
      setEditForm({ name: '', email: '', role: 'admin' });
      await loadAdmins();
    } catch (err) {
      console.error('Failed to update admin:', err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        }
        throw new Error('Failed to delete admin user');
      }
      
      await loadAdmins();
    } catch (err) {
      console.error('Failed to delete admin:', err);
      alert(err.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadAdmins}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-stone-900">Admin Settings</h2>
        <div className="text-sm text-stone-600">
          {admins.length} admin users
        </div>
      </div>

      {/* Add Admin Form */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Plus size={24} className="text-amber-600" />
          <h3 className="text-xl font-semibold text-stone-900">Add New Admin User</h3>
        </div>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="md:col-span-4 flex items-center justify-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Admin User</span>
          </button>
        </form>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Admin User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {admins.map(admin => (
                <tr key={admin._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Shield size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">
                          {editingId === admin._id ? (
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          ) : (
                            admin.name
                          )}
                        </div>
                        <div className="text-sm text-stone-500">
                          ID: {admin._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === admin._id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-stone-900">{admin.email}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === admin._id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                        {admin.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editingId === admin._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(admin._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(admin)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {admins.length === 0 && (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-stone-400 mb-4" />
            <p className="text-stone-500">No admin users found</p>
          </div>
        )}
      </div>

      {/* Admin Permissions */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Admin Permissions</h3>
        <div className="p-4 border border-stone-200 rounded-lg">
          <h4 className="font-semibold text-stone-900 mb-2">Full System Access</h4>
          <ul className="text-sm text-stone-600 space-y-1">
            <li>• Manage all products & categories</li>
            <li>• View and manage all orders & customers</li>
            <li>• Access all reports and analytics</li>
            <li>• Manage admin users</li>
            <li>• System settings and configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


