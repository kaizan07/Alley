"""
Simple aggregation model for sales data processing
"""

from datetime import datetime, timedelta
from collections import defaultdict
from typing import List, Dict, Any, Optional


class AggregationModel:
    """
    Simple aggregation model for sales data
    """
    
    @staticmethod
    def aggregate_sales_data(orders: List[Dict], period: str = 'daily') -> List[Dict]:
        """
        Aggregate sales data by time period
        
        Args:
            orders: List of order dictionaries with items
            period: 'daily', 'weekly', or 'monthly'
            
        Returns:
            List of aggregated sales data
        """
        sales_map = {}
        
        for order in orders:
            order_date = datetime.fromisoformat(order['createdAt'].replace('Z', '+00:00'))
            period_start = AggregationModel._get_period_start(order_date, period)
            key = period_start.strftime('%Y-%m-%d')
            
            if key not in sales_map:
                sales_map[key] = {
                    'date': period_start.isoformat(),
                    'quantity': 0,
                    'revenue': 0,
                    'orders': 0
                }
            
            for item in order.get('items', []):
                sales_map[key]['quantity'] += item.get('quantity', 0)
                sales_map[key]['revenue'] += item.get('price', 0) * item.get('quantity', 0)
                sales_map[key]['orders'] += 1
        
        return sorted(sales_map.values(), key=lambda x: x['date'])
    
    @staticmethod
    def aggregate_by_period(data: List[Dict], period: str = 'daily') -> List[Dict]:
        """
        Aggregate data by time period
        
        Args:
            data: List of data points with date and quantity/revenue
            period: 'daily', 'weekly', or 'monthly'
            
        Returns:
            List of aggregated data
        """
        aggregated = {}
        
        for item in data:
            item_date = datetime.fromisoformat(item['date'].replace('Z', '+00:00'))
            period_start = AggregationModel._get_period_start(item_date, period)
            key = period_start.strftime('%Y-%m-%d')
            
            if key not in aggregated:
                aggregated[key] = {
                    'date': period_start.isoformat(),
                    'quantity': 0,
                    'revenue': 0
                }
            
            aggregated[key]['quantity'] += item.get('quantity', 0)
            aggregated[key]['revenue'] += item.get('revenue', 0)
        
        return sorted(aggregated.values(), key=lambda x: x['date'])
    
    @staticmethod
    def _get_period_start(date: datetime, period: str) -> datetime:
        """
        Get the start of the period for a given date
        
        Args:
            date: Datetime object
            period: 'daily', 'weekly', or 'monthly'
            
        Returns:
            Datetime at start of period
        """
        d = date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        if period == 'daily':
            return d
        elif period == 'weekly':
            days_since_monday = d.weekday()
            return d - timedelta(days=days_since_monday)
        elif period == 'monthly':
            return d.replace(day=1)
        else:
            return d
    
    @staticmethod
    def calculate_trend(data: List[Dict]) -> float:
        """
        Calculate trend (slope) of sales data
        
        Args:
            data: List of data points with quantity
            
        Returns:
            Slope value
        """
        if len(data) < 2:
            return 0.0
        
        n = len(data)
        x = list(range(n))
        y = [d.get('quantity', 0) for d in data]
        
        sum_x = sum(x)
        sum_y = sum(y)
        sum_xy = sum(x[i] * y[i] for i in range(n))
        sum_xx = sum(xi * xi for xi in x)
        
        denominator = n * sum_xx - sum_x * sum_x
        if denominator == 0:
            return 0.0
        
        slope = (n * sum_xy - sum_x * sum_y) / denominator
        return slope
    
    @staticmethod
    def calculate_moving_average(data: List[Dict], window: int = 7) -> List[Dict]:
        """
        Calculate moving average
        
        Args:
            data: List of data points
            window: Window size for moving average
            
        Returns:
            List of moving average data points
        """
        if len(data) < window:
            return data
        
        result = []
        for i in range(window - 1, len(data)):
            window_data = data[i - window + 1:i + 1]
            avg_quantity = sum(d.get('quantity', 0) for d in window_data) / window
            avg_revenue = sum(d.get('revenue', 0) for d in window_data) / window
            
            result.append({
                'date': data[i]['date'],
                'quantity': avg_quantity,
                'revenue': avg_revenue
            })
        
        return result
    
    @staticmethod
    def aggregate_product_sales(orders: List[Dict], product_id: str) -> List[Dict]:
        """
        Aggregate sales for a specific product
        
        Args:
            orders: List of order dictionaries
            product_id: Product ID to filter by
            
        Returns:
            List of product sales data
        """
        product_sales = []
        
        for order in orders:
            for item in order.get('items', []):
                if str(item.get('product', '')) == str(product_id):
                    product_sales.append({
                        'date': order['createdAt'],
                        'quantity': item.get('quantity', 0),
                        'revenue': item.get('price', 0) * item.get('quantity', 0)
                    })
        
        return AggregationModel.aggregate_by_period(product_sales, 'daily')
    
    @staticmethod
    def aggregate_category_sales(orders: List[Dict], products: List[Dict], category: str) -> List[Dict]:
        """
        Aggregate sales for a specific category
        
        Args:
            orders: List of order dictionaries
            products: List of product dictionaries
            category: Category name to filter by
            
        Returns:
            List of category sales data
        """
        # Get product IDs in category
        category_product_ids = {
            str(p.get('_id', '')) for p in products 
            if p.get('category', '') == category
        }
        
        category_sales = []
        
        for order in orders:
            for item in order.get('items', []):
                if str(item.get('product', '')) in category_product_ids:
                    category_sales.append({
                        'date': order['createdAt'],
                        'quantity': item.get('quantity', 0),
                        'revenue': item.get('price', 0) * item.get('quantity', 0)
                    })
        
        return AggregationModel.aggregate_by_period(category_sales, 'daily')
    
    @staticmethod
    def get_summary_stats(data: List[Dict]) -> Dict[str, Any]:
        """
        Get summary statistics from aggregated data
        
        Args:
            data: List of aggregated data points
            
        Returns:
            Dictionary with summary statistics
        """
        if not data:
            return {
                'totalSales': 0,
                'totalRevenue': 0,
                'avgDailySales': 0,
                'dataPoints': 0
            }
        
        total_sales = sum(d.get('quantity', 0) for d in data)
        total_revenue = sum(d.get('revenue', 0) for d in data)
        avg_daily_sales = total_sales / len(data) if data else 0
        
        return {
            'totalSales': total_sales,
            'totalRevenue': total_revenue,
            'avgDailySales': avg_daily_sales,
            'dataPoints': len(data),
            'trend': AggregationModel.calculate_trend(data)
        }

