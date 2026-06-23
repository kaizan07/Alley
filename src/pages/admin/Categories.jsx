import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) throw new Error('Failed to load categories');
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadCategories(); 
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error('Failed to create category');
      
      setForm({ name: '', description: '' });
      await loadCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      alert(err.message);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditForm({ name: category.name, description: category.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) throw new Error('Failed to update category');
      
      setEditingId(null);
      setEditForm({ name: '', description: '' });
      await loadCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert(err.message);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update category');
      
      await loadCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-stone-900">Categories</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Add New Category</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {categories.map(category => (
                <tr key={category._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === category._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="font-medium text-stone-900">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category._id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-1 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-stone-600">{category.description || '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(category._id, category.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {editingId === category._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(category._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check size={16} />
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
                            onClick={() => startEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
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
        
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}


