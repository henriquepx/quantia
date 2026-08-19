"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { ICONS } from "@/lib/icons";
import { CalculatorConfig } from "@/lib/calculators/types";
import { CATEGORIES } from "@/lib/calculators/categories";
import { getCategoryTranslation } from "@/lib/calculators/i18n";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function ToolCard({ tool }: { tool: CalculatorConfig }) {
  const Icon = ICONS[tool.icon];
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);
  const { language } = useLanguage();
  const translatedCategory = categoryInfo
    ? getCategoryTranslation(categoryInfo.id, language)
    : null;

  return (
    <Link
      href={`/calculators/${tool.slug}`}
      className="block h-full group hover-elevate border rounded-lg active-elevate transition-all"
    >
      <div className="h-full bg-card/50 hover:bg-card/80 transition-colors border-0 shadow-none rounded-lg">
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5" />
            </div>
            {categoryInfo && (
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {translatedCategory?.label ?? categoryInfo.label}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {tool.title}
          </h3>
          <p className="text-xs line-clamp-2 mt-1.5 text-muted-foreground">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ToolGrid({ tools }: { tools: CalculatorConfig[] }) {
  const { t } = useLanguage();

  if (tools.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <SearchX className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <p>{t("noCalculators")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
