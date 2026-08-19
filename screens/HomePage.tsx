"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolGrid } from "@/components/home/ToolGrid";
import { CATEGORIES } from "@/lib/calculators/categories";
import { allCalculators } from "@/lib/calculators/registry";
import { localizeCalculator, getCategoryTranslation } from "@/lib/calculators/i18n";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface HomePageProps {
  initialCategory: string;
}

export default function HomePage({ initialCategory }: HomePageProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { language, t } = useLanguage();

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "all") router.replace("/");
    else router.replace(`/?category=${category}`);
  };

  const localizedTools = useMemo(
    () => allCalculators.map((tool) => localizeCalculator(tool, language)),
    [language]
  );

  const filteredTools = useMemo(() => {
    let tools = localizedTools;

    if (activeCategory !== "all") {
      tools = tools.filter((tool) => tool.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      tools = tools.filter((tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
      );
    }

    return tools;
  }, [search, activeCategory, localizedTools]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {language === "pt"
              ? "Ferramentas financeiras e calculadoras."
              : "Financial tools and calculators."}
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {language === "pt"
              ? "Uma coleção completa de ferramentas para investimentos, empréstimos, impostos e finanças pessoais, direto no navegador."
              : "A comprehensive, browser-based collection of tools for investments, loans, taxes, and personal finance."}
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-10 h-12 text-base rounded-xl shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 pb-4 overflow-x-auto no-scrollbar border-b">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {t("allTools")}
          </button>

          {CATEGORIES.map((cat) => {
            const translated = getCategoryTranslation(cat.id, language);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {translated?.label ?? cat.label}
              </button>
            );
          })}
        </div>

        <ToolGrid tools={filteredTools} />
      </main>
    </div>
  );
}
