// Countries Data with City Mappings
import { EUROPE_CITIES } from "./data-europe";
import { GLOBAL_CITIES } from "./data-global";
import { UK_CITIES } from "./data-uk";
import { CityData, CountryData } from "./types";

// Group cities by country
function groupCitiesByCountry(cities: CityData[]): Record<string, CityData[]> {
  return cities.reduce((acc, city) => {
    const key = city.country;
    if (!acc[key]) acc[key] = [];
    acc[key].push(city);
    return acc;
  }, {} as Record<string, CityData[]>);
}

const allCities = [...UK_CITIES, ...EUROPE_CITIES, ...GLOBAL_CITIES];
const citiesByCountry = groupCitiesByCountry(allCities);

export const COUNTRIES_DATA: CountryData[] = [
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRateToGBP: 1,
    flagEmoji: "🇬🇧",
    description: "The UK offers diverse living costs, from expensive London to affordable northern cities.",
    cities: citiesByCountry["United Kingdom"] || [],
  },
  {
    slug: "germany",
    name: "Germany",
    code: "DE",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇩🇪",
    description: "Germany offers high living standards with excellent infrastructure and varied costs.",
    cities: citiesByCountry["Germany"] || [],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    code: "NL",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇳🇱",
    description: "The Netherlands offers excellent quality of life with high salaries.",
    cities: citiesByCountry["Netherlands"] || [],
  },
  {
    slug: "france",
    name: "France",
    code: "FR",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇫🇷",
    description: "France offers high quality of life with excellent healthcare and culture.",
    cities: citiesByCountry["France"] || [],
  },
  {
    slug: "spain",
    name: "Spain",
    code: "ES",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇪🇸",
    description: "Spain offers excellent quality of life at lower costs with great weather.",
    cities: citiesByCountry["Spain"] || [],
  },
  {
    slug: "portugal",
    name: "Portugal",
    code: "PT",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇵🇹",
    description: "Portugal is a hotspot for expats with affordable living and great weather.",
    cities: citiesByCountry["Portugal"] || [],
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    code: "CH",
    currency: "CHF",
    currencySymbol: "CHF",
    exchangeRateToGBP: 0.89,
    flagEmoji: "🇨🇭",
    description: "Switzerland has the highest salaries in Europe but also the highest costs.",
    cities: citiesByCountry["Switzerland"] || [],
  },
  {
    slug: "ireland",
    name: "Ireland",
    code: "IE",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToGBP: 0.86,
    flagEmoji: "🇮🇪",
    description: "Ireland hosts major tech companies with high salaries.",
    cities: citiesByCountry["Ireland"] || [],
  },
  {
    slug: "poland",
    name: "Poland",
    code: "PL",
    currency: "PLN",
    currencySymbol: "zł",
    exchangeRateToGBP: 0.20,
    flagEmoji: "🇵🇱",
    description: "Poland offers low costs with rapidly growing tech scene.",
    cities: citiesByCountry["Poland"] || [],
  },
  {
    slug: "united-states",
    name: "United States",
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToGBP: 0.79,
    flagEmoji: "🇺🇸",
    description: "The US offers high salaries especially in tech.",
    cities: citiesByCountry["United States"] || [],
  },
  {
    slug: "canada",
    name: "Canada",
    code: "CA",
    currency: "CAD",
    currencySymbol: "C$",
    exchangeRateToGBP: 0.59,
    flagEmoji: "🇨🇦",
    description: "Canada offers high quality of life with universal healthcare.",
    cities: citiesByCountry["Canada"] || [],
  },
  {
    slug: "united-arab-emirates",
    name: "United Arab Emirates",
    code: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    exchangeRateToGBP: 0.22,
    flagEmoji: "🇦🇪",
    description: "The UAE offers tax-free salaries with high living standards.",
    cities: citiesByCountry["United Arab Emirates"] || [],
  },
  {
    slug: "singapore",
    name: "Singapore",
    code: "SG",
    currency: "SGD",
    currencySymbol: "S$",
    exchangeRateToGBP: 0.59,
    flagEmoji: "🇸🇬",
    description: "Singapore is Asia's financial hub with low taxes.",
    cities: citiesByCountry["Singapore"] || [],
  },
  {
    slug: "australia",
    name: "Australia",
    code: "AU",
    currency: "AUD",
    currencySymbol: "A$",
    exchangeRateToGBP: 0.52,
    flagEmoji: "🇦🇺",
    description: "Australia offers high salaries and outdoor lifestyle.",
    cities: citiesByCountry["Australia"] || [],
  },
];
