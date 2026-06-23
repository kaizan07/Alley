import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  RefreshCw,
  Calendar,
  ShoppingCart,
  Filter
} from 'lucide-react';

const ProductPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, critical, warning, info

  useEffect(() => {
    fetchPredictions();
  }, [filter]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = filter === 'all' 
        ? 'http://localhost:5000/api/predictions/products'
        : `http://localhost:5000/api/predictions/products?alertOnly=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        let filteredPredictions = data.predictions;
        
        if (filter !== 'all' && filter !== 'critical') {
          filteredPredictions = data.predictions.filter(p => p.alertLevel === filter);
        }
        
        setPredictions(filteredPredictions);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch predictions');
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (alertLevel) => {
    switch (alertLevel) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getAlertIcon = (alertLevel) => {
    switch (alertLevel) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Package className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
        <span className="ml-2">Loading product predictions...</span>
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
          <h2 className="text-2xl font-bold text-stone-900">Product Predictions</h2>
          <p className="text-stone-600">AI-powered sales forecasts for individual products</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="critical">Critical Alerts</option>
              <option value="warning">Warning Alerts</option>
              <option value="info">Info Alerts</option>
            </select>
          </div>
          <button
            onClick={fetchPredictions}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Predictions List */}
      <div className="space-y-4">
        {predictions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">No Predictions Available</h3>
            <p className="text-stone-600">No products match the current filter criteria.</p>
          </div>
        ) : (
          predictions.map((prediction, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getAlertColor(prediction.alertLevel)}`}>
                    {getAlertIcon(prediction.alertLevel)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      {prediction.product.title}
                    </h3>
                    <p className="text-stone-600">{prediction.product.category}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-stone-600">
                      <span>Current Stock: {prediction.product.currentStock}</span>
                      <span>Avg Daily Sales: {prediction.avgDailySales}</span>
                      <span>Days of Stock: {prediction.daysOfStock}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAlertColor(prediction.alertLevel)}`}>
                    {prediction.alertLevel.toUpperCase()}
                  </div>
                  <p className="text-sm text-stone-600 mt-1">
                    Confidence: {prediction.confidence}%
                  </p>
                </div>
              </div>

              {/* Stock Out Prediction */}
              {prediction.stockOutPrediction.daysUntilStockOut && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-red-800 font-medium">
                        Stock will run out in {prediction.stockOutPrediction.daysUntilStockOut} days
                      </p>
                      <p className="text-red-700 text-sm">
                        Recommended restock: {prediction.stockOutPrediction.recommendedRestock} units
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7-Day Predictions */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-stone-700 mb-2">Next 7 Days Prediction</h4>
                <div className="grid grid-cols-7 gap-2">
                  {prediction.predictions.map((pred, dayIndex) => (
                    <div key={dayIndex} className="text-center p-2 bg-stone-50 rounded-lg">
                      <p className="text-xs text-stone-600">Day {pred.day}</p>
                      <p className="text-sm font-semibold text-stone-900">{pred.predictedSales}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPredictions;

