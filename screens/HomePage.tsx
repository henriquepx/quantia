"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToolGrid } from "@/components/home/ToolGrid";
import { CATEGORIES } from "@/lib/calculators/categories";
import { allCalculators } from "@/lib/calculators/registry";

interface HomePageProps {
  initialCategory: string;
}

export default function HomePage({
  initialCategory,
}: HomePageProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const handleCategoryChange = (category: string) => {
  setActiveCategory(category);

  if (category === "all") {
    router.replace("/");
  } else {
    router.replace(`/?category=${category}`);
  }
};

  const filteredTools = useMemo(() => {
    let tools = allCalculators;
    
    if (activeCategory !== "all") {
      tools = tools.filter(t => t.category === activeCategory);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      tools = tools.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }
    
    return tools;
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Search Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ferramentas financeiras e calculadoras.
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            A comprehensive, browser-based collection of tools for investments, loans, taxes, and personal finance.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search for compound interest, mortgage, net salary..."
              className="pl-10 h-12 text-base rounded-xl shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4 overflow-x-auto no-scrollbar border-b">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${activeCategory === "all" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            All Tools
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeCategory === cat.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ToolGrid tools={filteredTools} />

      </main>
    </div>
  );
}
