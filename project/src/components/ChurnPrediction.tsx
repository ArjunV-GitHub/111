import React, { useState } from 'react';
import { Users, AlertTriangle, Shield, TrendingDown, Mail, Phone, Gift } from 'lucide-react';

const ChurnPrediction: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');

  const churnSegments = [
    { id: 'all', name: 'All Customers', count: 48392, risk: 'medium' },
    { id: 'premium', name: 'Premium', count: 12450, risk: 'low' },
    { id: 'basic', name: 'Basic', count: 28900, risk: 'high' },
    { id: 'enterprise', name: 'Enterprise', count: 7042, risk: 'low' },
  ];

  const highRiskCustomers = [
    {
      id: 'CUST001',
      name: 'Acme Corp',
      plan: 'Premium',
      riskScore: 87,
      reasons: ['Decreased usage', 'Support tickets', 'Contract expiring'],
      lastActive: '3 days ago',
      value: '$12,500',
    },
    {
      id: 'CUST002',
      name: 'TechStart Inc',
      plan: 'Basic',
      riskScore: 92,
      reasons: ['No recent login', 'Feature usage drop', 'Competitor inquiry'],
      lastActive: '1 week ago',
      value: '$2,100',
    },
    {
      id: 'CUST003',
      name: 'Global Solutions',
      plan: 'Enterprise',
      riskScore: 78,
      reasons: ['Budget cuts', 'Team reduction', 'Usage decline'],
      lastActive: '2 days ago',
      value: '$45,000',
    },
  ];

  const retentionStrategies = [
    {
      type: 'Discount Campaign',
      icon: Gift,
      description: 'Offer 25% discount for next 3 months',
      effectiveness: '74%',
      cost: 'Low',
      applicableRisk: 'Medium to High',
    },
    {
      type: 'Personal Outreach',
      icon: Phone,
      description: 'Direct call from account manager',
      effectiveness: '68%',
      cost: 'Medium',
      applicableRisk: 'High',
    },
    {
      type: 'Feature Training',
      icon: Users,
      description: 'Personalized onboarding session',
      effectiveness: '61%',
      cost: 'Medium',
      applicableRisk: 'Medium',
    },
    {
      type: 'Email Nurture',
      icon: Mail,
      description: 'Automated re-engagement emails',
      effectiveness: '43%',
      cost: 'Low',
      applicableRisk: 'Low to Medium',
    },
  ];

  const churnMetrics = [
    { label: 'Overall Churn Rate', value: '3.2%', change: '-0.8%', trend: 'down' },
    { label: 'High Risk Customers', value: '1,247', change: '+127', trend: 'up' },
    { label: 'Retention Rate', value: '96.8%', change: '+0.8%', trend: 'up' },
    { label: 'Avg Customer Value', value: '$4,250', change: '+$180', trend: 'up' },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'High Risk';
    if (score >= 60) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="space-y-6">
      {/* Churn Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {churnMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">{metric.label}</h3>
              <span className={`text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Segment Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Segment Analysis</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {churnSegments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => setSelectedSegment(segment.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSegment === segment.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">{segment.name}</h4>
                  <p className="text-sm text-gray-500">{segment.count.toLocaleString()} customers</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    segment.risk === 'high' ? 'bg-red-100 text-red-800' :
                    segment.risk === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {segment.risk} risk
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">High Risk Customers</h3>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Launch Retention Campaign
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {highRiskCustomers.map((customer, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-500">{customer.plan} Plan • {customer.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    getRiskColor(customer.riskScore)
                  }`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {getRiskLabel(customer.riskScore)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Score: {customer.riskScore}%</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Risk Factors</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {customer.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Activity</h5>
                  <p className="text-sm text-gray-600">Last active: {customer.lastActive}</p>
                  <div className="mt-2 space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Contact
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention Strategies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Retention Strategies</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retentionStrategies.map((strategy, index) => {
              const Icon = strategy.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">{strategy.type}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600 font-medium">{strategy.effectiveness} success</span>
                      <span className="text-gray-500">{strategy.cost} cost</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Deploy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Churn Prediction Model */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI Model Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-lg mb-3">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">94.7%</p>
                <p className="text-sm text-gray-600">Prediction Accuracy</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-4 rounded-lg mb-3">
                <TrendingDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">67%</p>
                <p className="text-sm text-gray-600">Churn Prevention</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 p-4 rounded-lg mb-3">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">$2.3M</p>
                <p className="text-sm text-gray-600">Revenue Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPrediction;