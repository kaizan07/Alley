import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ProductSale from '../models/ProductSale.js';

/**
 * Data processor for sales prediction analysis
 */
export class PredictionDataProcessor {
  
  /**
   * Get sales data aggregated by time periods
   * @param {string} period - 'daily', 'weekly', 'monthly'
   * @param {number} months - Number of months to look back
   */
  static async getSalesData(period = 'daily', months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    // Get all orders from the specified period
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $in: ['Delivered', 'Shipped', 'Processing'] }
    }).populate('items.product');
    
    // Aggregate sales data
    const salesData = this.aggregateSalesData(orders, period);
    
    return salesData;
  }
  
  /**
   * Get product-level sales data
   */
  static async getProductSalesData(productId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $in: ['Delivered', 'Shipped', 'Processing'] },
      'items.product': productId
    });
    
    // Extract sales for specific product
    const productSales = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.toString() === productId.toString()) {
          productSales.push({
            date: order.createdAt,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });
    });
    
    return this.aggregateByPeriod(productSales, 'daily');
  }
  
  /**
   * Get category-level sales data
   */
  static async getCategorySalesData(category, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    // Get products in category
    const products = await Product.find({ category });
    const productIds = products.map(p => p._id);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $in: ['Delivered', 'Shipped', 'Processing'] },
      'items.product': { $in: productIds }
    });
    
    // Aggregate sales by category
    const categorySales = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.some(id => id.toString() === item.product.toString())) {
          categorySales.push({
            date: order.createdAt,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });
    });
    
    return this.aggregateByPeriod(categorySales, 'daily');
  }
  
  /**
   * Get all products with current stock and recent sales
   */
  static async getProductsWithStock() {
    const products = await Product.find({});
    const productsWithSales = [];
    
    for (const product of products) {
      const recentSales = await this.getProductSalesData(product._id, 3); // Last 3 months
      const totalSales = recentSales.reduce((sum, day) => sum + day.quantity, 0);
      const avgDailySales = totalSales / (recentSales.length || 1);
      
      productsWithSales.push({
        ...product.toObject(),
        recentSales,
        totalSales,
        avgDailySales,
        daysOfStock: product.stock / (avgDailySales || 1)
      });
    }
    
    return productsWithSales;
  }
  
  /**
   * Get all categories with sales data
   */
  static async getCategoriesWithSales() {
    const categories = await Product.distinct('category');
    const categoriesWithSales = [];
    
    for (const category of categories) {
      const salesData = await this.getCategorySalesData(category, 6);
      const totalSales = salesData.reduce((sum, day) => sum + day.quantity, 0);
      const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
      const avgDailySales = totalSales / (salesData.length || 1);
      
      categoriesWithSales.push({
        category,
        salesData,
        totalSales,
        totalRevenue,
        avgDailySales,
        trend: this.calculateTrend(salesData)
      });
    }
    
    return categoriesWithSales;
  }
  
  /**
   * Aggregate sales data from orders
   */
  static aggregateSalesData(orders, period) {
    const salesMap = new Map();
    
    orders.forEach(order => {
      const date = this.getPeriodStart(order.createdAt, period);
      const key = date.toISOString().split('T')[0];
      
      order.items.forEach(item => {
        if (!salesMap.has(key)) {
          salesMap.set(key, {
            date: date,
            quantity: 0,
            revenue: 0,
            orders: 0
          });
        }
        
        const dayData = salesMap.get(key);
        dayData.quantity += item.quantity;
        dayData.revenue += item.price * item.quantity;
        dayData.orders += 1;
      });
    });
    
    return Array.from(salesMap.values()).sort((a, b) => a.date - b.date);
  }
  
  /**
   * Aggregate data by time period
   */
  static aggregateByPeriod(data, period) {
    const aggregated = new Map();
    
    data.forEach(item => {
      const date = this.getPeriodStart(item.date, period);
      const key = date.toISOString().split('T')[0];
      
      if (!aggregated.has(key)) {
        aggregated.set(key, {
          date: date,
          quantity: 0,
          revenue: 0
        });
      }
      
      const dayData = aggregated.get(key);
      dayData.quantity += item.quantity;
      dayData.revenue += item.revenue;
    });
    
    return Array.from(aggregated.values()).sort((a, b) => a.date - b.date);
  }
  
  /**
   * Get period start date
   */
  static getPeriodStart(date, period) {
    const d = new Date(date);
    
    switch (period) {
      case 'daily':
        d.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        d.setDate(d.getDate() - d.getDay());
        d.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        break;
    }
    
    return d;
  }
  
  /**
   * Calculate trend (slope) of sales data
   */
  static calculateTrend(data) {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.quantity);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }
  
  /**
   * Calculate moving average
   */
  static calculateMovingAverage(data, window = 7) {
    if (data.length < window) return data;
    
    const result = [];
    for (let i = window - 1; i < data.length; i++) {
      const windowData = data.slice(i - window + 1, i + 1);
      const avg = windowData.reduce((sum, d) => sum + d.quantity, 0) / window;
      result.push({
        date: data[i].date,
        quantity: avg,
        revenue: windowData.reduce((sum, d) => sum + d.revenue, 0) / window
      });
    }
    
    return result;
  }
}

