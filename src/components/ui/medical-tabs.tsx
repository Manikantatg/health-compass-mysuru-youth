
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const MedicalTabs = TabsPrimitive.Root

const MedicalTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
MedicalTabsList.displayName = TabsPrimitive.List.displayName

const MedicalTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "tab-medical tab-medical-inactive data-[state=active]:tab-medical-active",
      className
    )}
    {...props}
  />
))
MedicalTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const MedicalTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-slide-up-gentle",
      className
    )}
    {...props}
  />
))
MedicalTabsContent.displayName = TabsPrimitive.Content.displayName

export { MedicalTabs, MedicalTabsList, MedicalTabsTrigger, MedicalTabsContent }
