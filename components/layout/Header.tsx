"use client";

import Link from "next/link";
import { Search, Languages } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mr-6 hover:opacity-80 transition-opacity">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Search className="h-4 w-4" />
          </div>
          <span className="font-bold hidden sm:inline-block">Quantia</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("calculators")}
            </Link>

            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={language === "pt" ? "Switch to English" : "Mudar para português"}
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
            >
              <Languages className="h-3.5 w-3.5" />
              {language === "pt" ? "EN" : "PT"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
