import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Image, X, Plus } from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
    category: '',
    stock: ''
  });
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const categoriesRes = await fetch('http://localhost:5000/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to load categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        
        if (isEdit) {
          const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!productRes.ok) throw new Error('Failed to load product');
          const productData = await productRes.json();
          setForm({
            title: productData.title || '',
            description: productData.description || '',
            price: productData.price || '',
            images: productData.images || [],
            category: productData.category || '',
            stock: productData.stock || ''
          });
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.price || !form.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit 
        ? `http://localhost:5000/api/products/${id}` 
        : 'http://localhost:5000/api/products/add';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading && !isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold text-stone-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter product title"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Product Images
              </label>
              
              <div className="space-y-4">
                {/* Add Image Input */}
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Image List */}
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-stone-200"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-stone-200">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


