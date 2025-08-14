import { Church } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  className?: string;
  iconOnly?: boolean;
}

const Logo = ({ 
  size = "md", 
  showText = true, 
  textSize = "md", 
  className,
  iconOnly = false
}: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8", 
    xl: "w-10 h-10"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  if (iconOnly) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg",
        sizeClasses[size],
        className
      )}>
        <Church className={cn("text-white", iconSizes[size])} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow",
        sizeClasses[size]
      )}>
        <Church className={cn("text-white", iconSizes[size])} />
      </div>
      {showText && (
        <div>
          <h2 className={cn(
            "font-bold text-foreground",
            textSizes[textSize]
          )}>
            Sistema Parroquial
          </h2>
          <p className="text-sm text-muted-foreground">
            Caracterización
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
