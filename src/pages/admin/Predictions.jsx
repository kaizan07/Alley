import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  Activity
} from 'lucide-react';
import PredictionDashboard from '../../components/PredictionDashboard';
import ProductPredictions from '../../components/ProductPredictions';
import CategoryPredictions from '../../components/CategoryPredictions';

const Predictions = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'products', label: 'Product Predictions', icon: Package },
    { id: 'categories', label: 'Category Predictions', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PredictionDashboard />;
      case 'products':
        return <ProductPredictions />;
      case 'categories':
        return <CategoryPredictions />;
      default:
        return <PredictionDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-stone-900">AI Sales Predictions</h2>
          <p className="text-stone-600">Predictive analytics and inventory management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Predictions;

