import { getAllCountries, getAllCities, getComparisonPairs } from "@/lib/cost-of-living";
import { getAllJobSlugs } from "@/lib/us-job-salaries";
import { COMMON_SALARIES } from "@/lib/us-tax-calculator";
import { getAllSavingsSlugs } from "@/lib/savings-calculator";
import { US_BENEFITS } from "@/lib/benefits/us-benefits-data";
import type { MetadataRoute } from "next";

const BASE_URL = "https://calculatesalary.us";

// Use a static date for lastModified to give Google a meaningful signal
// Update this date when content actually changes (e.g., new tax year)
const LAST_CONTENT_UPDATE = new Date("2025-04-06");

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages - US-specific calculators only
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/salaries`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/salary-after-tax`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tax-brackets`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tax-bands`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/state-taxes`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/fica-taxes`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/401k-calculator`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hourly`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hourly-to-salary`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/employer-cost`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/multiple-jobs`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/salary-comparison`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bonus-tax`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pension-calculator`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/minimum-wage`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pay-rise`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/self-employment-tax`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/income-percentile`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/net-to-gross`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mortgage-affordability`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tax-refund`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/capital-gains-tax`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cost-of-living`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Generate dynamic salary pages
  // Optimized for crawl budget - focus on high-value round numbers
  const allSalaries = new Set<number>();

  // Add common salaries (from us-tax-calculator) - these are search-driven
  COMMON_SALARIES.forEach((s) => {
    if (s >= 20000 && s <= 200000) {
      allSalaries.add(s);
    }
  });

  // Add $5,000 increments from $20,000 to $120,000 (most searched US salaries)
  for (let s = 20000; s <= 120000; s += 5000) {
    allSalaries.add(s);
  }

  // Add $10,000 increments from $120,000 to $250,000
  for (let s = 120000; s <= 250000; s += 10000) {
    allSalaries.add(s);
  }

  const salaryPages: MetadataRoute.Sitemap = Array.from(allSalaries)
    .sort((a, b) => a - b)
    .map((salary) => ({
      url: `${BASE_URL}/salary/${salary}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      // Focus crawl budget on most searched salary ranges
      priority: salary >= 30000 && salary <= 100000 ? 0.7 : 0.5,
    }));

  // Generate job salary pages
  const jobSalaryPages: MetadataRoute.Sitemap = getAllJobSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/salaries/${slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  // Generate salary-after-tax pages - reduced for crawl budget
  const salaryAfterTaxAmounts = [
    25000, 30000, 35000, 40000, 50000, 60000, 70000, 80000, 100000, 125000, 150000,
  ];
  const salaryAfterTaxPages: MetadataRoute.Sitemap = salaryAfterTaxAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/salary-after-tax/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: amount >= 30000 && amount <= 80000 ? 0.6 : 0.4,
    }),
  );

  // Generate hourly-to-salary pages - reduced for crawl budget
  const hourlyRates = [
    10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 75, 100,
  ];
  const hourlyRatePages: MetadataRoute.Sitemap = hourlyRates.map((rate) => ({
    url: `${BASE_URL}/hourly-to-salary/${rate}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "yearly" as const,
    priority: rate >= 15 && rate <= 40 ? 0.6 : 0.4,
  }));

  // Generate hourly rate pages (/hourly/[rate])
  // Removed decimal rates (11.44, 12.21) - Google sees these as auto-generated/low-value
  const hourlyCalcRates = [
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 32, 35, 40, 45, 50, 60, 75, 100,
  ];
  const hourlyCalcPages: MetadataRoute.Sitemap = hourlyCalcRates.map(
    (rate) => ({
      url: `${BASE_URL}/hourly/${rate}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: rate >= 15 && rate <= 40 ? 0.7 : 0.5,
    }),
  );

  // Generate employer cost pages - reduced for crawl budget
  const employerCostAmounts = [
    30000, 40000, 50000, 60000, 70000, 80000, 100000, 150000,
  ];
  const employerCostPages: MetadataRoute.Sitemap = employerCostAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/employer-cost/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: amount >= 40000 && amount <= 80000 ? 0.6 : 0.4,
    }),
  );

  // Generate comparison pages - limited to most popular comparisons only
  // Reduced from ~50 to ~12 pages for better crawl budget
  const comparisonPages: MetadataRoute.Sitemap = [];
  const popularComparisons = [
    [30000, 35000], [35000, 40000], [40000, 50000], [50000, 60000],
    [60000, 70000], [70000, 80000], [80000, 100000], [100000, 120000],
    [120000, 150000], [50000, 75000], [75000, 100000],
  ];

  popularComparisons.forEach(([salary1, salary2]) => {
    comparisonPages.push({
      url: `${BASE_URL}/compare/${salary1}-vs-${salary2}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  });

  // Generate income percentile pages - reduced for crawl budget
  const percentileSalaries = [
    30000, 40000, 50000, 60000, 75000, 100000, 150000, 200000,
  ];
  const incomePercentilePages: MetadataRoute.Sitemap = percentileSalaries.map(
    (salary) => ({
      url: `${BASE_URL}/income-percentile/${salary}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: salary >= 40000 && salary <= 100000 ? 0.6 : 0.4,
    }),
  );

  // Generate net-to-gross pages (monthly net amounts) - reduced for crawl budget
  const netToGrossAmounts = [
    2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000,
  ];
  const netToGrossPages: MetadataRoute.Sitemap = netToGrossAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/net-to-gross/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: amount >= 2500 && amount <= 5000 ? 0.6 : 0.4,
    }),
  );

  // Country pages
  const countryCodeMap: Record<string, string> = {
    "united-kingdom": "gb", "germany": "de", "netherlands": "nl", "france": "fr",
    "spain": "es", "portugal": "pt", "switzerland": "ch", "ireland": "ie",
    "poland": "pl", "united-states": "us", "canada": "ca", "united-arab-emirates": "ae",
    "singapore": "sg", "australia": "au",
  };

  const costOfLivingCountryPages: MetadataRoute.Sitemap = getAllCountries().map(
    (country) => ({
      url: `${BASE_URL}/cost-of-living/${countryCodeMap[country.slug] || country.code.toLowerCase()}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // City pages
  const costOfLivingCityPages: MetadataRoute.Sitemap = getAllCities().map(
    (city) => ({
      url: `${BASE_URL}/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // City comparison pages
  const costOfLivingComparePages: MetadataRoute.Sitemap = getComparisonPairs().map(
    ({ city1, city2 }) => ({
      url: `${BASE_URL}/cost-of-living/compare/${city1}-vs-${city2}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Generate mortgage affordability pages - reduced for crawl budget
  const mortgageAffordabilitySalaries = [
    40000, 50000, 60000, 75000, 100000, 125000, 150000,
  ];
  const mortgageAffordabilityPages: MetadataRoute.Sitemap = mortgageAffordabilitySalaries.map(
    (salary) => ({
      url: `${BASE_URL}/mortgage-affordability/${salary}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: salary >= 50000 && salary <= 100000 ? 0.6 : 0.4,
    })
  );

  // Generate capital gains tax pages - reduced for crawl budget
  const capitalGains = [
    10000, 25000, 50000, 100000, 250000, 500000,
  ];
  const capitalGainsTaxPages: MetadataRoute.Sitemap = capitalGains.map(
    (gain) => ({
      url: `${BASE_URL}/capital-gains-tax/${gain}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: gain >= 25000 && gain <= 100000 ? 0.6 : 0.4,
    })
  );

  // Generate savings calculator pages
  const savingsCalculatorStaticPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/savings-calculator`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ];

  // Dynamic savings pages use /savings/ URL for better SEO
  const savingsPages: MetadataRoute.Sitemap = getAllSavingsSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/savings/${slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: slug.includes("a-month") ? 0.8 : 0.6,
    })
  );

  // Benefits pages
  const benefitsMainPage: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/benefits`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ];

  const benefitsPages: MetadataRoute.Sitemap = US_BENEFITS.map((benefit) => ({
    url: `${BASE_URL}/benefits/${benefit.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...jobSalaryPages,
    ...salaryPages,
    ...salaryAfterTaxPages,
    ...hourlyRatePages,
    ...hourlyCalcPages,
    ...employerCostPages,
    ...comparisonPages,
    ...incomePercentilePages,
    ...netToGrossPages,
    ...costOfLivingCountryPages,
    ...costOfLivingCityPages,
    ...costOfLivingComparePages,
    ...mortgageAffordabilityPages,
    ...capitalGainsTaxPages,
    ...savingsCalculatorStaticPage,
    ...savingsPages,
    ...benefitsMainPage,
    ...benefitsPages,
  ];
}
