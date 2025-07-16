import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DynamicPricing from './components/DynamicPricing';
import DemandForecasting from './components/DemandForecasting';
import ChurnPrediction from './components/ChurnPrediction';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'pricing':
        return <DynamicPricing />;
      case 'forecasting':
        return <DemandForecasting />;
      case 'churn':
        return <ChurnPrediction />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;