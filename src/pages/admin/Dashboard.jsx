import { useEffect, useState } from 'react';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0 });
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [qs, rt, cs, bs] = await Promise.all([
          fetch('http://localhost:5000/api/reports/quick-stats').then(r => r.json()),
          fetch('http://localhost:5000/api/reports/revenue-trends').then(r => r.json()),
          fetch('http://localhost:5000/api/reports/category-sales').then(r => r.json()),
          fetch('http://localhost:5000/api/reports/best-sellers').then(r => r.json()),
        ]);
        
        setStats(qs);
        setRevenueTrends(rt);
        setCategorySales(cs);
        setBestSellers(bs);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-stone-900">Dashboard Overview</h2>
        <div className="text-sm text-stone-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={stats.products} 
          color="blue"
        />
        <StatCard 
          icon={ShoppingCart} 
          label="Total Orders" 
          value={stats.orders} 
          color="green"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
                      value={`₹${stats.revenue.toFixed(2)}`} 
          color="amber"
        />
        <StatCard 
          icon={Users} 
          label="Total Customers" 
          value={stats.customers} 
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Revenue Trends (Last 30 Days)" icon={TrendingUp}>
          <div className="space-y-3">
            {revenueTrends.length > 0 ? (
              revenueTrends.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <span className="text-sm font-medium text-stone-700">{item._id}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">₹{item.revenue.toFixed(2)}</div>
                    <div className="text-xs text-stone-500">{item.orders} orders</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-stone-500 text-center py-4">No revenue data available</p>
            )}
          </div>
        </Panel>

        <Panel title="Sales by Category (Last 30 Days)" icon={Package}>
          <div className="space-y-3">
            {categorySales.length > 0 ? (
              categorySales.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <span className="text-sm font-medium text-stone-700">{item.category}</span>
                  <span className="text-sm font-semibold text-blue-600">{item.quantitySold} sold</span>
                </div>
              ))
            ) : (
              <p className="text-stone-500 text-center py-4">No category sales data available</p>
            )}
          </div>
        </Panel>
      </div>

      {/* Best Sellers */}
      <Panel title="Best Selling Products (Last 30 Days)" icon={TrendingUp} className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestSellers.length > 0 ? (
            bestSellers.map((item, index) => (
              <div key={index} className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Product {item._id}</span>
                  <span className="text-sm font-semibold text-green-600">{item.quantitySold} sold</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{item.category}</span>
                  <span>₹{item.avgPrice}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-stone-500 text-center py-4 col-span-full">No best sellers data available</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-600">{label}</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children, icon: Icon, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-stone-200 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon size={20} className="text-amber-600" />}
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}


