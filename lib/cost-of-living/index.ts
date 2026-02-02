// Cost of Living - Main Export & Helper Functions
import { COUNTRIES_DATA } from "./countries";
import { EUROPE_CITIES } from "./data-europe";
import { GLOBAL_CITIES } from "./data-global";
import { UK_CITIES } from "./data-uk";
import { US_CITIES } from "./data-us";
import { CityComparison, CityData, CountryData } from "./types";

// Re-export types
export * from "./types";

// Get all data
export function getAllCountries(): CountryData[] {
  return COUNTRIES_DATA;
}

export function getAllCities(): CityData[] {
  return [...US_CITIES, ...UK_CITIES, ...EUROPE_CITIES, ...GLOBAL_CITIES];
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
      valueRatio: city.averageNetSalaryUSD / (city.costIndex / 100),
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
    salaryDifference: city1 && city2 ? city2.averageNetSalaryUSD - city1.averageNetSalaryUSD : 0,
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
  salaryUSD: number,
  citySlug: string
): { purchasingPower: number; equivalent: number } {
  const city = getCityBySlug(citySlug);
  if (!city) return { purchasingPower: 100, equivalent: salaryUSD };

  // How much this salary is worth relative to NYC
  const purchasingPower = (salaryUSD / (city.costIndex / 100));
  const equivalent = Math.round(purchasingPower);

  return { purchasingPower, equivalent };
}

// Format currency
export function formatLocalCurrency(
  amount: number,
  currencySymbol: string,
  locale = "en-US"
): string {
  return `${currencySymbol}${amount.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}


// Get comparison pairs for programmatic SEO
export function getComparisonPairs(): { city1: string; city2: string }[] {
  const popularCities = [
    "new-york", "san-francisco", "los-angeles", "chicago",
    "austin", "seattle", "denver", "boston", "miami", "dallas",
    "london", "berlin", "amsterdam", "paris", "dublin",
    "toronto", "dubai", "sydney", "singapore"
  ].sort(); // Sort alphabetically for consistent canonical URLs

  const pairs: { city1: string; city2: string }[] = [];

  for (let i = 0; i < popularCities.length; i++) {
    for (let j = i + 1; j < popularCities.length; j++) {
      // Since array is sorted, city1 will always be alphabetically first
      pairs.push({ city1: popularCities[i], city2: popularCities[j] });
    }
  }

  return pairs;
}

// Get US city comparison pairs (for targeted SEO)
export function getUSComparisonPairs(): { city1: string; city2: string }[] {
  const usCities = US_CITIES.map(c => c.slug);
  const pairs: { city1: string; city2: string }[] = [];

  for (let i = 0; i < usCities.length; i++) {
    for (let j = i + 1; j < usCities.length; j++) {
      pairs.push({ city1: usCities[i], city2: usCities[j] });
    }
  }

  return pairs;
}

// Get related comparisons for a given city
export function getRelatedComparisons(citySlug: string, limit = 6): { city1: string; city2: string }[] {
  const allPairs = getComparisonPairs();
  return allPairs
    .filter(pair => pair.city1 === citySlug || pair.city2 === citySlug)
    .filter(pair => pair.city1 !== pair.city2)
    .sort(() => 0.5 - Math.random()) // Shuffle for variety
    .slice(0, limit);
}

