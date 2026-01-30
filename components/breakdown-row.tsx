import { formatCurrency } from '@/lib/us-tax-calculator'

interface BreakdownRowProps {
  label: string
  yearly: number
  monthly: number
  isDeduction?: boolean
  highlighted?: boolean
}

export function BreakdownRow({
  label,
  yearly,
  monthly,
  isDeduction = false,
  highlighted = false
}: BreakdownRowProps) {
  const baseClasses = "flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
  const highlightClasses = highlighted
    ? 'bg-accent/10 border border-accent/20'
    : 'hover:bg-muted/30'

  return (
    <div className={`${baseClasses} ${highlightClasses}`}>
      <span className={`text-sm ${highlighted ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <div className="flex gap-6 text-right">
        <span className={`text-sm min-w-[90px] tabular-nums ${isDeduction ? 'text-red-500' : highlighted ? 'text-accent font-semibold' : 'text-foreground'}`}>
          {formatCurrency(yearly)}
        </span>
        <span className={`text-sm min-w-[90px] tabular-nums text-muted-foreground ${isDeduction ? 'text-red-400' : highlighted ? 'font-medium' : ''}`}>
          {formatCurrency(monthly)}
        </span>
      </div>
    </div>
  )
}
