import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/Navbar';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    items, 
    total, 
    loading, 
    error, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  
  const [userId, setUserId] = useState(null);
  const hasLoadedCart = useRef(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id && !hasLoadedCart.current) {
      setUserId(user._id);
      hasLoadedCart.current = true;
      getCart(user._id);
    }

    // Cleanup function to reset the ref when component unmounts
    return () => {
      hasLoadedCart.current = false;
    };
  }, [getCart]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(userId, itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(userId, itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart(userId);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!userId) return;
      if (items.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      const orderItems = items.map((ci) => ({
        product: ci.product._id || ci.product,
        title: ci.product.title,
        quantity: ci.quantity,
        price: ci.price,
        size: ci.size,
        color: ci.color,
      }));

      const payload = {
        user: userId,
        items: orderItems,
        shippingFee: 0,
        payment: { method: 'COD', paid: false },
        shipping: {},
      };

      const res = await axios.post(`${API_BASE}/api/orders`, payload);
      if (res.status === 201) {
        await clearCart(userId);
        alert('Order placed successfully!');
        // Redirect to a page; if none, go to home
        navigate('/');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f0e8] flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4d4033] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f0e8] flex justify-center items-center">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f0e8] flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-600">Please login to view your cart</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f7f0e8] py-12 px-4 md:px-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#4d4033] mb-8">Shopping Cart</h1>
          
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <a 
                href="/allProduct" 
                className="inline-block bg-[#4d4033] text-white px-6 py-3 rounded-lg hover:bg-[#3b3228] transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || "/placeholder.png"}
                            alt={item.product.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                          <p className="text-lg font-semibold text-[#4d4033]">
                            ₹{item.price}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-[#4d4033]">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} items)</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => navigate('/checkout')} className="w-full bg-[#4d4033] text-white py-3 rounded-lg hover:bg-[#3b3228] transition-colors font-medium">
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-4 text-center">
                    <a 
                      href="/allProduct" 
                      className="text-[#4d4033] hover:underline text-sm"
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
