import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Calculator Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The tool you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
