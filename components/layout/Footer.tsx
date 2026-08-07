export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quantia</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              A comprehensive collection of financial calculators. Running 100% in your browser for absolute privacy and speed.
            </p>
          </div>
          <div className="space-y-3 md:text-right">
            <p className="text-sm text-muted-foreground">
              Disclaimer: These tools are provided for educational and informational purposes only. Results do not constitute financial advice.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Quantia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
