// components/ui/toast.tsx

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const toastVariants = cva(
  "fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-full max-w-md items-center justify-between space-x-4 rounded-lg border p-4 pr-6 shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 border-slate-200",
        destructive: "bg-red-50 text-red-600 border-red-200"
      },
      state: {
        visible: "animate-in slide-in-from-top-full opacity-100",
        hidden: "animate-out slide-out-to-top-full opacity-0"
      }
    },
    defaultVariants: {
      variant: "destructive",
      state: "visible"
    }
  }
)

interface ToastProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof toastVariants> {
  message: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, message, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <span>{message}</span>
    </div>
  )
)
Toast.displayName = "Toast"

export { Toast, toastVariants }