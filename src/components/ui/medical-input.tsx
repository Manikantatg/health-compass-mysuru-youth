
import * as React from "react"
import { cn } from "@/lib/utils"

export interface MedicalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  floatingLabel?: boolean
}

const MedicalInput = React.forwardRef<HTMLInputElement, MedicalInputProps>(
  ({ className, type, label, error, success, floatingLabel = false, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value !== '')
      props.onBlur?.(e)
    }

    if (floatingLabel && label) {
      return (
        <div className="floating-label">
          <input
            type={type}
            className={cn(
              "input-medical",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-success focus-visible:ring-success",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" "
            {...props}
          />
          <label
            className={cn(
              "transition-all duration-200 ease-out",
              (isFocused || hasValue) && "transform -translate-y-6 scale-85 text-medical-blue",
              error && "text-destructive"
            )}
          >
            {label}
          </label>
          {error && (
            <p className="mt-2 text-sm text-destructive font-medium">
              {error}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "input-medical",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-success focus-visible:ring-success",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }
)
MedicalInput.displayName = "MedicalInput"

export { MedicalInput }
