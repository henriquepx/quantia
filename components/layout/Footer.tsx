"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quantia</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("footerDescription")}
            </p>
          </div>
          <div className="space-y-3 md:text-right">
            <p className="text-sm text-muted-foreground">{t("disclaimer")}</p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Quantia. {t("rights")}.
            </p>
            <p className="text-sm text-muted-foreground">
              {t("madeWith")}{" "}
              <a
                href="https://henriquepinheirodev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Henrique
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
