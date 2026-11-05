import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField ({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-text-primary">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children}
      {description && !error ? (
        <p className="text-xs text-text-tertiary">{description}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function FormGrid ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>
  )
}

export function FormSection ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
