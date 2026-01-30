// Cost of Living - Main Export & Helper Functions
import { COUNTRIES_DATA } from "./countries";
import { EUROPE_CITIES } from "./data-europe";
import { GLOBAL_CITIES } from "./data-global";
import { UK_CITIES } from "./data-uk";
import { CityComparison, CityData, CountryData } from "./types";

// Re-export types
export * from "./types";

// Get all data
export function getAllCountries(): CountryData[] {
  return COUNTRIES_DATA;
}

export function getAllCities(): CityData[] {
  return [...UK_CITIES, ...EUROPE_CITIES, ...GLOBAL_CITIES];
}

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES_DATA.find((c) => c.slug === slug);
}

export function getCityBySlug(citySlug: string): CityData | undefined {
  return getAllCities().find((c) => c.slug === citySlug);
}

export function getCityInCountry(countrySlug: string, citySlug: string): CityData | undefined {
  const country = getCountryBySlug(countrySlug);
  return country?.cities.find((c) => c.slug === citySlug);
}

export function getAllCitySlugs(): { country: string; city: string }[] {
  return COUNTRIES_DATA.flatMap((country) =>
    country.cities.map((city) => ({
      country: country.slug,
      city: city.slug,
    }))
  );
}

export function getAllCountrySlugs(): string[] {
  return COUNTRIES_DATA.map((c) => c.slug);
}

// Sorting and filtering
export function getCheapestCities(limit = 10): CityData[] {
  return getAllCities()
    .sort((a, b) => a.costIndex - b.costIndex)
    .slice(0, limit);
}

export function getMostExpensiveCities(limit = 10): CityData[] {
  return getAllCities()
    .sort((a, b) => b.costIndex - a.costIndex)
    .slice(0, limit);
}

export function getBestValueCities(limit = 10): (CityData & { valueRatio: number })[] {
  return getAllCities()
    .map((city) => ({
      ...city,
      valueRatio: city.averageNetSalaryGBP / (city.costIndex / 100),
    }))
    .sort((a, b) => b.valueRatio - a.valueRatio)
    .slice(0, limit);
}

export function getCitiesByCountry(countrySlug: string): CityData[] {
  const country = getCountryBySlug(countrySlug);
  return country?.cities || [];
}

// Comparison functions
export function compareCities(city1Slug: string, city2Slug: string): CityComparison {
  const city1 = getCityBySlug(city1Slug);
  const city2 = getCityBySlug(city2Slug);

  return {
    city1,
    city2,
    costDifference: city1 && city2 ? city2.costIndex - city1.costIndex : 0,
    rentDifference: city1 && city2 ? city2.rentIndex - city1.rentIndex : 0,
    salaryDifference: city1 && city2 ? city2.averageNetSalaryGBP - city1.averageNetSalaryGBP : 0,
  };
}

// Calculate equivalent salary needed in another city
export function calculateEquivalentSalary(
  currentSalary: number,
  fromCitySlug: string,
  toCitySlug: string
): number {
  const fromCity = getCityBySlug(fromCitySlug);
  const toCity = getCityBySlug(toCitySlug);

  if (!fromCity || !toCity) return currentSalary;

  return Math.round((currentSalary * toCity.costIndex) / fromCity.costIndex);
}

// Calculate purchasing power
export function calculatePurchasingPower(
  salaryGBP: number,
  citySlug: string
): { purchasingPower: number; equivalent: number } {
  const city = getCityBySlug(citySlug);
  if (!city) return { purchasingPower: 100, equivalent: salaryGBP };

  // How much this salary is worth relative to London
  const purchasingPower = (salaryGBP / (city.costIndex / 100));
  const equivalent = Math.round(purchasingPower);

  return { purchasingPower, equivalent };
}

// Format currency
export function formatLocalCurrency(
  amount: number,
  currencySymbol: string,
  locale = "en-GB"
): string {
  return `${currencySymbol}${amount.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

export function formatGBP(amount: number): string {
  return `£${amount.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

// Get comparison pairs for programmatic SEO
export function getComparisonPairs(): { city1: string; city2: string }[] {
  const popularCities = [
    "london", "manchester", "birmingham", "edinburgh",
    "berlin", "amsterdam", "paris", "dublin",
    "new-york", "san-francisco", "toronto", "dubai",
    "sydney", "singapore", "zurich"
  ];

  const pairs: { city1: string; city2: string }[] = [];
  
  for (let i = 0; i < popularCities.length; i++) {
    for (let j = i + 1; j < popularCities.length; j++) {
      pairs.push({ city1: popularCities[i], city2: popularCities[j] });
    }
  }

  return pairs;
}

// Get UK city comparison pairs (for targeted SEO)
export function getUKComparisonPairs(): { city1: string; city2: string }[] {
  const ukCities = UK_CITIES.map(c => c.slug);
  const pairs: { city1: string; city2: string }[] = [];
  
  for (let i = 0; i < ukCities.length; i++) {
    for (let j = i + 1; j < ukCities.length; j++) {
      pairs.push({ city1: ukCities[i], city2: ukCities[j] });
    }
  }

  return pairs;
}
