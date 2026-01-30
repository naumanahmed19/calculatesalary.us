import { getAllCountries, getAllCities, getComparisonPairs } from "@/lib/cost-of-living";
import { getAllJobSlugs } from "@/lib/uk-job-salaries";
import { COMMON_SALARIES } from "@/lib/us-tax-calculator";
import type { MetadataRoute } from "next";

const BASE_URL = "https://calculatesalary.us";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/salaries`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tax-bands`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/national-insurance`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/student-loans`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/umbrella-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hourly`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/employer-cost`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pro-rata`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/multiple-jobs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/salary-comparison`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bonus-tax`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dividend-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pension-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/salary-sacrifice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/marriage-allowance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/minimum-wage`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tax-code-checker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pay-rise`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/self-employed-tax`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/redundancy-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/scotland`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/london-salary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/income-percentile`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/average-salary-uk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/net-to-gross`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mortgage-affordability`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tax-refund`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/child-benefit`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/company-car-tax`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/maternity-pay`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/work-from-home-tax-relief`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/capital-gains-tax`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Generate dynamic salary pages
  // Includes common salaries plus additional increments for comprehensive coverage
  const allSalaries = new Set<number>();

  // Add common salaries
  COMMON_SALARIES.forEach((s) => allSalaries.add(s));

  // Add every £1,000 increment from £15,000 to £100,000
  for (let s = 15000; s <= 100000; s += 1000) {
    allSalaries.add(s);
  }

  // Add every £5,000 increment from £100,000 to £200,000
  for (let s = 100000; s <= 200000; s += 5000) {
    allSalaries.add(s);
  }

  // Add every £10,000 increment from £200,000 to £500,000
  for (let s = 200000; s <= 500000; s += 10000) {
    allSalaries.add(s);
  }

  const salaryPages: MetadataRoute.Sitemap = Array.from(allSalaries)
    .sort((a, b) => a - b)
    .map((salary) => ({
      url: `${BASE_URL}/salary/${salary}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: salary >= 20000 && salary <= 80000 ? 0.7 : 0.5,
    }));

  // Generate job salary pages
  const jobSalaryPages: MetadataRoute.Sitemap = getAllJobSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/salaries/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  // Generate umbrella calculator day rate pages
  const dayRates = [
    250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
    1000, 1100, 1200, 1500,
  ];
  const dayRatePages: MetadataRoute.Sitemap = dayRates.map((rate) => ({
    url: `${BASE_URL}/umbrella-calculator/${rate}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: rate >= 400 && rate <= 800 ? 0.7 : 0.5,
  }));

  // Generate salary-after-tax pages
  const salaryAfterTaxAmounts = [
    20000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 42000, 45000, 48000,
    50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000,
    100000, 110000, 120000, 125000, 130000, 150000, 200000,
  ];
  const salaryAfterTaxPages: MetadataRoute.Sitemap = salaryAfterTaxAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/salary-after-tax/${amount}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: amount >= 25000 && amount <= 60000 ? 0.7 : 0.5,
    }),
  );

  // Generate hourly-to-salary pages
  const hourlyRates = [
    9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 32, 35, 38, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
    110, 120, 130, 140, 150, 175, 200,
  ];
  const hourlyRatePages: MetadataRoute.Sitemap = hourlyRates.map((rate) => ({
    url: `${BASE_URL}/hourly-to-salary/${rate}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: rate >= 12 && rate <= 40 ? 0.7 : 0.5,
  }));

  // Generate hourly rate pages (/hourly/[rate])
  const hourlyCalcRates = [
    10, 11, 11.44, 12, 12.21, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 32, 35, 40, 45, 50, 60, 75, 100,
  ];
  const hourlyCalcPages: MetadataRoute.Sitemap = hourlyCalcRates.map(
    (rate) => ({
      url: `${BASE_URL}/hourly/${rate}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: rate >= 12 && rate <= 40 ? 0.7 : 0.5,
    }),
  );

  // Generate employer cost pages
  const employerCostAmounts = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
    75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000,
    150000, 175000, 200000,
  ];
  const employerCostPages: MetadataRoute.Sitemap = employerCostAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/employer-cost/${amount}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: amount >= 25000 && amount <= 80000 ? 0.7 : 0.5,
    }),
  );

  // Generate comparison pages
  const comparisonPages: MetadataRoute.Sitemap = [];

  // Add common comparisons (matching generateStaticParams)
  for (let salary = 20000; salary <= 100000; salary += 5000) {
    comparisonPages.push({
      url: `${BASE_URL}/compare/${salary}-vs-${salary + 5000}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    });

    if (salary + 10000 <= 150000) {
      comparisonPages.push({
        url: `${BASE_URL}/compare/${salary}-vs-${salary + 10000}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.7,
      });
    }
  }

  // Generate London salary pages
  const londonSalaries = [
    25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
    80000, 90000, 100000, 120000, 150000,
  ];
  const londonSalaryPages: MetadataRoute.Sitemap = londonSalaries.map(
    (salary) => ({
      url: `${BASE_URL}/london-salary/${salary}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: salary >= 40000 && salary <= 80000 ? 0.7 : 0.5,
    }),
  );

  // Generate income percentile pages
  const percentileSalaries = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
    75000, 80000, 90000, 100000, 120000, 150000, 200000,
  ];
  const incomePercentilePages: MetadataRoute.Sitemap = percentileSalaries.map(
    (salary) => ({
      url: `${BASE_URL}/income-percentile/${salary}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: salary >= 30000 && salary <= 80000 ? 0.7 : 0.5,
    }),
  );

  // Generate Scotland tax pages
  const scotlandSalaries = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
    75000, 80000, 90000, 100000, 125000, 150000,
  ];
  const scotlandPages: MetadataRoute.Sitemap = scotlandSalaries.map(
    (salary) => ({
      url: `${BASE_URL}/scotland/${salary}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: salary >= 30000 && salary <= 80000 ? 0.7 : 0.5,
    }),
  );

  // Generate net-to-gross pages (monthly net amounts)
  const netToGrossAmounts = [
    1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4500,
    5000, 5500, 6000, 7000, 8000, 10000,
  ];
  const netToGrossPages: MetadataRoute.Sitemap = netToGrossAmounts.map(
    (amount) => ({
      url: `${BASE_URL}/net-to-gross/${amount}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: amount >= 2000 && amount <= 5000 ? 0.7 : 0.5,
    }),
  );

  // Generate cost of living pages
  const costOfLivingStaticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/cost-of-living`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

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
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // City pages
  const costOfLivingCityPages: MetadataRoute.Sitemap = getAllCities().map(
    (city) => ({
      url: `${BASE_URL}/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  // City comparison pages
  const costOfLivingComparePages: MetadataRoute.Sitemap = getComparisonPairs().map(
    ({ city1, city2 }) => ({
      url: `${BASE_URL}/cost-of-living/compare/${city1}-vs-${city2}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })
  );

  // Generate mortgage affordability pages
  const mortgageAffordabilitySalaries = [
    25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
    75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 150000,
  ];
  const mortgageAffordabilityPages: MetadataRoute.Sitemap = mortgageAffordabilitySalaries.map(
    (salary) => ({
      url: `${BASE_URL}/mortgage-affordability/${salary}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: salary >= 30000 && salary <= 80000 ? 0.7 : 0.5,
    })
  );

  // Generate child benefit pages (HICBC-relevant income levels)
  const childBenefitIncomes = [
    50000, 55000, 60000, 62000, 64000, 66000, 68000, 70000, 72000, 74000,
    76000, 78000, 80000, 85000, 90000, 100000,
  ];
  const childBenefitPages: MetadataRoute.Sitemap = childBenefitIncomes.map(
    (income) => ({
      url: `${BASE_URL}/child-benefit/${income}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: income >= 60000 && income <= 80000 ? 0.7 : 0.5,
    })
  );

  // Generate capital gains tax pages
  const capitalGains = [
    10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
    150000, 200000, 250000, 300000, 400000, 500000,
  ];
  const capitalGainsTaxPages: MetadataRoute.Sitemap = capitalGains.map(
    (gain) => ({
      url: `${BASE_URL}/capital-gains-tax/${gain}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: gain >= 20000 && gain <= 100000 ? 0.7 : 0.5,
    })
  );

  // Generate maternity pay pages
  const maternitySalaries = [
    20000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 45000,
    50000, 55000, 60000, 70000, 80000, 100000,
  ];
  const maternityPayPages: MetadataRoute.Sitemap = maternitySalaries.map(
    (salary) => ({
      url: `${BASE_URL}/maternity-pay/${salary}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: salary >= 25000 && salary <= 50000 ? 0.7 : 0.5,
    })
  );

  // Generate company car tax pages (P11D values)
  const p11dValues = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
    70000, 80000, 90000, 100000,
  ];
  const companyCarTaxPages: MetadataRoute.Sitemap = p11dValues.map(
    (p11d) => ({
      url: `${BASE_URL}/company-car-tax/${p11d}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: p11d >= 30000 && p11d <= 60000 ? 0.7 : 0.5,
    })
  );

  return [
    ...staticPages,
    ...jobSalaryPages,
    ...salaryPages,
    ...dayRatePages,
    ...salaryAfterTaxPages,
    ...hourlyRatePages,
    ...hourlyCalcPages,
    ...employerCostPages,
    ...comparisonPages,
    ...londonSalaryPages,
    ...incomePercentilePages,
    ...scotlandPages,
    ...netToGrossPages,
    ...costOfLivingStaticPages,
    ...costOfLivingCountryPages,
    ...costOfLivingCityPages,
    ...costOfLivingComparePages,
    ...mortgageAffordabilityPages,
    ...childBenefitPages,
    ...capitalGainsTaxPages,
    ...maternityPayPages,
    ...companyCarTaxPages,
  ];
}

