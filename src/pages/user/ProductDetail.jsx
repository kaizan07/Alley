import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

const ProductDetail = () => {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);



  const handleAddToCart = async () => {
    if (!size) {
      alert('Please select a size');
      return;
    }

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('No user data found. Please login again.');
      return;
    }
    
    if (!user._id) {
      alert('User ID missing. Please login again.');
      return;
    }

    setLoading(true);
    try {
      await addToCart(user._id, id, quantity, size, 'Default');
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  // If product is not loaded yet, show loading
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

   return (
    <>
    <Navbar/>
    <section className="min-h-screen bg-[#f7f0e8] py-12 px-4 md:px-24 ">
      <div className="flex flex-col lg:flex-row items-start gap-12 pl-30 pr-50">
        {/* Image */}
        <div className="flex-1">
          <img src={product.images[0]} alt={product.title} className=" rounded shadow-lg w-full max-w-md max-h-130 " />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-6">
          
          <h2 className="text-3xl font-semibold">{product.title}</h2>
          <p className="text-xl font-bold text-gray-700">₹{product.price}</p>

          {/* Select Size */}
          <div>
            <label className="block mb-1 text-sm font-medium">Size *</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>



          {/* Quantity */}
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium">Quantity *</label>
            <div className="flex items-center border rounded">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1">-</button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-10 text-center border-l border-r"
              />
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1">+</button>
            </div>
          </div>



          {/* Add to Cart */}
          <button 
            onClick={handleAddToCart}
            disabled={loading || !size}
            className={`mt-4 w-full py-3 rounded font-medium flex items-center justify-center gap-2 transition-colors ${
              loading || !size
                ? 'bg-gray-400 cursor-not-allowed'
                : addedToCart
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-[#4d4033] hover:bg-[#3b3228]'
            } text-white`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Adding...
              </>
            ) : addedToCart ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>

          {/* View Cart Button (shown after adding to cart) */}
          {addedToCart && (
            <Link
              to="/cart"
              className="mt-3 w-full bg-white border-2 border-[#4d4033] text-[#4d4033] py-3 rounded font-medium flex items-center justify-center gap-2 hover:bg-[#4d4033] hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
            </Link>
          )}

          {/* Social Icons (placeholders) */}
          <div className="flex gap-4 text-xl text-gray-600 mt-4">
            <i className="fab fa-facebook-f" />
            <i className="fab fa-pinterest" />
            <i className="fab fa-whatsapp" />
            <i className="fas fa-times" />
          </div>

          {/* Description */}
          <p className="text-sm mt-6 text-gray-700">
            {product.description || 'Stylish product that adds a modern touch to your wardrobe.'}
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default ProductDetail;