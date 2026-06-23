import { useEffect, useState } from 'react';
import { Users, Mail, Calendar, Shield, Eye } from 'lucide-react';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`Failed to load users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} className="text-amber-600" />;
      default:
        return <Users size={16} className="text-green-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          onClick={loadUsers}
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
        <h2 className="text-3xl font-bold text-stone-900">Customers</h2>
        <div className="text-sm text-stone-600">
          {users.length} total users
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Total Users</p>
              <p className="text-2xl font-bold text-stone-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Regular Users</p>
              <p className="text-2xl font-bold text-stone-900">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Admins</p>
              <p className="text-2xl font-bold text-stone-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">New This Month</p>
              <p className="text-2xl font-bold text-stone-900">
                {users.filter(u => {
                  const userDate = new Date(u.createdAt || Date.now());
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return userDate > monthAgo;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Calendar size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-amber-800">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">
                          {user.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-stone-500">
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-stone-400" />
                      <span className="text-stone-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-stone-400" />
                      <span className="text-sm text-stone-600">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(`User profile for ${user.name || user.email}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-stone-400 mb-4" />
            <p className="text-stone-500">No users found</p>
          </div>
        )}
      </div>

             {/* Role Legend */}
       <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
         <h3 className="text-lg font-semibold text-stone-900 mb-4">Role Types</h3>
         <div className="grid grid-cols-2 gap-4">
           {[
             { role: 'user', color: 'bg-green-100 text-green-800', icon: Users },
             { role: 'admin', color: 'bg-purple-100 text-purple-800', icon: Shield }
           ].map(({ role, color, icon: Icon }) => (
             <div key={role} className="flex items-center space-x-2">
               <Icon size={16} className="text-stone-400" />
               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                 {role}
               </span>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}


