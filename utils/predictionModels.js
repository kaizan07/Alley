/**
 * Prediction models for sales forecasting
 */

export class PredictionModels {
  
  /**
   * Simple Moving Average Prediction
   * @param {Array} data - Historical sales data
   * @param {number} periods - Number of periods to predict
   * @param {number} window - Moving average window size
   */
  static movingAverage(data, periods = 30, window = 7) {
    if (data.length < window) {
      // If not enough data, use simple average
      const avg = data.reduce((sum, d) => sum + d.quantity, 0) / data.length;
      return Array(periods).fill(avg);
    }
    
    const predictions = [];
    const recentData = data.slice(-window);
    const avg = recentData.reduce((sum, d) => sum + d.quantity, 0) / window;
    
    // Add trend if data shows clear trend
    const trend = this.calculateTrend(data.slice(-14)); // Last 2 weeks trend
    const trendFactor = Math.max(0.8, Math.min(1.2, 1 + trend * 0.1)); // Cap trend influence
    
    for (let i = 0; i < periods; i++) {
      predictions.push(avg * Math.pow(trendFactor, i + 1));
    }
    
    return predictions;
  }
  
  /**
   * Linear Regression Prediction
   * @param {Array} data - Historical sales data
   * @param {number} periods - Number of periods to predict
   */
  static linearRegression(data, periods = 30) {
    if (data.length < 2) {
      const avg = data.length > 0 ? data[0].quantity : 0;
      return Array(periods).fill(avg);
    }
    
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.quantity);
    
    // Calculate regression coefficients
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate predictions
    const predictions = [];
    for (let i = 0; i < periods; i++) {
      const futureX = n + i;
      predictions.push(Math.max(0, slope * futureX + intercept));
    }
    
    return predictions;
  }
  
  /**
   * Exponential Smoothing Prediction
   * @param {Array} data - Historical sales data
   * @param {number} periods - Number of periods to predict
   * @param {number} alpha - Smoothing factor (0-1)
   */
  static exponentialSmoothing(data, periods = 30, alpha = 0.3) {
    if (data.length === 0) return Array(periods).fill(0);
    
    // Initialize with first value
    let smoothed = data[0].quantity;
    const smoothedValues = [smoothed];
    
    // Apply exponential smoothing
    for (let i = 1; i < data.length; i++) {
      smoothed = alpha * data[i].quantity + (1 - alpha) * smoothed;
      smoothedValues.push(smoothed);
    }
    
    // Generate predictions
    const predictions = [];
    for (let i = 0; i < periods; i++) {
      predictions.push(Math.max(0, smoothed));
    }
    
    return predictions;
  }
  
  /**
   * Seasonal Adjustment Prediction
   * @param {Array} data - Historical sales data
   * @param {number} periods - Number of periods to predict
   */
  static seasonalAdjustment(data, periods = 30) {
    if (data.length < 7) {
      return this.movingAverage(data, periods);
    }
    
    // Calculate weekly seasonality
    const weeklyPattern = this.calculateWeeklyPattern(data);
    
    // Get base trend using moving average
    const basePredictions = this.movingAverage(data, periods);
    
    // Apply seasonal adjustment
    const predictions = basePredictions.map((base, i) => {
      const dayOfWeek = (i % 7);
      const seasonalFactor = weeklyPattern[dayOfWeek] || 1;
      return Math.max(0, base * seasonalFactor);
    });
    
    return predictions;
  }
  
  /**
   * Advanced ML-like Prediction (Weighted combination)
   * @param {Array} data - Historical sales data
   * @param {number} periods - Number of periods to predict
   */
  static advancedPrediction(data, periods = 30) {
    if (data.length < 7) {
      return this.movingAverage(data, periods);
    }
    
    // Get predictions from different methods
    const maPred = this.movingAverage(data, periods);
    const lrPred = this.linearRegression(data, periods);
    const esPred = this.exponentialSmoothing(data, periods);
    const saPred = this.seasonalAdjustment(data, periods);
    
    // Weight the predictions based on data characteristics
    const weights = this.calculateWeights(data);
    
    // Combine predictions
    const predictions = [];
    for (let i = 0; i < periods; i++) {
      const combined = 
        maPred[i] * weights.ma +
        lrPred[i] * weights.lr +
        esPred[i] * weights.es +
        saPred[i] * weights.sa;
      
      predictions.push(Math.max(0, combined));
    }
    
    return predictions;
  }
  
  /**
   * Calculate trend from data
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
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }
  
  /**
   * Calculate weekly pattern for seasonal adjustment
   */
  static calculateWeeklyPattern(data) {
    const weeklyTotals = [0, 0, 0, 0, 0, 0, 0];
    const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
    
    data.forEach(day => {
      const dayOfWeek = day.date.getDay();
      weeklyTotals[dayOfWeek] += day.quantity;
      weeklyCounts[dayOfWeek]++;
    });
    
    const avgDaily = data.reduce((sum, d) => sum + d.quantity, 0) / data.length;
    
    return weeklyTotals.map((total, i) => {
      const count = weeklyCounts[i] || 1;
      return (total / count) / avgDaily;
    });
  }
  
  /**
   * Calculate weights for combining different prediction methods
   */
  static calculateWeights(data) {
    const n = data.length;
    const trend = Math.abs(this.calculateTrend(data));
    const volatility = this.calculateVolatility(data);
    
    // Adjust weights based on data characteristics
    let maWeight = 0.3;
    let lrWeight = 0.3;
    let esWeight = 0.2;
    let saWeight = 0.2;
    
    // If strong trend, increase linear regression weight
    if (trend > 0.5) {
      lrWeight += 0.2;
      maWeight -= 0.1;
      esWeight -= 0.1;
    }
    
    // If high volatility, increase exponential smoothing weight
    if (volatility > 0.3) {
      esWeight += 0.2;
      lrWeight -= 0.1;
      maWeight -= 0.1;
    }
    
    // If enough data for seasonality, increase seasonal weight
    if (n >= 14) {
      saWeight += 0.1;
      maWeight -= 0.05;
      lrWeight -= 0.05;
    }
    
    return { ma: maWeight, lr: lrWeight, es: esWeight, sa: saWeight };
  }
  
  /**
   * Calculate volatility (standard deviation / mean)
   */
  static calculateVolatility(data) {
    if (data.length < 2) return 0;
    
    const values = data.map(d => d.quantity);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return mean > 0 ? stdDev / mean : 0;
  }
  
  /**
   * Predict stock-out date
   * @param {number} currentStock - Current stock level
   * @param {Array} predictions - Daily sales predictions
   */
  static predictStockOut(currentStock, predictions) {
    let runningStock = currentStock;
    
    for (let i = 0; i < predictions.length; i++) {
      runningStock -= predictions[i];
      if (runningStock <= 0) {
        return {
          daysUntilStockOut: i + 1,
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          recommendedRestock: Math.ceil(predictions.slice(i, i + 7).reduce((a, b) => a + b, 0))
        };
      }
    }
    
    return {
      daysUntilStockOut: null,
      date: null,
      recommendedRestock: Math.ceil(predictions.slice(0, 7).reduce((a, b) => a + b, 0))
    };
  }
}

