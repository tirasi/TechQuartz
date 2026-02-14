import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(({ label, className, ...props }, ref) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
    <div className="input-glow rounded-xl">
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-input border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors",
          className
        )}
        {...props}
      />
    </div>
  </div>
));

GlowInput.displayName = "GlowInput";
export default GlowInput;
