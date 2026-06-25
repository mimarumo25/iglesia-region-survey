import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportActionsProps {
  onClear: () => void;
  onQuery?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
  isExporting?: boolean;
  clearDisabled?: boolean;
  queryDisabled?: boolean;
  exportDisabled?: boolean;
  queryType?: "button" | "submit";
  className?: string;
}

const ReportActions = ({
  onClear,
  onQuery,
  onExport,
  isLoading = false,
  isExporting = false,
  clearDisabled = false,
  queryDisabled = false,
  exportDisabled = false,
  queryType = "button",
  className,
}: ReportActionsProps) => (
  <div
    className={cn(
      "grid w-full grid-cols-3 items-stretch gap-1.5 rounded-2xl border border-border/70 bg-background/80 p-1.5 shadow-sm backdrop-blur-sm sm:w-auto sm:flex sm:flex-row sm:items-center sm:gap-2",
      className
    )}
  >
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClear}
      disabled={isLoading || clearDisabled}
      className="h-11 min-w-0 justify-center gap-1.5 border-transparent bg-muted/60 px-2 text-xs shadow-none hover:border-border hover:bg-muted sm:h-9 sm:gap-2 sm:px-4 sm:text-sm"
    >
      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
      Limpiar
    </Button>

    <Button
      type={queryType}
      size="sm"
      onClick={queryType === "button" ? onQuery : undefined}
      disabled={isLoading || queryDisabled}
      className="h-11 min-w-0 justify-center gap-1.5 bg-gradient-primary px-2 text-xs shadow-sm hover:brightness-105 sm:h-9 sm:gap-2 sm:px-5 sm:text-sm"
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
      ) : (
        <Search className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
      Consultar
    </Button>

    {onExport && (
      <Button
        type="button"
        size="sm"
        onClick={onExport}
        disabled={isLoading || isExporting || exportDisabled}
        className="h-11 min-w-0 justify-center gap-1.5 bg-emerald-600 px-2 text-xs shadow-sm hover:bg-emerald-700 sm:h-9 sm:gap-2 sm:px-4 sm:text-sm"
      >
        {isExporting ? (
          <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
        ) : (
          <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
        Excel
      </Button>
    )}
  </div>
);

export default ReportActions;
