import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart3, Target, AlertCircle, CheckCircle } from 'lucide-react';

const DemandForecasting: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('next-quarter');

  const forecastData = [
    { product: 'Premium Plan', current: 1250, predicted: 1420, confidence: 94, trend: 'up' },
    { product: 'Basic Plan', current: 3400, predicted: 3650, confidence: 91, trend: 'up' },
    { product: 'Enterprise Plan', current: 180, predicted: 210, confidence: 89, trend: 'up' },
    { product: 'Starter Plan', current: 2100, predicted: 1950, confidence: 87, trend: 'down' },
  ];

  const seasonalFactors = [
    { factor: 'Holiday Season', impact: '+25%', period: 'Q4', type: 'positive' },
    { factor: 'Summer Slowdown', impact: '-15%', period: 'Q3', type: 'negative' },
    { factor: 'Back-to-School', impact: '+18%', period: 'Q3', type: 'positive' },
    { factor: 'Year-End Budget', impact: '+30%', period: 'Q4', type: 'positive' },
  ];

  const forecastAccuracy = [
    { period: 'Last Month', accuracy: '96.2%', deviation: '±3.8%' },
    { period: 'Last Quarter', accuracy: '94.7%', deviation: '±5.3%' },
    { period: 'Last Year', accuracy: '91.4%', deviation: '±8.6%' },
  ];

  return (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Configuration</h3>
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="next-month">Next Month</option>
            <option value="next-quarter">Next Quarter</option>
            <option value="next-year">Next Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Generate Forecast
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Demand Forecast by Product</h3>
          </div>
          <div className="p-6 space-y-4">
            {forecastData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">Current: {item.current}</span>
                    <span className="text-sm text-gray-500">Predicted: {item.predicted}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-medium">
                      {item.trend === 'up' ? '+' : '-'}
                      {Math.abs(((item.predicted - item.current) / item.current) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{item.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Seasonal Factors</h3>
          </div>
          <div className="p-6 space-y-4">
            {seasonalFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    factor.type === 'positive' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {factor.type === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                    <p className="text-sm text-gray-500">{factor.period}</p>
                  </div>
                </div>
                <span className={`font-medium ${
                  factor.type === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {factor.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Accuracy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Forecast Accuracy Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forecastAccuracy.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 p-4 rounded-lg mb-3">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{metric.accuracy}</p>
                  <p className="text-sm text-gray-600">{metric.period}</p>
                </div>
                <p className="text-sm text-gray-500">Deviation: {metric.deviation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Demand Trend Visualization</h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Interactive demand forecast chart</p>
              <p className="text-sm text-gray-500 mt-1">Historical data vs. AI predictions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Strong Growth Expected</h4>
              <p className="text-sm text-gray-600">Premium Plan demand is forecasted to increase by 13.6% due to feature enhancements and market expansion.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Seasonal Adjustment Needed</h4>
              <p className="text-sm text-gray-600">Consider inventory buildup for Q4 holiday season surge based on historical patterns.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Market Opportunity</h4>
              <p className="text-sm text-gray-600">Enterprise Plan shows untapped potential with 16.7% growth opportunity in the next quarter.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandForecasting;