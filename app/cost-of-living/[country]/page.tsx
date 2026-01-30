import { SidebarLayout } from "@/components/sidebar-layout";
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from "@/components/ad-unit";
import { RelatedCalculators, costOfLivingCalculators } from "@/components/related-calculators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUSD, getCountryBySlug } from "@/lib/cost-of-living";
import { ArrowRight, Building2, TrendingDown, TrendingUp } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Map country codes to slugs
const codeToSlug: Record<string, string> = {
  us: "united-states",
  gb: "united-kingdom",
  ca: "canada",
  de: "germany",
  nl: "netherlands",
  fr: "france",
  es: "spain",
  pt: "portugal",
  ch: "switzerland",
  ie: "ireland",
  pl: "poland",
  at: "austria",
  cz: "czech-republic",
  hu: "hungary",
  se: "sweden",
  dk: "denmark",
  ae: "united-arab-emirates",
  sg: "singapore",
  au: "australia",
};

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return Object.keys(codeToSlug).map((code) => ({ country: code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: countryCode } = await params;
  const slug = codeToSlug[countryCode.toLowerCase()];
  const country = slug ? getCountryBySlug(slug) : undefined;

  if (!country) {
    return { title: "Country Not Found" };
  }

  return {
    title: `Cost of Living in ${country.name} | ${country.cities.length} Cities Compared`,
    description: `Compare cost of living across ${country.cities.length} cities in ${country.name}. See rent, groceries, transport costs and average salaries.`,
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { country: countryCode } = await params;
  const slug = codeToSlug[countryCode.toLowerCase()];
  const country = slug ? getCountryBySlug(slug) : undefined;

  if (!country) {
    notFound();
  }

  const sortedByCheap = [...country.cities].sort((a, b) => a.costIndex - b.costIndex);
  const sortedByExpensive = [...country.cities].sort((a, b) => b.costIndex - a.costIndex);

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
                <span className="text-foreground">{country.name}</span>
              </nav>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{country.flagEmoji}</span>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    Cost of Living in {country.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {country.cities.length} cities • Currency: {country.currencySymbol} ({country.currency})
                  </p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground">
                {country.description}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Cities Covered
                  </CardDescription>
                  <CardTitle className="text-3xl">{country.cities.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-emerald-500" />
                    Cheapest City
                  </CardDescription>
                  <CardTitle className="text-2xl text-emerald-600 dark:text-emerald-400">
                    {sortedByCheap[0].name}
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
                    {sortedByExpensive[0].name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Cities Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                All Cities in {country.name}
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {country.cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cost-of-living/${countryCode.toLowerCase()}/${city.slug}`}
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
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {city.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <div className="text-xs text-muted-foreground">Cost</div>
                            <div className={`text-lg font-bold ${
                              city.costIndex <= 70 
                                ? "text-emerald-600 dark:text-emerald-400" 
                                : city.costIndex >= 100 
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-foreground"
                            }`}>
                              {city.costIndex}
                            </div>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-2 text-center">
                            <div className="text-xs text-muted-foreground">Rent</div>
                            <div className="text-lg font-bold text-foreground">{city.rentIndex}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <span className="text-sm text-muted-foreground">Avg Salary</span>
                          <span className="font-semibold">{formatUSD(city.averageNetSalaryUSD)}/mo</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
              <h2>About Cost of Living in {country.name}</h2>
              <p>
                {country.name} offers a range of living costs across its cities. 
                {sortedByCheap[0] && (
                  <> The most affordable city is <strong>{sortedByCheap[0].name}</strong> with a cost 
                  index of {sortedByCheap[0].costIndex}.</>
                )}
                {sortedByExpensive[0] && (
                  <> <strong>{sortedByExpensive[0].name}</strong> is the most expensive with an 
                  index of {sortedByExpensive[0].costIndex}.</>
                )}
              </p>
              <p>
                Average net salaries in {country.name} range from{" "}
                <strong>{formatUSD(Math.min(...country.cities.map(c => c.averageNetSalaryUSD)))}</strong> to{" "}
                <strong>{formatUSD(Math.max(...country.cities.map(c => c.averageNetSalaryUSD)))}</strong>{" "}
                per month when converted to USD.
              </p>
              <p>
                Compare these costs with US cities using our{" "}
                <Link href="/cost-of-living" className="text-accent hover:underline">
                  cost of living calculator
                </Link>, or calculate your take-home pay with our{" "}
                <Link href="/" className="text-accent hover:underline">salary calculator</Link>.
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
