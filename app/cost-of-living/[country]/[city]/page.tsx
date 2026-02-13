import { SidebarLayout } from "@/components/sidebar-layout";
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from "@/components/ad-unit";
import { RelatedCalculators, costOfLivingCalculators } from "@/components/related-calculators";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    calculateEquivalentSalary,
    formatUSD,
    getAllCities,
    getAllCitySlugs,
    getCityBySlug
} from "@/lib/cost-of-living";
import {
    ArrowRight,
    ArrowRightLeft,
    Bus,
    Home,
    MapPin,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Utensils,
    Zap
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ country: string; city: string }>;
}

export const revalidate = false

export async function generateStaticParams() {
  const slugs = getAllCitySlugs();
  return slugs.map(({ city }) => {
    const cityData = getAllCities().find(c => c.slug === city);
    return { 
      country: cityData?.countryCode.toLowerCase() || "gb", 
      city 
    };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: countryCode, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return { title: "City Not Found" };
  }

  const nycComparison = city.costIndex < 100
    ? `${100 - city.costIndex}% cheaper than NYC`
    : city.costIndex > 100
      ? `${city.costIndex - 100}% more expensive than NYC`
      : `same as NYC`;

  return {
    title: `Cost of Living in ${city.name}, ${city.country} | ${nycComparison}`,
    description: `Cost of living in ${city.name}: ${nycComparison}. Average salary: ${formatUSD(city.averageNetSalaryUSD)}/month. Rent index: ${city.rentIndex}. Compare with US cities.`,
    alternates: {
      canonical: `https://calculatesalary.us/cost-of-living/${countryCode.toLowerCase()}/${citySlug}`,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { country: countryCode, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  // Get similar US cities for comparison
  const allCities = getAllCities();
  const usCities = allCities.filter(c => c.countryCode === "US" && c.slug !== city.slug);
  
  const costCategories = [
    { name: "Overall Cost", index: city.costIndex, icon: MapPin },
    { name: "Rent", index: city.rentIndex, icon: Home },
    { name: "Groceries", index: city.groceriesIndex, icon: ShoppingCart },
    { name: "Restaurants", index: city.restaurantsIndex, icon: Utensils },
    { name: "Transport", index: city.transportIndex, icon: Bus },
    { name: "Utilities", index: city.utilitiesIndex, icon: Zap },
  ];

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb & Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/cost-of-living" className="hover:text-foreground transition-colors">
                  Cost of Living
                </Link>
                <span>/</span>
                <Link href={`/cost-of-living/${countryCode}`} className="hover:text-foreground transition-colors">
                  {city.country}
                </Link>
                <span>/</span>
                <span className="text-foreground">{city.name}</span>
              </nav>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                    Cost of Living in {city.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {city.country} • Pop: {(city.population / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-muted-foreground max-w-2xl">
                    {city.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {city.highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                  <div className="flex gap-3">
                    <Card className="text-center min-w-[100px]">
                      <CardHeader className="pb-3 pt-3 px-4">
                        <CardDescription className="text-xs">Cost<br />Index</CardDescription>
                        <CardTitle className={`text-3xl ${
                          city.costIndex < 100
                            ? "text-emerald-600 dark:text-emerald-400"
                            : city.costIndex > 100
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-foreground"
                        }`}>
                          {city.costIndex}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="text-center min-w-[100px]">
                      <CardHeader className="pb-3 pt-3 px-4">
                        <CardDescription className="text-xs">Rent<br />Index</CardDescription>
                        <CardTitle className="text-3xl">{city.rentIndex}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                  <Card className="text-center">
                    <CardHeader className="pb-3 pt-3 px-4">
                      <CardDescription className="text-xs">Avg Net Salary</CardDescription>
                      <CardTitle className="text-2xl">{formatUSD(city.averageNetSalaryUSD)}/mo</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="py-8 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Cost Breakdown vs NYC (Index 100)
              </h2>
              
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {costCategories.map((category) => {
                  const Icon = category.icon;
                  const diff = category.index - 100;
                  
                  return (
                    <Card key={category.name}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardDescription>{category.name}</CardDescription>
                        </div>
                        <div className="flex items-end justify-between">
                          <CardTitle className="text-2xl">{category.index}</CardTitle>
                          <span className={`text-sm font-medium ${
                            diff < 0 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : diff > 0 
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-muted-foreground"
                          }`}>
                            {diff < 0 ? (
                              <span className="flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                {Math.abs(diff)}% cheaper
                              </span>
                            ) : diff > 0 ? (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {diff}% pricier
                              </span>
                            ) : (
                              "Same as NYC"
                            )}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Salary Equivalence Table */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <ArrowRightLeft className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Salary Equivalence</h2>
                  <p className="text-sm text-muted-foreground">
                    How much you'd need to earn in {city.name} to match a NYC salary
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">NYC Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Equivalent in {city.name}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[50000, 75000, 100000, 125000, 150000, 200000].map((salary) => {
                      const equivalent = calculateEquivalentSalary(salary, "new-york", city.slug);
                      const diff = equivalent - salary;

                      return (
                        <tr key={salary} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{formatUSD(salary)}</td>
                          <td className="px-4 py-3 text-sm text-accent font-semibold">
                            {formatUSD(equivalent)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right ${
                            diff < 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}>
                            {diff < 0 ? `Save ${formatUSD(Math.abs(diff))}` : `Need ${formatUSD(diff)} more`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Compare with US Cities */}
        {city.countryCode !== "US" && usCities.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Compare with US Cities
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {usCities.slice(0, 4).map((usCity) => {
                    const costDiff = city.costIndex - usCity.costIndex;

                    return (
                      <Link
                        key={usCity.slug}
                        href={`/cost-of-living/compare/${city.slug}-vs-${usCity.slug}`}
                        className="group"
                      >
                        <Card className="h-full transition-all hover:ring-2 hover:ring-accent/50">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base group-hover:text-accent transition-colors">
                                vs {usCity.name}
                              </CardTitle>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className={`text-lg font-bold ${
                              costDiff < 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}>
                              {costDiff < 0
                                ? `${Math.abs(costDiff)}% cheaper`
                                : costDiff > 0
                                  ? `${costDiff}% pricier`
                                  : "Same cost"}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
              <h2>Living in {city.name}: What to Expect</h2>
              <p>
                {city.name} has a cost of living index of <strong>{city.costIndex}</strong>, meaning it is{" "}
                {city.costIndex < 100
                  ? `${100 - city.costIndex}% cheaper than NYC`
                  : city.costIndex > 100
                    ? `${city.costIndex - 100}% more expensive than NYC`
                    : "comparable to NYC"
                } in overall living costs.
              </p>
              <p>
                The average net monthly salary in {city.name} is approximately{" "}
                <strong>{city.currencySymbol}{city.averageNetSalary.toLocaleString()}</strong>{" "}
                ({formatUSD(city.averageNetSalaryUSD)} when converted to USD).
              </p>
              <h3>Cost Breakdown</h3>
              <ul>
                <li><strong>Rent:</strong> Index of {city.rentIndex}</li>
                <li><strong>Groceries:</strong> Index of {city.groceriesIndex}</li>
                <li><strong>Restaurants:</strong> Index of {city.restaurantsIndex}</li>
                <li><strong>Transport:</strong> Index of {city.transportIndex}</li>
                <li><strong>Utilities:</strong> Index of {city.utilitiesIndex}</li>
              </ul>
              <p>
                Key highlights: {city.highlights.join(", ")}.
              </p>
              <p>
                Use our <Link href="/" className="text-accent hover:underline">US salary calculator</Link> to
                see your take-home pay, or <Link href="/cost-of-living" className="text-accent hover:underline">
                compare with other cities</Link>.
              </p>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={costOfLivingCalculators} />
        <FooterAd />
      </main>
    </SidebarLayout>
  );
}
