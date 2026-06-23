import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, total, getCart, clearCart } = useCart();
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const hasLoadedCart = useRef(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setUserId(user._id);
      if (!hasLoadedCart.current) {
        getCart(user._id);
        hasLoadedCart.current = true;
      }
      // Prefill from user if available
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
      }));
    }
  }, [getCart]);

  const subtotal = useMemo(() => total, [total]);
  const shippingFee = 0;
  const grandTotal = subtotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async () => {
    if (!userId) {
      alert('Please login first.');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!form.name || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.postalCode) {
      alert('Please fill all required address fields.');
      return;
    }

    try {
      setSubmitting(true);
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
        shippingFee,
        payment: {
          method: paymentMethod,
          paid: paymentMethod !== 'COD',
        },
        shipping: {
          ...form,
        },
      };

      const res = await axios.post(`${API_BASE}/api/orders`, payload);
      if (res.status === 201) {
        await clearCart(userId);
        const orderId = res.data?._id;
        navigate(orderId ? `/order-confirmation/${orderId}` : '/order-confirmation/unknown');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f7f0e8] py-10 px-4 md:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-[#4d4033]">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="border p-3 rounded" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-3 rounded" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-3 rounded" />
                
                <input name="addressLine1" value={form.addressLine1} onChange={handleChange} placeholder="Address Line 1" className="border p-3 rounded md:col-span-2" />
                <input name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Address Line 2 (Optional)" className="border p-3 rounded md:col-span-2" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-3 rounded" />
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-3 rounded" />
                <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="border p-3 rounded" />
                <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-3 rounded" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#4d4033]">Payment</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" value="Direct" checked={paymentMethod === 'Direct'} onChange={() => setPaymentMethod('Direct')} />
                  <span>Mark as Paid (Direct Confirmation)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-2xl font-semibold mb-4 text-[#4d4033]">Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="truncate pr-2">{item.product.title} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
              <button onClick={placeOrder} disabled={submitting} className="mt-6 w-full bg-[#4d4033] text-white py-3 rounded-lg hover:bg-[#3b3228] transition-colors font-medium disabled:opacity-70">
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className="text-xs text-gray-500 mt-3">By placing this order, you agree to our terms and policies.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;


