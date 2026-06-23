import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';

export default function Reports() {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [revenueRes, categoryRes] = await Promise.all([
          fetch('http://localhost:5000/api/reports/revenue-trends'),
          fetch('http://localhost:5000/api/reports/category-sales')
        ]);
        
        if (!revenueRes.ok || !categoryRes.ok) {
          throw new Error('Failed to load reports');
        }
        
        const [revenueData, categoryData] = await Promise.all([
          revenueRes.json(),
          categoryRes.json()
        ]);
        
        setDailyRevenue(revenueData);
        setCategorySales(categoryData);
      } catch (err) {
        console.error('Failed to load reports:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
          onClick={() => window.location.reload()}
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
        <h2 className="text-3xl font-bold text-stone-900">Reports & Analytics</h2>
        <div className="text-sm text-stone-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp size={24} className="text-amber-600" />
          <h3 className="text-xl font-semibold text-stone-900">Revenue Trends (Last 30 Days)</h3>
        </div>
        
        {dailyRevenue.length > 0 ? (
          <div className="space-y-4">
            {dailyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-stone-400" />
                  <span className="font-medium text-stone-900">{formatDate(item._id)}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-green-600">
                    ₹{(item.revenue)}
                    </span>
                  </div>
                  <div className="text-sm text-stone-500">
                    {item.orders} orders
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp size={48} className="mx-auto text-stone-400 mb-4" />
            <p className="text-stone-500">No revenue data available</p>
          </div>
        )}
      </div>

      {/* Category Sales */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Package size={24} className="text-amber-600" />
          <h3 className="text-xl font-semibold text-stone-900">Sales by Category (Last 30 Days)</h3>
        </div>
        
        {categorySales.length > 0 ? (
          <div className="space-y-4">
            {categorySales.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-medium text-stone-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-blue-600">
                    {item.quantitySold} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-stone-400 mb-4" />
            <p className="text-stone-500">No category sales data available</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Total Revenue (30d)</p>
              <p className="text-2xl font-bold text-stone-900">
                ₹{dailyRevenue.reduce((sum, item) => sum + item.revenue, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Total Orders (30d)</p>
              <p className="text-2xl font-bold text-stone-900">
                {dailyRevenue.reduce((sum, item) => sum + item.orders, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Categories Sold</p>
              <p className="text-2xl font-bold text-stone-900">
                {categorySales.length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Export Reports</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            Export Revenue Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Category Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
}


