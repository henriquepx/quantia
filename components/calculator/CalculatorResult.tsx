import { CalculatorResult as ResultType } from "@/lib/calculators/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/calculators/utils";
import { Card } from "@/components/ui/card";

interface Props {
  result: ResultType;
}

export function CalculatorResult({ result }: Props) {
  let displayValue = String(result.value);
  
  if (result.type === 'currency') {
    displayValue = formatCurrency(result.value);
  } else if (result.type === 'percent') {
    displayValue = formatPercent(result.value);
  } else if (result.type === 'number') {
    displayValue = formatNumber(result.value);
  }

  if (result.highlight) {
    return (
      <Card className="p-6 bg-primary/5 border-primary/20 flex flex-col items-center justify-center text-center space-y-2">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {result.label}
        </span>
        <span className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
          {displayValue}
        </span>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{result.label}</span>
      <span className="font-semibold">{displayValue}</span>
    </div>
  );
}
