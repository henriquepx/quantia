"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">{t("calculatorNotFound")}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {t("calculatorNotFoundDescription")}
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        {t("returnHome")}
      </Link>
    </div>
  );
}
