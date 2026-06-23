import { useEffect, useState } from 'react';
import { Package, User, DollarSign, Calendar, Eye } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/orders');
      if (!response.ok) throw new Error('Failed to load orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadOrders(); 
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      await loadOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          onClick={loadOrders}
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
        <h2 className="text-3xl font-bold text-stone-900">Orders</h2>
        <div className="text-sm text-stone-600">
          {orders.length} total orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Package size={16} className="text-stone-400" />
                      <span className="font-mono text-sm text-stone-900">
                        {order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-stone-400" />
                      <div>
                        <div className="font-medium text-stone-900">
                          {order.user?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-stone-500">
                          {order.user?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-stone-600">
                      {order.items?.length || 0} items
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="text-xs text-stone-500 mt-1">
                        {order.items[0]?.title || order.items[0]?.product?.title || 'Product'}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-stone-900">
                        ₹{order.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-amber-500 ${getStatusColor(order.status || 'Pending')}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-stone-400" />
                      <span className="text-sm text-stone-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-stone-400 mb-4" />
            <p className="text-stone-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            { status: 'Processing', color: 'bg-blue-100 text-blue-800' },
            { status: 'Shipped', color: 'bg-purple-100 text-purple-800' },
            { status: 'Delivered', color: 'bg-green-100 text-green-800' },
            { status: 'Cancelled', color: 'bg-red-100 text-red-800' }
          ].map(({ status, color }) => (
            <div key={status} className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDetails(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-lg border border-stone-200 p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-stone-900">Order Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="px-3 py-1 text-sm rounded-md bg-stone-100 hover:bg-stone-200"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-stone-700">
              <div>
                <div><span className="font-medium">Order ID:</span> {selectedOrder._id}</div>
                <div><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</div>
                <div><span className="font-medium">Status:</span> {selectedOrder.status}</div>
              </div>
              <div>
                <div><span className="font-medium">Customer:</span> {selectedOrder.user?.name || 'Unknown'}</div>
                <div><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'N/A'}</div>
                <div><span className="font-medium">Total:</span> ₹{selectedOrder.total?.toFixed(2)}</div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-stone-900 mb-3">Items ({selectedOrder.items?.length || 0})</h4>
              <div className="max-h-80 overflow-auto divide-y divide-stone-200">
                {selectedOrder.items?.map((it) => (
                  <div key={it._id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-stone-900 font-medium truncate">
                        {it.title || it.product?.title || 'Product'}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Qty: {it.quantity} · Price: ₹{it.price} {it.size ? `· Size: ${it.size}` : ''} {it.color ? `· Color: ${it.color}` : ''}
                      </div>
                    </div>
                    <div className="text-stone-900 font-semibold whitespace-nowrap">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                  <div className="py-6 text-center text-stone-500 text-sm">No items</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


