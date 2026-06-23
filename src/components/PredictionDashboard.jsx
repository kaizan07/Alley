import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  BarChart3, 
  RefreshCw,
  Calendar,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const PredictionDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/predictions/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
        <span className="ml-2">Loading prediction data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchDashboardData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { summary, topCategories, criticalProducts } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">AI Sales Predictions</h2>
          <p className="text-stone-600">Predictive analytics for inventory management</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Total Products</p>
              <p className="text-2xl font-bold text-stone-900">{summary.totalProducts}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{summary.criticalAlerts}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Warning Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.warningAlerts}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Sales Growth</p>
              <p className={`text-2xl font-bold ${summary.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.salesGrowth >= 0 ? '+' : ''}{summary.salesGrowth}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Products Alert */}
      {criticalProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Critical Stock Alerts</h3>
          </div>
          <p className="text-red-700 mb-4">These products are running low on stock and need immediate attention:</p>
          <div className="space-y-2">
            {criticalProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-stone-900">{product.title}</p>
                  <p className="text-sm text-stone-600">Current Stock: {product.currentStock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {product.daysOfStock} days left
                  </p>
                  <p className="text-xs text-stone-500">Restock needed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-amber-600 mr-2" />
          <h3 className="text-lg font-semibold text-stone-900">Top Performing Categories</h3>
        </div>
        <div className="space-y-3">
          {topCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-stone-900">{category.category}</p>
                  <p className="text-sm text-stone-600">{category.totalSales} total sales</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${category.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.trend >= 0 ? '+' : ''}{category.trend}% trend
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-stone-900">Daily Sales Average</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{summary.avgDailySales}</p>
          <p className="text-sm text-stone-600 mt-1">units per day</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-stone-900">Total Categories</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{summary.totalCategories}</p>
          <p className="text-sm text-stone-600 mt-1">active categories</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionDashboard;

