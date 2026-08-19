import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorField } from "@/lib/calculators/types";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface Props {
  field: CalculatorField;
  value: any;
  onChange: (val: any) => void;
}

export function CalculatorInput({ field, value, onChange }: Props) {
  const { language } = useLanguage();
  
  if (field.type === 'select' && field.options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Select value={value?.toString()} onValueChange={onChange}>
          <SelectTrigger id={field.id} className="w-full bg-background">
            <SelectValue placeholder={field.placeholder || (language === "pt" ? "Selecione..." : "Select...")} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {field.helpText && <p className="text-[11px] text-muted-foreground">{field.helpText}</p>}
      </div>
    );
  }

  const isCurrency = field.type === 'currency';
  const isPercent = field.type === 'percent';
  
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.label}</Label>
      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            R$
          </span>
        )}
        <Input 
          id={field.id}
          type="number"
          value={value === 0 && !isPercent ? '' : value}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          placeholder={field.placeholder || "0"}
          className={`bg-background ${isCurrency ? 'pl-9' : ''} ${isPercent ? 'pr-8' : ''}`}
          min={field.min}
          max={field.max}
          step={field.step || "any"}
        />
        {isPercent && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            %
          </span>
        )}
      </div>
      {field.helpText && <p className="text-[11px] text-muted-foreground">{field.helpText}</p>}
    </div>
  );
}
