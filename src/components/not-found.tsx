import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4"
      data-testid="not-found-page"
    >
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        {`Oops! The page you're looking for doesn't exist. It might have been moved or deleted.`}
      </p>
      <Button variant="default" asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
