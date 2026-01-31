import { CostOfLivingCalculator } from "@/components/cost-of-living-calculator";
import { SidebarLayout } from "@/components/sidebar-layout";
import { RelatedCalculators, salaryCalculators } from "@/components/related-calculators";
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from "@/components/ad-unit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    formatUSD,
    getAllCities,
    getBestValueCities,
    getCheapestCities,
    getMostExpensiveCities
} from "@/lib/cost-of-living";
import { US_CITIES } from "@/lib/cost-of-living/data-us";
import {
    ArrowRight,
    Building2,
    Globe,
    MapPin,
    Sparkles,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cost of Living Calculator USA | Compare Cities & Living Costs",
  description: "Compare cost of living across US cities and worldwide. See how New York compares to San Francisco, Austin, Chicago, and international cities. Make informed relocation decisions.",
  keywords: "cost of living USA, living costs comparison, US city costs, rent prices USA, NYC vs San Francisco, relocate USA, cost of living by city",
};

export default function CostOfLivingPage() {
  const allCities = getAllCities();
  const cheapestCities = getCheapestCities(6);
  const expensiveCities = getMostExpensiveCities(6);
  const bestValueCities = getBestValueCities(6);

  // US cities sorted by cost
  const usCitiesSorted = [...US_CITIES].sort((a, b) => a.costIndex - b.costIndex);

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Hero Section */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                <MapPin className="h-3 w-3 mr-1" />
                {US_CITIES.length} US Cities + International Comparisons
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Cost of Living Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate what salary you need in different cities to maintain your lifestyle.
                Compare living costs across US and international destinations.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <CostOfLivingCalculator />
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Quick Stats */}
        <section className="py-8 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>US Cities</CardDescription>
                  <CardTitle className="text-3xl">{US_CITIES.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Cities</CardDescription>
                  <CardTitle className="text-3xl">{allCities.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-emerald-500" />
                    Most Affordable US City
                  </CardDescription>
                  <CardTitle className="text-2xl text-emerald-600 dark:text-emerald-400">
                    {usCitiesSorted[0]?.name}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-rose-500" />
                    Most Expensive
                  </CardDescription>
                  <CardTitle className="text-2xl text-rose-600 dark:text-rose-400">
                    San Francisco
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* US Cities Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">US Cities</h2>
                  <p className="text-sm text-muted-foreground">Compare living costs across major US cities</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {US_CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cost-of-living/us/${city.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:ring-2 hover:ring-accent/50 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-accent transition-colors">
                              {city.name}
                            </CardTitle>
                            <CardDescription>
                              Pop: {(city.population / 1000000).toFixed(1)}M
                            </CardDescription>
                          </div>
                          <Badge variant={city.costIndex < 70 ? "default" : city.costIndex > 90 ? "destructive" : "secondary"}>
                            {city.costIndex}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Rent Index:</span>
                            <span className="ml-1 font-medium">{city.rentIndex}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Avg Salary:</span>
                            <span className="ml-1 font-medium">{formatUSD(city.averageNetSalaryUSD)}</span>
                          </div>
                        </div>
                        <p className={`text-sm font-medium ${
                          city.costIndex < 100
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        }`}>
                          {city.costIndex < 100
                            ? `${100 - city.costIndex}% cheaper than NYC`
                            : city.costIndex > 100
                              ? `${city.costIndex - 100}% more expensive than NYC`
                              : "NYC (baseline)"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* Best Value Cities - Global */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-amber-500/10 p-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Best Value Cities Worldwide</h2>
                  <p className="text-sm text-muted-foreground">Highest salary-to-cost ratio for Americans</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bestValueCities.slice(0, 6).map((city, index) => (
                  <Link
                    key={city.slug}
                    href={`/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:ring-2 hover:ring-amber-500/50 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-amber-600 border-amber-500/30">
                              #{index + 1} Best Value
                            </Badge>
                            <CardTitle className="text-lg group-hover:text-amber-600 transition-colors">
                              {city.name}
                            </CardTitle>
                            <CardDescription>{city.country}</CardDescription>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-muted-foreground">Cost Index</div>
                            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                              {city.costIndex}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Avg Salary (USD)</div>
                            <div className="text-lg font-semibold text-foreground">
                              {formatUSD(city.averageNetSalaryUSD)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* International Comparisons */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-emerald-500/10 p-2">
                  <Globe className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">International Comparisons</h2>
                  <p className="text-sm text-muted-foreground">How US cities compare to popular expat destinations</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-emerald-500" />
                      Most Affordable Cities
                    </CardTitle>
                    <CardDescription>Globally, including UK cities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cheapestCities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div>
                            <span className="font-medium text-foreground">{city.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{city.country}</span>
                          </div>
                          <Badge variant="secondary" className="text-emerald-600">
                            {city.costIndex}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-rose-500" />
                      Most Expensive Cities
                    </CardTitle>
                    <CardDescription>Global comparison including NYC</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {expensiveCities.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/cost-of-living/${city.countryCode.toLowerCase()}/${city.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div>
                            <span className="font-medium text-foreground">{city.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{city.country}</span>
                          </div>
                          <Badge variant="destructive">
                            {city.costIndex}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Understanding Cost of Living in the USA
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  The cost of living varies significantly across US cities. <strong>New York City</strong> and{" "}
                  <strong>San Francisco</strong> are among the most expensive cities with cost indices around 100-105
                  (NYC is our baseline). However, cities like <strong>{usCitiesSorted[0]?.name}</strong> offer
                  living costs that are <strong>{100 - usCitiesSorted[0]?.costIndex}% lower</strong> than NYC.
                </p>
                <p>
                  For those considering relocation within the US or abroad, understanding these cost
                  differences is crucial for making informed financial decisions. Our calculator helps
                  you compare not just overall costs, but specific categories like rent, groceries,
                  transport, and utilities.
                </p>
                <h3>Key Factors We Compare</h3>
                <ul>
                  <li><strong>Rent Index:</strong> Housing costs relative to NYC</li>
                  <li><strong>Groceries Index:</strong> Food and daily essentials</li>
                  <li><strong>Transport Index:</strong> Public transport and commuting costs</li>
                  <li><strong>Restaurants Index:</strong> Dining out and entertainment</li>
                  <li><strong>Average Net Salary:</strong> Typical take-home pay in the city</li>
                </ul>
                <p>
                  Use this data alongside our{" "}
                  <Link href="/" className="text-accent hover:underline">salary calculator</Link>{" "}
                  to understand your true purchasing power in different locations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators title="Related Tools" calculators={salaryCalculators} />

        <FooterAd />
      </main>
    </SidebarLayout>
  );
}
