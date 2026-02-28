import { SidebarLayout } from "@/components/sidebar-layout";
import { RelatedCalculators, costOfLivingCalculators } from "@/components/related-calculators";
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from "@/components/ad-unit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    calculateEquivalentSalary,
    formatUSD,
    getCityBySlug,
    getComparisonPairs,
    getRelatedComparisons
} from "@/lib/cost-of-living";
import {
    ArrowRightLeft,
    Baby,
    BarChart3,
    Briefcase,
    Bus,
    Check,
    DollarSign,
    GraduationCap,
    Heart,
    Home,
    MapPin,
    Scale,
    Shield,
    ShoppingCart,
    Sparkles,
    Users,
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
  const cheaper = costDiff > 0 ? city1.name : city2.name;

  const relatedComparisons = getRelatedComparisons(city1.slug, 3).concat(getRelatedComparisons(city2.slug, 3));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is it cheaper to live in ${city1.name} or ${city2.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${cheaper} is ${Math.abs(costDiff)}% cheaper than ${cheaper === city1.name ? city2.name : city1.name} for standard living costs including rent, groceries, and transport.`
        }
      },
      {
        "@type": "Question",
        "name": `How much is rent in ${city1.name} compared to ${city2.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Rent in ${city1.name} is ${city1.rentIndex > city2.rentIndex ? 'higher' : 'lower'} than ${city2.name}. The rent index is ${city1.rentIndex} vs ${city2.rentIndex}.`
        }
      },
      {
        "@type": "Question",
        "name": `What salary do I need in ${city2.name} to live like I do in ${city1.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `If you earn ${formatUSD(75000)} in ${city1.name}, you would need approximately ${formatUSD(calculateEquivalentSalary(75000, city1.slug, city2.slug))} in ${city2.name} to maintain the same standard of living.`
        }
      }
    ]
  };

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
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

        {/* Verdict Section */}
        <section className="py-12 bg-card border-b border-border/40">
          <div className="container mx-auto px-4">
             <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">The Verdict</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Living in <strong className="text-foreground">{city1.name}</strong> is <strong className={costDiff > 0 ? "text-emerald-600" : "text-rose-600"}>{Math.abs(costDiff)}% {costDiff > 0 ? "cheaper" : "more expensive"}</strong> than <strong className="text-foreground">{city2.name}</strong>.
                  <br className="mb-4" />
                  If you move from {city1.name} to {city2.name}, you will pay {city1.rentIndex < city2.rentIndex ? "more" : "less"} for housing
                  and {city1.groceriesIndex < city2.groceriesIndex ? "more" : "less"} for daily groceries.
                  To maintain the same standard of life as a {formatUSD(75000)} salary in {city1.name}, you would need to earn about <span className="font-semibold text-foreground">{formatUSD(calculateEquivalentSalary(75000, city1.slug, city2.slug))}</span> in {city2.name}.
                </p>
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

        {/* City Profiles - Unique Content */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">City Profiles</h2>
                  <p className="text-sm text-muted-foreground">What makes each city unique</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* City 1 Profile */}
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{city1.name}</span>
                      <Badge variant="outline" className="text-xs">{city1.country}</Badge>
                    </CardTitle>
                    <CardDescription>{city1.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Why people love {city1.name}:</p>
                      <div className="flex flex-wrap gap-2">
                        {city1.highlights.map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-muted-foreground text-xs">Population</div>
                        <div className="font-semibold">{city1.population.toLocaleString()}</div>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-muted-foreground text-xs">Avg. Salary</div>
                        <div className="font-semibold">{formatUSD(city1.averageNetSalaryUSD)}/mo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* City 2 Profile */}
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{city2.name}</span>
                      <Badge variant="outline" className="text-xs">{city2.country}</Badge>
                    </CardTitle>
                    <CardDescription>{city2.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Why people love {city2.name}:</p>
                      <div className="flex flex-wrap gap-2">
                        {city2.highlights.map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-muted-foreground text-xs">Population</div>
                        <div className="font-semibold">{city2.population.toLocaleString()}</div>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2 text-center">
                        <div className="text-muted-foreground text-xs">Avg. Salary</div>
                        <div className="font-semibold">{formatUSD(city2.averageNetSalaryUSD)}/mo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Real Cost Examples */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <ShoppingCart className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Real Monthly Costs</h2>
                  <p className="text-sm text-muted-foreground">Estimated costs based on NYC baseline prices</p>
                </div>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Expense</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">{city1.name}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">{city2.name}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { name: "1-bed apartment (city center)", baseline: 3500, key: "rentIndex" as const },
                      { name: "Monthly groceries", baseline: 450, key: "groceriesIndex" as const },
                      { name: "Dining out (10 meals)", baseline: 350, key: "restaurantsIndex" as const },
                      { name: "Public transport pass", baseline: 130, key: "transportIndex" as const },
                      { name: "Utilities (electric, heating, water)", baseline: 200, key: "utilitiesIndex" as const },
                    ].map((item) => {
                      const cost1 = Math.round(item.baseline * city1[item.key] / 100);
                      const cost2 = Math.round(item.baseline * city2[item.key] / 100);
                      const savings = cost2 - cost1;
                      return (
                        <tr key={item.name} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">{formatUSD(cost1)}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">{formatUSD(cost2)}</td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${
                            savings > 0 ? "text-emerald-600" : savings < 0 ? "text-rose-600" : "text-muted-foreground"
                          }`}>
                            {savings > 0 ? `+${formatUSD(savings)}` : savings < 0 ? formatUSD(savings) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-muted/50 font-semibold">
                      <td className="px-4 py-3 text-sm">Total Monthly</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatUSD(Math.round(3500 * city1.rentIndex / 100 + 450 * city1.groceriesIndex / 100 + 350 * city1.restaurantsIndex / 100 + 130 * city1.transportIndex / 100 + 200 * city1.utilitiesIndex / 100))}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatUSD(Math.round(3500 * city2.rentIndex / 100 + 450 * city2.groceriesIndex / 100 + 350 * city2.restaurantsIndex / 100 + 130 * city2.transportIndex / 100 + 200 * city2.utilitiesIndex / 100))}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {(() => {
                          const total1 = Math.round(3500 * city1.rentIndex / 100 + 450 * city1.groceriesIndex / 100 + 350 * city1.restaurantsIndex / 100 + 130 * city1.transportIndex / 100 + 200 * city1.utilitiesIndex / 100);
                          const total2 = Math.round(3500 * city2.rentIndex / 100 + 450 * city2.groceriesIndex / 100 + 350 * city2.restaurantsIndex / 100 + 130 * city2.transportIndex / 100 + 200 * city2.utilitiesIndex / 100);
                          const diff = total2 - total1;
                          return <span className={diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : ""}>
                            {diff > 0 ? `+${formatUSD(diff)}` : diff < 0 ? formatUSD(diff) : "—"}
                          </span>;
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                * Estimates based on NYC = 100 index. Actual costs vary by lifestyle and location within city.
              </p>
            </div>
          </div>
        </section>

        {/* Who Should Choose Section */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Who Should Choose Which City?</h2>
                  <p className="text-sm text-muted-foreground">Recommendations based on your priorities</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Choose {city1.name} if you...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {city1.costIndex < city2.costIndex && (
                        <li className="flex items-start gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Want lower overall living costs ({Math.abs(costDiff)}% cheaper)</span>
                        </li>
                      )}
                      {city1.rentIndex < city2.rentIndex && (
                        <li className="flex items-start gap-2 text-sm">
                          <Home className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Are looking for more affordable housing</span>
                        </li>
                      )}
                      {(city1.safetyIndex ?? 0) > (city2.safetyIndex ?? 0) && (
                        <li className="flex items-start gap-2 text-sm">
                          <Shield className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Prioritize safety (score: {city1.safetyIndex}/100)</span>
                        </li>
                      )}
                      {city1.averageNetSalaryUSD > city2.averageNetSalaryUSD && (
                        <li className="flex items-start gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Want higher earning potential ({formatUSD(city1.averageNetSalaryUSD)}/mo avg)</span>
                        </li>
                      )}
                      {(city1.childcareIndex ?? 999) < (city2.childcareIndex ?? 999) && (
                        <li className="flex items-start gap-2 text-sm">
                          <Baby className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Have children (lower childcare costs)</span>
                        </li>
                      )}
                      {city1.highlights.some(h => h.toLowerCase().includes("startup") || h.toLowerCase().includes("tech")) && (
                        <li className="flex items-start gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>Work in tech or startups</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">Choose {city2.name} if you...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {city2.costIndex < city1.costIndex && (
                        <li className="flex items-start gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Want lower overall living costs ({Math.abs(costDiff)}% cheaper)</span>
                        </li>
                      )}
                      {city2.rentIndex < city1.rentIndex && (
                        <li className="flex items-start gap-2 text-sm">
                          <Home className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Are looking for more affordable housing</span>
                        </li>
                      )}
                      {(city2.safetyIndex ?? 0) > (city1.safetyIndex ?? 0) && (
                        <li className="flex items-start gap-2 text-sm">
                          <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Prioritize safety (score: {city2.safetyIndex}/100)</span>
                        </li>
                      )}
                      {city2.averageNetSalaryUSD > city1.averageNetSalaryUSD && (
                        <li className="flex items-start gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Want higher earning potential ({formatUSD(city2.averageNetSalaryUSD)}/mo avg)</span>
                        </li>
                      )}
                      {(city2.childcareIndex ?? 999) < (city1.childcareIndex ?? 999) && (
                        <li className="flex items-start gap-2 text-sm">
                          <Baby className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Have children (lower childcare costs)</span>
                        </li>
                      )}
                      {city2.highlights.some(h => h.toLowerCase().includes("startup") || h.toLowerCase().includes("tech")) && (
                        <li className="flex items-start gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                          <span>Work in tech or startups</span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quality of Life Comparison */}
        {(city1.qualityOfLifeIndex || city1.safetyIndex || city2.qualityOfLifeIndex || city2.safetyIndex) && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-accent/10 p-2">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Quality of Life & Safety</h2>
                    <p className="text-sm text-muted-foreground">Beyond just costs - what matters for daily life</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {city1.qualityOfLifeIndex && (
                    <Card className="text-center">
                      <CardHeader className="pb-2">
                        <CardDescription>{city1.name}</CardDescription>
                        <CardTitle className="text-3xl text-foreground">{city1.qualityOfLifeIndex}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Quality of Life Score</p>
                      </CardContent>
                    </Card>
                  )}
                  {city2.qualityOfLifeIndex && (
                    <Card className="text-center">
                      <CardHeader className="pb-2">
                        <CardDescription>{city2.name}</CardDescription>
                        <CardTitle className="text-3xl text-foreground">{city2.qualityOfLifeIndex}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Quality of Life Score</p>
                      </CardContent>
                    </Card>
                  )}
                  {city1.safetyIndex && (
                    <Card className="text-center">
                      <CardHeader className="pb-2">
                        <CardDescription>{city1.name}</CardDescription>
                        <CardTitle className={`text-3xl ${city1.safetyIndex >= 80 ? "text-emerald-600" : city1.safetyIndex >= 60 ? "text-amber-600" : "text-rose-600"}`}>
                          {city1.safetyIndex}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Safety Score</p>
                      </CardContent>
                    </Card>
                  )}
                  {city2.safetyIndex && (
                    <Card className="text-center">
                      <CardHeader className="pb-2">
                        <CardDescription>{city2.name}</CardDescription>
                        <CardTitle className={`text-3xl ${city2.safetyIndex >= 80 ? "text-emerald-600" : city2.safetyIndex >= 60 ? "text-amber-600" : "text-rose-600"}`}>
                          {city2.safetyIndex}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">Safety Score</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

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

        {/* Related Comparisons */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
           <div className="container mx-auto px-4">
             <div className="max-w-4xl mx-auto">
               <h3 className="text-xl font-bold mb-6 text-center">Other Comparisons</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {relatedComparisons.map((pair, i) => (
                    <Link
                      key={i}
                      href={`/cost-of-living/compare/${pair.city1}-vs-${pair.city2}`}
                      className="block p-4 rounded-lg bg-card border border-border/50 hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-sm font-medium">
                         <span>{pair.city1.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                         <span className="text-muted-foreground text-xs">vs</span>
                         <span>{pair.city2.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                      </div>
                    </Link>
                 ))}
               </div>
             </div>
           </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  );
}
