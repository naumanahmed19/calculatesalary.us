import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalculatorPanelProps {
  children: React.ReactNode
  className?: string
}

interface CalculatorLayoutProps {
  children: React.ReactNode
  className?: string
  /** Vertical alignment: 'stretch' (default) matches heights, 'start' aligns top, 'center' centers */
  align?: 'stretch' | 'start' | 'center'
}

interface InputPanelProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
  className?: string
  minHeight?: string
  /** Position in layout - affects border radius */
  position?: 'left' | 'right'
}

interface ResultsPanelProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
  className?: string
  minHeight?: string
  /** Position in layout - affects border radius */
  position?: 'left' | 'right'
}

/**
 * Calculator Layout - Wrapper for two-panel calculator
 * For reversed layout, simply put ResultsPanel before InputPanel in your JSX
 */
export function CalculatorLayout({ children, className, align = 'center' }: CalculatorLayoutProps) {
  const alignClasses = {
    stretch: 'items-stretch',
    start: 'items-start',
    center: 'items-center',
  }

  return (
    <div className={cn('space-y-8', className)}>
      <div className={cn(
        'mx-auto max-w-lg grid grid-cols-1 gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2',
        alignClasses[align]
      )}>
        {children}
      </div>
    </div>
  )
}

/**
 * Input Panel - Left side of calculator (card style)
 */
export function InputPanel({
  icon: Icon,
  title,
  description,
  children,
  className,
  minHeight,
  position = 'left',
}: InputPanelProps) {
  const radiusClasses = position === 'left'
    ? 'rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
    : 'rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tl-none lg:rounded-br-3xl'

  return (
    <div
      className={cn(
        'flex flex-col bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0',
        radiusClasses,
        className
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-8 space-y-6 flex-1">{children}</div>
    </div>
  )
}

/**
 * Results Panel - Right side of calculator (accent style)
 */
export function ResultsPanel({
  icon: Icon,
  title,
  description,
  children,
  className,
  minHeight = '600px',
  position = 'right',
}: ResultsPanelProps) {
  const radiusClasses = position === 'right'
    ? 'rounded-3xl'
    : 'rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'

  return (
    <div
      className={cn(
        'flex flex-col bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0',
        radiusClasses,
        className
      )}
      style={{ minHeight }}
    >
      <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
        <Icon className="h-5 w-5" />
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-8 space-y-6 flex-1">{children}</div>
    </div>
  )
}

/**
 * Result Value - Large centered value display
 */
interface ResultValueProps {
  value: string
  label: string
  className?: string
  valueClassName?: string
}

export function ResultValue({ value, label, className, valueClassName }: ResultValueProps) {
  return (
    <div className={cn('text-center py-4', className)}>
      <div className={cn('text-4xl font-bold text-foreground', valueClassName)}>{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

/**
 * Result Row - Key-value row for results breakdown
 */
interface ResultRowProps {
  label: string
  value: string
  showBorder?: boolean
  valueClassName?: string
}

export function ResultRow({ label, value, showBorder = true, valueClassName }: ResultRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between py-2',
        showBorder && 'border-b border-border/50'
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium', valueClassName)}>{value}</span>
    </div>
  )
}

/**
 * Result Card - Highlighted result box
 */
interface ResultCardProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'accent'
  className?: string
}

export function ResultCard({ children, variant = 'default', className }: ResultCardProps) {
  const variants = {
    default: 'bg-card/60 dark:bg-card/40 ring-1 ring-border/50',
    success: 'bg-emerald-600/10 dark:bg-emerald-500/10 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20',
    warning: 'bg-amber-500/10 ring-1 ring-amber-500/20',
    accent: 'bg-accent/10',
  }

  return (
    <div className={cn('rounded-xl p-4', variants[variant], className)}>
      {children}
    </div>
  )
}

/**
 * Stat Grid - Two-column grid for stats
 */
interface StatGridProps {
  children: React.ReactNode
  className?: string
}

export function StatGrid({ children, className }: StatGridProps) {
  return <div className={cn('grid grid-cols-2 gap-3', className)}>{children}</div>
}

/**
 * Stat Box - Individual stat display
 */
interface StatBoxProps {
  label: string
  value: string
  className?: string
}

export function StatBox({ label, value, className }: StatBoxProps) {
  return (
    <div className={cn('rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50', className)}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-xl font-bold text-foreground">{value}</div>
    </div>
  )
}

/**
 * Quick Select Buttons - For common value presets
 */
interface QuickSelectProps<T> {
  options: { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
  className?: string
}

export function QuickSelect<T>({ options, selected, onSelect, className }: QuickSelectProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2 pt-1', className)}>
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            'px-3 py-1 text-xs font-medium rounded-full transition-all',
            selected === option.value
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Currency Input - Input with $ prefix
 */
interface CurrencyInputProps {
  id: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  className?: string
}

export function CurrencyInput({
  id,
  value,
  onChange,
  step = 1000,
  min = 0,
  max,
  className,
}: CurrencyInputProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
        $
      </span>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        className={cn(
          'flex h-12 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-lg font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    </div>
  )
}

/**
 * Percent Input - Input with % suffix
 */
interface PercentInputProps {
  id: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  className?: string
}

export function PercentInput({
  id,
  value,
  onChange,
  step = 0.1,
  min = 0,
  max = 100,
  className,
}: PercentInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        className={cn(
          'flex h-12 w-full rounded-md border border-input bg-background px-3 pr-8 py-2 text-lg font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
    </div>
  )
}
