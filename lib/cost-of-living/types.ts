// Cost of Living Types

export interface DataSource {
  name: string;
  url?: string;
  reliability: number; // 0-100 confidence score
}

export interface CityData {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  population: number;
  currency: string;
  currencySymbol: string;
  
  // Cost indices (London = 100 baseline)
  costIndex: number;
  rentIndex: number;
  groceriesIndex: number;
  restaurantsIndex: number;
  transportIndex: number;
  utilitiesIndex: number;
  childcareIndex?: number; // Optional: for better family cost comparison
  healthcareIndex?: number; // Optional: for healthcare cost comparison
  
  // Salary data
  averageNetSalary: number; // In local currency, monthly
  averageNetSalaryGBP: number; // Converted to GBP
  medianNetSalary?: number; // Optional: median salary
  
  // Metadata
  description: string;
  highlights: string[];
  lastUpdated: string; // ISO 8601 format
  dataVersion: string; // Semantic versioning for data changes
  
  // Data quality metrics
  dataQuality: {
    score: number; // 0-100 overall quality score
    sources: DataSource[];
    sampleSize?: number; // Number of data points collected
    confidence: number; // Statistical confidence (0-100)
  };
  
  // Additional metrics
  qualityOfLifeIndex?: number; // Optional: overall quality of life score
  safetyIndex?: number; // Optional: safety score
}

export interface CountryData {
  slug: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToGBP: number;
  cities: CityData[];
  description: string;
  flagEmoji: string;
  
  // Additional country metrics
  minimumWage?: number; // Monthly minimum wage in local currency
  averageTaxRate?: number; // Average tax burden percentage
  region: string; // Geographic region (e.g., "Europe", "North America")
}

export interface CityComparison {
  city1: CityData | undefined;
  city2: CityData | undefined;
  costDifference: number;
  rentDifference: number;
  salaryDifference: number;
}
