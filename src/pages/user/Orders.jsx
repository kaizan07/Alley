import React, { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'processing':
        return <Package size={16} className="text-blue-600" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-600" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f0e8] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#4d4033] mb-4">Please log in to view your orders</h2>
            <Link to="/login" className="bg-[#4d4033] text-white px-6 py-3 rounded-lg hover:bg-[#3b3228] transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f0e8] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4d4033] mx-auto mb-4"></div>
            <p className="text-[#4d4033]">Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f7f0e8] py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#caa47c] rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-[#4d4033]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#4d4033]">My Orders</h1>
                <p className="text-[#6b5b47]">Track and manage your orders</p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#4d4033] mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Link 
                to="/allProduct" 
                className="inline-block bg-[#4d4033] text-white px-6 py-3 rounded-lg hover:bg-[#3b3228] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-[#caa47c] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#4d4033]">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-[#6b5b47]">
                            <Calendar size={14} />
                            <span>Placed on {formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-lg font-bold text-[#4d4033] mt-1">
                          <DollarSign size={18} />
                          <span>{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.product.image || '/src/assets/img/home/tshirt-1.png'}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-[#4d4033]">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#4d4033]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <p>Shipping Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 text-[#4d4033] hover:text-[#3b3228] transition-colors">
                            <Eye size={16} />
                            <span className="text-sm">View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
