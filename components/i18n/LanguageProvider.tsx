"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pt" | "en";

const STORAGE_KEY = "quantia-language";

const translations = {
  pt: {
    madeWith: "Feito por",
    calculators: "Calculadoras",
    allTools: "Todas",
    searchPlaceholder: "Pesquisar por juros compostos, financiamento, salário líquido...",
    noCalculators: "Nenhuma calculadora encontrada para a sua pesquisa.",
    inputs: "Entradas",
    results: "Resultados",
    formula: "Fórmula",
    howItWorks: "Como funciona",
    home: "Início",
    category: "Categoria",
    returnHome: "Voltar ao início",
    calculatorNotFound: "Calculadora não encontrada",
    calculatorNotFoundDescription: "A ferramenta que você procura não existe ou foi movida.",
    footerDescription: "Uma coleção completa de calculadoras financeiras. Tudo funciona 100% no seu navegador, com privacidade e rapidez.",
    disclaimer: "Aviso: estas ferramentas são fornecidas apenas para fins educacionais e informativos. Os resultados não constituem aconselhamento financeiro.",
    rights: "Todos os direitos reservados.",
    searchLanguage: "PT",
  },
  en: {
    calculators: "Calculators",
    allTools: "All Tools",
    searchPlaceholder: "Search for compound interest, mortgage, net salary...",
    noCalculators: "No calculators found matching your search.",
    inputs: "Inputs",
    results: "Results",
    formula: "Formula",
    howItWorks: "How it works",
    home: "Home",
    category: "Category",
    returnHome: "Return Home",
    calculatorNotFound: "Calculator Not Found",
    calculatorNotFoundDescription: "The tool you are looking for doesn't exist or has been moved.",
    footerDescription: "A comprehensive collection of financial calculators. Running 100% in your browser for absolute privacy and speed.",
    disclaimer: "Disclaimer: these tools are provided for educational and informational purposes only. Results do not constitute financial advice.",
    rights: "All rights reserved.",
    searchLanguage: "EN",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "pt" || saved === "en") setLanguageState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (next) => setLanguageState(next),
    toggleLanguage: () => setLanguageState((current) => current === "pt" ? "en" : "pt"),
    t: (key) => translations[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
