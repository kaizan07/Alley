import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2, Eye, Package, AlertTriangle } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [stockLoading, setStockLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/categories')
      ]);
      
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load products and categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchQuery || 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        await loadData();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product');
    }
  };

  const handleStockEdit = (product) => {
    setEditingStock(product._id);
    setNewStock(product.stock.toString());
  };

  const handleStockCancel = () => {
    setEditingStock(null);
    setNewStock('');
  };

  const handleStockSave = async (productId) => {
    if (!newStock || isNaN(newStock) || parseInt(newStock) < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }

    try {
      setStockLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: parseInt(newStock) }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      // Update local state
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, stock: parseInt(newStock) } : p
      ));

      setEditingStock(null);
      setNewStock('');
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    } finally {
      setStockLoading(false);
    }
  };

  const getStockAlertLevel = (stock) => {
    if (stock === 0) return { level: 'critical', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (stock <= 10) return { level: 'warning', color: 'text-yellow-600 bg-yellow-50', icon: AlertTriangle };
    if (stock <= 30) return { level: 'info', color: 'text-blue-600 bg-blue-50', icon: Package };
    return { level: 'good', color: 'text-green-600 bg-green-50', icon: Package };
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
          onClick={loadData}
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
        <h2 className="text-3xl font-bold text-stone-900">Products</h2>
        <Link 
          to="/admin/products/new"
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-stone-600 flex items-center">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="font-medium text-stone-900">{product.title}</div>
                        <div className="text-sm text-stone-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-stone-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4">
                    {editingStock === product._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-20 px-2 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          min="0"
                        />
                        <button
                          onClick={() => handleStockSave(product._id)}
                          disabled={stockLoading}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {stockLoading ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={handleStockCancel}
                          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockAlertLevel(product.stock).color}`}>
                          {React.createElement(getStockAlertLevel(product.stock).icon, { className: "w-3 h-3 mr-1" })}
                          {product.stock} in stock
                        </div>
                        <button
                          onClick={() => handleStockEdit(product)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Edit Stock"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}


