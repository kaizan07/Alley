# Aggregation Model

Simple Python aggregation model for sales data processing.

## Features

- **Sales Data Aggregation**: Aggregate sales by daily, weekly, or monthly periods
- **Product Sales**: Aggregate sales for specific products
- **Category Sales**: Aggregate sales for product categories
- **Trend Calculation**: Calculate trend/slope from sales data
- **Moving Average**: Calculate moving averages for smoothing
- **Summary Statistics**: Get summary stats from aggregated data

## Usage

```python
from aggregation_model import AggregationModel

# Aggregate sales data
orders = [...]  # List of order dictionaries
aggregated = AggregationModel.aggregate_sales_data(orders, period='daily')

# Calculate trend
trend = AggregationModel.calculate_trend(aggregated)

# Get summary statistics
stats = AggregationModel.get_summary_stats(aggregated)
```

## Methods

- `aggregate_sales_data(orders, period)`: Aggregate sales by time period
- `aggregate_by_period(data, period)`: Aggregate data by time period
- `calculate_trend(data)`: Calculate trend/slope
- `calculate_moving_average(data, window)`: Calculate moving average
- `aggregate_product_sales(orders, product_id)`: Aggregate product sales
- `aggregate_category_sales(orders, products, category)`: Aggregate category sales
- `get_summary_stats(data)`: Get summary statistics

## No Dependencies

This model uses only Python standard library - no external packages required!

