// AI Model Utilities for Decision Intelligence Platform

export interface PricingRecommendation {
  currentPrice: number;
  recommendedPrice: number;
  confidence: number;
  expectedImpact: number;
  factors: string[];
}

export interface DemandForecast {
  product: string;
  historical: number[];
  predicted: number[];
  confidence: number;
  seasonalFactors: { factor: string; impact: number }[];
}

export interface ChurnRisk {
  customerId: string;
  riskScore: number;
  factors: string[];
  recommendedActions: string[];
  retentionProbability: number;
}

// Simulated AI Pricing Model
export class DynamicPricingAI {
  private marketData: { [key: string]: any } = {
    'premium-plan': {
      basePrice: 99,
      demand: 0.85,
      competition: 0.72,
      seasonality: 1.08,
      elasticity: -0.8
    },
    'basic-plan': {
      basePrice: 29,
      demand: 1.15,
      competition: 0.95,
      seasonality: 0.93,
      elasticity: -1.2
    },
    'enterprise-plan': {
      basePrice: 299,
      demand: 0.78,
      competition: 0.65,
      seasonality: 1.12,
      elasticity: -0.6
    }
  };

  calculateOptimalPrice(productId: string): PricingRecommendation {
    const data = this.marketData[productId];
    if (!data) throw new Error('Product not found');

    const demandMultiplier = data.demand;
    const competitionFactor = data.competition;
    const seasonalFactor = data.seasonality;
    
    // AI pricing algorithm
    const priceAdjustment = (demandMultiplier - 1) * 0.15 + 
                           (1 - competitionFactor) * 0.1 + 
                           (seasonalFactor - 1) * 0.12;
    
    const recommendedPrice = Math.round(data.basePrice * (1 + priceAdjustment));
    const confidence = Math.min(95, 75 + Math.abs(priceAdjustment) * 100);
    const expectedImpact = (recommendedPrice - data.basePrice) * 450; // Estimated monthly impact

    const factors = [];
    if (demandMultiplier > 1.05) factors.push('High demand detected');
    if (competitionFactor < 0.8) factors.push('Limited competition');
    if (seasonalFactor > 1.05) factors.push('Seasonal uptrend');
    if (demandMultiplier < 0.95) factors.push('Demand softening');
    if (competitionFactor > 0.9) factors.push('Competitive pressure');

    return {
      currentPrice: data.basePrice,
      recommendedPrice,
      confidence,
      expectedImpact,
      factors
    };
  }

  updateMarketConditions(productId: string, conditions: Partial<typeof this.marketData[string]>) {
    if (this.marketData[productId]) {
      this.marketData[productId] = { ...this.marketData[productId], ...conditions };
    }
  }
}

// Simulated Demand Forecasting Model
export class DemandForecastingAI {
  private historicalData: { [key: string]: number[] } = {
    'Premium Plan': [1100, 1150, 1200, 1180, 1220, 1250, 1280, 1320, 1350, 1380, 1400, 1420],
    'Basic Plan': [3200, 3250, 3300, 3280, 3320, 3400, 3450, 3500, 3520, 3580, 3600, 3650],
    'Enterprise Plan': [150, 155, 160, 165, 170, 180, 185, 190, 195, 200, 205, 210],
    'Starter Plan': [2200, 2150, 2100, 2080, 2050, 2100, 2080, 2000, 1980, 1960, 1950, 1940]
  };

