'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <CardTitle className="mt-3 text-center text-2xl font-extrabold text-gray-900">
            Oops! Something went wrong.
          </CardTitle>
        </CardHeader>
        {process.env.NODE_ENV === 'development' && (
          <CardContent>
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Error details
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{error.message || 'An unexpected error occurred.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
