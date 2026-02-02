import { SidebarLayout } from "@/components/sidebar-layout";
import { RelatedCalculators, costOfLivingCalculators } from "@/components/related-calculators";
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from "@/components/ad-unit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    calculateEquivalentSalary,
    formatUSD,
    getCityBySlug,
    getComparisonPairs
} from "@/lib/cost-of-living";
import {
    ArrowRightLeft,
    BarChart3,
    Bus,
    Check,
    DollarSign,
    Home,
    Scale,
    ShoppingCart,
    Utensils,
    Zap
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const BASE_URL = "https://calculatesalary.us";

interface PageProps {
  params: Promise<{ comparison: string }>;
}

function parseComparison(slug: string): { city1: string; city2: string; needsRedirect: boolean; canonicalSlug: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;

  const rawCity1 = match[1];
  const rawCity2 = match[2];

  // Normalize: always put alphabetically first city first
  const [city1, city2] = [rawCity1, rawCity2].sort();
  const canonicalSlug = `${city1}-vs-${city2}`;
  const needsRedirect = slug !== canonicalSlug;

  return { city1, city2, needsRedirect, canonicalSlug };
}

export async function generateStaticParams() {
  const pairs = getComparisonPairs();
  return pairs.map(({ city1, city2 }) => ({
    comparison: `${city1}-vs-${city2}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);

  if (!parsed) return { title: "Comparison Not Found" };

  const city1 = getCityBySlug(parsed.city1);
  const city2 = getCityBySlug(parsed.city2);

  if (!city1 || !city2) {
    return { title: "Comparison Not Found" };
  }

  const costDiff = city2.costIndex - city1.costIndex;
  const cheaper = costDiff > 0 ? city1.name : city2.name;

  return {
    title: `${city1.name} vs ${city2.name} Cost of Living | Which is Cheaper?`,
    description: `Compare cost of living: ${city1.name} vs ${city2.name}. ${cheaper} is ${Math.abs(costDiff)}% cheaper. See rent, groceries, transport and salary comparisons.`,
    alternates: {
      canonical: `${BASE_URL}/cost-of-living/compare/${parsed.canonicalSlug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { comparison } = await params;
  const parsed = parseComparison(comparison);

  if (!parsed) notFound();

  // Redirect to canonical URL if cities are in wrong order
  if (parsed.needsRedirect) {
    redirect(`/cost-of-living/compare/${parsed.canonicalSlug}`);
  }

  const city1 = getCityBySlug(parsed.city1);
  const city2 = getCityBySlug(parsed.city2);

  if (!city1 || !city2) notFound();

  const categories = [
    { name: "Overall Cost", key: "costIndex" as const, icon: DollarSign },
    { name: "Rent", key: "rentIndex" as const, icon: Home },
    { name: "Groceries", key: "groceriesIndex" as const, icon: ShoppingCart },
    { name: "Restaurants", key: "restaurantsIndex" as const, icon: Utensils },
    { name: "Transport", key: "transportIndex" as const, icon: Bus },
    { name: "Utilities", key: "utilitiesIndex" as const, icon: Zap },
  ];

  const getWinner = (key: keyof typeof city1) => {
    const val1 = city1[key] as number;
    const val2 = city2[key] as number;
    if (val1 < val2) return "city1";
    if (val2 < val1) return "city2";
    return "tie";
  };

  const city1Wins = categories.filter(c => getWinner(c.key) === "city1").length;
  const city2Wins = categories.filter(c => getWinner(c.key) === "city2").length;
  const costDiff = city2.costIndex - city1.costIndex;

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb & Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/cost-of-living" className="hover:text-foreground transition-colors">
                  Cost of Living
                </Link>
                <span>/</span>
                <span className="text-foreground">Compare</span>
              </nav>

              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  <ArrowRightLeft className="h-3 w-3 mr-1" />
                  City Comparison
                </Badge>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <Link
                    href={`/cost-of-living/${city1.countryCode.toLowerCase()}/${city1.slug}`}
                    className="text-2xl md:text-3xl font-bold text-foreground hover:text-accent transition-colors"
                  >
                    {city1.name}
                  </Link>

                  <span className="text-muted-foreground text-xl">vs</span>

                  <Link
                    href={`/cost-of-living/${city2.countryCode.toLowerCase()}/${city2.slug}`}
                    className="text-2xl md:text-3xl font-bold text-foreground hover:text-accent transition-colors"
                  >
                    {city2.name}
                  </Link>
                </div>

                <p className="text-lg text-muted-foreground">
                  {costDiff < 0 ? (
                    <><strong className="text-emerald-600 dark:text-emerald-400">{city1.name}</strong> is {Math.abs(costDiff)}% more expensive</>
                  ) : costDiff > 0 ? (
                    <><strong className="text-emerald-600 dark:text-emerald-400">{city1.name}</strong> is {costDiff}% cheaper</>
                  ) : (
                    <>Both cities have similar costs</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Score Summary */}
        <section className="py-8 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className={`transition-all ${city1Wins > city2Wins ? "ring-2 ring-emerald-500 shadow-md" : "hover:shadow-md"}`}>
                  <CardHeader className="text-center pb-3">
                    <CardDescription className="text-sm font-medium">{city1.name} Wins</CardDescription>
                    <CardTitle className={`text-4xl ${city1Wins > city2Wins ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {city1Wins}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">of 6 categories</p>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-md transition-all">
                  <CardHeader className="text-center pb-3">
                    <CardDescription className="text-sm font-medium">Tied</CardDescription>
                    <CardTitle className="text-4xl text-muted-foreground">
                      {6 - city1Wins - city2Wins}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">categories</p>
                  </CardHeader>
                </Card>

                <Card className={`transition-all ${city2Wins > city1Wins ? "ring-2 ring-emerald-500 shadow-md" : "hover:shadow-md"}`}>
                  <CardHeader className="text-center pb-3">
                    <CardDescription className="text-sm font-medium">{city2.name} Wins</CardDescription>
                    <CardTitle className={`text-4xl ${city2Wins > city1Wins ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {city2Wins}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">of 6 categories</p>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Category Comparison */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Category Breakdown</h2>
                  <p className="text-sm text-muted-foreground">Compare costs across 6 key categories</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const val1 = city1[category.key];
                  const val2 = city2[category.key];
                  const winner = getWinner(category.key);
                  const diff = val2 - val1;

                  return (
                    <Card key={category.key} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-muted p-1.5">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <CardDescription className="font-medium text-foreground">{category.name}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`text-center flex-1 p-2 rounded-lg ${
                            winner === "city1" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-muted/30"
                          }`}>
                            <div className={`text-2xl font-bold ${winner === "city1" ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                              {val1}
                            </div>
                            <div className="text-xs text-muted-foreground">{city1.name}</div>
                          </div>

                          <div className="px-2 text-muted-foreground text-sm">vs</div>

                          <div className={`text-center flex-1 p-2 rounded-lg ${
                            winner === "city2" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-muted/30"
                          }`}>
                            <div className={`text-2xl font-bold ${winner === "city2" ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                              {val2}
                            </div>
                            <div className="text-xs text-muted-foreground">{city2.name}</div>
                          </div>
                        </div>

                        {winner !== "tie" && (
                          <div className="text-center">
                            <Badge variant="outline" className={`text-xs ${
                              winner === "city1"
                                ? "text-emerald-600 border-emerald-500/30"
                                : "text-emerald-600 border-emerald-500/30"
                            }`}>
                              <Check className="h-3 w-3 mr-1" />
                              {winner === "city1" ? city1.name : city2.name} is {Math.abs(diff)} pts cheaper
                            </Badge>
                          </div>
                        )}
                        {winner === "tie" && (
                          <div className="text-center">
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Same cost
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Salary Equivalence */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Scale className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Salary Equivalence</h2>
                  <p className="text-sm text-muted-foreground">
                    How much you'd need in {city2.name} to match a {city1.name} salary
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Salary in {city1.name}</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Equivalent in {city2.name}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Difference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[50000, 75000, 100000, 125000, 150000, 200000].map((salary) => {
                      const equivalent = calculateEquivalentSalary(salary, city1.slug, city2.slug);
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
                            {diff < 0
                              ? `${formatUSD(Math.abs(diff))} less`
                              : `${formatUSD(diff)} more`}
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

        {/* SEO Content */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
              <h2>{city1.name} vs {city2.name}: Summary</h2>
              <p>
                The overall cost of living differs by <strong>{Math.abs(costDiff)}%</strong>.{" "}
                {costDiff !== 0 && (
                  <><strong>{costDiff > 0 ? city1.name : city2.name}</strong> is the more affordable option.</>
                )}
              </p>
              <p>
                <strong>Rent:</strong> {city1.name} has a rent index of {city1.rentIndex}, while {city2.name}{" "}
                has {city2.rentIndex}.
              </p>
              <p>
                <strong>Average Salaries:</strong> {city1.name}: {formatUSD(city1.averageNetSalaryUSD)}/month vs{" "}
                {city2.name}: {formatUSD(city2.averageNetSalaryUSD)}/month (both in USD).
              </p>
              <p>
                Out of 6 categories, <strong>{city1.name}</strong> wins {city1Wins}, while{" "}
                <strong>{city2.name}</strong> wins {city2Wins}.
              </p>
              <p>
                <Link href="/cost-of-living" className="text-accent hover:underline">
                  Compare more cities
                </Link>{" "}or calculate your{" "}
                <Link href="/" className="text-accent hover:underline">US take-home pay</Link>.
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
