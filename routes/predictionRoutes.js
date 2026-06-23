import express from "express";
import { PredictionDataProcessor } from "../utils/predictionDataProcessor.js";
import { PredictionModels } from "../utils/predictionModels.js";

const router = express.Router();

// Dashboard summary
router.get("/dashboard", async (_req, res) => {
  try {
    const products = await PredictionDataProcessor.getProductsWithStock();
    const categories = await PredictionDataProcessor.getCategoriesWithSales();

    const criticalProducts = products
      .filter(p => p.daysOfStock <= 7)
      .map(p => ({
        title: p.title,
        currentStock: p.stock,
        daysOfStock: Math.max(0, Math.round(p.daysOfStock))
      }));

    const totalProducts = products.length;
    const totalCategories = categories.length;
    const warningAlerts = products.filter(p => p.daysOfStock > 7 && p.daysOfStock <= 14).length;
    const avgDailySales = Number(
      (
        products.reduce((sum, p) => sum + (p.avgDailySales || 0), 0) / (totalProducts || 1)
      ).toFixed(1)
    );

    // Simple growth proxy using category trend average
    const salesGrowth = Math.round(
      (categories.reduce((sum, c) => sum + (c.trend || 0), 0) / (totalCategories || 1)) * 100
    ) / 100;

    const topCategories = categories
      .map(c => ({
        category: c.category,
        totalSales: c.totalSales,
        totalRevenue: c.totalRevenue,
        trend: Math.round((c.trend || 0) * 100) / 100
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

    res.json({
      success: true,
      summary: {
        totalProducts,
        criticalAlerts: criticalProducts.length,
        warningAlerts,
        totalCategories,
        salesGrowth,
        avgDailySales
      },
      topCategories,
      criticalProducts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Product predictions
router.get("/products", async (req, res) => {
  try {
    const alertOnly = req.query.alertOnly === 'true';
    const method = (req.query.method || 'advanced').toLowerCase();
    const periods = Math.max(1, Math.min(60, parseInt(req.query.periods || '7', 10)));
    const products = await PredictionDataProcessor.getProductsWithStock();

    const predictions = products.map(p => {
      const data = (p.recentSales || []).map(d => ({ date: new Date(d.date), quantity: d.quantity }));

      let series;
      switch (method) {
        case 'moving_average':
          series = PredictionModels.movingAverage(data, periods);
          break;
        case 'linear_regression':
          series = PredictionModels.linearRegression(data, periods);
          break;
        case 'exponential_smoothing':
          series = PredictionModels.exponentialSmoothing(data, periods);
          break;
        case 'seasonal':
          series = PredictionModels.seasonalAdjustment(data, periods);
          break;
        case 'advanced':
        default:
          series = PredictionModels.advancedPrediction(data, periods);
      }

      const next = series.map((q, i) => ({ day: i + 1, predictedSales: Math.round(q) }));

      const stockOut = PredictionModels.predictStockOut(p.stock || 0, next.map(d => d.predictedSales));
      let alertLevel = 'good';
      if (stockOut.daysUntilStockOut && stockOut.daysUntilStockOut <= 7) alertLevel = 'critical';
      else if (stockOut.daysUntilStockOut && stockOut.daysUntilStockOut <= 14) alertLevel = 'warning';
      else if ((p.stock || 0) < (p.avgDailySales || 0) * 15) alertLevel = 'info';

      const confidence = Math.max(50, Math.min(95, Math.round(80 - (PredictionModels.calculateVolatility(data) * 30))));

      return {
        product: {
          id: p._id,
          title: p.title,
          category: p.category,
          currentStock: p.stock,
        },
        avgDailySales: Math.round(p.avgDailySales || 0),
        daysOfStock: Math.max(0, Math.round(p.daysOfStock || 0)),
        alertLevel,
        confidence,
        predictions: next,
        stockOutPrediction: stockOut
      };
    }).filter(pr => alertOnly ? (pr.alertLevel === 'critical') : true);

    res.json({ success: true, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Category predictions
router.get("/categories", async (req, res) => {
  try {
    const categories = await PredictionDataProcessor.getCategoriesWithSales();
    const method = (req.query.method || 'seasonal').toLowerCase();
    const periods = Math.max(1, Math.min(60, parseInt(req.query.periods || '7', 10)));

    const predictions = categories.map(c => {
      const data = (c.salesData || []).map(d => ({ date: new Date(d.date), quantity: d.quantity }));
      let series;
      switch (method) {
        case 'moving_average':
          series = PredictionModels.movingAverage(data, periods);
          break;
        case 'linear_regression':
          series = PredictionModels.linearRegression(data, periods);
          break;
        case 'exponential_smoothing':
          series = PredictionModels.exponentialSmoothing(data, periods);
          break;
        case 'seasonal':
        default:
          series = PredictionModels.seasonalAdjustment(data, periods);
      }
      const next = series.map((q, i) => ({ day: i + 1, predictedSales: Math.round(q) }));

      return {
        category: c.category,
        totalSales: c.totalSales,
        totalRevenue: c.totalRevenue,
        avgDailySales: Math.round(c.avgDailySales || 0),
        trend: Math.round((PredictionDataProcessor.calculateTrend(c.salesData) || 0) * 100) / 100,
        predictions: next,
        productStockPredictions: []
      };
    });

    res.json({ success: true, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;


