
import * as React from "react"
import { cn } from "@/lib/utils"

const MedicalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: 'normal' | 'urgent' | 'warning'
    interactive?: boolean
  }
>(({ className, status, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card-medical",
      status === 'urgent' && "status-urgent",
      status === 'warning' && "status-warning", 
      status === 'normal' && "status-normal",
      interactive && "medical-card-hover cursor-pointer",
      className
    )}
    {...props}
  />
))
MedicalCard.displayName = "MedicalCard"

const MedicalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
))
MedicalCardHeader.displayName = "MedicalCardHeader"

const MedicalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-medical-subtitle font-satoshi tracking-tight",
      className
    )}
    {...props}
  />
))
MedicalCardTitle.displayName = "MedicalCardTitle"

const MedicalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-medical-caption", className)}
    {...props}
  />
))
MedicalCardDescription.displayName = "MedicalCardDescription"

const MedicalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
MedicalCardContent.displayName = "MedicalCardContent"

const MedicalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
MedicalCardFooter.displayName = "MedicalCardFooter"

export { 
  MedicalCard, 
  MedicalCardHeader, 
  MedicalCardFooter, 
  MedicalCardTitle, 
  MedicalCardDescription, 
  MedicalCardContent 
}