  generateForecast(product: string, periods: number = 6): DemandForecast {
    const historical = this.historicalData[product] || [];
    const trend = this.calculateTrend(historical);
    const seasonality = this.calculateSeasonality(historical);
    
    const predicted = [];
    const lastValue = historical[historical.length - 1];
    
    for (let i = 1; i <= periods; i++) {
      const trendComponent = lastValue + (trend * i);
      const seasonalComponent = seasonality[i % seasonality.length];
      const noise = (Math.random() - 0.5) * 0.05; // 5% random variation
      
      predicted.push(Math.round(trendComponent * seasonalComponent * (1 + noise)));
    }

    const confidence = Math.max(75, 95 - (periods * 2)); // Confidence decreases with time

    const seasonalFactors = [
      { factor: 'Holiday Season', impact: 0.25 },
      { factor: 'Back-to-School', impact: 0.18 },
      { factor: 'Summer Slowdown', impact: -0.15 },
      { factor: 'Year-End Budget', impact: 0.30 }
    ];

    return {
      product,
      historical: historical.slice(-12), // Last 12 periods
      predicted,
      confidence,
      seasonalFactors
    };
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = data.reduce((sum, _, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateSeasonality(data: number[]): number[] {
    const seasonalPeriod = 4; // Quarterly seasonality
    const seasonal = [];
    
    for (let i = 0; i < seasonalPeriod; i++) {
      const seasonalValues = [];
      for (let j = i; j < data.length; j += seasonalPeriod) {
        seasonalValues.push(data[j]);
      }
      const avg = seasonalValues.reduce((a, b) => a + b, 0) / seasonalValues.length;
      const overallAvg = data.reduce((a, b) => a + b, 0) / data.length;
      seasonal.push(avg / overallAvg);
    }
    
    return seasonal;
  }
}

// Simulated Churn Prediction Model
export class ChurnPredictionAI {
  private customerFeatures: { [key: string]: any } = {
    'CUST001': { usage: 0.3, support_tickets: 5, contract_days: 30, engagement: 0.2 },
    'CUST002': { usage: 0.1, support_tickets: 2, contract_days: 15, engagement: 0.1 },
    'CUST003': { usage: 0.6, support_tickets: 3, contract_days: 45, engagement: 0.4 },
    'CUST004': { usage: 0.8, support_tickets: 1, contract_days: 120, engagement: 0.7 },
    'CUST005': { usage: 0.9, support_tickets: 0, contract_days: 200, engagement: 0.9 }
  };

  predictChurnRisk(customerId: string): ChurnRisk {
    const features = this.customerFeatures[customerId];
    if (!features) throw new Error('Customer not found');

    // Churn risk calculation using weighted features
    const usageScore = (1 - features.usage) * 0.3;
    const supportScore = Math.min(features.support_tickets / 10, 1) * 0.25;
    const contractScore = Math.max(0, (60 - features.contract_days) / 60) * 0.25;
    const engagementScore = (1 - features.engagement) * 0.2;

    const riskScore = Math.round((usageScore + supportScore + contractScore + engagementScore) * 100);

    const factors = [];
    if (features.usage < 0.5) factors.push('Low platform usage');
    if (features.support_tickets > 3) factors.push('High support ticket volume');
    if (features.contract_days < 60) factors.push('Contract expiring soon');
    if (features.engagement < 0.4) factors.push('Low engagement score');

    const recommendedActions = [];
    if (riskScore > 70) {
      recommendedActions.push('Immediate personal outreach');
      recommendedActions.push('Offer retention discount');
    }
    if (features.usage < 0.3) recommendedActions.push('Schedule product training');
    if (features.support_tickets > 2) recommendedActions.push('Escalate to success manager');

    const retentionProbability = Math.max(10, 90 - riskScore);

    return {
      customerId,
      riskScore,
      factors,
      recommendedActions,
      retentionProbability
    };
  }

  batchPredict(customerIds: string[]): ChurnRisk[] {
    return customerIds.map(id => this.predictChurnRisk(id));
  }

  updateCustomerFeatures(customerId: string, features: Partial<typeof this.customerFeatures[string]>) {
    if (this.customerFeatures[customerId]) {
      this.customerFeatures[customerId] = { ...this.customerFeatures[customerId], ...features };
    }
  }
}

// Export singleton instances
export const pricingAI = new DynamicPricingAI();
export const forecastingAI = new DemandForecastingAI();
export const churnAI = new ChurnPredictionAI();