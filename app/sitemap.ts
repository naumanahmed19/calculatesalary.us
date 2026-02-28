import { getAllCountries, getAllCities, getComparisonPairs } from "@/lib/cost-of-living";
import { getAllJobSlugs } from "@/lib/us-job-salaries";
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
      url: `${BASE_URL}/savings-calculator`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/benefits`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.9,
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

  // Generate dynamic salary pages - $10K increments only for crawl budget
  const salaryAmounts = [
    30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
    120000, 150000, 200000,
  ];
  const salaryPages: MetadataRoute.Sitemap = salaryAmounts.map((salary) => ({
    url: `${BASE_URL}/salary/${salary}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "yearly" as const,
    priority: salary >= 40000 && salary <= 100000 ? 0.7 : 0.5,
  }));

  // Generate job salary pages - HIGH VALUE, keep all
  const jobSalaryPages: MetadataRoute.Sitemap = getAllJobSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/salaries/${slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  // Generate salary-after-tax pages - reduced
  const salaryAfterTaxAmounts = [30000, 40000, 50000, 60000, 80000, 100000];
  const salaryAfterTaxPages: MetadataRoute.Sitemap = salaryAfterTaxAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/salary-after-tax/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }),
  );

  // Generate hourly-to-salary pages - key rates only
  const hourlyRates = [12, 15, 20, 25, 30, 40, 50];
  const hourlyRatePages: MetadataRoute.Sitemap = hourlyRates.map((rate) => ({
    url: `${BASE_URL}/hourly-to-salary/${rate}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  // Generate hourly rate pages - reduced, no decimals
  const hourlyCalcRates = [
    10, 12, 15, 18, 20, 25, 30, 35, 40, 50, 75, 100,
  ];
  const hourlyCalcPages: MetadataRoute.Sitemap = hourlyCalcRates.map(
    (rate) => ({
      url: `${BASE_URL}/hourly/${rate}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: rate >= 15 && rate <= 40 ? 0.6 : 0.4,
    }),
  );

  // Generate employer cost pages - reduced
  const employerCostAmounts = [40000, 60000, 80000, 100000];
  const employerCostPages: MetadataRoute.Sitemap = employerCostAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/employer-cost/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }),
  );

  // Generate comparison pages - top pairs only
  const popularComparisons = [
    [40000, 50000], [50000, 60000], [60000, 80000],
    [80000, 100000], [100000, 150000],
  ];
  const comparisonPages: MetadataRoute.Sitemap = popularComparisons.map(
    ([s1, s2]) => ({
      url: `${BASE_URL}/compare/${s1}-vs-${s2}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }),
  );

  // Generate income percentile pages - reduced
  const percentileSalaries = [40000, 60000, 80000, 100000, 150000];
  const incomePercentilePages: MetadataRoute.Sitemap = percentileSalaries.map(
    (salary) => ({
      url: `${BASE_URL}/income-percentile/${salary}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }),
  );

  // Generate net-to-gross pages - reduced
  const netToGrossAmounts = [2500, 3500, 5000, 7500];
  const netToGrossPages: MetadataRoute.Sitemap = netToGrossAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/net-to-gross/${amount}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }),
  );

  // Cost of living - countries only (high value)
  const costOfLivingCountryPages: MetadataRoute.Sitemap = getAllCountries().map(
    (country) => ({
      url: `${BASE_URL}/cost-of-living/${country.code.toLowerCase()}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // Cost of living cities - keep but lower priority
  const costOfLivingCityPages: MetadataRoute.Sitemap = getAllCities().map(
    (city) => ({
      url: `${BASE_URL}/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  // City comparisons - TOP 10 only
  const allComparisons = getComparisonPairs();
  const topCityComparisons = allComparisons.slice(0, 10);
  const costOfLivingComparePages: MetadataRoute.Sitemap = topCityComparisons.map(
    ({ city1, city2 }) => ({
      url: `${BASE_URL}/cost-of-living/compare/${city1}-vs-${city2}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  // Generate mortgage affordability pages - reduced
  const mortgageAffordabilitySalaries = [50000, 75000, 100000, 150000];
  const mortgageAffordabilityPages: MetadataRoute.Sitemap = mortgageAffordabilitySalaries.map(
    (salary) => ({
      url: `${BASE_URL}/mortgage-affordability/${salary}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  // Generate capital gains tax pages - reduced
  const capitalGains = [25000, 50000, 100000, 250000];
  const capitalGainsTaxPages: MetadataRoute.Sitemap = capitalGains.map(
    (gain) => ({
      url: `${BASE_URL}/capital-gains-tax/${gain}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })
  );

  // Savings pages - TOP amounts only (monthly savings have highest search volume)
  const topSavingsSlugs = [
    "100-a-month", "200-a-month", "500-a-month", "1000-a-month",
    "5-percent", "10-years", "10000-goal", "50000-goal",
  ];
  const savingsPages: MetadataRoute.Sitemap = topSavingsSlugs.map(
    (slug) => ({
      url: `${BASE_URL}/savings/${slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "yearly" as const,
      priority: slug.includes("a-month") ? 0.7 : 0.5,
    })
  );

  // Benefits pages - HIGH VALUE, keep all
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
    ...savingsPages,
    ...benefitsPages,
  ];
}
