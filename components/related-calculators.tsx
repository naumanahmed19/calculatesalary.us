import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  ArrowRightLeft,
  MapPin,
  FileText,
  Briefcase,
  Coins,
  Gift,
  Building2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export interface CalculatorItem {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

// Default calculators that can be used across pages
export const defaultCalculators: CalculatorItem[] = [
  { href: "/", title: "US Salary Calculator", description: "Calculate take-home pay", icon: Calculator },
  { href: "/income-percentile", title: "Income Percentile", description: "See where you rank", icon: TrendingUp },
  { href: "/average-salary", title: "Average US Salary", description: "US salary statistics", icon: BarChart3 },
  { href: "/salary-comparison", title: "Salary Comparison", description: "Compare job offers", icon: ArrowRightLeft },
  { href: "/cost-of-living", title: "Cost of Living", description: "Compare city costs", icon: MapPin },
];

export const taxCalculators: CalculatorItem[] = [
  { href: "/", title: "US Salary Calculator", description: "Calculate take-home pay", icon: Calculator },
  { href: "/tax-code-checker", title: "Tax Calculator", description: "Federal & state taxes", icon: FileText },
  { href: "/self-employed-tax", title: "Self-Employed Tax", description: "Tax for self-employed", icon: Briefcase },
  { href: "/dividend-calculator", title: "Dividend Calculator", description: "Calculate dividend tax", icon: Coins },
  { href: "/bonus-tax", title: "Bonus Tax", description: "Tax on bonus payments", icon: Gift },
];

export const salaryCalculators: CalculatorItem[] = [
  { href: "/", title: "US Salary Calculator", description: "Calculate take-home pay", icon: Calculator },
  { href: "/income-percentile", title: "Income Percentile", description: "See where you rank", icon: TrendingUp },
  { href: "/average-salary", title: "Average US Salary", description: "US salary statistics", icon: BarChart3 },
  { href: "/salary-comparison", title: "Salary Comparison", description: "Compare job offers", icon: ArrowRightLeft },
  { href: "/state", title: "State Calculator", description: "State-specific calculations", icon: Building2 },
];

export const costOfLivingCalculators: CalculatorItem[] = [
  { href: "/", title: "US Salary Calculator", description: "Calculate take-home pay", icon: Calculator },
  { href: "/cost-of-living", title: "Cost of Living Index", description: "Compare city costs", icon: MapPin },
  { href: "/income-percentile", title: "Income Percentile", description: "See where you rank", icon: TrendingUp },
  { href: "/average-salary", title: "Average US Salary", description: "US salary statistics", icon: BarChart3 },
  { href: "/salary-comparison", title: "Salary Comparison", description: "Compare job offers", icon: ArrowRightLeft },
];

interface RelatedCalculatorsProps {
  title?: string;
  calculators?: CalculatorItem[];
  className?: string;
}

export function RelatedCalculators({
  title = "Related Calculators",
  calculators = defaultCalculators,
  className = "",
}: RelatedCalculatorsProps) {
  return (
    <section className={`py-12 bg-muted/30 border-t border-border/40 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">{title}</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calc) => {
              const Icon = calc.icon || Calculator;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group rounded-xl bg-card p-5 ring-1 ring-border/50 hover:ring-accent/50 hover:shadow-md transition-all"
                >
                  <div className="rounded-lg bg-accent/10 p-2.5 w-fit mb-3">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {calc.title}
                  </h3>
                  {calc.description && (
                    <p className="text-sm text-muted-foreground mt-1">{calc.description}</p>
                  )}
                  <div className="mt-3 flex items-center text-sm font-medium text-accent">
                    Try it
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
