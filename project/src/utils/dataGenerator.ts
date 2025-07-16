// Real-time data generation utilities

export interface MetricData {
  timestamp: Date;
  value: number;
  change: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  predicted?: number;
  confidence?: number;
}

export class RealTimeDataGenerator {
  private static instance: RealTimeDataGenerator;
  private subscribers: { [key: string]: ((data: any) => void)[] } = {};
  private intervals: { [key: string]: NodeJS.Timeout } = {};

  static getInstance(): RealTimeDataGenerator {
    if (!RealTimeDataGenerator.instance) {
      RealTimeDataGenerator.instance = new RealTimeDataGenerator();
    }
    return RealTimeDataGenerator.instance;
  }

  subscribe(metric: string, callback: (data: any) => void) {
    if (!this.subscribers[metric]) {
      this.subscribers[metric] = [];
    }
    this.subscribers[metric].push(callback);

    // Start generating data for this metric if not already started
    if (!this.intervals[metric]) {
      this.startDataGeneration(metric);
    }
  }

  unsubscribe(metric: string, callback: (data: any) => void) {
    if (this.subscribers[metric]) {
      this.subscribers[metric] = this.subscribers[metric].filter(cb => cb !== callback);
      
      // Stop data generation if no more subscribers
      if (this.subscribers[metric].length === 0) {
        this.stopDataGeneration(metric);
      }
    }
  }

  private startDataGeneration(metric: string) {
    const generators: { [key: string]: () => any } = {
      revenue: () => this.generateRevenueData(),
      customers: () => this.generateCustomerData(),
      churnRate: () => this.generateChurnData(),
      aiAccuracy: () => this.generateAccuracyData(),
      demandTrend: () => this.generateDemandTrendData(),
      pricingPerformance: () => this.generatePricingPerformanceData()
    };

    const generator = generators[metric];
    if (generator) {
      // Generate initial data
      this.notifySubscribers(metric, generator());
      
      // Set up interval for real-time updates
      this.intervals[metric] = setInterval(() => {
        this.notifySubscribers(metric, generator());
      }, 5000); // Update every 5 seconds
    }
  }

  private stopDataGeneration(metric: string) {
    if (this.intervals[metric]) {
      clearInterval(this.intervals[metric]);
      delete this.intervals[metric];
    }
  }

  private notifySubscribers(metric: string, data: any) {
    if (this.subscribers[metric]) {
      this.subscribers[metric].forEach(callback => callback(data));
    }
  }

  private generateRevenueData(): MetricData {
    const baseRevenue = 12400000;
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const value = Math.round(baseRevenue * (1 + variation));
    const change = (Math.random() - 0.3) * 0.3; // Slight positive bias
    
    return {
      timestamp: new Date(),
      value,
      change: Math.round(change * 1000) / 1000
    };
  }

  private generateCustomerData(): MetricData {
    const baseCustomers = 48392;
    const variation = (Math.random() - 0.5) * 0.01;
    const value = Math.round(baseCustomers * (1 + variation));
    const change = (Math.random() - 0.2) * 0.15;
    
    return {
      timestamp: new Date(),
      value,
      change: Math.round(change * 1000) / 1000
    };
  }

  private generateChurnData(): MetricData {
    const baseChurn = 3.2;
    const variation = (Math.random() - 0.5) * 0.1;
    const value = Math.max(0, baseChurn + variation);
    const change = (Math.random() - 0.6) * 0.2; // Negative bias (good)
    
    return {
      timestamp: new Date(),
      value: Math.round(value * 10) / 10,
      change: Math.round(change * 10) / 10
    };
  }

  private generateAccuracyData(): MetricData {
    const baseAccuracy = 94.7;
    const variation = (Math.random() - 0.5) * 0.5;
    const value = Math.min(99.9, Math.max(85, baseAccuracy + variation));
    const change = (Math.random() - 0.3) * 0.05;
    
    return {
      timestamp: new Date(),
      value: Math.round(value * 10) / 10,
      change: Math.round(change * 10) / 10
    };
  }

  private generateDemandTrendData(): ChartDataPoint[] {
    const products = ['Premium Plan', 'Basic Plan', 'Enterprise Plan', 'Starter Plan'];
    const baseValues = [1420, 3650, 210, 1950];
    
    return products.map((product, index) => {
      const variation = (Math.random() - 0.5) * 0.1;
      const value = Math.round(baseValues[index] * (1 + variation));
      const predicted = Math.round(value * (1 + (Math.random() - 0.3) * 0.2));
      
      return {
        name: product,
        value,
        predicted,
        confidence: Math.round(85 + Math.random() * 10)
      };
    });
  }

  private generatePricingPerformanceData(): { revenue: number; conversion: number; optimization: number } {
    return {
      revenue: Math.round((20 + Math.random() * 10) * 10) / 10,
      conversion: Math.round((85 + Math.random() * 10) * 10) / 10,
      optimization: Math.round((10 + Math.random() * 15) * 10) / 10
    };
  }

  // Generate historical chart data
  generateHistoricalData(periods: number = 12): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    const baseValue = 1000000;
    
    for (let i = 0; i < periods; i++) {
      const trend = i * 50000; // Upward trend
      const seasonal = Math.sin((i / periods) * 2 * Math.PI) * 100000; // Seasonal variation
      const noise = (Math.random() - 0.5) * 50000; // Random noise
      
      data.push({
        name: `Month ${i + 1}`,
        value: Math.round(baseValue + trend + seasonal + noise)
      });
    }
    
    return data;
  }

  // Generate forecast data with confidence intervals
  generateForecastData(historicalData: ChartDataPoint[], periods: number = 6): ChartDataPoint[] {
    const forecast: ChartDataPoint[] = [];
    const lastValue = historicalData[historicalData.length - 1].value;
    const trend = this.calculateTrend(historicalData.map(d => d.value));
    
    for (let i = 1; i <= periods; i++) {
      const trendValue = lastValue + (trend * i);
      const confidence = Math.max(70, 95 - (i * 3)); // Decreasing confidence
      const variation = (Math.random() - 0.5) * 0.1 * trendValue;
      
      forecast.push({
        name: `Forecast ${i}`,
        value: Math.round(trendValue + variation),
        confidence
      });
    }
    
    return forecast;
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
}

export const dataGenerator = RealTimeDataGenerator.getInstance();