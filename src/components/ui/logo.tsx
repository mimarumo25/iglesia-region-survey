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

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  if (iconOnly) {
    return (
      <div className={cn(
        "rounded-lg flex items-center justify-center",
        sizeClasses[size],
        className
      )}>
        <img
          src="/logo_mia__oficial_2.svg"
          alt="MIA Logo"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "rounded-lg flex items-center justify-center hover:shadow-xl transition-shadow",
        sizeClasses[size]
      )}>
        <img
          src="/logo_mia__oficial_2.svg"
          alt="MIA Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <div>
          <h2 className={cn(
            "font-bold text-foreground",
            textSizes[textSize]
          )}>
            MIA
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestión Integral
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
