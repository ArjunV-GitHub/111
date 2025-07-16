import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Zap, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { pricingAI, PricingRecommendation } from '../utils/aiModels';
import { dataGenerator } from '../utils/dataGenerator';

const DynamicPricing: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState('premium-plan');
  const [recommendations, setRecommendations] = useState<{ [key: string]: PricingRecommendation }>({});
  const [performanceData, setPerformanceData] = useState<any>({});
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());

  const products = [
    {
      id: 'premium-plan',
      name: 'Premium Plan',
      description: 'Advanced features for growing businesses',
      category: 'Subscription'
    },
    {
      id: 'basic-plan',
      name: 'Basic Plan',
      description: 'Essential features for small teams',
      category: 'Subscription'
    },
    {
      id: 'enterprise-plan',
      name: 'Enterprise Plan',
      description: 'Full-scale solution for large organizations',
      category: 'Enterprise'
    },
  ];

  useEffect(() => {
    // Generate initial recommendations for all products
    const initialRecommendations: { [key: string]: PricingRecommendation } = {};
    products.forEach(product => {
      try {
        initialRecommendations[product.id] = pricingAI.calculateOptimalPrice(product.id);
      } catch (error) {
        console.error(`Error calculating price for ${product.id}:`, error);
      }
    });
    setRecommendations(initialRecommendations);

    // Generate price history data
    const history = Array.from({ length: 12 }, (_, i) => {
      const basePrice = initialRecommendations[selectedProduct]?.currentPrice || 99;
      const variation = (Math.random() - 0.5) * 0.1;
      return {
        month: `Month ${i + 1}`,
        price: Math.round(basePrice * (1 + variation)),
        revenue: Math.round((basePrice * (1 + variation)) * (1000 + Math.random() * 500)),
        conversions: Math.round(85 + Math.random() * 10)
      };
    });
    setPriceHistory(history);

    // Subscribe to performance data updates
    dataGenerator.subscribe('pricingPerformance', (data) => {
      setPerformanceData(data);
    });
  }, [selectedProduct]);

  const handleApplyRecommendation = async (productId: string) => {
    setIsOptimizing(true);
    
    // Simulate API call to apply pricing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update market conditions to reflect the change
    const recommendation = recommendations[productId];
    if (recommendation) {
      pricingAI.updateMarketConditions(productId, {
        basePrice: recommendation.recommendedPrice
      });
      
      // Recalculate recommendation
      const newRecommendation = pricingAI.calculateOptimalPrice(productId);
      setRecommendations(prev => ({
        ...prev,
        [productId]: newRecommendation
      }));
      
      setAppliedRecommendations(prev => new Set([...prev, productId]));
    }
    
    setIsOptimizing(false);
  };

  const refreshRecommendations = async () => {
    setIsOptimizing(true);
    
    // Simulate market data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedRecommendations: { [key: string]: PricingRecommendation } = {};
    products.forEach(product => {
      // Simulate market condition changes
      const marketChange = {
        demand: 0.8 + Math.random() * 0.4,
        competition: 0.6 + Math.random() * 0.4,
        seasonality: 0.9 + Math.random() * 0.2
      };
      
      pricingAI.updateMarketConditions(product.id, marketChange);
      updatedRecommendations[product.id] = pricingAI.calculateOptimalPrice(product.id);
    });
    
    setRecommendations(updatedRecommendations);
    setIsOptimizing(false);
  };

  const currentProduct = products.find(p => p.id === selectedProduct);
  const currentRecommendation = recommendations[selectedProduct];

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Pricing Intelligence</h1>
          <p className="text-sm text-gray-500">AI-powered pricing optimization in real-time</p>
        </div>
        <button
          onClick={refreshRecommendations}
          disabled={isOptimizing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : 'Refresh Analysis'}</span>
        </button>
      </div>

      {/* Product Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Product for Pricing Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const recommendation = recommendations[product.id];
            const isApplied = appliedRecommendations.has(product.id);
            
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedProduct === product.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  {isApplied && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Applied
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                {recommendation && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Current: <span className="font-medium">${recommendation.currentPrice}</span>
                    </p>
                    <p className="text-sm text-blue-600">
                      AI Rec: <span className="font-medium">${recommendation.recommendedPrice}</span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getConfidenceColor(recommendation.confidence)
                      }`}>
                        {recommendation.confidence}% confidence
                      </span>
                      <span className={`text-xs font-medium ${
                        getImpactColor(recommendation.expectedImpact)
                      }`}>
                        {recommendation.expectedImpact > 0 ? '+' : ''}${Math.abs(recommendation.expectedImpact).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {currentProduct && currentRecommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Recommendation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Pricing Recommendation</h3>
              <p className="text-sm text-gray-500">{currentProduct.name}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="text-2xl font-bold text-gray-900">${currentRecommendation.currentPrice}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-500">AI Recommended</p>
                    <p className="text-2xl font-bold text-blue-600">${currentRecommendation.recommendedPrice}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Confidence</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{currentRecommendation.confidence}%</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Monthly Impact</span>
                    </div>
                    <span className={`text-lg font-bold ${getImpactColor(currentRecommendation.expectedImpact)}`}>
                      {currentRecommendation.expectedImpact > 0 ? '+' : ''}${Math.abs(currentRecommendation.expectedImpact).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Factors Influencing Price</h4>
                <div className="space-y-2">
                  {currentRecommendation.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleApplyRecommendation(selectedProduct)}
                  disabled={isOptimizing || appliedRecommendations.has(selectedProduct)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>
                    {appliedRecommendations.has(selectedProduct) 
                      ? 'Recommendation Applied' 
                      : isOptimizing 
                        ? 'Applying...' 
                        : 'Apply AI Recommendation'
                    }
                  </span>
                </button>
                
                {appliedRecommendations.has(selectedProduct) && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Price optimization has been applied successfully</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Performance Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Price Performance Analytics</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    +{performanceData.revenue || 23}%
                  </p>
                  <p className="text-sm text-gray-600">Revenue Growth</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {performanceData.conversion || 89}%
                  </p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price History Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Price ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-2">Market Intelligence</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Competitor avg price: ${currentRecommendation.currentPrice + 6}</li>
                  <li>• Market demand: {Math.random() > 0.5 ? 'High' : 'Medium'} ({(Math.random() * 20 + 5).toFixed(0)}%)</li>
                  <li>• Price elasticity: {(Math.random() * -1.5 - 0.5).toFixed(1)}</li>
                  <li>• Seasonal factor: {(Math.random() * 0.3 + 0.9).toFixed(2)}x</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Rules Engine */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Automated Pricing Rules</h3>
          <p className="text-sm text-gray-500">Configure intelligent pricing automation</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Competitive Pricing',
                description: 'Auto-adjust based on competitor analysis',
                status: 'active',
                trigger: 'Competitor price change > 5%',
                action: 'Adjust within 2 hours'
              },
              {
                name: 'Demand-Based Pricing',
                description: 'Price adjustment based on demand patterns',
                status: 'active',
                trigger: 'Demand spike > 20%',
                action: 'Increase price by 3-8%'
              },
              {
                name: 'Inventory Optimization',
                description: 'Dynamic pricing for inventory management',
                status: 'pending',
                trigger: 'Stock level < 15%',
                action: 'Reduce price by 10-15%'
              }
            ].map((rule, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rule.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Trigger:</span> {rule.trigger}
                  </div>
                  <div>
                    <span className="font-medium">Action:</span> {rule.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPricing;