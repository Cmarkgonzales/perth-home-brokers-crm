interface DocumentProgressBarProps {
  verifiedCount: number
  requiredCount: number
  className?: string
}

export function DocumentProgressBar ({
  verifiedCount,
  requiredCount,
  className,
}: DocumentProgressBarProps) {
  const progress =
    requiredCount === 0
      ? 0
      : Math.round((verifiedCount / requiredCount) * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={verifiedCount}
      aria-valuemin={0}
      aria-valuemax={requiredCount}
      aria-label="Documents verified"
      className={className ?? 'h-1.5 overflow-hidden rounded-full bg-border'}
    >
      <div
        className="h-full rounded-full bg-phb-yellow"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
