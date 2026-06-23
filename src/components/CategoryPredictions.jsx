import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  RefreshCw,
  DollarSign,
  ShoppingCart,
  Calendar
} from 'lucide-react';

const CategoryPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/predictions/categories');
      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.predictions);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch category predictions');
      console.error('Error fetching category predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    if (trend > 5) return 'text-green-600';
    if (trend < -5) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4 transform rotate-180" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
        <span className="ml-2">Loading category predictions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchPredictions}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Category Predictions</h2>
          <p className="text-stone-600">AI-powered sales forecasts by product category</p>
        </div>
        <button
          onClick={fetchPredictions}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Category Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BarChart3 className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">No Category Data</h3>
            <p className="text-stone-600">No sales data available for category predictions.</p>
          </div>
        ) : (
          predictions.map((prediction, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      {prediction.category}
                    </h3>
                    <p className="text-sm text-stone-600">
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 ${getTrendColor(prediction.trend)}`}>
                  {getTrendIcon(prediction.trend)}
                  <span className="text-sm font-medium">
                    {prediction.trend >= 0 ? '+' : ''}{prediction.trend}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-stone-900">{prediction.totalSales}</p>
                  <p className="text-xs text-stone-600">Total Sales</p>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-stone-900">₹{prediction.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-stone-600">Total Revenue</p>
                </div>
              </div>

              {/* Daily Average */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Daily Average Sales</span>
                  <span className="text-lg font-bold text-blue-900">{prediction.avgDailySales}</span>
                </div>
              </div>

              {/* 7-Day Predictions */}
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">Next 7 Days Prediction</h4>
                <div className="grid grid-cols-7 gap-1">
                  {prediction.predictions.map((pred, dayIndex) => (
                    <div key={dayIndex} className="text-center p-2 bg-stone-50 rounded-lg">
                      <p className="text-xs text-stone-600">D{pred.day}</p>
                      <p className="text-sm font-semibold text-stone-900">{pred.predictedSales}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Product Stock Predictions */}
              {prediction.productStockPredictions && prediction.productStockPredictions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-stone-700 mb-2">Product Stock Predictions</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {prediction.productStockPredictions.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-stone-50 rounded text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-stone-900 truncate max-w-32">{product.title}</span>
                          <span className="text-stone-600">Stock: {product.currentStock}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-600">Pred: {product.predictedSales}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            product.alertLevel === 'critical' ? 'bg-red-100 text-red-800' :
                            product.alertLevel === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {product.alertLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trend Analysis */}
              <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">Trend Analysis</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${getTrendColor(prediction.trend)}`}>
                      {prediction.trend >= 0 ? 'Growing' : 'Declining'}
                    </span>
                    <span className="text-stone-500">
                      {Math.abs(prediction.trend)}% monthly
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {predictions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Category Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-stone-50 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-900">{predictions.length}</p>
              <p className="text-sm text-stone-600">Active Categories</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-900">
                {predictions.reduce((sum, p) => sum + p.totalSales, 0).toLocaleString()}
              </p>
              <p className="text-sm text-stone-600">Total Sales</p>
            </div>
            <div className="text-center p-4 bg-stone-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-stone-900">
                ₹{predictions.reduce((sum, p) => sum + p.totalRevenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-stone-600">Total Revenue</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPredictions;
