import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dataGenerator, MetricData } from '../utils/dataGenerator';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    revenue: { value: '$12.4M', change: '+15.3%', trend: 'up' as const },
    customers: { value: '48,392', change: '+8.2%', trend: 'up' as const },
    churnRate: { value: '3.2%', change: '-0.8%', trend: 'down' as const },
    aiAccuracy: { value: '94.7%', change: '+2.1%', trend: 'up' as const }
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [demandData, setDemandData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Generate initial chart data
    const historical = dataGenerator.generateHistoricalData(12);
    const forecast = dataGenerator.generateForecastData(historical, 6);
    setRevenueData([...historical, ...forecast]);

    // Subscribe to real-time updates
    const updateMetrics = () => {
      dataGenerator.subscribe('revenue', (data: MetricData) => {
        setMetrics(prev => ({
          ...prev,
          revenue: {
            value: `$${(data.value / 1000000).toFixed(1)}M`,
            change: `${data.change > 0 ? '+' : ''}${(data.change * 100).toFixed(1)}%`,
            trend: data.change > 0 ? 'up' : 'down'
          }
        }));
        setLastUpdate(new Date());
      });

      dataGenerator.subscribe('customers', (data: MetricData) => {
        setMetrics(prev => ({
          ...prev,
          customers: {
            value: data.value.toLocaleString(),
            change: `${data.change > 0 ? '+' : ''}${(data.change * 100).toFixed(1)}%`,
            trend: data.change > 0 ? 'up' : 'down'
          }
        }));
      });

      dataGenerator.subscribe('churnRate', (data: MetricData) => {
        setMetrics(prev => ({
          ...prev,
          churnRate: {
            value: `${data.value}%`,
            change: `${data.change > 0 ? '+' : ''}${data.change}%`,
            trend: data.change < 0 ? 'up' : 'down' // Inverted for churn (lower is better)
          }
        }));
      });

      dataGenerator.subscribe('aiAccuracy', (data: MetricData) => {
        setMetrics(prev => ({
          ...prev,
          aiAccuracy: {
            value: `${data.value}%`,
            change: `${data.change > 0 ? '+' : ''}${data.change}%`,
            trend: data.change > 0 ? 'up' : 'down'
          }
        }));
      });

      dataGenerator.subscribe('demandTrend', (data: any[]) => {
        setDemandData(data);
      });
    };

    updateMetrics();

    return () => {
      // Cleanup subscriptions would go here in a real implementation
    };
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new data
    const historical = dataGenerator.generateHistoricalData(12);
    const forecast = dataGenerator.generateForecastData(historical, 6);
    setRevenueData([...historical, ...forecast]);
    
    setIsLoading(false);
    setLastUpdate(new Date());
  };

  const metricConfigs = [
    {
      title: 'Total Revenue',
      ...metrics.revenue,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Customers',
      ...metrics.customers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Churn Rate',
      ...metrics.churnRate,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'AI Accuracy',
      ...metrics.aiAccuracy,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const alerts = [
    { type: 'warning', message: 'High churn risk detected in Premium segment', time: '2 hours ago', severity: 'high' },
    { type: 'success', message: 'Pricing optimization increased revenue by 12%', time: '4 hours ago', severity: 'medium' },
    { type: 'info', message: 'Demand forecast updated for Q4 2024', time: '6 hours ago', severity: 'low' },
  ];

  const recentDecisions = [
    { action: 'Price Adjustment', product: 'Premium Plan', impact: '+$47K revenue', status: 'active', confidence: 92 },
    { action: 'Retention Campaign', segment: 'High-risk customers', impact: '127 customers saved', status: 'completed', confidence: 87 },
    { action: 'Inventory Optimization', category: 'Electronics', impact: '15% reduction in overstock', status: 'active', confidence: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated: {format(lastUpdate, 'MMM dd, yyyy HH:mm:ss')}</p>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Updating...' : 'Refresh Data'}</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricConfigs.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-500">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend & AI Predictions</h3>
          <p className="text-sm text-gray-500">Historical data with 6-month AI forecast</p>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 1000000).toFixed(2)}M`, 'Revenue']}
                  labelFormatter={(label) => `Period: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI-Powered Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Alerts</h3>
            <p className="text-sm text-gray-500">Real-time intelligent notifications</p>
          </div>
          <div className="p-6 space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-1 rounded-full ${
                  alert.type === 'warning' ? 'bg-amber-100' :
                  alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-amber-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{alert.time}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Decisions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent AI Decisions</h3>
            <p className="text-sm text-gray-500">Automated actions and their impact</p>
          </div>
          <div className="p-6 space-y-4">
            {recentDecisions.map((decision, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{decision.action}</p>
                  <p className="text-xs text-gray-500">
                    {decision.product || decision.segment || decision.category}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {decision.confidence}% confidence
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{decision.impact}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    decision.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {decision.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demand Analysis Chart */}
      {demandData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Demand Analysis</h3>
            <p className="text-sm text-gray-500">Current vs predicted demand by product</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" name="Current" />
                  <Bar dataKey="predicted" fill="#10b981" name="Predicted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;