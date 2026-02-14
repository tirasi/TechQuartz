import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ glow = false, children, className, ...props }: GlassCardProps) => (
  <motion.div
    className={cn("glass p-6", glow && "neon-glow", className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);

export default GlassCard;
