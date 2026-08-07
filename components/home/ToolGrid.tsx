import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { CalculatorConfig } from "@/lib/calculators/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/calculators/categories";

export function ToolCard({ tool }: { tool: CalculatorConfig }) {
  const Icon =
  LucideIcons[tool.icon as keyof typeof LucideIcons] ??
  LucideIcons.Calculator;
  const categoryInfo = CATEGORIES.find(c => c.id === tool.category);
  
  return (
    <Link href={`/calculators/${tool.slug}`} className="block h-full group hover-elevate border rounded-lg active-elevate transition-all">
      <Card className="h-full bg-card/50 hover:bg-card/80 transition-colors border-0 shadow-none">
        <CardHeader className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:scale-110 transition-transform">
              <Icon className="h-5 w-5" />
            </div>
            {categoryInfo && (
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {categoryInfo.label}
              </span>
            )}
          </div>
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">{tool.title}</CardTitle>
          <CardDescription className="text-xs line-clamp-2 mt-1.5">{tool.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export function ToolGrid({ tools }: { tools: CalculatorConfig[] }) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <LucideIcons.SearchX className="mx-auto h-12 w-12 opacity-20 mb-4" />
        <p>No calculators found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
