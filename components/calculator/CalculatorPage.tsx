import { useState, useMemo } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { CalculatorConfig, CalculatorResult as ResultType } from "@/lib/calculators/types";
import { CalculatorInput } from "./CalculatorInput";
import { CalculatorResult } from "./CalculatorResult";
import { CATEGORIES } from "@/lib/calculators/categories";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { localizeCalculator, getCategoryTranslation } from "@/lib/calculators/i18n";

export function CalculatorPage({ config }: { config: CalculatorConfig }) {
  const { language, t } = useLanguage();
  const localizedConfig = useMemo(() => localizeCalculator(config, language), [config, language]);

  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    localizedConfig.fields.forEach(f => {
      initial[f.id] = f.defaultValue !== undefined ? f.defaultValue : (f.type === 'select' && f.options ? f.options[0].value : 0);
    });
    return initial;
  });

  const handleInputChange = (id: string, value: any) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const results = useMemo(() => {
    try {
      return localizedConfig.calculate(inputs);
    } catch (e) {
      console.error("Calculation error", e);
      return [];
    }
  }, [inputs, localizedConfig]);

  const primaryResult = results.find(r => r.highlight);
  const secondaryResults = results.filter(r => !r.highlight);
  const categoryInfo = CATEGORIES.find(c => c.id === localizedConfig.category);
  // @ts-ignore
  const Icon = LucideIcons[localizedConfig.icon] || LucideIcons.Calculator;

  return (
    <main className="flex-1 bg-muted/10 pb-20">
      
      <div className="bg-background border-b">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">{t("home")}</Link>
            <LucideIcons.ChevronRight className="h-3 w-3" />
            <Link href={`/?category=${localizedConfig.category}`} className="hover:text-foreground">
              {getCategoryTranslation(localizedConfig.category, language)?.label || categoryInfo?.label || t("category")}
            </Link>
            <LucideIcons.ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{localizedConfig.title}</span>
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{localizedConfig.title}</h1>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">{localizedConfig.description}</p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <LucideIcons.SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                {t("inputs")}
              </h2>
              <div className="space-y-5">
                {localizedConfig.fields.map(field => (
                  <CalculatorInput 
                    key={field.id}
                    field={field}
                    value={inputs[field.id]}
                    onChange={(val) => handleInputChange(field.id, val)}
                  />
                ))}
              </div>
            </Card>

            {localizedConfig.formula && (
              <Card className="p-6 bg-muted/30 shadow-none border-dashed text-sm">
                <h3 className="font-medium text-muted-foreground mb-2">{t("formula")}</h3>
                <code className="font-mono bg-background px-2 py-1 rounded block whitespace-pre-wrap">
                  {localizedConfig.formula}
                </code>
              </Card>
            )}
          </div>

          <div className="md:col-span-7 space-y-8">

            <div className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <LucideIcons.BarChart2 className="h-5 w-5 text-muted-foreground" />
                {t("results")}
              </h2>
              
              {primaryResult && (
                <CalculatorResult result={primaryResult} />
              )}
              
              {secondaryResults.length > 0 && (
                <Card className="p-4 shadow-sm">
                  {secondaryResults.map((res, i) => (
                    <CalculatorResult key={i} result={res} />
                  ))}
                </Card>
              )}
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground mt-12">
              <h3 className="text-foreground font-semibold text-lg flex items-center gap-2 mb-3">
                <LucideIcons.Info className="h-5 w-5" />
                {t("howItWorks")}
              </h3>
              <p className="leading-relaxed">{localizedConfig.explanation}</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
