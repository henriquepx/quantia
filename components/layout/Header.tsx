import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
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
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Calculators
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
